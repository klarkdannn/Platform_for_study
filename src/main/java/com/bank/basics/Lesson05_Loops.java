package com.bank.basics;

import java.util.List;

/**
 * УРОК 5: Циклы
 * for, while, do-while, for-each, break, continue, метки
 */
public class Lesson05_Loops {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. FOR — классический цикл со счётчиком
        // Структура: for (инициализация; условие; шаг)
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. for — классический ===");

        double balance = 10_000.0;
        double rate = 0.07; // 7% годовых

        System.out.printf("Начальный баланс: %.2f руб.%n", balance);
        for (int year = 1; year <= 5; year++) {
            balance = balance * (1 + rate);
            System.out.printf("  Год %d: %.2f руб.%n", year, balance);
        }

        // Цикл назад:
        System.out.println("\nОбратный отсчёт:");
        for (int i = 5; i >= 1; i--) {
            System.out.print(i + " ");
        }
        System.out.println("Пуск!");

        // Несколько переменных в for:
        for (int i = 0, j = 10; i < j; i++, j--) {
            System.out.print("(" + i + "," + j + ") ");
        }
        System.out.println();

        // ═══════════════════════════════════════════════════════════
        // 2. WHILE — цикл с предусловием
        // Выполняется пока условие true. Может не выполниться ни разу.
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. while ===");

        double debt = 50_000.0;
        double monthlyPayment = 5_000.0;
        double monthlyRate = 0.02; // 2% в месяц (24% годовых)
        int month = 0;

        System.out.printf("Начальный долг: %.2f руб.%n", debt);
        while (debt > 0) {
            month++;
            double interest = debt * monthlyRate;
            debt = debt + interest - monthlyPayment;
            if (debt < 0) debt = 0;
            System.out.printf("  Месяц %2d: долг = %.2f руб. (проценты: %.2f)%n",
                    month, debt, interest);
        }
        System.out.println("Долг погашен за " + month + " месяцев!");

        // ═══════════════════════════════════════════════════════════
        // 3. DO-WHILE — цикл с постусловием
        // Выполняется хотя бы один раз (проверка ПОСЛЕ итерации)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. do-while ===");

        // Имитация ввода PIN (всегда спрашиваем хотя бы раз)
        String[] attempts = {"1111", "2222", "1234"}; // имитация ввода пользователя
        String correctPin = "1234";
        int attemptIndex = 0;
        int maxAttempts = 3;

        do {
            String entered = attempts[attemptIndex++];
            System.out.println("Введён PIN: " + entered);
            if (entered.equals(correctPin)) {
                System.out.println("PIN верный, доступ разрешён!");
                break;
            } else {
                System.out.println("Неверный PIN. Осталось попыток: " + (maxAttempts - attemptIndex));
            }
        } while (attemptIndex < maxAttempts);

        if (attemptIndex >= maxAttempts && !attempts[attemptIndex-1].equals(correctPin)) {
            System.out.println("Карта заблокирована!");
        }

        // ═══════════════════════════════════════════════════════════
        // 4. FOR-EACH — для коллекций и массивов
        // Нельзя изменять коллекцию во время итерации!
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. for-each (enhanced for) ===");

        String[] accountTypes = {"Дебетовый", "Накопительный", "Кредитный"};

        for (String type : accountTypes) { // читать: "для каждого type в accountTypes"
            System.out.println("  - " + type);
        }

        List<Double> transactions = List.of(5000.0, -3000.0, 15000.0, -500.0, 8000.0);
        double total = 0;
        for (double tx : transactions) {
            total += tx;
        }
        System.out.printf("Итого транзакций: %+.2f руб.%n", total);

        // ═══════════════════════════════════════════════════════════
        // 5. BREAK И CONTINUE
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 5. break и continue ===");

        // break — выходит из цикла полностью
        System.out.print("Ищу первую транзакцию > 10000: ");
        double[] amounts = {1000, 5000, 3500, 15000, 8000, 25000};
        for (double amount : amounts) {
            if (amount > 10_000) {
                System.out.println(amount + " руб. — НАЙДЕНА, стоп!");
                break; // выходим из цикла
            }
            System.out.print(amount + " ");
        }

        // continue — пропускает текущую итерацию, переходит к следующей
        System.out.print("\nТолько положительные транзакции: ");
        for (double amount : amounts) {
            if (amount < 0) continue; // пропустить отрицательные
            System.out.print(amount + " ");
        }
        System.out.println();

        // ═══════════════════════════════════════════════════════════
        // 6. МЕТКИ (Labels) — break/continue с именем
        // Нужны для вложенных циклов
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 6. Метки для вложенных циклов ===");

        String[] clients = {"Алиса", "Боб", "Вася"};
        String[] statuses = {"ACTIVE", "BLOCKED", "ACTIVE"};
        String targetClient = "Боб";

        // outer: — метка для внешнего цикла
        outer:
        for (int i = 0; i < clients.length; i++) {
            for (int j = 0; j < statuses.length; j++) {
                if (clients[i].equals(targetClient)) {
                    System.out.println("Найден: " + clients[i] + " статус: " + statuses[i]);
                    break outer; // выходим из ВНЕШНЕГО цикла
                }
            }
        }

        // ═══════════════════════════════════════════════════════════
        // 7. БЕСКОНЕЧНЫЙ ЦИКЛ (осторожно!)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 7. Ограниченный 'бесконечный' цикл ===");

        int iteration = 0;
        while (true) { // бесконечный цикл
            iteration++;
            if (iteration >= 5) break; // всегда нужен выход!
        }
        System.out.println("Итераций: " + iteration);

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║              ЗАДАНИЯ — Урок 5: Циклы                    ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Симуляция вклада (12 месяцев, 8.5% годовых):    ║");
        System.out.println("║        double balance = 100_000;                        ║");
        System.out.println("║        Выведи баланс каждый месяц                       ║");
        System.out.println("║        Остановись если balance > 1_000_000              ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Угадай число (цикл while + Scanner):            ║");
        System.out.println("║        Загадай число от 1 до 100                        ║");
        System.out.println("║        Пользователь вводит числа                        ║");
        System.out.println("║        Подсказки: \"Больше\", \"Меньше\", \"Угадал!\"        ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Таблица умножения (вложенные циклы):            ║");
        System.out.println("║        Выведи таблицу 10x10 с форматированием           ║");
        System.out.println("║        (выравнивание колонок через %4d)                 ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Числа Фибоначчи (до N):                        ║");
        System.out.println("║        Выведи первые 20 чисел: 0 1 1 2 3 5 8 13 ...    ║");
        System.out.println("║        Найди первое число Фибоначчи > 1_000_000         ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 5. Простые числа (Решето Эратосфена):              ║");
        System.out.println("║        Найди все простые числа до 100                   ║");
        System.out.println("║        Алгоритм: вычеркивай кратные, остальные — простые║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
