package com.bank.concurrency;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

/**
 * МНОГОПОТОЧНОСТЬ — ЧАСТЬ 3: CONCURRENT КОЛЛЕКЦИИ
 *
 * Обычные коллекции (HashMap, ArrayList, LinkedList) НЕ потокобезопасны.
 * Использование в многопоточной среде → ConcurrentModificationException, data corruption.
 *
 * Java предоставляет готовые потокобезопасные альтернативы.
 */
public class ConcurrentCollections {

    // ══════════════════════════════════════════════════════════════════════
    // 1. CONCURRENTHASHMAP — ПОТОКОБЕЗОПАСНАЯ КАРТА
    // ══════════════════════════════════════════════════════════════════════

    static void concurrentHashMapDemo() throws InterruptedException {
        System.out.println("\n=== ConcurrentHashMap ===");

        // Segment locking — блокирует только сегмент (Java 7)
        // Node locking — блокирует только один bucket (Java 8+)
        // В отличие от Hashtable который блокирует ВСЮ карту!
        ConcurrentHashMap<String, Double> balances = new ConcurrentHashMap<>();

        ExecutorService pool = Executors.newFixedThreadPool(10);
        List<Future<?>> futures = new ArrayList<>();

        // 10 потоков одновременно пишут в карту — безопасно!
        for (int i = 0; i < 10; i++) {
            final int accountId = i;
            futures.add(pool.submit(() -> {
                String key = "ACC-" + String.format("%03d", accountId);
                balances.put(key, Math.random() * 100_000);
            }));
        }
        for (Future<?> f : futures) {
            try { f.get(); } catch (Exception e) { /* ignore */ }
        }
        System.out.println("Счётов в карте: " + balances.size());

        // Атомарные операции ConcurrentHashMap:
        balances.putIfAbsent("ACC-NEW", 0.0);        // Добавить только если нет
        balances.computeIfAbsent("ACC-X", k -> 5000.0);  // Добавить если нет
        balances.computeIfPresent("ACC-000", (k, v) -> v + 100); // Изменить если есть

        // compute — атомарное вычисление нового значения
        balances.compute("ACC-000", (key, oldValue) ->
            oldValue == null ? 1000.0 : oldValue + 1000.0
        );

        // merge — удобно для агрегации
        balances.merge("ACC-001", 500.0, Double::sum); // Добавить 500 к существующему

        // Атомарное обновление (потокобезопасный increment):
        ConcurrentHashMap<String, Long> txCounts = new ConcurrentHashMap<>();
        txCounts.merge("transfers", 1L, Long::sum);  // Атомарный счётчик по ключу

        // Параллельные операции (Java 8+):
        double totalBalance = balances.reduceValues(1, Double::sum);
        System.out.println("Общий баланс: " + totalBalance);

        double maxBalance = balances.reduceValues(1, Math::max);
        System.out.println("Максимальный баланс: " + maxBalance);

        pool.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. BLOCKINGQUEUE — ОЧЕРЕДЬ С БЛОКИРОВКОЙ
    // ══════════════════════════════════════════════════════════════════════

    // Идеальна для паттерна Producer-Consumer
    // Без wait/notify — всё встроено!

    static void blockingQueueDemo() throws InterruptedException {
        System.out.println("\n=== BlockingQueue (Producer-Consumer) ===");

        // LinkedBlockingQueue: связный список, опционально ограниченный
        BlockingQueue<String> queue = new LinkedBlockingQueue<>(10); // ёмкость 10

        // ArrayBlockingQueue: массив фиксированного размера
        // PriorityBlockingQueue: с приоритетом (наименьший элемент первый)
        // SynchronousQueue: нет буфера, producer ждёт consumer напрямую
        // DelayQueue: элементы становятся доступны только после задержки

        CountDownLatch latch = new CountDownLatch(10);

        // Producer — добавляет платежи
        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    String payment = "PAY-" + i;
                    queue.put(payment); // Блокирует если очередь полная
                    System.out.println("Добавлен: " + payment + " (в очереди: " + queue.size() + ")");
                    Thread.sleep(30);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "producer");

        // Consumer — обрабатывает платежи
        Thread consumer = new Thread(() -> {
            while (true) {
                try {
                    String payment = queue.poll(1, TimeUnit.SECONDS); // Ждём 1 сек
                    if (payment == null) break; // Таймаут — выходим
                    System.out.println("Обработан: " + payment);
                    Thread.sleep(50);
                    latch.countDown();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }, "consumer");

        producer.start();
        consumer.start();
        latch.await(10, TimeUnit.SECONDS);
        consumer.interrupt();
        producer.join();
        consumer.join();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. COPYONWRITEARRAYLIST — ДЛЯ ЧАСТОГО ЧТЕНИЯ, РЕДКОЙ ЗАПИСИ
    // ══════════════════════════════════════════════════════════════════════

    static void copyOnWriteDemo() throws InterruptedException {
        System.out.println("\n=== CopyOnWriteArrayList ===");

        // При каждой записи создаётся КОПИЯ массива.
        // Дорого при частой записи, но чтение всегда быстро и без синхронизации.
        // Идеально для: listener-ов, подписчиков, редко меняющихся списков.
        CopyOnWriteArrayList<String> listeners = new CopyOnWriteArrayList<>();

        // Регистрируем слушателей (редко)
        listeners.add("AuditListener");
        listeners.add("LoggingListener");
        listeners.add("NotificationListener");

        ExecutorService pool = Executors.newFixedThreadPool(5);

        // Много потоков читают (часто, без блокировки!)
        for (int i = 0; i < 5; i++) {
            pool.submit(() -> {
                // Итерация безопасна — работает на snapshot
                listeners.forEach(l -> { /* вызвать слушателя */ });
            });
        }

        // Один поток добавляет нового слушателя (создаёт копию массива)
        pool.submit(() -> listeners.add("NewListener"));

        pool.shutdown();
        pool.awaitTermination(2, TimeUnit.SECONDS);
        System.out.println("Слушателей: " + listeners.size());
    }

    // ══════════════════════════════════════════════════════════════════════
    // 4. ATOMIC ПЕРЕМЕННЫЕ И LongAdder
    // ══════════════════════════════════════════════════════════════════════

    static void atomicDemo() throws InterruptedException {
        System.out.println("\n=== ATOMIC ПЕРЕМЕННЫЕ ===");

        // AtomicInteger / AtomicLong — CAS без блокировок
        AtomicLong requestCount = new AtomicLong(0);
        AtomicInteger errorCount = new AtomicInteger(0);

        // LongAdder — БЫСТРЕЕ AtomicLong при высоком contention
        // Каждый поток имеет свою "ячейку", суммируем только при чтении
        LongAdder successCount = new LongAdder();

        ExecutorService pool = Executors.newFixedThreadPool(20);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < 1000; i++) {
            futures.add(pool.submit(() -> {
                requestCount.incrementAndGet();
                if (Math.random() < 0.05) errorCount.incrementAndGet();
                else successCount.increment();
            }));
        }

        for (Future<?> f : futures) {
            try { f.get(); } catch (Exception e) { /* ignore */ }
        }

        System.out.printf("Запросов: %d, Ошибок: %d, Успешных: %d%n",
            requestCount.get(), errorCount.get(), successCount.sum());

        // AtomicReference — атомарная ссылка на объект
        record Config(int maxConnections, int timeout) {}
        AtomicReference<Config> config = new AtomicReference<>(new Config(10, 5000));

        // Атомарно заменить конфигурацию
        config.set(new Config(20, 3000));
        Config current = config.get();
        System.out.println("Конфиг: maxConn=" + current.maxConnections());

        // CAS на ссылку:
        Config oldConfig = config.get();
        boolean updated = config.compareAndSet(oldConfig, new Config(30, 2000));
        System.out.println("Конфиг обновлён: " + updated);

        pool.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 5. CONCURRENTLINKEDQUEUE — LOCK-FREE ОЧЕРЕДЬ
    // ══════════════════════════════════════════════════════════════════════

    static void concurrentQueueDemo() throws InterruptedException {
        System.out.println("\n=== ConcurrentLinkedQueue (Lock-Free) ===");

        // Использует CAS алгоритм Майкла-Скотта
        // Нет блокировок → очень быстрая при конкуренции
        // НЕ блокирует при пустой очереди (poll() возвращает null)
        ConcurrentLinkedQueue<String> eventQueue = new ConcurrentLinkedQueue<>();

        ExecutorService pool = Executors.newFixedThreadPool(4);

        // Producers
        for (int i = 0; i < 2; i++) {
            final int producerId = i;
            pool.submit(() -> {
                for (int j = 0; j < 5; j++) {
                    eventQueue.offer("Event-P" + producerId + "-" + j);
                }
            });
        }

        Thread.sleep(100); // Даём producers время

        // Consumers — неблокирующий drain
        pool.submit(() -> {
            String event;
            while ((event = eventQueue.poll()) != null) {
                System.out.println("Обработано: " + event);
            }
        });

        pool.shutdown();
        pool.awaitTermination(2, TimeUnit.SECONDS);
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. СРАВНЕНИЕ КОЛЛЕКЦИЙ
    // ══════════════════════════════════════════════════════════════════════

    /*
     КОЛЛЕКЦИЯ                │ ПОТОКОБЕЗОПАСНА │ БЛОКИРУЕТ     │ ПРИМЕНЕНИЕ
     ─────────────────────────┼─────────────────┼───────────────┼────────────────────────────
     HashMap                  │ НЕТ             │ -             │ Только в одном потоке
     Hashtable                │ ДА              │ Всю карту     │ Устарела, не используй
     Collections.synchronizedMap│ ДА            │ Всю карту     │ Редко, обёртка
     ConcurrentHashMap        │ ДА              │ Один bucket   │ Высокая конкуренция
     CopyOnWriteArrayList     │ ДА              │ При записи    │ Много чтений, мало записей
     ArrayList                │ НЕТ             │ -             │ Только в одном потоке
     Vector                   │ ДА              │ Весь список   │ Устарела
     LinkedBlockingQueue      │ ДА              │ При put/take  │ Producer-Consumer
     ConcurrentLinkedQueue    │ ДА              │ Нет (CAS)     │ Высокая конкуренция
     PriorityBlockingQueue    │ ДА              │ Да            │ Задачи с приоритетом
     AtomicInteger/Long       │ ДА              │ Нет (CAS)     │ Счётчики
     LongAdder                │ ДА              │ Нет           │ Счётчики под нагрузкой
    */

    public static void main(String[] args) throws InterruptedException {
        concurrentHashMapDemo();
        blockingQueueDemo();
        copyOnWriteDemo();
        atomicDemo();
        concurrentQueueDemo();
    }

    // ★ ЗАДАНИЯ
    // 1. Реализуй потокобезопасный кеш на ConcurrentHashMap:
    //    - getOrLoad(key, loader): если нет в кеше → загрузить и положить
    //    - Гарантируй что loader вызывается ТОЛЬКО ОДИН РАЗ для каждого ключа
    //    - Подсказка: computeIfAbsent() — атомарна!
    //
    // 2. Реализуй систему логирования с BlockingQueue:
    //    - Методы log(String) — producer (не блокирует)
    //    - Фоновый поток пишет логи в файл — consumer
    //    - Метод flush() — дождаться записи всех логов
    //
    // 3. Реализуй счётчик активных запросов с AtomicInteger:
    //    - increment() при старте запроса
    //    - decrement() при завершении (в finally!)
    //    - getActive() — текущее число активных
    //    - isShuttingDown() — запросить завершение (volatile flag)
    //    - waitForDrain() — дождаться завершения всех активных запросов
}
