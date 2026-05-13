package com.bank.basics;

import java.util.Arrays;
import java.util.Random;

/**
 * УРОК 6: Массивы
 * Одномерные, многомерные, зубчатые. Класс Arrays.
 */
public class Lesson06_Arrays {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. ОДНОМЕРНЫЙ МАССИВ
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. Одномерный массив ===");

        // Объявление и создание (заполняется нулями/null)
        double[] balances = new double[5];
        balances[0] = 50_000.0;
        balances[1] = 120_000.0;
        balances[2] = 8_000.0;
        balances[3] = 300_000.0;
        balances[4] = 75_000.0;

        // Инициализатор массива (сразу с значениями):
        String[] accountIds = {"ACC001", "ACC002", "ACC003", "ACC004", "ACC005"};

        System.out.println("Длина массива: " + balances.length); // length — поле, не метод!

        // Проход по массиву:
        for (int i = 0; i < balances.length; i++) {
            System.out.printf("  %s: %,.2f руб.%n", accountIds[i], balances[i]);
        }

        // ArrayIndexOutOfBoundsException — частая ошибка!
        try {
            double x = balances[10]; // индекс 10, а массив только из 5 элементов
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }

        // ═══════════════════════════════════════════════════════════
        // 2. КЛАСС Arrays — утилиты для работы с массивами
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. Класс Arrays ===");

        double[] amounts = {5000, 15000, 3000, 50000, 1000, 25000};
        System.out.println("До сортировки:   " + Arrays.toString(amounts));

        Arrays.sort(amounts); // сортировка по возрастанию
        System.out.println("После sort():    " + Arrays.toString(amounts));

        // Бинарный поиск (массив должен быть отсортирован!):
        int idx = Arrays.binarySearch(amounts, 15000);
        System.out.println("Поиск 15000:     индекс = " + idx);

        // Копирование:
        double[] copy = Arrays.copyOf(amounts, amounts.length); // полная копия
        double[] first3 = Arrays.copyOfRange(amounts, 0, 3);   // первые 3 элемента
        System.out.println("Первые 3:        " + Arrays.toString(first3));

        // Заполнение:
        double[] zeros = new double[5];
        Arrays.fill(zeros, 0.0);
        System.out.println("Заполнено нулями: " + Arrays.toString(zeros));

        // Сравнение:
        double[] a = {1, 2, 3};
        double[] b = {1, 2, 3};
        System.out.println("Arrays.equals: " + Arrays.equals(a, b)); // true

        // ═══════════════════════════════════════════════════════════
        // 3. ДВУМЕРНЫЙ МАССИВ (матрица)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. Двумерный массив ===");

        // Матрица транзакций: [клиент][месяц]
        double[][] transactions = {
            {5000, 15000, 3000, 8000},   // клиент 0
            {20000, 5000, 0, 12000},     // клиент 1
            {1000, 3000, 7000, 2000}     // клиент 2
        };

        String[] clientNames = {"Алиса", "Боб  ", "Вася "};
        String[] months      = {"Янв", "Фев", "Мар", "Апр"};

        // Заголовок
        System.out.print("Клиент   ");
        for (String m : months) System.out.printf("%-8s", m);
        System.out.println("Итого");

        // Данные
        for (int i = 0; i < transactions.length; i++) {
            System.out.printf("%-9s", clientNames[i]);
            double total = 0;
            for (int j = 0; j < transactions[i].length; j++) {
                System.out.printf("%-8.0f", transactions[i][j]);
                total += transactions[i][j];
            }
            System.out.printf("%.0f%n", total);
        }

        System.out.println("Размер: " + transactions.length + " x " + transactions[0].length);

        // ═══════════════════════════════════════════════════════════
        // 4. ЗУБЧАТЫЙ МАССИВ (Jagged Array)
        // Каждая строка может иметь разное количество элементов
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. Зубчатый массив ===");

        // У клиентов разное количество счетов:
        double[][] clientAccounts = new double[3][];
        clientAccounts[0] = new double[]{10000, 50000};           // 2 счёта
        clientAccounts[1] = new double[]{5000, 25000, 100000};    // 3 счёта
        clientAccounts[2] = new double[]{75000};                  // 1 счёт

        for (int i = 0; i < clientAccounts.length; i++) {
            System.out.printf("Клиент %d (%d счёт(а)): ", i, clientAccounts[i].length);
            System.out.println(Arrays.toString(clientAccounts[i]));
        }

        // ═══════════════════════════════════════════════════════════
        // 5. РАБОТА С МАССИВОМ: поиск min, max, среднее
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 5. Поиск min/max/среднее ===");

        Random rng = new Random(42);
        double[] deposits = new double[10];
        for (int i = 0; i < deposits.length; i++) {
            deposits[i] = rng.nextInt(50000) + 1000;
        }

        System.out.println("Транзакции: " + Arrays.toString(deposits));

        double min = deposits[0], max = deposits[0], sum = 0;
        for (double d : deposits) {
            if (d < min) min = d;
            if (d > max) max = d;
            sum += d;
        }
        System.out.printf("Min: %.0f, Max: %.0f, Среднее: %.2f%n", min, max, sum / deposits.length);

        // ═══════════════════════════════════════════════════════════
        // 6. SYSTEM.ARRAYCOPY — быстрое копирование
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 6. System.arraycopy ===");

        double[] src  = {1000, 2000, 3000, 4000, 5000};
        double[] dest = new double[5];
        System.arraycopy(src, 1, dest, 0, 3); // из src[1] в dest[0], 3 элемента
        System.out.println("Копия [1..3]: " + Arrays.toString(dest));

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║             ЗАДАНИЯ — Урок 6: Массивы                   ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Массив транзакций:                               ║");
        System.out.println("║        double[] txs = новый массив из 10 Random сумм   ║");
        System.out.println("║        Найди max и min вручную (без Arrays.sort)        ║");
        System.out.println("║        Отсортируй Arrays.sort()                         ║");
        System.out.println("║        Выведи транзакции > 5000 руб                    ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Матрица выписки (2D массив):                    ║");
        System.out.println("║        String[][] statement = {                         ║");
        System.out.println("║          {\"01.05\", \"DEPOSIT\",  \"+50000\"},              ║");
        System.out.println("║          {\"02.05\", \"WITHDRAW\", \"-3000\"},               ║");
        System.out.println("║          {\"03.05\", \"TRANSFER\", \"-15000\"}              ║");
        System.out.println("║        };                                               ║");
        System.out.println("║        Выведи таблицей с заголовком                     ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Бинарный поиск вручную:                         ║");
        System.out.println("║        Реализуй binarySearch(int[] sorted, int target)  ║");
        System.out.println("║        Без Arrays.binarySearch()                        ║");
        System.out.println("║        Сложность должна быть O(log n)                  ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Реверс массива без доп. памяти:                 ║");
        System.out.println("║        void reverse(int[] arr) — два указателя         ║");
        System.out.println("║        i=0, j=arr.length-1, swap пока i<j             ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
