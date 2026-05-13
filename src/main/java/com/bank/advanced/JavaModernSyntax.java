package com.bank.advanced;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   СОВРЕМЕННЫЙ СИНТАКСИС JAVA 8–21                       ║
 * ║   Records, Sealed, Pattern Matching, Streams, Optionals  ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Версии Java и что добавили:
 *  Java 8  (2014) — Lambda, Stream API, Optional, Date/Time API
 *  Java 9  (2017) — Модули, List.of(), Map.of(), Stream.takeWhile/dropWhile
 *  Java 10 (2018) — var (локальный вывод типов)
 *  Java 11 (2018) — LTS. String.isBlank(), strip(), lines(). HTTP Client.
 *  Java 14 (2020) — Records (preview), switch expressions (stable)
 *  Java 15 (2020) — Text Blocks (stable), Sealed Classes (preview)
 *  Java 16 (2021) — Records (stable), Pattern Matching instanceof (stable)
 *  Java 17 (2021) — LTS. Sealed Classes (stable), Switch Pattern (preview)
 *  Java 21 (2023) — LTS. Virtual Threads! Switch Pattern (stable), SequencedCollection
 */
public class JavaModernSyntax {

    // ══════════════════════════════════════════════════════════
    // 1. VAR — ВЫВОД ТИПОВ (Java 10+)
    // ══════════════════════════════════════════════════════════
    // var НЕ означает динамическую типизацию!
    // Компилятор выводит тип из правой части. Тип фиксируется.

    static void varDemo() {
        var balance = new BigDecimal("50000.00");  // BigDecimal
        var accounts = new ArrayList<String>();    // ArrayList<String>
        var name = "Иван Иванов";                  // String

        // Удобно для длинных типов:
        var map = new HashMap<String, List<BigDecimal>>();

        // НЕЛЬЗЯ использовать:
        // var x;           ← нет инициализации
        // var x = null;    ← нельзя определить тип
        // public var foo() ← только локальные переменные
    }

    // ══════════════════════════════════════════════════════════
    // 2. RECORDS (Java 16+) — неизменяемые классы данных
    // ══════════════════════════════════════════════════════════
    // Record автоматически генерирует:
    //   - конструктор со всеми полями
    //   - геттеры (без get префикса: id(), amount())
    //   - equals(), hashCode(), toString()
    //
    // БАНК: Неизменяемые DTO, запросы, события.

    // Простой record:
    record Money(BigDecimal amount, String currency) {
        // Компактный конструктор — валидация:
        Money {
            if (amount.compareTo(BigDecimal.ZERO) < 0)
                throw new IllegalArgumentException("Сумма не может быть отрицательной: " + amount);
            currency = currency.toUpperCase();
        }

        // Можно добавлять методы:
        public Money add(Money other) {
            if (!this.currency.equals(other.currency))
                throw new IllegalArgumentException("Разные валюты");
            return new Money(this.amount.add(other.amount), this.currency);
        }

        public boolean isZero() { return amount.compareTo(BigDecimal.ZERO) == 0; }
    }

    record TransferRequest(String fromAccountId, String toAccountId, Money amount, String description) {}
    record TransferResult(boolean success, String transactionId, String message) {}
    record PageRequest(int page, int size, String sortBy) {
        PageRequest { if (size <= 0 || size > 100) throw new IllegalArgumentException("size: 1-100"); }
        static PageRequest of(int page, int size) { return new PageRequest(page, size, "createdAt"); }
    }

    // ══════════════════════════════════════════════════════════
    // 3. SEALED CLASSES (Java 17+) — закрытая иерархия
    // ══════════════════════════════════════════════════════════
    // sealed = только разрешённые подклассы.
    // Компилятор знает ВСЕ возможные подтипы → exhaustive switch.
    //
    // БАНК: Чёткое разграничение типов результатов операции.

    sealed interface PaymentResult permits PaymentResult.Success, PaymentResult.Failure, PaymentResult.Pending {
        record Success(String transactionId, BigDecimal amount, Instant timestamp) implements PaymentResult {}
        record Failure(String errorCode, String message, boolean retryable) implements PaymentResult {}
        record Pending(String transactionId, String reason) implements PaymentResult {}
    }

    sealed interface AccountEvent
            permits AccountEvent.Opened, AccountEvent.Credited, AccountEvent.Debited,
                    AccountEvent.Blocked, AccountEvent.Closed {
        record Opened(String accountId, String clientId, Instant at)   implements AccountEvent {}
        record Credited(String accountId, BigDecimal amount, Instant at) implements AccountEvent {}
        record Debited(String accountId, BigDecimal amount, Instant at)  implements AccountEvent {}
        record Blocked(String accountId, String reason, Instant at)    implements AccountEvent {}
        record Closed(String accountId, Instant at)                    implements AccountEvent {}
    }

    // ══════════════════════════════════════════════════════════
    // 4. SWITCH EXPRESSIONS + PATTERN MATCHING (Java 14–21)
    // ══════════════════════════════════════════════════════════

    // Switch expression (Java 14+) — возвращает значение:
    static String getAccountCategory(BigDecimal balance) {
        return switch (balance.divide(BigDecimal.valueOf(10_000)).intValue()) {
            case 0      -> "Стандарт";
            case 1, 2, 3, 4, 5, 6, 7, 8, 9 -> "Серебро";
            default     -> balance.compareTo(BigDecimal.valueOf(1_000_000)) >= 0
                           ? "Премиум" : "Золото";
        };
    }

    // Pattern matching switch (Java 21, stable):
    static String describePaymentResult(PaymentResult result) {
        return switch (result) {
            case PaymentResult.Success(var txId, var amount, var ts) ->
                "Успех: txId=%s, сумма=%s".formatted(txId, amount);
            case PaymentResult.Failure(var code, var msg, var retry) ->
                "Ошибка [%s]: %s%s".formatted(code, msg, retry ? " (можно повторить)" : "");
            case PaymentResult.Pending(var txId, var reason) ->
                "Ожидание txId=%s: %s".formatted(txId, reason);
        };
        // Компилятор проверяет exhaustiveness! Забыл ветку — ошибка компиляции.
    }

    // Pattern matching для instanceof (Java 16+):
    static void processEvent(AccountEvent event) {
        if (event instanceof AccountEvent.Credited(String accountId, BigDecimal amount, Instant at)) {
            System.out.printf("Зачисление на %s: +%s в %s%n", accountId, amount, at);
        } else if (event instanceof AccountEvent.Debited(String accountId, BigDecimal amount, Instant at)) {
            System.out.printf("Списание с %s: -%s в %s%n", accountId, amount, at);
        }
    }

    // ══════════════════════════════════════════════════════════
    // 5. TEXT BLOCKS (Java 15+) — многострочные строки
    // ══════════════════════════════════════════════════════════
    // БАНК: SQL запросы, JSON шаблоны, email тексты.

    static final String SQL_QUERY = """
            SELECT a.id, a.balance, c.name, c.email
            FROM accounts a
            JOIN clients c ON a.client_id = c.id
            WHERE a.status = 'ACTIVE'
              AND a.balance > :minBalance
            ORDER BY a.balance DESC
            LIMIT :limit
            """;

    static final String EMAIL_TEMPLATE = """
            Уважаемый %s,

            Уведомляем Вас о поступлении средств:
            Счёт: %s
            Сумма: %,.2f %s
            Дата: %s

            С уважением,
            Банк
            """;

    static final String JSON_EXAMPLE = """
            {
              "accountId": "ACC-001",
              "balance": 50000.00,
              "currency": "RUB",
              "status": "ACTIVE"
            }
            """;

    // ══════════════════════════════════════════════════════════
    // 6. ADVANCED STREAM API
    // ══════════════════════════════════════════════════════════

    record Transaction(String id, BigDecimal amount, String type, LocalDate date) {}

    static void streamAdvanced() {
        List<Transaction> transactions = List.of(
            new Transaction("T1", new BigDecimal("1000"), "DEPOSIT",   LocalDate.now()),
            new Transaction("T2", new BigDecimal("500"),  "WITHDRAW",  LocalDate.now()),
            new Transaction("T3", new BigDecimal("2000"), "DEPOSIT",   LocalDate.now().minusDays(1)),
            new Transaction("T4", new BigDecimal("150"),  "FEE",       LocalDate.now()),
            new Transaction("T5", new BigDecimal("3000"), "DEPOSIT",   LocalDate.now())
        );

        // Сумма депозитов за сегодня
        BigDecimal todayDeposits = transactions.stream()
            .filter(t -> "DEPOSIT".equals(t.type()) && t.date().equals(LocalDate.now()))
            .map(Transaction::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        System.out.println("Депозиты сегодня: " + todayDeposits);

        // Группировка по типу с суммой
        Map<String, BigDecimal> byType = transactions.stream()
            .collect(Collectors.groupingBy(
                Transaction::type,
                Collectors.reducing(BigDecimal.ZERO, Transaction::amount, BigDecimal::add)
            ));
        System.out.println("По типам: " + byType);

        // Статистика
        DoubleSummaryStatistics stats = transactions.stream()
            .mapToDouble(t -> t.amount().doubleValue())
            .summaryStatistics();
        System.out.printf("Мин: %.2f, Макс: %.2f, Среднее: %.2f%n",
                stats.getMin(), stats.getMax(), stats.getAverage());

        // flatMap — развернуть вложенные списки
        List<List<Transaction>> batches = List.of(
            transactions.subList(0, 2), transactions.subList(2, 4));
        long total = batches.stream().flatMap(List::stream).count();
        System.out.println("Всего через flatMap: " + total);

        // takeWhile / dropWhile (Java 9+) — берём/пропускаем пока условие true
        List<Transaction> until500 = transactions.stream()
            .takeWhile(t -> t.amount().compareTo(new BigDecimal("1000")) <= 0)
            .toList();

        // Collectors.teeing (Java 12+) — два коллектора одновременно
        record MinMax(BigDecimal min, BigDecimal max) {}
        MinMax minMax = transactions.stream()
            .collect(Collectors.teeing(
                Collectors.minBy(Comparator.comparing(Transaction::amount)),
                Collectors.maxBy(Comparator.comparing(Transaction::amount)),
                (min, max) -> new MinMax(
                    min.map(Transaction::amount).orElse(BigDecimal.ZERO),
                    max.map(Transaction::amount).orElse(BigDecimal.ZERO)
                )
            ));
        System.out.println("Min: " + minMax.min() + ", Max: " + minMax.max());
    }

    // ══════════════════════════════════════════════════════════
    // 7. OPTIONAL — работа с null-безопасностью
    // ══════════════════════════════════════════════════════════

    record Client(String id, String name, String email) {}
    static Map<String, Client> clientDB = Map.of(
        "1", new Client("1", "Иван", "ivan@bank.ru"),
        "2", new Client("2", "Мария", null)
    );

    static Optional<Client> findClient(String id) {
        return Optional.ofNullable(clientDB.get(id));
    }

    static void optionalDemo() {
        // Цепочка операций без null-проверок
        String email = findClient("1")
            .map(Client::email)
            .filter(e -> e.contains("@"))
            .orElse("no-reply@bank.ru");
        System.out.println("Email клиента 1: " + email);

        // orElseGet — ленивое вычисление (не вызывается если значение есть)
        String fallback = findClient("99")
            .map(Client::name)
            .orElseGet(() -> "Неизвестный");
        System.out.println("Клиент 99: " + fallback);

        // orElseThrow
        try {
            findClient("99").orElseThrow(() ->
                new NoSuchElementException("Клиент не найден"));
        } catch (NoSuchElementException e) {
            System.out.println("Поймано: " + e.getMessage());
        }

        // ifPresentOrElse (Java 9+)
        findClient("2").map(Client::email)
            .ifPresentOrElse(
                e -> System.out.println("Email: " + e),
                () -> System.out.println("Email не указан")
            );

        // flatMap для Optional<Optional<...>>
        Optional<String> nested = findClient("1")
            .flatMap(c -> Optional.ofNullable(c.email()));
    }

    // ══════════════════════════════════════════════════════════
    // 8. VIRTUAL THREADS (Java 21+) — Project Loom
    // ══════════════════════════════════════════════════════════
    // Обычные потоки: 1 поток OS = ~1MB RAM. 10 000 потоков = 10GB!
    // Virtual Threads: lightweight, миллионы потоков в JVM.
    // НЕ нужен WebFlux для неблокирующего кода!
    //
    // БАНК: Обработка тысяч параллельных платёжных запросов.

    static void virtualThreadsDemo() throws InterruptedException {
        System.out.println("\n── Virtual Threads (Java 21) ──");

        // Создать виртуальный поток:
        Thread vThread = Thread.ofVirtual().start(() -> {
            System.out.println("Virtual thread: " + Thread.currentThread().isVirtual());
        });
        vThread.join();

        // ExecutorService с виртуальными потоками:
        var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor();
        var futures = new ArrayList<java.util.concurrent.Future<String>>();

        for (int i = 0; i < 5; i++) {
            final int id = i;
            futures.add(executor.submit(() -> {
                Thread.sleep(100); // симулируем I/O
                return "Платёж " + id + " обработан в " + Thread.currentThread().getName();
            }));
        }

        for (var f : futures) {
            try { System.out.println(f.get()); }
            catch (Exception e) { System.out.println("Ошибка: " + e.getMessage()); }
        }
        executor.shutdown();
        System.out.println("Все платежи обработаны параллельно!");
    }

    // ══════════════════════════════════════════════════════════
    // 9. АННОТАЦИИ — создание своих аннотаций
    // ══════════════════════════════════════════════════════════

    // Мета-аннотации:
    // @Target   — куда можно ставить
    // @Retention — когда доступна (SOURCE/CLASS/RUNTIME)
    // @Documented — включать в JavaDoc

    @java.lang.annotation.Target({
        java.lang.annotation.ElementType.METHOD,
        java.lang.annotation.ElementType.TYPE
    })
    @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
    @interface Audited {
        String action() default "OPERATION";
        boolean logParams() default true;
    }

    @java.lang.annotation.Target(java.lang.annotation.ElementType.FIELD)
    @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
    @interface Sensitive {
        String mask() default "****";
    }

    // Использование:
    static class PaymentService {
        @Sensitive
        private String apiKey = "secret-key-123";

        @Audited(action = "PAYMENT", logParams = true)
        public String processPayment(BigDecimal amount) {
            return "processed";
        }
    }

    // Обработка аннотации через рефлексию:
    static void processAnnotations() throws Exception {
        var method = PaymentService.class.getMethod("processPayment", BigDecimal.class);
        if (method.isAnnotationPresent(Audited.class)) {
            Audited a = method.getAnnotation(Audited.class);
            System.out.printf("Метод аудируется: action=%s, logParams=%b%n",
                    a.action(), a.logParams());
        }
    }

    public static void run() {
        System.out.println("=== СОВРЕМЕННЫЙ СИНТАКСИС JAVA 8-21 ===\n");

        // Records
        System.out.println("── Records ──");
        var m1 = new Money(new BigDecimal("1000.00"), "rub");
        var m2 = new Money(new BigDecimal("500.00"), "RUB");
        System.out.println("m1 = " + m1);
        System.out.println("m1 + m2 = " + m1.add(m2));

        // Sealed + Pattern switch
        System.out.println("\n── Sealed Classes + Pattern Switch ──");
        PaymentResult[] results = {
            new PaymentResult.Success("TX-001", new BigDecimal("5000"), Instant.now()),
            new PaymentResult.Failure("CARD_EXPIRED", "Срок действия карты истёк", true),
            new PaymentResult.Pending("TX-002", "Ожидание авторизации банка")
        };
        for (var r : results) System.out.println(describePaymentResult(r));

        // Text blocks
        System.out.println("\n── Text Blocks ──");
        System.out.println("SQL запрос:\n" + SQL_QUERY);

        // Streams
        System.out.println("── Stream API Advanced ──");
        streamAdvanced();

        // Optional
        System.out.println("\n── Optional ──");
        optionalDemo();

        // Annotations
        System.out.println("\n── Аннотации (рефлексия) ──");
        try { processAnnotations(); } catch (Exception e) { System.out.println(e.getMessage()); }

        // Virtual Threads
        try { virtualThreadsDemo(); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
