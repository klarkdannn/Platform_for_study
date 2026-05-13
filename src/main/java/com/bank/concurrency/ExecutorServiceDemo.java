package com.bank.concurrency;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

/**
 * МНОГОПОТОЧНОСТЬ В JAVA — ЧАСТЬ 2: EXECUTOR SERVICE И COMPLETABLEFUTURE
 *
 * Thread вручную — низкоуровнево и неудобно.
 * ExecutorService — пул потоков, готовый к production.
 * CompletableFuture — асинхронное программирование в современном стиле.
 *
 * В Spring Boot всё это используется под капотом:
 *   @Async → запускает метод в ThreadPoolTaskExecutor
 *   WebFlux → реактивный стиль (CompletableFuture на стероидах)
 *   @Scheduled → ScheduledExecutorService
 */
public class ExecutorServiceDemo {

    // ══════════════════════════════════════════════════════════════════════
    // 1. ТИПЫ THREAD POOLS
    // ══════════════════════════════════════════════════════════════════════

    static void threadPoolsDemo() throws InterruptedException, ExecutionException {
        System.out.println("\n=== ТИПЫ THREAD POOLS ===");

        // Fixed: N постоянных потоков. Задачи ждут в очереди.
        // Хорошо для CPU-bound задач (вычисления).
        // Правило: N = количество CPU ядер
        int cpuCores = Runtime.getRuntime().availableProcessors();
        ExecutorService fixedPool = Executors.newFixedThreadPool(cpuCores);

        // Cached: Создаёт потоки по мере нужды, удаляет после 60s простоя.
        // Хорошо для I/O-bound задач (сеть, диск) если их немного.
        // ОПАСНО: при шторме запросов создаёт тысячи потоков → OOM!
        ExecutorService cachedPool = Executors.newCachedThreadPool();

        // Single: Один поток, задачи выполняются последовательно.
        // Хорошо для сериализации доступа к ресурсу.
        ExecutorService singlePool = Executors.newSingleThreadExecutor();

        // Scheduled: для периодических задач (@Scheduled в Spring)
        ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(2);

        // ThreadPoolExecutor: максимальный контроль (используй в production!)
        ThreadPoolExecutor customPool = new ThreadPoolExecutor(
            4,              // corePoolSize: всегда живут
            8,              // maximumPoolSize: максимум при нагрузке
            60L, TimeUnit.SECONDS,  // keepAliveTime: как долго жить сверх core
            new LinkedBlockingQueue<>(100),  // Очередь задач (НЕ неограниченная!)
            new ThreadFactory() {
                private final AtomicInteger count = new AtomicInteger(1);
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "bank-worker-" + count.getAndIncrement());
                    t.setDaemon(false);
                    return t;
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy() // Политика при переполнении очереди
            // AbortPolicy: выбросить RejectedExecutionException (по умолчанию)
            // CallerRunsPolicy: выполнить в вызывающем потоке (замедляет producer)
            // DiscardPolicy: тихо выбросить задачу
            // DiscardOldestPolicy: выбросить самую старую задачу
        );

        // Демонстрация submit:
        Future<String> future = fixedPool.submit(() -> {
            Thread.sleep(50);
            return "Платёж обработан потоком: " + Thread.currentThread().getName();
        });
        System.out.println(future.get()); // Блокирует до получения результата

        // Завершение пулов
        fixedPool.shutdown();    // Ждёт завершения текущих задач
        cachedPool.shutdown();
        singlePool.shutdown();
        scheduledPool.shutdown();
        customPool.shutdown();

        // fixedPool.shutdownNow() — прерывает текущие задачи (посылает InterruptedException)
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. FUTURE — РЕЗУЛЬТАТ АСИНХРОННОЙ ЗАДАЧИ
    // ══════════════════════════════════════════════════════════════════════

    static void futureDemo() throws InterruptedException, ExecutionException, TimeoutException {
        System.out.println("\n=== FUTURE ===");

        ExecutorService pool = Executors.newFixedThreadPool(4);

        // Запустить несколько задач параллельно
        List<Future<Double>> futures = new ArrayList<>();
        String[] accounts = {"ACC-001", "ACC-002", "ACC-003", "ACC-004"};

        for (String acc : accounts) {
            Future<Double> f = pool.submit(() -> {
                Thread.sleep(100); // Имитация запроса к БД
                return Math.random() * 100_000; // Баланс счёта
            });
            futures.add(f);
        }

        // Собрать результаты
        double totalBalance = 0;
        for (int i = 0; i < futures.size(); i++) {
            try {
                // get(timeout) — не ждём бесконечно!
                double balance = futures.get(i).get(2, TimeUnit.SECONDS);
                totalBalance += balance;
                System.out.printf("Баланс %s: %.2f%n", accounts[i], balance);
            } catch (TimeoutException e) {
                System.out.println("Таймаут для " + accounts[i]);
                futures.get(i).cancel(true); // Отменить задачу
            }
        }
        System.out.printf("Общий баланс: %.2f%n", totalBalance);

        pool.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. INVOKEALL / INVOKEANY
    // ══════════════════════════════════════════════════════════════════════

    static void invokeDemo() throws InterruptedException, ExecutionException {
        System.out.println("\n=== INVOKEALL / INVOKEANY ===");

        ExecutorService pool = Executors.newFixedThreadPool(3);

        List<Callable<String>> tasks = List.of(
            () -> { Thread.sleep(100); return "Результат от банка А"; },
            () -> { Thread.sleep(200); return "Результат от банка Б"; },
            () -> { Thread.sleep(50);  return "Результат от банка В"; }
        );

        // invokeAll: ждёт ВСЕ задачи (максимум 5 секунд)
        System.out.println("--- invokeAll ---");
        List<Future<String>> all = pool.invokeAll(tasks, 5, TimeUnit.SECONDS);
        for (Future<String> f : all) {
            System.out.println(f.isDone() ? f.get() : "Не завершилось");
        }

        // invokeAny: возвращает результат ПЕРВОЙ завершившейся задачи
        // Полезно: отправить запрос в несколько систем, взять быстрейший ответ
        System.out.println("--- invokeAny ---");
        String fastest = pool.invokeAny(tasks);
        System.out.println("Быстрейший ответ: " + fastest);

        pool.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 4. COMPLETABLEFUTURE — СОВРЕМЕННОЕ ASYNC ПРОГРАММИРОВАНИЕ
    // ══════════════════════════════════════════════════════════════════════

    // Имитация сервисов:
    static CompletableFuture<Double> getAccountBalance(String accountId) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(100); // Запрос к БД
            return 50_000.0;
        });
    }

    static CompletableFuture<Double> getExchangeRate(String currency) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(80); // Запрос к внешнему API
            return currency.equals("USD") ? 90.5 : 98.2;
        });
    }

    static CompletableFuture<Boolean> sendNotification(String userId, String message) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(50); // Запрос к SMS сервису
            System.out.println("Уведомление отправлено: " + userId + " → " + message);
            return true;
        });
    }

    static void completableFutureDemo() throws Exception {
        System.out.println("\n=== COMPLETABLEFUTURE ===");

        // --- Базовое использование ---
        CompletableFuture<String> simple = CompletableFuture
            .supplyAsync(() -> "Данные из БД")  // Async задача
            .thenApply(data -> data.toUpperCase())  // Трансформация (map)
            .thenApply(data -> "Результат: " + data);

        System.out.println(simple.get());

        // --- Цепочка зависимых операций (как Stream для async) ---
        System.out.println("--- Цепочка операций ---");
        CompletableFuture<String> transfer = CompletableFuture
            .supplyAsync(() -> { sleep(50); return "user-123"; })        // Найти пользователя
            .thenApply(userId -> { sleep(50); return 50_000.0; })        // Получить баланс
            .thenApply(balance -> balance - 10_000)                      // Списать
            .thenApply(newBalance -> "Новый баланс: " + newBalance)      // Форматировать
            .thenApply(msg -> { System.out.println(msg); return msg; }); // Логировать

        transfer.get();

        // --- Параллельные запросы (самое важное!) ---
        System.out.println("--- Параллельные запросы ---");
        long start = System.currentTimeMillis();

        // Запустить ВСЕ запросы параллельно
        CompletableFuture<Double> balanceFuture = getAccountBalance("ACC-001");
        CompletableFuture<Double> rateFuture = getExchangeRate("USD");

        // Ждём ОБОИХ и объединяем
        CompletableFuture<Double> combined = balanceFuture.thenCombine(
            rateFuture,
            (balance, rate) -> balance / rate // Конвертация в USD
        );

        System.out.printf("Баланс в USD: %.2f (за %dms)%n",
            combined.get(), System.currentTimeMillis() - start);
        // Занимает ~100ms (максимум из 100 и 80), а не 180ms!

        // --- allOf: Ждать ВСЕ задачи ---
        System.out.println("--- allOf ---");
        CompletableFuture<Double> b1 = getAccountBalance("ACC-001");
        CompletableFuture<Double> b2 = getAccountBalance("ACC-002");
        CompletableFuture<Double> b3 = getAccountBalance("ACC-003");

        CompletableFuture<Void> allDone = CompletableFuture.allOf(b1, b2, b3);
        allDone.get(); // Ждём все три

        double total = b1.get() + b2.get() + b3.get();
        System.out.println("Суммарный баланс: " + total);

        // --- anyOf: Первый завершившийся ---
        System.out.println("--- anyOf ---");
        CompletableFuture<Object> fastest = CompletableFuture.anyOf(
            CompletableFuture.supplyAsync(() -> { sleep(200); return "Медленный"; }),
            CompletableFuture.supplyAsync(() -> { sleep(50);  return "Быстрый"; }),
            CompletableFuture.supplyAsync(() -> { sleep(100); return "Средний"; })
        );
        System.out.println("Первый ответ: " + fastest.get());

        // --- Обработка ошибок ---
        System.out.println("--- Обработка ошибок ---");
        CompletableFuture<String> withError = CompletableFuture
            .supplyAsync(() -> {
                if (Math.random() > 0.5) throw new RuntimeException("Сервис недоступен");
                return "Успех";
            })
            .exceptionally(ex -> "Fallback: " + ex.getMessage())  // Как catch
            .thenApply(result -> "Финальный результат: " + result);

        System.out.println(withError.get());

        // handle: обрабатывает ОБА случая (успех и ошибка)
        CompletableFuture<String> handled = CompletableFuture
            .supplyAsync(() -> { throw new RuntimeException("Ошибка!"); })
            .handle((result, ex) -> {
                if (ex != null) return "Ошибка: " + ex.getMessage();
                return result.toString();
            });
        System.out.println(handled.get());

        // whenComplete: side-effect (лог, метрика) без изменения результата
        CompletableFuture<Double> withLogging = getAccountBalance("ACC-001")
            .whenComplete((balance, ex) -> {
                if (ex != null) System.out.println("Ошибка получения баланса: " + ex);
                else System.out.println("Баланс успешно получен: " + balance);
            });
        withLogging.get();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 5. РЕАЛЬНЫЙ СЦЕНАРИЙ: ПАРАЛЛЕЛЬНАЯ ОБРАБОТКА ПЛАТЕЖЕЙ
    // ══════════════════════════════════════════════════════════════════════

    record Payment(String id, String fromAccount, String toAccount, double amount) {}

    static class PaymentBatchProcessor {
        private final ExecutorService pool = Executors.newFixedThreadPool(8);

        // Обработать пачку платежей параллельно
        CompletableFuture<List<String>> processBatch(List<Payment> payments) {
            List<CompletableFuture<String>> futures = payments.stream()
                .map(this::processPayment)
                .toList();

            return CompletableFuture
                .allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                    .map(f -> f.join()) // join() вместо get() (нет checked exception)
                    .toList());
        }

        private CompletableFuture<String> processPayment(Payment payment) {
            return CompletableFuture.supplyAsync(() -> {
                sleep(50 + (int)(Math.random() * 100)); // Имитация обработки
                return "OK: " + payment.id();
            }, pool);
        }

        void shutdown() {
            pool.shutdown();
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. SCHEDULED TASKS (@Scheduled в Spring под капотом)
    // ══════════════════════════════════════════════════════════════════════

    static void scheduledDemo() throws InterruptedException {
        System.out.println("\n=== SCHEDULED TASKS ===");

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        // Выполнить один раз через 1 секунду
        scheduler.schedule(
            () -> System.out.println("Отложенное уведомление"),
            1, TimeUnit.SECONDS
        );

        // Повторять каждые 500ms (аналог @Scheduled(fixedRate))
        ScheduledFuture<?> periodic = scheduler.scheduleAtFixedRate(
            () -> System.out.println("Проверка курсов валют: " +
                System.currentTimeMillis()),
            0,    // initialDelay
            500,  // period
            TimeUnit.MILLISECONDS
        );

        // scheduleWithFixedDelay: задержка ПОСЛЕ завершения задачи
        // (аналог @Scheduled(fixedDelay))
        scheduler.scheduleWithFixedDelay(
            () -> { System.out.println("Очистка кеша"); sleep(100); },
            0, 400, TimeUnit.MILLISECONDS
        );

        Thread.sleep(1500); // Даём поработать 1.5 секунды
        periodic.cancel(false);
        scheduler.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 7. SEMAPHORE — ОГРАНИЧЕНИЕ ЧИСЛА ОДНОВРЕМЕННЫХ ОПЕРАЦИЙ
    // ══════════════════════════════════════════════════════════════════════

    static void semaphoreDemo() throws InterruptedException {
        System.out.println("\n=== SEMAPHORE (Rate Limiting) ===");

        // Максимум 3 одновременных запроса к внешнему API
        java.util.concurrent.Semaphore semaphore = new java.util.concurrent.Semaphore(3);

        ExecutorService pool = Executors.newFixedThreadPool(10);
        AtomicInteger concurrent = new AtomicInteger(0);
        AtomicInteger maxConcurrent = new AtomicInteger(0);

        List<Future<?>> futures = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            futures.add(pool.submit(() -> {
                try {
                    semaphore.acquire(); // Занять слот (блокирует если 0 слотов)
                    int current = concurrent.incrementAndGet();
                    maxConcurrent.updateAndGet(m -> Math.max(m, current));
                    System.out.printf("Задача %d запущена (concurrent=%d)%n", taskId, current);
                    sleep(100);
                    concurrent.decrementAndGet();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    semaphore.release(); // Освободить слот
                }
            }));
        }

        for (Future<?> f : futures) {
            try { f.get(); } catch (ExecutionException e) { /* ignore */ }
        }
        System.out.println("Максимум одновременных: " + maxConcurrent.get() + " (лимит: 3)");
        pool.shutdown();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 8. COUNTDOWNLATCH И CYCLICBARRIER
    // ══════════════════════════════════════════════════════════════════════

    static void coordinationDemo() throws InterruptedException {
        System.out.println("\n=== COORDINATION PRIMITIVES ===");

        // CountDownLatch: ждём пока N операций не завершатся
        // Нельзя переиспользовать!
        java.util.concurrent.CountDownLatch latch = new java.util.concurrent.CountDownLatch(3);

        ExecutorService pool = Executors.newFixedThreadPool(3);
        String[] services = {"БД", "Кеш", "Kafka"};

        for (String service : services) {
            pool.submit(() -> {
                sleep(100 + (int)(Math.random() * 200));
                System.out.println(service + " запущен");
                latch.countDown(); // Уменьшить счётчик
            });
        }

        System.out.println("Ждём запуска всех сервисов...");
        latch.await(5, TimeUnit.SECONDS); // Ждём пока счётчик не станет 0
        System.out.println("Все сервисы запущены! Запускаем приложение.");

        // CyclicBarrier: N потоков ждут ДРУГ ДРУГА в точке встречи
        // Можно переиспользовать (в отличие от CountDownLatch)
        java.util.concurrent.CyclicBarrier barrier = new java.util.concurrent.CyclicBarrier(
            3,
            () -> System.out.println("=== Все потоки в точке синхронизации ===")
        );

        for (int i = 0; i < 3; i++) {
            final int id = i;
            pool.submit(() -> {
                try {
                    sleep(50 * id);
                    System.out.println("Поток " + id + " готов");
                    barrier.await(); // Ждём все потоки
                    System.out.println("Поток " + id + " продолжает работу");
                } catch (Exception e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
    }

    private static void sleep(int ms) {
        try { Thread.sleep(ms); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    public static void main(String[] args) throws Exception {
        threadPoolsDemo();
        futureDemo();
        invokeDemo();
        completableFutureDemo();

        System.out.println("\n=== BATCH PROCESSOR ===");
        PaymentBatchProcessor processor = new PaymentBatchProcessor();
        List<Payment> batch = List.of(
            new Payment("P1", "A1", "A2", 1000),
            new Payment("P2", "A3", "A4", 2000),
            new Payment("P3", "A5", "A6", 3000)
        );
        List<String> results = processor.processBatch(batch).get();
        results.forEach(System.out::println);
        processor.shutdown();

        scheduledDemo();
        semaphoreDemo();
        coordinationDemo();
    }

    // ★ ЗАДАНИЯ
    // 1. Напиши метод который параллельно получает балансы 10 счетов
    //    (каждый запрос 100ms) и возвращает сумму. Замерь время.
    //    Должно выполниться за ~100ms, не за 1000ms!
    //
    // 2. Реализуй retry с CompletableFuture:
    //    - Если задача падает с ошибкой, повтори до 3 раз
    //    - С exponential backoff (1s, 2s, 4s между попытками)
    //
    // 3. Реализуй timeout для CompletableFuture без Java 9:
    //    - completeOnTimeout() (Java 9+)
    //    - Вручную через ScheduledExecutor (для понимания)
    //
    // 4. Реализуй ограничитель скорости (RateLimiter):
    //    - Не более 10 запросов в секунду
    //    - Используй Semaphore + ScheduledExecutor для освобождения
}
