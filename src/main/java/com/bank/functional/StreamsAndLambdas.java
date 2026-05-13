package com.bank.functional;

import java.util.*;
import java.util.function.*;
import java.util.stream.*;

/**
 * УРОКИ 21-23: Лямбды, Stream API, Optional
 *
 * Ключевая идея: Stream — это конвейер обработки данных.
 *   Источник → [промежуточные операции] → терминальная операция
 *   список  →  filter → map → sorted  → collect
 *
 * НЕ изменяет оригинальную коллекцию!
 * Ленивые вычисления: промежуточные операции не выполняются до терминальной.
 *
 * Запуск из Main: выбери пункт "12. Streams и Lambda"
 */
public class StreamsAndLambdas {

    // Тестовые данные — банковские транзакции [тип, сумма, клиент]
    record Transaction(String type, double amount, String client, String month) {}

    public static void run() {
        System.out.println("=== ЛЯМБДЫ, STREAMS И OPTIONAL ===\n");

        demoLambdas();
        demoFunctionalInterfaces();
        demoStreams();
        demoCollectors();
        demoOptional();
        printTasks();
    }

    // ═══════════════════════════════════════════════════════════
    // ЛЯМБДЫ
    // ═══════════════════════════════════════════════════════════

    private static void demoLambdas() {
        System.out.println("--- ЛЯМБДЫ ---");

        // Лямбда = анонимная функция
        // Синтаксис: (параметры) -> тело

        // Comparator через лямбду (вместо анонимного класса)
        Comparator<String> byLength = (a, b) -> a.length() - b.length();
        List<String> names = Arrays.asList("Боб", "Алиса", "Чарли", "Ян");
        names.sort(byLength);
        System.out.println("Отсортировано по длине: " + names);

        // Метод-ссылки (Method References)
        List<String> clients = Arrays.asList("алиса", "боб", "чарли");
        System.out.print("Заглавные (метод-ссылка): ");
        clients.stream().map(String::toUpperCase).forEach(s -> System.out.print(s + " "));
        System.out.println();

        // Ссылка на статический метод
        List<Integer> numbers = Arrays.asList(3, -1, 4, -1, 5, -9);
        System.out.print("Абсолютные значения: ");
        numbers.stream().map(Math::abs).forEach(n -> System.out.print(n + " "));
        System.out.println("\n");
    }

    // ═══════════════════════════════════════════════════════════
    // ФУНКЦИОНАЛЬНЫЕ ИНТЕРФЕЙСЫ
    // ═══════════════════════════════════════════════════════════

    private static void demoFunctionalInterfaces() {
        System.out.println("--- ФУНКЦИОНАЛЬНЫЕ ИНТЕРФЕЙСЫ ---");

        // Function<T, R> — принимает T, возвращает R
        Function<Double, String> formatBalance = amount ->
                String.format("%,.2f руб.", amount);
        System.out.println("Function: " + formatBalance.apply(50000.50));

        // Predicate<T> — принимает T, возвращает boolean
        Predicate<Double> isLargeTransaction = amount -> amount > 100_000;
        Predicate<Double> isPositive = amount -> amount > 0;
        System.out.println("Predicate (>100k): " + isLargeTransaction.test(150_000.0));
        System.out.println("AND (>0 AND >100k): " + isPositive.and(isLargeTransaction).test(150_000.0));
        System.out.println("OR: " + isLargeTransaction.or(isPositive).test(50_000.0));
        System.out.println("NOT: " + isLargeTransaction.negate().test(50_000.0));

        // Consumer<T> — принимает T, ничего не возвращает
        Consumer<String> logger = msg -> System.out.println("  [LOG] " + msg);
        logger.accept("Транзакция выполнена");

        // Supplier<T> — ничего не принимает, возвращает T
        Supplier<String> accountIdGenerator = () -> "ACC-" + System.currentTimeMillis();
        System.out.println("Supplier (ID): " + accountIdGenerator.get());

        // BiFunction<T, U, R> — принимает T и U, возвращает R
        BiFunction<Double, Double, Double> calcInterest = (balance, rate) -> balance * rate / 100;
        System.out.println("BiFunction (проценты): " + calcInterest.apply(100_000.0, 8.5));

        // UnaryOperator<T> — принимает T, возвращает T (частный случай Function)
        UnaryOperator<Double> addTax = amount -> amount * 1.13; // +13% НДС
        System.out.println("UnaryOperator (+13%): " + addTax.apply(1000.0));
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // STREAM API
    // ═══════════════════════════════════════════════════════════

    private static void demoStreams() {
        System.out.println("--- STREAM API ---");

        List<Transaction> transactions = createTestData();

        // filter — оставить только подходящие элементы
        System.out.println("Крупные транзакции (> 50_000):");
        transactions.stream()
                .filter(t -> t.amount() > 50_000)
                .forEach(t -> System.out.printf("  %s %.0f руб. (%s)%n",
                        t.type(), t.amount(), t.client()));

        // map — преобразовать каждый элемент
        System.out.print("\nТолько суммы: ");
        transactions.stream()
                .map(Transaction::amount)
                .map(a -> String.format("%.0f", a))
                .collect(Collectors.joining(", "));
        transactions.stream()
                .map(Transaction::amount)
                .forEach(a -> System.out.printf("%.0f ", a));

        // sorted — сортировка
        System.out.println("\n\nПо убыванию суммы:");
        transactions.stream()
                .sorted(Comparator.comparingDouble(Transaction::amount).reversed())
                .limit(3) // первые 3
                .forEach(t -> System.out.printf("  %s: %.0f руб.%n", t.client(), t.amount()));

        // reduce — агрегация
        double totalDeposits = transactions.stream()
                .filter(t -> t.type().equals("DEPOSIT"))
                .mapToDouble(Transaction::amount)
                .sum();
        System.out.printf("%nОбщая сумма пополнений: %.2f руб.%n", totalDeposits);

        // count, min, max
        long depositCount = transactions.stream()
                .filter(t -> t.type().equals("DEPOSIT"))
                .count();
        System.out.println("Количество пополнений: " + depositCount);

        OptionalDouble maxAmount = transactions.stream()
                .mapToDouble(Transaction::amount)
                .max();
        maxAmount.ifPresent(m -> System.out.printf("Максимальная транзакция: %.0f руб.%n", m));

        // distinct, skip, limit
        System.out.print("\nУникальные клиенты: ");
        transactions.stream()
                .map(Transaction::client)
                .distinct()
                .sorted()
                .forEach(c -> System.out.print(c + " "));

        // anyMatch, allMatch, noneMatch
        boolean hasLarge = transactions.stream().anyMatch(t -> t.amount() > 100_000);
        boolean allPositive = transactions.stream().allMatch(t -> t.amount() > 0);
        System.out.println("\nЕсть транзакции > 100k: " + hasLarge);
        System.out.println("Все суммы положительные: " + allPositive);
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // COLLECTORS — терминальные операции сборки
    // ═══════════════════════════════════════════════════════════

    private static void demoCollectors() {
        System.out.println("--- COLLECTORS ---");

        List<Transaction> transactions = createTestData();

        // toList, toSet, toMap
        List<String> clientList = transactions.stream()
                .map(Transaction::client)
                .distinct()
                .collect(Collectors.toList());
        System.out.println("toList: " + clientList);

        // groupingBy — группировка
        Map<String, List<Transaction>> byType = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::type));
        System.out.println("\ngroupingBy (по типу):");
        byType.forEach((type, txs) ->
                System.out.printf("  %s: %d транзакций%n", type, txs.size()));

        // groupingBy + counting
        Map<String, Long> countByClient = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::client, Collectors.counting()));
        System.out.println("\nКоличество транзакций по клиентам: " + countByClient);

        // groupingBy + summingDouble
        Map<String, Double> totalByClient = transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::client,
                        Collectors.summingDouble(Transaction::amount)));
        System.out.println("\nОбщая сумма по клиентам:");
        totalByClient.forEach((client, sum) ->
                System.out.printf("  %-8s %,.2f руб.%n", client, sum));

        // joining — склеить строки
        String clientNames = transactions.stream()
                .map(Transaction::client)
                .distinct()
                .collect(Collectors.joining(", ", "[", "]"));
        System.out.println("\nКлиенты: " + clientNames);

        // partitioningBy — разбить на два списка
        Map<Boolean, List<Transaction>> partition = transactions.stream()
                .collect(Collectors.partitioningBy(t -> t.amount() > 50_000));
        System.out.println("Крупные транзакции: " + partition.get(true).size());
        System.out.println("Малые транзакции:   " + partition.get(false).size());
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // OPTIONAL — безопасная работа с null
    // ═══════════════════════════════════════════════════════════

    private static void demoOptional() {
        System.out.println("--- OPTIONAL ---");

        // Проблема: NullPointerException
        // String email = client.getEmail(); // если getEmail() вернул null → NPE при следующей операции

        // Optional решает проблему явно
        Optional<String> email = Optional.ofNullable(null); // может быть null
        Optional<String> phone = Optional.of("+79001234567"); // точно НЕ null

        System.out.println("email.isEmpty(): " + email.isEmpty());
        System.out.println("phone.isPresent(): " + phone.isPresent());

        // orElse — значение по умолчанию
        String emailValue = email.orElse("не указан");
        System.out.println("email (orElse): " + emailValue);

        // orElseGet — вычисляется лениво (если нужно)
        String generated = email.orElseGet(() -> "user_" + System.currentTimeMillis() + "@bank.ru");
        System.out.println("email (orElseGet): " + generated);

        // orElseThrow — бросить исключение
        try {
            String mustExist = email.orElseThrow(() ->
                    new IllegalStateException("Email обязателен"));
        } catch (IllegalStateException e) {
            System.out.println("orElseThrow сработал: " + e.getMessage());
        }

        // map — трансформация если значение есть
        Optional<Integer> phoneLength = phone.map(String::length);
        System.out.println("Длина телефона: " + phoneLength.orElse(0));

        // filter — оставить только если подходит
        Optional<String> longPhone = phone.filter(p -> p.length() > 10);
        System.out.println("Телефон длиннее 10 символов: " + longPhone.isPresent());

        // Реальный пример: поиск клиента
        Map<String, String> clientEmails = Map.of(
                "CLI001", "alice@mail.ru",
                "CLI002", "bob@mail.ru"
        );

        String result = Optional.ofNullable(clientEmails.get("CLI001"))
                .map(e -> e.toUpperCase())
                .orElse("Клиент не найден");
        System.out.println("Email клиента (Optional chain): " + result);
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // Тестовые данные
    // ═══════════════════════════════════════════════════════════

    private static List<Transaction> createTestData() {
        return Arrays.asList(
                new Transaction("DEPOSIT",    50_000, "Алиса",  "Май"),
                new Transaction("WITHDRAWAL", 15_000, "Алиса",  "Май"),
                new Transaction("DEPOSIT",   120_000, "Боб",    "Май"),
                new Transaction("TRANSFER",   30_000, "Алиса",  "Май"),
                new Transaction("WITHDRAWAL", 80_000, "Боб",    "Апрель"),
                new Transaction("DEPOSIT",    25_000, "Чарли",  "Апрель"),
                new Transaction("TRANSFER",  200_000, "Боб",    "Май"),
                new Transaction("WITHDRAWAL", 10_000, "Чарли",  "Май")
        );
    }

    private static void printTasks() {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                     ТВОИ ЗАДАНИЯ                        ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ 1. Метод filterClients(List<Client>, Predicate<Client>) ║");
        System.out.println("║    - фильтр по статусу активности                       ║");
        System.out.println("║    - фильтр по балансу > порога                         ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 2. Stream API задачи:                                   ║");
        System.out.println("║    - Сумма DEPOSIT транзакций за ТЕКУЩИЙ месяц          ║");
        System.out.println("║    - Клиент с максимальным балансом                     ║");
        System.out.println("║    - Уникальные валюты всех счетов                      ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 3. Перепиши findClientById(String id) так,              ║");
        System.out.println("║    чтобы возвращал Optional<Client>                     ║");
        System.out.println("║    Используй orElseThrow(AccountNotFoundException::new) ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
