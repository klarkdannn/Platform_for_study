package com.bank.concurrency;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * МНОГОПОТОЧНОСТЬ В JAVA — ЧАСТЬ 1: ОСНОВЫ
 *
 * Почему многопоточность нужна в банке?
 *   - 10 000 клиентов делают переводы одновременно
 *   - Один поток = 1 клиент в очереди → невозможно
 *   - 200 потоков = 200 клиентов параллельно → production
 *
 * ПРОБЛЕМЫ которые нужно решать:
 *   Race Condition — два потока меняют одно значение одновременно
 *   Deadlock       — два потока ждут друг друга вечно
 *   Visibility     — один поток не видит изменение другого
 */
public class ThreadBasics {

    // ══════════════════════════════════════════════════════════════════════
    // 1. СОЗДАНИЕ ПОТОКОВ
    // ══════════════════════════════════════════════════════════════════════

    // Способ 1: Наследование от Thread
    static class PaymentProcessor extends Thread {
        private final String clientName;
        private final double amount;

        PaymentProcessor(String clientName, double amount) {
            super("PaymentThread-" + clientName); // Имя потока (важно для отладки!)
            this.clientName = clientName;
            this.amount = amount;
        }

        @Override
        public void run() {
            System.out.printf("[%s] Обрабатываем платёж %.2f для %s%n",
                Thread.currentThread().getName(), amount, clientName);
            try {
                Thread.sleep(100); // Имитируем работу с БД
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // Восстанавливаем флаг прерывания!
                System.out.println("Платёж прерван: " + clientName);
            }
            System.out.println("Платёж завершён: " + clientName);
        }
    }

    // Способ 2: Runnable (предпочтительнее — нет наследования)
    static Runnable createBalanceChecker(int accountId) {
        return () -> {
            System.out.printf("[%s] Проверяем баланс счёта %d%n",
                Thread.currentThread().getName(), accountId);
            // Здесь был бы запрос к БД
        };
    }

    static void threadCreationDemo() throws InterruptedException {
        System.out.println("\n=== СОЗДАНИЕ ПОТОКОВ ===");

        // Способ 1: Thread subclass
        PaymentProcessor t1 = new PaymentProcessor("Иван", 5000.0);
        t1.start(); // start() создаёт новый поток и вызывает run()
        // t1.run() — НЕ ТАК! run() выполнится в ТЕКУЩЕМ потоке

        // Способ 2: Runnable + Thread
        Thread t2 = new Thread(createBalanceChecker(42), "BalanceChecker-1");
        t2.start();

        // Способ 3: Lambda (самый краткий)
        Thread t3 = new Thread(() -> System.out.println("Lambda-поток: " +
            Thread.currentThread().getName()));
        t3.setDaemon(true); // Daemon-поток умирает когда умирают все non-daemon потоки
        t3.start();

        // Ждём завершения t1 и t2
        t1.join();  // join() блокирует текущий поток пока t1 не завершится
        t2.join(500); // join(timeout) — ждём максимум 500ms

        System.out.println("Все платежи обработаны");
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. RACE CONDITION — КЛАССИЧЕСКАЯ ПРОБЛЕМА
    // ══════════════════════════════════════════════════════════════════════

    // ПЛОХО: race condition
    static class UnsafeBankAccount {
        private double balance; // Нет volatile, нет синхронизации

        UnsafeBankAccount(double initialBalance) {
            this.balance = initialBalance;
        }

        // ОПАСНО: два потока могут читать одно balance одновременно!
        void deposit(double amount) {
            double current = balance;  // Поток 1 читает: 1000
            // ... Поток 2 тоже читает: 1000 и делает deposit ...
            balance = current + amount; // Поток 1 пишет: 1500, Поток 2 тоже пишет 1500
            // Итог: 1500 вместо правильного 2000! Деньги потеряны!
        }

        double getBalance() { return balance; }
    }

    // ПРАВИЛЬНО: синхронизация
    static class SafeBankAccount {
        private double balance;
        private final Object lock = new Object(); // Объект-монитор

        SafeBankAccount(double initialBalance) {
            this.balance = initialBalance;
        }

        // synchronized: только один поток может быть внутри в любой момент
        synchronized void deposit(double amount) {
            balance += amount;
        }

        // Можно синхронизировать на конкретном объекте (мелкозернистее)
        void withdraw(double amount) throws InsufficientFundsException {
            synchronized (lock) {
                if (balance < amount) {
                    throw new InsufficientFundsException("Недостаточно средств");
                }
                balance -= amount;
            }
        }

        synchronized double getBalance() {
            return balance;
        }
    }

    static class InsufficientFundsException extends Exception {
        InsufficientFundsException(String message) { super(message); }
    }

    static void raceConditionDemo() throws InterruptedException {
        System.out.println("\n=== RACE CONDITION ДЕМОНСТРАЦИЯ ===");

        UnsafeBankAccount unsafe = new UnsafeBankAccount(0);
        SafeBankAccount safe = new SafeBankAccount(0);

        int threadCount = 100;
        double depositAmount = 100.0;
        double expected = threadCount * depositAmount;

        // Небезопасный счёт
        Thread[] unsafeThreads = new Thread[threadCount];
        for (int i = 0; i < threadCount; i++) {
            unsafeThreads[i] = new Thread(() -> unsafe.deposit(depositAmount));
            unsafeThreads[i].start();
        }
        for (Thread t : unsafeThreads) t.join();
        System.out.printf("Unsafe: ожидали %.0f, получили %.0f (разница: %.0f)%n",
            expected, unsafe.getBalance(), expected - unsafe.getBalance());

        // Безопасный счёт
        Thread[] safeThreads = new Thread[threadCount];
        for (int i = 0; i < threadCount; i++) {
            safeThreads[i] = new Thread(() -> safe.deposit(depositAmount));
            safeThreads[i].start();
        }
        for (Thread t : safeThreads) t.join();
        System.out.printf("Safe: ожидали %.0f, получили %.0f ✓%n",
            expected, safe.getBalance());
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. VOLATILE — ВИДИМОСТЬ МЕЖДУ ПОТОКАМИ
    // ══════════════════════════════════════════════════════════════════════

    // volatile гарантирует что изменение ВИДНО всем потокам немедленно.
    // НО не гарантирует атомарность составных операций (i++ — не атомарно!)

    static class ServiceController {
        // Без volatile: JVM может кешировать значение в регистре CPU
        // Поток может никогда не увидеть изменение!
        private volatile boolean running = true;

        void stop() {
            running = false; // Другой поток увидит это изменение
        }

        void processRequests() {
            while (running) { // Читает актуальное значение из памяти
                // Обрабатываем запросы...
                Thread.onSpinWait(); // JVM hint для spin-loop
            }
            System.out.println("Сервис остановлен");
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 4. ATOMIC КЛАССЫ — АТОМАРНЫЕ ОПЕРАЦИИ БЕЗ synchronized
    // ══════════════════════════════════════════════════════════════════════

    // AtomicInteger использует CAS (Compare-And-Swap) — операция CPU
    // Быстрее чем synchronized для простых операций!

    static class TransactionCounter {
        private final AtomicInteger successCount = new AtomicInteger(0);
        private final AtomicInteger failCount = new AtomicInteger(0);
        private final AtomicLong totalAmount = new AtomicLong(0);

        void recordSuccess(long amount) {
            successCount.incrementAndGet();                   // i++ атомарно
            totalAmount.addAndGet(amount);                    // total += amount атомарно
        }

        void recordFailure() {
            failCount.incrementAndGet();
        }

        // CAS: изменить только если текущее значение == expected
        boolean tryResetIfZero() {
            return successCount.compareAndSet(0, 0); // Если 0 → оставить 0 (пример CAS)
        }

        void printStats() {
            System.out.printf("Успешных: %d, Неудачных: %d, Сумма: %d%n",
                successCount.get(), failCount.get(), totalAmount.get());
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 5. REENTRANT LOCK — ГИБКАЯ БЛОКИРОВКА
    // ══════════════════════════════════════════════════════════════════════

    // ReentrantLock мощнее synchronized:
    //   - Можно попробовать взять лок (tryLock)
    //   - Можно взять с таймаутом
    //   - Можно прервать ожидание
    //   - Поддерживает fairness (порядок очереди)

    static class AccountWithLock {
        private double balance;
        private final ReentrantLock lock = new ReentrantLock(true); // true = fair

        AccountWithLock(double balance) {
            this.balance = balance;
        }

        boolean tryTransfer(AccountWithLock target, double amount) {
            // tryLock() — не ждём, сразу возвращаем false если занято
            if (lock.tryLock()) {
                try {
                    if (target.lock.tryLock()) {
                        try {
                            if (balance >= amount) {
                                balance -= amount;
                                target.balance += amount;
                                return true;
                            }
                            return false;
                        } finally {
                            target.lock.unlock(); // ВСЕГДА в finally!
                        }
                    }
                } finally {
                    lock.unlock(); // ВСЕГДА в finally!
                }
            }
            return false; // Не смогли взять лок — попробуй позже
        }

        double getBalance() {
            lock.lock();
            try {
                return balance;
            } finally {
                lock.unlock();
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. READ-WRITE LOCK — ОПТИМИЗАЦИЯ ДЛЯ ЧТЕНИЯ
    // ══════════════════════════════════════════════════════════════════════

    // Много читателей могут работать одновременно.
    // Писатель получает эксклюзивный доступ.
    // Идеально для: кеши, конфигурации, справочники

    static class ExchangeRateCache {
        private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
        private final Lock readLock = rwLock.readLock();
        private final Lock writeLock = rwLock.writeLock();

        private double usdToRub = 90.0;
        private double eurToRub = 98.0;

        // Многие потоки могут читать одновременно
        double getUsdRate() {
            readLock.lock();
            try {
                return usdToRub;
            } finally {
                readLock.unlock();
            }
        }

        double getEurRate() {
            readLock.lock();
            try {
                return eurToRub;
            } finally {
                readLock.unlock();
            }
        }

        // Только один поток может обновлять
        void updateRates(double usd, double eur) {
            writeLock.lock();
            try {
                this.usdToRub = usd;
                this.eurToRub = eur;
                System.out.printf("Курсы обновлены: USD=%.2f, EUR=%.2f%n", usd, eur);
            } finally {
                writeLock.unlock();
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 7. WAIT / NOTIFY — ВЗАИМОДЕЙСТВИЕ ПОТОКОВ
    // ══════════════════════════════════════════════════════════════════════

    // Классический паттерн Producer-Consumer
    static class PaymentQueue {
        private final java.util.Queue<String> queue = new java.util.LinkedList<>();
        private final int maxSize;

        PaymentQueue(int maxSize) {
            this.maxSize = maxSize;
        }

        // Производитель: добавляет платежи
        synchronized void produce(String payment) throws InterruptedException {
            while (queue.size() >= maxSize) {
                System.out.println("Очередь полна, производитель ждёт...");
                wait(); // Освобождает монитор и ждёт notify
            }
            queue.add(payment);
            System.out.println("Добавлен платёж: " + payment);
            notifyAll(); // Будим ВСЕХ ожидающих потребителей
        }

        // Потребитель: обрабатывает платежи
        synchronized String consume() throws InterruptedException {
            while (queue.isEmpty()) {
                System.out.println("Очередь пуста, потребитель ждёт...");
                wait();
            }
            String payment = queue.poll();
            System.out.println("Обработан платёж: " + payment);
            notifyAll(); // Будим производителей
            return payment;
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 8. DEADLOCK — КАК ВОЗНИКАЕТ И КАК ИЗБЕЖАТЬ
    // ══════════════════════════════════════════════════════════════════════

    static class DeadlockExample {
        private final Object lockA = new Object();
        private final Object lockB = new Object();

        // ОПАСНО: Поток 1 берёт A затем B, Поток 2 берёт B затем A
        // Если они делают это одновременно — DEADLOCK
        void transferAtoB() throws InterruptedException {
            synchronized (lockA) {
                Thread.sleep(10); // Даём время другому потоку взять lockB
                synchronized (lockB) {
                    System.out.println("Перевод A→B");
                }
            }
        }

        void transferBtoA() throws InterruptedException {
            synchronized (lockB) {
                Thread.sleep(10);
                synchronized (lockA) { // ЖДЁМ lockA который держит transferAtoB!
                    System.out.println("Перевод B→A");
                }
            }
        }

        // РЕШЕНИЕ: всегда брать локи в одном порядке
        // Упорядочить по System.identityHashCode() или id счёта
        static void safeTransfer(Object from, Object to, Runnable action) {
            Object first = System.identityHashCode(from) < System.identityHashCode(to) ? from : to;
            Object second = first == from ? to : from;
            synchronized (first) {
                synchronized (second) {
                    action.run();
                }
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 9. THREAD LOCAL — ДАННЫЕ УНИКАЛЬНЫ ДЛЯ КАЖДОГО ПОТОКА
    // ══════════════════════════════════════════════════════════════════════

    // ThreadLocal: каждый поток имеет свою копию переменной
    // Применяется в Spring для хранения SecurityContext, Transaction, RequestId

    static class RequestContext {
        // Каждый HTTP запрос (поток) имеет свой requestId
        private static final ThreadLocal<String> REQUEST_ID = new ThreadLocal<>();
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();

        static void set(String requestId, String userId) {
            REQUEST_ID.set(requestId);
            USER_ID.set(userId);
        }

        static String getRequestId() { return REQUEST_ID.get(); }
        static String getUserId() { return USER_ID.get(); }

        // КРИТИЧНО: очистить после использования!
        // Иначе в thread pools данные "протекают" к следующему запросу
        static void clear() {
            REQUEST_ID.remove();
            USER_ID.remove();
        }

        // Использование в filter/interceptor:
        static void simulateRequest(String reqId, String userId) {
            try {
                set(reqId, userId);
                System.out.printf("[%s] RequestId=%s, UserId=%s%n",
                    Thread.currentThread().getName(), getRequestId(), getUserId());
                // ... обработка запроса ...
            } finally {
                clear(); // ВСЕГДА в finally!
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // MAIN — ДЕМОНСТРАЦИЯ
    // ══════════════════════════════════════════════════════════════════════

    public static void main(String[] args) throws InterruptedException {
        threadCreationDemo();
        raceConditionDemo();

        System.out.println("\n=== ATOMIC СЧЁТЧИКИ ===");
        TransactionCounter counter = new TransactionCounter();
        Thread[] workers = new Thread[10];
        for (int i = 0; i < 10; i++) {
            final int idx = i;
            workers[i] = new Thread(() -> {
                counter.recordSuccess(idx * 100L);
                if (idx % 3 == 0) counter.recordFailure();
            });
            workers[i].start();
        }
        for (Thread w : workers) w.join();
        counter.printStats();

        System.out.println("\n=== READ-WRITE LOCK ===");
        ExchangeRateCache cache = new ExchangeRateCache();
        Thread writer = new Thread(() -> cache.updateRates(91.5, 99.0));
        Thread reader1 = new Thread(() -> System.out.println("USD=" + cache.getUsdRate()));
        Thread reader2 = new Thread(() -> System.out.println("EUR=" + cache.getEurRate()));
        reader1.start(); reader2.start(); writer.start();
        reader1.join(); reader2.join(); writer.join();

        System.out.println("\n=== THREAD LOCAL ===");
        Thread req1 = new Thread(() -> RequestContext.simulateRequest("REQ-001", "user_42"));
        Thread req2 = new Thread(() -> RequestContext.simulateRequest("REQ-002", "user_99"));
        req1.start(); req2.start();
        req1.join(); req2.join();
    }

    // ══════════════════════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ
    // ══════════════════════════════════════════════════════════════════════
    //
    // 1. ЛЕГКО: Создай 5 потоков которые считают факториал разных чисел.
    //    Выведи результат с именем потока. Дождись всех через join().
    //
    // 2. СРЕДНЕ: Реализуй потокобезопасный счёт (BankAccount) с методами
    //    deposit/withdraw/transfer. Запусти 100 потоков делающих переводы.
    //    Проверь что итоговая сумма денег в системе не изменилась.
    //
    // 3. СРЕДНЕ: Реализуй паттерн Producer-Consumer используя BlockingQueue
    //    вместо wait/notify (BlockingQueue уже потокобезопасен).
    //    Один producer добавляет задачи, 3 consumer их обрабатывают.
    //
    // 4. СЛОЖНО: Воспроизведи deadlock (две нити блокируют друг друга).
    //    Обнаружь его через jstack или Thread.getAllStackTraces().
    //    Исправь используя ordered locking или tryLock с таймаутом.
    //
    // 5. ЭКСПЕРТ: Реализуй свой ThreadPool (без ExecutorService):
    //    - Очередь задач (BlockingQueue<Runnable>)
    //    - N рабочих потоков которые берут задачи из очереди
    //    - Метод submit(Runnable) для добавления задач
    //    - Метод shutdown() для остановки
}
