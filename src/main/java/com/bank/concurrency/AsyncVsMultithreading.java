package com.bank.concurrency;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  АСИНХРОННОСТЬ VS МНОГОПОТОЧНОСТЬ — В ЧЁМ РАЗНИЦА?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ЭТО САМЫЙ ЧАСТЫЙ ВОПРОС НА СОБЕСЕДОВАНИЯХ. Большинство путают эти понятия.
 *
 *  КЛЮЧЕВОЕ РАЗЛИЧИЕ:
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │ Многопоточность — про РЕСУРСЫ (сколько потоков CPU использует)       │
 *  │ Асинхронность   — про СТИЛЬ ПРОГРАММИРОВАНИЯ (кто ждёт результата)  │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 *  АНАЛОГИИ:
 *
 *  Синхронный повар (1 поток):
 *    Поставил воду → СТОИТ И ЖДЁТ пока закипит → режет овощи
 *    Один человек, ждёт каждого шага
 *
 *  Асинхронный повар (1 поток, но умный):
 *    Поставил воду → ЗАНЯЛСЯ овощами → вода закипела — вернулся к ней
 *    Один человек, не простаивает, получает уведомление о готовности
 *
 *  Многопоточный повар (несколько потоков):
 *    Повар 1 занимается супом | Повар 2 режет овощи | Повар 3 готовит десерт
 *    Несколько человек работают параллельно
 *
 *  Асинхронный + Многопоточный (production):
 *    Несколько поваров, каждый не простаивает → максимальная эффективность
 */
public class AsyncVsMultithreading {

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 1: СИНХРОННОЕ ВЫПОЛНЕНИЕ — БЛОКИРУЮЩЕЕ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * СИНХРОННЫЙ (blocking) подход.
     *
     * Поток ЗАБЛОКИРОВАН пока ждёт IO.
     * Пока ждём ответ от БД — поток ничего не делает, просто висит.
     * 1000 одновременных запросов = 1000 заблокированных потоков = 1000MB RAM.
     */
    static String synchronousPayment(String accountId, double amount) {
        System.out.println("[" + Thread.currentThread().getName() + "] Начало запроса");

        // Шаг 1: Получить баланс из БД — БЛОКИРУЕМСЯ на 100ms
        double balance = blockingDbQuery(accountId);    // Поток СТОИТ здесь

        // Шаг 2: Проверить лимит у внешнего сервиса — БЛОКИРУЕМСЯ на 80ms
        boolean withinLimit = blockingHttpCall(amount); // Поток СТОИТ здесь

        // Шаг 3: Записать транзакцию — БЛОКИРУЕМСЯ на 50ms
        blockingDbWrite(accountId, amount);             // Поток СТОИТ здесь

        System.out.println("[" + Thread.currentThread().getName() + "] Готово. Поток простаивал ~230ms");
        return "OK";
        // Итог: поток ЗАНЯТ 230ms, но CPU РАБОТАЛ лишь ~1ms. Остальное — ожидание IO.
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 2: МНОГОПОТОЧНОСТЬ — ПАРАЛЛЕЛЬНОЕ ВЫПОЛНЕНИЕ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * МНОГОПОТОЧНЫЙ подход.
     *
     * Запускаем несколько потоков чтобы обрабатывать много запросов одновременно.
     * НО: каждый поток всё ещё блокируется на IO!
     * 1000 запросов = 1000 потоков, каждый ждёт IO — расточительно.
     *
     * Хорошо для: CPU-bound задач (вычисления, шифрование).
     * Плохо для: IO-bound задач (сеть, диск) при большом числе запросов.
     */
    static void multithreadingDemo() throws InterruptedException {
        System.out.println("\n=== МНОГОПОТОЧНОСТЬ ===");
        System.out.println("Обрабатываем 4 платежа параллельно (4 потока):");

        ExecutorService pool = Executors.newFixedThreadPool(4);
        long start = System.currentTimeMillis();

        Future<String> f1 = pool.submit(() -> synchronousPayment("ACC-001", 1000));
        Future<String> f2 = pool.submit(() -> synchronousPayment("ACC-002", 2000));
        Future<String> f3 = pool.submit(() -> synchronousPayment("ACC-003", 3000));
        Future<String> f4 = pool.submit(() -> synchronousPayment("ACC-004", 4000));

        // Ждём все 4 результата
        try { f1.get(); f2.get(); f3.get(); f4.get(); }
        catch (ExecutionException e) { /* ignore */ }

        long elapsed = System.currentTimeMillis() - start;
        System.out.printf("4 платежа обработаны за %dms (каждый 230ms, параллельно)%n", elapsed);
        // ~230ms потому что выполняются ПАРАЛЛЕЛЬНО, а не последовательно (~920ms)
        pool.shutdown();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 3: АСИНХРОННОСТЬ — НЕ БЛОКИРУЮЩЕЕ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * АСИНХРОННЫЙ подход (один поток, не блокируется).
     *
     * Пока ждём IO — поток не стоит, он обрабатывает другие запросы.
     * Уведомление приходит когда IO завершился (callback/Future/Promise).
     *
     * Это то как работают Nginx, Node.js, Netty, Spring WebFlux.
     * 1000 запросов = 1 поток (или несколько) + event loop. Намного экономнее!
     */
    static CompletableFuture<String> asyncPayment(String accountId, double amount) {
        System.out.println("[" + Thread.currentThread().getName() + "] Запущен async запрос для " + accountId);

        return asyncDbQuery(accountId)                    // Не блокируемся! Возвращаем CF
            .thenCompose(balance ->                       // Когда БД ответила — продолжаем
                asyncHttpCall(amount)                     // Снова не блокируемся
                    .thenCompose(withinLimit ->           // Когда HTTP ответил — продолжаем
                        asyncDbWrite(accountId, amount)  // И снова не блокируемся
                    )
            )
            .thenApply(v -> {
                System.out.println("[" + Thread.currentThread().getName() + "] Async готово для " + accountId);
                return "OK";
            });
        // Поток НЕ ЖДЁТ нигде! Он свободен для других запросов.
    }

    static void asyncDemo() throws Exception {
        System.out.println("\n=== АСИНХРОННОСТЬ (CompletableFuture) ===");
        System.out.println("4 платежа async — один поток обслуживает всех:");

        long start = System.currentTimeMillis();

        // Запускаем 4 async операции — они все начинаются немедленно
        CompletableFuture<String> cf1 = asyncPayment("ACC-001", 1000);
        CompletableFuture<String> cf2 = asyncPayment("ACC-002", 2000);
        CompletableFuture<String> cf3 = asyncPayment("ACC-003", 3000);
        CompletableFuture<String> cf4 = asyncPayment("ACC-004", 4000);

        // Ждём все результаты
        CompletableFuture.allOf(cf1, cf2, cf3, cf4).get();

        System.out.printf("4 async платежа за %dms%n", System.currentTimeMillis() - start);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 4: ВИДЫ ПАРАЛЛЕЛИЗМА — КЛАССИФИКАЦИЯ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     *  4 КЛЮЧЕВЫХ ПОНЯТИЯ:
     *
     *  1. CONCURRENT (Конкурентность/Параллелизм)
     *     Несколько задач ПРОГРЕССИРУЮТ в одно время (не обязательно одновременно).
     *     Может быть на одном ядре через переключение контекста.
     *     "Жонглёр: одна рука, несколько шаров — все в воздухе, но бросок один"
     *
     *  2. PARALLEL (Параллельность)
     *     Задачи выполняются ФИЗИЧЕСКИ ОДНОВРЕМЕННО на разных CPU ядрах.
     *     "Два жонглёра: каждый свой шар, реально одновременно"
     *     Подмножество Concurrency.
     *
     *  3. ASYNC (Асинхронность)
     *     Стиль программирования: вызываешь операцию и получишь результат ПОТОМ.
     *     Не блокируешь поток ожиданием. Может быть однопоточным!
     *     "Заказал пиццу, пошёл смотреть кино, курьер позвонит когда приедет"
     *
     *  4. REACTIVE (Реактивность)
     *     Программирование потоками данных (streams) + async + backpressure.
     *     Когда данных приходит больше чем успеваешь обработать — уведомляешь.
     *     Spring WebFlux, Project Reactor, RxJava.
     *
     *  СХЕМА ВЗАИМОСВЯЗИ:
     *
     *  ┌─────────────────────────────────────────────────────┐
     *  │                   CONCURRENT                        │
     *  │  (несколько задач прогрессируют одновременно)       │
     *  │                                                     │
     *  │  ┌───────────────────┐   ┌────────────────────────┐│
     *  │  │     PARALLEL      │   │        ASYNC           ││
     *  │  │ (физически парал.)│   │  (не блокирующий IO)   ││
     *  │  │                   │   │                        ││
     *  │  │ - ForkJoinPool    │   │ - CompletableFuture    ││
     *  │  │ - parallelStream  │   │ - WebFlux/Reactor      ││
     *  │  │ - ExecutorService │   │ - Callbacks            ││
     *  │  └───────────────────┘   └────────────────────────┘│
     *  └─────────────────────────────────────────────────────┘
     */

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 5: ВИДЫ ЗАДАЧ — КОГДА КАКОЙ ПОДХОД
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CPU-BOUND задачи (ограничены процессором):
     *   Шифрование, сжатие, математика, ML, парсинг JSON
     *   → Используй параллельные потоки = ForkJoinPool / parallelStream
     *   → N потоков = N ядер CPU (больше не даст выигрыша)
     *
     * IO-BOUND задачи (ограничены вводом-выводом):
     *   HTTP запросы, SQL запросы, файлы, Kafka, Redis
     *   → Используй async = CompletableFuture / WebFlux / Virtual Threads
     *   → Один поток может обслуживать тысячи IO операций
     *
     * В банке:
     *   Шифрование PINа → CPU-bound → parallelStream
     *   HTTP запрос к платёжной системе → IO-bound → CompletableFuture
     *   SQL запрос → IO-bound → async (или Virtual Threads Java 21)
     */

    // ─── CPU-bound: параллельная обработка ──────────────────────────────────
    static void cpuBoundDemo() {
        System.out.println("\n=== CPU-BOUND: parallelStream ===");

        long[] accountIds = {1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L};

        // Шифрование хешей — CPU работа, параллелим по ядрам
        long start = System.currentTimeMillis();

        long[] hashes = java.util.Arrays.stream(accountIds)
            .parallel()  // ← ForkJoinPool.commonPool(), N потоков = N ядер
            .map(id -> expensiveHash(id))
            .toArray();

        System.out.printf("10 хешей параллельно за %dms%n", System.currentTimeMillis() - start);

        // ПРЕДУПРЕЖДЕНИЕ: parallel stream плохо для IO!
        // Каждый поток будет ждать IO → все потоки ForkJoinPool заблокированы
        // → parallelStream в других частях приложения не получит потоки → деградация
    }

    // ─── IO-bound: асинхронная обработка ────────────────────────────────────
    static void ioBoundDemo() throws Exception {
        System.out.println("\n=== IO-BOUND: async CompletableFuture ===");

        ExecutorService ioPool = Executors.newFixedThreadPool(50); // IO пул (больше потоков)
        long start = System.currentTimeMillis();

        // 10 HTTP запросов параллельно, не блокируем друг друга
        var futures = java.util.List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            .stream()
            .map(i -> CompletableFuture.supplyAsync(() -> mockHttpRequest(i), ioPool))
            .toList();

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
        System.out.printf("10 HTTP запросов async за %dms (каждый ~50ms)%n",
            System.currentTimeMillis() - start);
        ioPool.shutdown();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 6: VIRTUAL THREADS (Java 21) — РЕВОЛЮЦИЯ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * ПРОБЛЕМА platform threads (старые потоки):
     *   Каждый Thread = поток ОС = ~1MB стека = дорого
     *   10 000 одновременных запросов = 10 000 потоков ОС = 10GB RAM → OOM
     *
     * VIRTUAL THREADS (Java 21, Project Loom):
     *   Виртуальные потоки управляются JVM, не ОС
     *   Миллионы virtual threads на десятках platform threads
     *   Можно писать СИНХРОННЫЙ КОД но работать как async!
     *   Когда virtual thread блокируется на IO → JVM освобождает platform thread
     *
     * АНАЛОГИЯ:
     *   Platform thread = грузовик (дорогой, мало штук)
     *   Virtual thread  = велосипед (дешёвый, миллионы)
     *   JVM            = диспетчер: велосипедистов пересаживает на грузовики
     *                   когда нужно, сам велосипед "ждёт" не занимая грузовик
     */
    static void virtualThreadsDemo() throws Exception {
        System.out.println("\n=== VIRTUAL THREADS (Java 21) ===");

        long start = System.currentTimeMillis();
        AtomicInteger counter = new AtomicInteger();

        // Запускаем 10 000 виртуальных потоков!
        // На платформе: такое же количество platform threads вызвало бы OOM
        try (ExecutorService vtp = Executors.newVirtualThreadPerTaskExecutor()) {
            var futures = new java.util.ArrayList<Future<?>>();

            for (int i = 0; i < 10_000; i++) {
                futures.add(vtp.submit(() -> {
                    // Синхронный код! Но JVM не блокирует platform thread:
                    Thread.sleep(10); // Виртуальный поток "уснул", platform thread свободен
                    counter.incrementAndGet();
                    return null;
                }));
            }

            for (Future<?> f : futures) f.get();
        }

        System.out.printf("10 000 virtual threads за %dms, counter=%d%n",
            System.currentTimeMillis() - start, counter.get());

        // Создание одного виртуального потока:
        Thread vt = Thread.ofVirtual().name("payment-vt").start(() -> {
            System.out.println("Virtual thread: " + Thread.currentThread().isVirtual());
        });
        vt.join();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 7: EVENT LOOP — КАК РАБОТАЕТ ASYNC В NODE.JS И NETTY
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * EVENT LOOP — однопоточный цикл обработки событий.
     *
     * Node.js, Nginx, Netty используют этот подход.
     * Один поток обрабатывает МИЛЛИОНЫ запросов.
     *
     * Принцип:
     *   while (true) {
     *     event = eventQueue.poll();   // Взять следующее событие
     *     handle(event);               // Обработать (БЫСТРО! нельзя блокироваться)
     *   }
     *
     * "Принято соединение от клиента 1" → запустить async запрос к БД
     * "Принято соединение от клиента 2" → запустить async запрос к БД
     * "БД ответила для клиента 1"       → отправить ответ клиенту 1
     * "БД ответила для клиента 2"       → отправить ответ клиенту 2
     *
     * В Java: Netty (основа Spring WebFlux, gRPC) использует NIO + event loop.
     *
     * ПРОБЛЕМА: если обработчик занял 1 секунду (CPU работа) → все ждут!
     * CPU-bound задачи в event loop → выносить в отдельный пул потоков.
     */
    static void eventLoopSimulation() throws InterruptedException {
        System.out.println("\n=== EVENT LOOP СИМУЛЯЦИЯ ===");

        BlockingQueue<String> eventQueue = new LinkedBlockingQueue<>();
        AtomicInteger processed = new AtomicInteger();

        // Симуляция event loop (один поток)
        Thread eventLoop = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    String event = eventQueue.poll(100, TimeUnit.MILLISECONDS);
                    if (event == null) break;
                    // Обработка ДОЛЖНА быть быстрой!
                    System.out.println("[EventLoop] Обработка: " + event);
                    processed.incrementAndGet();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "event-loop");

        eventLoop.start();

        // Симуляция входящих событий
        eventQueue.put("HTTP_REQUEST:ACC-001");
        eventQueue.put("DB_RESPONSE:ACC-002:balance=50000");
        eventQueue.put("HTTP_REQUEST:ACC-003");
        eventQueue.put("KAFKA_MESSAGE:transfer_completed");
        eventQueue.put("DB_RESPONSE:ACC-001:balance=30000");

        eventLoop.join();
        System.out.println("Обработано событий: " + processed.get());
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ЧАСТЬ 8: REACTIVE PROGRAMMING — СЛЕДУЮЩИЙ УРОВЕНЬ
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * REACTIVE (Project Reactor в Spring WebFlux):
     *
     * Mono<T>  — 0 или 1 элемент (как Optional но async)
     * Flux<T>  — 0 или N элементов (как Stream но async)
     *
     * Принципы:
     *   Responsive  — быстро отвечает
     *   Resilient   — устойчив к сбоям
     *   Elastic     — масштабируется
     *   Message-driven — асинхронные сообщения
     *
     * BACKPRESSURE — ключевое отличие от CompletableFuture:
     *   Consumer говорит Producer: "Присылай не более 10 элементов в секунду"
     *   Иначе consumer захлёбывается (OutOfMemory)
     *
     * Пример Spring WebFlux:
     *
     *   @GetMapping("/accounts/{id}")
     *   public Mono<Account> getAccount(@PathVariable String id) {
     *       return accountRepository.findById(id)    // Возвращает Mono
     *           .switchIfEmpty(Mono.error(new NotFoundException()))
     *           .map(acc -> enrichWithMetadata(acc));
     *   }
     *
     *   @GetMapping(value = "/accounts/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
     *   public Flux<Account> streamAccounts() {
     *       return accountRepository.findAll()  // Возвращает Flux (поток данных)
     *           .delayElements(Duration.ofMillis(100));  // Backpressure
     *   }
     *
     * КОГДА ИСПОЛЬЗОВАТЬ WebFlux vs MVC:
     *   MVC (синхронный):  Простые CRUD, команда не знает reactive, монолит
     *   WebFlux (async):   Много IO, streaming данных, микросервисы, высокая нагрузка
     */

    // ═══════════════════════════════════════════════════════════════════════
    //  СРАВНИТЕЛЬНАЯ ТАБЛИЦА
    // ═══════════════════════════════════════════════════════════════════════

    /*
     ПОДХОД            │ ПОТОКИ │ БЛОКИРОВКА │ СЛОЖНОСТЬ │ ПРИМЕНЕНИЕ
     ──────────────────┼────────┼────────────┼───────────┼─────────────────────────
     Синхронный        │ 1      │ ДА         │ Низкая    │ Простые скрипты
     Многопоточный     │ N      │ ДА         │ Средняя   │ CPU-bound задачи
     CompletableFuture │ N(IO)  │ НЕТ        │ Средняя   │ Async IO, микросервисы
     Virtual Threads   │ M*     │ НЕТ(JVM)   │ Низкая!   │ IO-bound, Java 21+
     Reactive (Flux)   │ Мало   │ НЕТ        │ Высокая   │ Стриминг, backpressure
     Event Loop        │ 1-2    │ НЕТ        │ Высокая   │ Netty, Node.js стиль

     * M virtual threads на N platform threads (N << M, типично N = число ядер)
    */

    // ═══════════════════════════════════════════════════════════════════════
    //  ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ (ИМИТАЦИЯ IO)
    // ═══════════════════════════════════════════════════════════════════════

    static double blockingDbQuery(String id)       { sleep(100); return 50000.0; }
    static boolean blockingHttpCall(double amount)  { sleep(80);  return true; }
    static void blockingDbWrite(String id, double a){ sleep(50); }

    static CompletableFuture<Double> asyncDbQuery(String id) {
        return CompletableFuture.supplyAsync(() -> { sleep(100); return 50000.0; });
    }
    static CompletableFuture<Boolean> asyncHttpCall(double amount) {
        return CompletableFuture.supplyAsync(() -> { sleep(80); return true; });
    }
    static CompletableFuture<Void> asyncDbWrite(String id, double amount) {
        return CompletableFuture.runAsync(() -> sleep(50));
    }

    static long expensiveHash(long id) {
        long h = id * 6364136223846793005L + 1442695040888963407L;
        for (int i = 0; i < 100_000; i++) h = h * h + id; // CPU работа
        return h;
    }

    static String mockHttpRequest(int i) { sleep(50); return "response-" + i; }

    static void sleep(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Потоков CPU: " + Runtime.getRuntime().availableProcessors());
        multithreadingDemo();
        asyncDemo();
        cpuBoundDemo();
        ioBoundDemo();
        virtualThreadsDemo();
        eventLoopSimulation();

        System.out.println("\n═══ ВЫВОД ═══");
        System.out.println("Многопоточность ≠ Асинхронность");
        System.out.println("IO-bound → Virtual Threads (Java 21) или CompletableFuture");
        System.out.println("CPU-bound → parallelStream / ForkJoinPool");
        System.out.println("Высокая нагрузка + стриминг → Spring WebFlux (Reactor)");
    }

    // ★ ЗАДАНИЯ
    // 1. Замерь: 100 синхронных запросов (каждый 100ms) vs 100 async. Разница?
    // 2. Сломай event loop: добавь Thread.sleep(1000) в обработчик.
    //    Что происходит с остальными событиями?
    // 3. Реализуй simple event loop: очередь + один поток + 3 типа событий
    // 4. Запусти 1 000 000 virtual threads. Сколько памяти использует приложение?
    //    Сравни с 1000 platform threads.
}
