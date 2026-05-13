package com.bank.algorithms.complexity;

import java.util.HashMap;
import java.util.Map;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(n) — ЛИНЕЙНОЕ ВРЕМЯ                                 ║
 * ║   "Время растёт пропорционально размеру данных"          ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Один раз проходим по всем данным.
 * n=100 → 100 операций. n=1_000_000 → 1_000_000 операций.
 *
 * ПРИМЕРЫ O(n):
 *   - Линейный поиск в неотсортированном массиве
 *   - Сумма/минимум/максимум массива
 *   - Один проход по списку
 *   - Копирование массива
 *   - Поиск дубликатов через HashSet
 *
 * КАК УЗНАТЬ O(n)?
 *   Один цикл от 0 до n.
 *   for (int i = 0; i < n; i++) { ... одно действие ... }
 */
public class ON_Linear {

    // ── ПРИМЕР 1: Линейный поиск — O(n) ─────────────────────
    // БАНК: Найти транзакцию с заданной суммой.

    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i; // нашли!
        }
        return -1; // не найдено
    }

    // ── ПРИМЕР 2: Сумма/макс/мин — O(n) ─────────────────────
    // БАНК: Общая сумма всех транзакций, максимальный платёж.

    public static long sumArray(int[] arr) {
        long sum = 0;
        for (int x : arr) sum += x; // n операций
        return sum;
    }

    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }

    // ── ПРИМЕР 3: Проверка дубликатов — O(n) через HashMap ───
    // БАНК: Найти дублированные номера транзакций (возможная ошибка).

    public static boolean hasDuplicates(String[] ids) {
        Map<String, Boolean> seen = new HashMap<>();
        for (String id : ids) {
            if (seen.containsKey(id)) return true; // дубликат!
            seen.put(id, true);
        }
        return false; // O(n) — один проход
    }

    // ── ПРИМЕР 4: Реверс массива — O(n) ─────────────────────
    // БАНК: Вывести историю транзакций в обратном порядке.

    public static void reverse(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left++] = arr[right];
            arr[right--] = temp;
        } // O(n/2) = O(n)
    }

    // ── ПРИМЕР 5: Two Pointers — O(n) ────────────────────────
    // Задача: найти пару элементов с заданной суммой в отсортированном массиве.
    // БАНК: Найти два платежа которые в сумме дают целевую сумму возврата.

    public static int[] twoSum(int[] sortedArr, int target) {
        int left = 0, right = sortedArr.length - 1;
        while (left < right) {
            int sum = sortedArr[left] + sortedArr[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;  // увеличиваем сумму
            else                   right--; // уменьшаем сумму
        }
        return new int[]{-1, -1}; // O(n)
    }

    // ── ПРИМЕР 6: Sliding Window — O(n) ─────────────────────
    // Задача: максимальная сумма подмассива длиной k.
    // БАНК: Максимальный объём транзакций за k дней.

    public static long maxWindowSum(int[] arr, int k) {
        long windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i]; // первое окно

        long maxSum = windowSum;
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k]; // сдвигаем окно: добавляем новый, убираем старый
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum; // O(n)
    }

    // ── ПРИМЕР 7: Prefix Sum — O(n) предобработка, O(1) запрос
    // БАНК: После O(n) предобработки — мгновенные запросы суммы за период.

    public static long[] buildPrefixSum(int[] arr) {
        long[] prefix = new long[arr.length + 1];
        for (int i = 0; i < arr.length; i++) {
            prefix[i + 1] = prefix[i] + arr[i]; // O(n)
        }
        return prefix;
    }

    public static long rangeSum(long[] prefix, int left, int right) {
        return prefix[right + 1] - prefix[left]; // O(1) после предобработки!
    }

    // ── ПРИМЕР 8: Kadane's Algorithm — O(n) ──────────────────
    // Максимальная сумма непрерывного подмассива.
    // БАНК: Найти период с максимальным суммарным притоком денег.

    public static long maxSubarraySum(int[] arr) {
        long maxSoFar = arr[0], maxEndingHere = arr[0];
        for (int i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar; // O(n) — алгоритм Кадане
    }

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши moveZerosToEnd(int[] arr):
    //    Переместить все нули в конец, сохранив порядок остальных.
    //    [0,1,0,3,12] → [1,3,12,0,0]
    //    За O(n) и O(1) дополнительной памяти (два указателя).
    //    Банк: "Нулевые транзакции" отдельно от реальных.
    //
    // 2. Напиши firstNonRepeating(String s):
    //    Найти первый неповторяющийся символ.
    //    "aabbcdde" → 'c' (индекс 4).
    //    За O(n) с двумя проходами.
    //    Банк: Найти уникальный идентификатор в потоке данных.
    //
    // 3. Напиши maxProfitOneDayTrade(int[] prices):
    //    Купить один раз и продать один раз для максимальной прибыли.
    //    prices = [7,1,5,3,6,4] → прибыль 5 (купить за 1, продать за 6).
    //    За O(n) и O(1) памяти.
    //    Это классика с LeetCode #121!
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(n) — ЛИНЕЙНОЕ ВРЕМЯ ===\n");

        int[] arr = {5, 2, 8, 1, 9, 3, 7, 4, 6, 0};
        System.out.println("Массив: {5,2,8,1,9,3,7,4,6,0}");
        System.out.printf("Сумма: %d%n", sumArray(arr));
        System.out.printf("Максимум: %d%n", findMax(arr));

        int[] sorted = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        int[] pair = twoSum(sorted, 11);
        System.out.printf("Two Sum = 11: индексы [%d, %d] → значения [%d, %d]%n",
                pair[0], pair[1], sorted[pair[0]], sorted[pair[1]]);

        int[] transactions = {100, -50, 200, -30, 150, -80, 300};
        System.out.printf("Макс. сумма подмассива (макс. прирост за период): %d%n",
                maxSubarraySum(transactions));

        long[] prefix = buildPrefixSum(transactions);
        System.out.printf("Сумма транзакций [1..4]: %d%n", rangeSum(prefix, 1, 4));
        System.out.println("(Предобработка O(n), каждый запрос O(1))");

        System.out.printf("%nMakс. сумма за 3 дня (window=3): %d%n",
                maxWindowSum(transactions, 3));
    }
}
