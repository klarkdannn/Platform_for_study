package com.bank.algorithms.complexity;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(n²) — КВАДРАТИЧНОЕ ВРЕМЯ                            ║
 * ║   "Медленно для больших данных, ок для малых (n<1000)"  ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Два вложенных цикла — классический признак O(n²).
 * n=100 → 10_000 операций.
 * n=10_000 → 100_000_000 операций (уже медленно!).
 * n=100_000 → 10^10 — нереально медленно.
 *
 * ПРИМЕРЫ O(n²):
 *   - Bubble Sort, Selection Sort, Insertion Sort
 *   - Проверка всех пар (два вложенных for)
 *   - Наивный поиск подстроки
 *   - Умножение матриц (наивное)
 *
 * КОГДА ДОПУСТИМО O(n²)?
 *   - n < 1000 (данных мало)
 *   - Когда O(n log n) сложнее написать/поддерживать
 *   - Для простоты кода в некритичных местах
 */
public class ON2_Quadratic {

    // ── ПРИМЕР 1: Bubble Sort — O(n²) ────────────────────────
    // Классический пример. Два вложенных цикла явно.

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {            // внешний цикл: n
            for (int j = 0; j < n - i - 1; j++) {    // внутренний цикл: n
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        } // итого: n * n / 2 ≈ O(n²)
    }

    // ── ПРИМЕР 2: Все пары сумм — O(n²) ──────────────────────
    // БАНК: Найти все пары транзакций с суммой равной target.
    // Наивное решение O(n²). Оптимальное через HashMap — O(n).

    public static List<int[]> findAllPairs(int[] arr, int target) {
        List<int[]> pairs = new ArrayList<>();
        for (int i = 0; i < arr.length; i++) {           // O(n)
            for (int j = i + 1; j < arr.length; j++) {   // O(n)
                if (arr[i] + arr[j] == target) {
                    pairs.add(new int[]{arr[i], arr[j]});
                }
            }
        }
        return pairs; // O(n²)
    }

    // Оптимизированная версия O(n) через HashMap:
    public static List<int[]> findAllPairsFast(int[] arr, int target) {
        List<int[]> pairs = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();
        Set<Integer> usedFirst = new HashSet<>();
        for (int x : arr) {
            int complement = target - x;
            if (seen.contains(complement) && !usedFirst.contains(complement)) {
                pairs.add(new int[]{complement, x});
                usedFirst.add(complement);
            }
            seen.add(x);
        }
        return pairs; // O(n)
    }

    // ── ПРИМЕР 3: Наивный поиск подстроки — O(n*m) ───────────
    // БАНК: Поиск паттерна мошенничества в описаниях транзакций.

    public static int naiveStringSearch(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        for (int i = 0; i <= n - m; i++) {          // O(n)
            int j = 0;
            while (j < m && text.charAt(i + j) == pattern.charAt(j)) j++; // O(m)
            if (j == m) return i; // нашли
        }
        return -1; // O(n*m)
    }

    // ── ПРИМЕР 4: Умножение матриц — O(n³) ───────────────────
    // Квадратные матрицы n×n.
    // БАНК: Корреляционные матрицы для анализа рисков.

    public static double[][] multiplyMatrices(double[][] A, double[][] B) {
        int n = A.length;
        double[][] C = new double[n][n];
        for (int i = 0; i < n; i++) {           // O(n)
            for (int j = 0; j < n; j++) {       // O(n)
                for (int k = 0; k < n; k++) {   // O(n)
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C; // O(n³) — для больших матриц используй Strassen O(n^2.81)
    }

    // ── ПРИМЕР 5: Insertion Sort — O(n²) и почему он нужен ───
    // Для ПОЧТИ ОТСОРТИРОВАННЫХ данных — почти O(n)!
    // TimSort (Java's Arrays.sort) использует Insertion Sort
    // для маленьких подмассивов.

    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {     // O(n)
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {       // O(n) в худшем
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        } // O(n²) худший, O(n) лучший (уже отсортирован)
    }

    // ── ПРИМЕР 6: Longest Common Subsequence — O(n*m) ────────
    // DP таблица n×m — классический O(n²) алгоритм.
    // БАНК: Сравнение двух потоков транзакций на схожесть.

    public static int lcs(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i-1) == b.charAt(j-1))
                    dp[i][j] = dp[i-1][j-1] + 1;
                else
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
        return dp[n][m]; // O(n*m)
    }

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Оптимизируй findAllPairs наивный O(n²) → O(n log n):
    //    Шаг 1: Отсортируй массив.
    //    Шаг 2: Используй Two Pointers (left, right).
    //    Сможешь ли написать без HashMap?
    //
    // 2. Напиши 0/1 Knapsack O(n*W) — задача о рюкзаке:
    //    Есть N предметов, каждый с весом w[i] и ценностью v[i].
    //    Рюкзак вмещает W. Максимизируй суммарную ценность.
    //    dp[i][w] = max(dp[i-1][w], dp[i-1][w-w[i]] + v[i])
    //    Банк: Выбрать инвестиции с максимальной доходностью
    //    при ограниченном бюджете.
    //
    // 3. Напиши editDistance(String a, String b) — расстояние Левенштейна:
    //    Минимальное число операций (вставка, удаление, замена)
    //    для превращения строки a в b.
    //    Банк: Поиск похожих имён клиентов (дубликаты записей).
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(n²) — КВАДРАТИЧНОЕ ВРЕМЯ ===\n");

        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Исходный: " + Arrays.toString(arr));
        bubbleSort(arr);
        System.out.println("После Bubble Sort: " + Arrays.toString(arr));

        int[] nums = {2, 7, 4, 1, 5, 9, 3};
        System.out.printf("%nПары с суммой 9 (O(n²)): %s%n",
                findAllPairs(nums, 9).stream()
                        .map(p -> Arrays.toString(p))
                        .reduce("", (a,b) -> a + b));
        System.out.printf("Пары с суммой 9 (O(n)):  %s%n",
                findAllPairsFast(nums, 9).stream()
                        .map(p -> Arrays.toString(p))
                        .reduce("", (a,b) -> a + b));

        System.out.printf("%nLCS(\"ABCBDAB\", \"BDCAB\") = %d%n", lcs("ABCBDAB", "BDCAB"));

        System.out.println("\nПроизводительность:");
        System.out.printf("  n=100:       %,d операций%n", 100 * 100L);
        System.out.printf("  n=1_000:     %,d операций%n", 1_000 * 1_000L);
        System.out.printf("  n=10_000:    %,d операций (медленно!)%n", 10_000 * 10_000L);
        System.out.printf("  n=100_000:   %,d операций (очень медленно!)%n", 100_000 * 100_000L);
    }
}
