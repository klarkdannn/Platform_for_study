package com.bank;

import com.bank.basics.*;
import com.bank.collections.CollectionsLesson;
import com.bank.functional.StreamsAndLambdas;
import com.bank.generics.GenericRepository;
import com.bank.algorithms.SortingAlgorithms;
import com.bank.algorithms.DataStructures;
import com.bank.patterns.PatternsDemo;
import com.bank.concurrency.ThreadBasics;
import com.bank.concurrency.ExecutorServiceDemo;
import com.bank.concurrency.ConcurrentCollections;
import com.bank.oop.model.*;
import com.bank.oop.enums.*;
import com.bank.oop.exceptions.*;

import java.io.PrintStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

/**
 * Главная точка входа учебного проекта "Банк".
 *
 * Запуск: mvn exec:java -Dexec.mainClass="com.bank.Main"
 * или:    mvn package && java -jar target/java-bank-study-1.0.0.jar
 */
public class Main {

    public static void main(String[] args) throws Exception {
        // Принудительно ставим UTF-8 для корректной кириллицы в Windows-терминале
        System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8));
        System.setErr(new PrintStream(System.err, true, StandardCharsets.UTF_8));

        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║   УЧЕБНЫЙ ПРОЕКТ JAVA — БАНК             ║");
        System.out.println("║   От Hello World до Spring Boot          ║");
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println();

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMenu();
            System.out.print("Выбери раздел (0 для выхода): ");

            String input = scanner.nextLine().trim();

            switch (input) {
                case "1"  -> runLesson("Hello World",          Lesson01_HelloWorld::run);
                case "2"  -> runLesson("Переменные и типы",    Lesson02_VariablesAndTypes::run);
                case "3"  -> runLesson("Операторы",            Lesson03_Operators::run);
                case "4"  -> runLesson("Условия и Switch",     Lesson04_ConditionsAndSwitch::run);
                case "5"  -> runLesson("Циклы",                Lesson05_Loops::run);
                case "6"  -> runLesson("Массивы",              Lesson06_Arrays::run);
                case "7"  -> runLesson("Строки",               Lesson07_Strings::run);
                case "8"  -> runLesson("Математика/BigDecimal",Lesson08_Math::run);
                case "9"  -> runLesson("ООП — Банк демо",      Main::runBankDemo);
                case "10" -> runLesson("Коллекции",            CollectionsLesson::run);
                case "11" -> runLesson("Generics",             GenericRepository::runDemo);
                case "12" -> runLesson("Streams и Lambdas",    StreamsAndLambdas::run);
                case "13" -> runLesson("Алгоритмы сортировки", SortingAlgorithms::run);
                case "14" -> runLesson("Структуры данных",     DataStructures::run);
                case "15" -> runLesson("Паттерны",             PatternsDemo::run);
                case "16" -> runLesson("Многопоточность — основы",    Main::runThreadBasics);
                case "17" -> runLesson("ExecutorService и Future",     Main::runExecutorService);
                case "18" -> runLesson("Concurrent коллекции",         Main::runConcurrentCollections);
                case "0"  -> { running = false; System.out.println("До свидания!"); }
                default   -> System.out.println("Неверный выбор. Попробуй ещё раз.\n");
            }
        }

        scanner.close();
    }

    private static void printMenu() {
        System.out.println("─────────────────────────────────────────");
        System.out.println("  ОСНОВЫ:");
        System.out.println("  1.  Hello World");
        System.out.println("  2.  Переменные и типы данных");
        System.out.println("  3.  Операторы");
        System.out.println("  4.  Условия и Switch");
        System.out.println("  5.  Циклы");
        System.out.println("  6.  Массивы");
        System.out.println("  7.  Строки");
        System.out.println("  8.  Математика и BigDecimal");
        System.out.println("  ООП:");
        System.out.println("  9.  ООП — живая демонстрация банка");
        System.out.println("  КОЛЛЕКЦИИ И ФУНКЦИОНАЛ:");
        System.out.println("  10. Коллекции (List, Map, Set, Queue)");
        System.out.println("  11. Generics");
        System.out.println("  12. Streams и Lambda");
        System.out.println("  АЛГОРИТМЫ:");
        System.out.println("  13. Алгоритмы сортировки");
        System.out.println("  14. Структуры данных");
        System.out.println("  ПАТТЕРНЫ:");
        System.out.println("  15. Паттерны проектирования");
        System.out.println("  МНОГОПОТОЧНОСТЬ:");
        System.out.println("  16. Многопоточность — Thread, synchronized, Atomic");
        System.out.println("  17. ExecutorService, Future, CompletableFuture");
        System.out.println("  18. Concurrent коллекции (ConcurrentHashMap, BlockingQueue)");
        System.out.println("─────────────────────────────────────────");
    }

    /** Обёртка для красивого вывода раздела */
    private static void runLesson(String name, Runnable lesson) {
        System.out.println("\n══════════════════════════════════════════");
        System.out.println("  РАЗДЕЛ: " + name);
        System.out.println("══════════════════════════════════════════\n");
        try {
            lesson.run();
        } catch (Exception e) {
            System.out.println("[ОШИБКА в уроке]: " + e.getClass().getSimpleName() + " — " + e.getMessage());
        }
        System.out.println("\n══════════════════════════════════════════");
        System.out.println("  Раздел завершён. Нажми Enter...");
        System.out.println("══════════════════════════════════════════\n");
        try {
            new Scanner(System.in).nextLine();
        } catch (java.util.NoSuchElementException ignored) {
            // При запуске без интерактивного ввода (тест, CI) — просто продолжаем
        }
    }

    private static void runThreadBasics() {
        try { ThreadBasics.main(new String[]{}); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    private static void runExecutorService() {
        try { ExecutorServiceDemo.main(new String[]{}); }
        catch (Exception e) { System.out.println("[ОШИБКА]: " + e.getMessage()); }
    }

    private static void runConcurrentCollections() {
        try { ConcurrentCollections.main(new String[]{}); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    /** Живая демонстрация ООП — работа с банком */
    private static void runBankDemo() {
        System.out.println("=== Создаём банк ===");
        Bank bank = new Bank("Учебный Банк Java");

        System.out.println("=== Регистрируем клиентов ===");
        Client alice = new Client.Builder("Алиса Иванова").email("alice@mail.ru").build();
        Client bob   = new Client.Builder("Боб Петров").email("bob@mail.ru").build();
        bank.registerClient(alice);
        bank.registerClient(bob);

        System.out.println("=== Открываем счета ===");
        DebitAccount aliceDebit = bank.openDebitAccount(alice, new BigDecimal("50000"));
        SavingsAccount aliceSavings = bank.openSavingsAccount(alice, new BigDecimal("100000"), 8.5);
        CreditAccount bobCredit = bank.openCreditAccount(bob, new BigDecimal("0"), new BigDecimal("300000"), 24.0);

        System.out.println("\nСчёт Алисы (дебет): " + aliceDebit);
        System.out.println("Счёт Алисы (накоп): " + aliceSavings);
        System.out.println("Счёт Боба (кредит): " + bobCredit);

        System.out.println("\n=== Проводим операции ===");
        try {
            aliceDebit.deposit(new BigDecimal("10000"), "Зарплата");
            aliceDebit.withdraw(new BigDecimal("5000"), "Продукты");
            bank.transfer(aliceDebit, bobCredit, new BigDecimal("15000"), "Перевод другу");
            aliceSavings.accrueInterest();

            System.out.println("\nИтоговые балансы:");
            System.out.printf("  Алиса (дебет):  %,.2f руб.%n", aliceDebit.getBalance());
            System.out.printf("  Алиса (накоп):  %,.2f руб.%n", aliceSavings.getBalance());
            System.out.printf("  Боб   (кредит): %,.2f руб. (долг)%n", bobCredit.getDebt());

            System.out.println("\nИстория транзакций Алисы (дебет):");
            aliceDebit.getTransactionHistory().forEach(tx ->
                System.out.println("  " + tx)
            );

        } catch (InsufficientFundsException e) {
            System.out.println("Недостаточно средств: " + e.getMessage());
        } catch (AccountBlockedException e) {
            System.out.println("Счёт заблокирован: " + e.getMessage());
        }

        System.out.println("\n=== Попытка снять слишком много (ожидаем ошибку) ===");
        try {
            aliceDebit.withdraw(new BigDecimal("999999"), "Большая покупка");
        } catch (InsufficientFundsException | IllegalStateException e) {
            // DebitAccount бросает IllegalStateException при превышении дневного лимита
            // InsufficientFundsException — при нехватке баланса
            System.out.println("Ожидаемая ошибка (" + e.getClass().getSimpleName() + "): " + e.getMessage());
        }

        System.out.println("\n=== Статистика банка ===");
        bank.printStats();
    }
}
