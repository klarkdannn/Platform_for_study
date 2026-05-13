package com.bank.algorithms.complexity;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(2^n) и O(n!) — ЭКСПОНЕНЦИАЛЬНОЕ/ФАКТОРИАЛЬНОЕ       ║
 * ║   "Практически непригодно при n > 20-30"                 ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * O(2^n) — каждый новый элемент УДВАИВАЕТ количество работы.
 * O(n!)  — перебор всех перестановок.
 *
 * n=10:  O(2^n) = 1024       | O(n!) = 3_628_800
 * n=20:  O(2^n) = 1_048_576  | O(n!) = 2.4 * 10^18
 * n=30:  O(2^n) = 10^9       | непригодно
 * n=50:  O(2^n) = 10^15      | НЕ ВЫПОЛНИМО
 *
 * ЧТО ДЕЛАТЬ?
 * - Мемоизация / DP — убирает дублирующиеся подзадачи
 * - Жадные алгоритмы — не всегда оптимально, но быстро
 * - Эвристики / Приближённые алгоритмы
 * - Ветви и границы (Branch and Bound)
 */
public class O2N_Exponential {

    // ── ПРИМЕР 1: Fibonacci наивный — O(2^n) ─────────────────
    // Классический пример экспоненциальной рекурсии.
    // fib(5) вычисляет fib(3) ДВАЖДЫ и fib(2) ТРИЖДЫ!

    public static long fibSlow(int n) {
        if (n <= 1) return n;
        return fibSlow(n - 1) + fibSlow(n - 2); // O(2^n)!
    }

    // ✅ Исправление — мемоизация превращает O(2^n) → O(n)
    public static long fibFast(int n, Map<Integer, Long> memo) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long result = fibFast(n - 1, memo) + fibFast(n - 2, memo);
        memo.put(n, result);
        return result; // O(n)
    }

    // ── ПРИМЕР 2: Все подмножества — O(2^n) ──────────────────
    // Для n элементов ровно 2^n подмножеств.
    // Для n=20 → 1_048_576 подмножеств.
    // БАНК: Перебор всех комбинаций финансовых инструментов.

    public static List<List<Integer>> allSubsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        generateSubsets(nums, 0, new ArrayList<>(), result);
        return result; // O(2^n)
    }

    private static void generateSubsets(int[] nums, int idx, List<Integer> current,
                                        List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = idx; i < nums.length; i++) {
            current.add(nums[i]);
            generateSubsets(nums, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    // Итеративная версия через битовую маску:
    public static List<List<Integer>> allSubsetsBitmask(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) { // 2^n масок
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) subset.add(nums[i]); // если i-й бит установлен
            }
            result.add(subset);
        }
        return result; // O(2^n)
    }

    // ── ПРИМЕР 3: Задача коммивояжёра — O(n!) наивно, O(2^n * n) DP
    // TSP (Travelling Salesman Problem):
    // Обойти все n городов минимальным путём и вернуться.
    // NP-hard — нет полиномиального решения!
    //
    // БАНК: Маршрут инкассации по N банкоматам (минимальный пробег).
    // Для 15 банкоматов — DP за секунды, для 30+ нужны эвристики.

    public static int tspDP(int[][] dist) {
        int n = dist.length;
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
        dp[1][0] = 0; // начинаем с вершины 0 (маска = 0001)

        for (int mask = 1; mask < (1 << n); mask++) {
            for (int u = 0; u < n; u++) {
                if ((mask & (1 << u)) == 0 || dp[mask][u] == Integer.MAX_VALUE / 2) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) != 0) continue; // v уже посещён
                    int newMask = mask | (1 << v);
                    dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
                }
            }
        }

        int fullMask = (1 << n) - 1; // все вершины посещены
        int result = Integer.MAX_VALUE;
        for (int u = 1; u < n; u++) {
            if (dp[fullMask][u] != Integer.MAX_VALUE / 2) {
                result = Math.min(result, dp[fullMask][u] + dist[u][0]); // возврат в 0
            }
        }
        return result; // O(2^n * n²)
    }

    // ── ПРИМЕР 4: Все перестановки — O(n!) ───────────────────
    // n! = 1*2*3*...*n
    // БАНК: Тестирование порядка выполнения транзакций.

    public static List<List<Integer>> allPermutations(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        permute(nums, 0, result);
        return result; // O(n!)
    }

    private static void permute(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> perm = new ArrayList<>();
            for (int x : nums) perm.add(x);
            result.add(perm);
            return;
        }
        for (int i = start; i < nums.length; i++) {
            int tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp; // swap
            permute(nums, start + 1, result);
            tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;     // unswap
        }
    }

    // ── ПРИМЕР 5: Наивный поиск оптимального кредитного портфеля ─
    // Реальная задача: n=25 активов. Какие взять?
    // Наивный O(2^25) = 33 миллиона вариантов — выполнимо!
    // Наивный O(2^50) = 10^15 — нет.
    // Решение: Greedy/DP/Branch-and-Bound.

    // Жадный алгоритм для портфеля — O(n log n):
    public static List<String> greedyPortfolio(
            String[] assets, double[] returns, double[] risks, double maxRisk) {
        // Сортируем по соотношению доходность/риск
        Integer[] idx = new Integer[assets.length];
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Double.compare(returns[b]/risks[b], returns[a]/risks[a]));

        List<String> portfolio = new ArrayList<>();
        double totalRisk = 0;
        for (int i : idx) {
            if (totalRisk + risks[i] <= maxRisk) {
                portfolio.add(assets[i]);
                totalRisk += risks[i];
            }
        }
        return portfolio; // O(n log n) — жадный, не оптимальный!
    }

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши generateBinaryStrings(int n):
    //    Все бинарные строки длиной n: "000", "001", "010"...
    //    Их ровно 2^n. Используй рекурсию (backtracking).
    //
    // 2. Задача N-ферзей (N-Queens):
    //    Расставь N ферзей на доске N×N без взаимного нападения.
    //    Используй backtracking с pruning.
    //    Выведи все решения для N=4, N=8.
    //    Сложность: O(N!) без оптимизаций.
    //
    // 3. Subset Sum с DP:
    //    Можно ли набрать ровно target из элементов массива?
    //    Наивно O(2^n), DP O(n * target).
    //    nums = [3,1,1,2,2,1], target = 5 → true
    //    Банк: Можно ли собрать ровно N рублей из имеющихся купюр?
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(2^n) — ЭКСПОНЕНЦИАЛЬНОЕ ВРЕМЯ ===\n");

        System.out.println("── Fibonacci O(2^n) vs O(n) ──");
        for (int n : new int[]{10, 30, 40}) {
            long s = System.nanoTime();
            long slow = (n <= 35) ? fibSlow(n) : -1;
            long slowMs = System.nanoTime() - s;

            s = System.nanoTime();
            long fast = fibFast(n, new HashMap<>());
            long fastMs = System.nanoTime() - s;

            System.out.printf("fib(%d)=%d | O(2^n): %.2fмс | O(n): %.4fмс%n",
                    n, fast, slowMs / 1e6, fastMs / 1e6);
        }

        System.out.println("\n── Все подмножества [1,2,3] ──");
        List<List<Integer>> subsets = allSubsets(new int[]{1, 2, 3});
        subsets.forEach(s -> System.out.println("  " + s));
        System.out.println("Итого: " + subsets.size() + " = 2^3 = 8");

        System.out.println("\n── Все перестановки [1,2,3] ──");
        allPermutations(new int[]{1, 2, 3}).forEach(p -> System.out.println("  " + p));

        System.out.println("\n── TSP для 4 банкоматов (расстояния) ──");
        int[][] d = {
            {0, 10, 15, 20},
            {10, 0, 35, 25},
            {15, 35, 0, 30},
            {20, 25, 30, 0}
        };
        System.out.println("Минимальный маршрут инкассации: " + tspDP(d));

        System.out.println("\n── Жадный портфель ──");
        String[] assets = {"SBER", "VTBR", "GMKN", "LKOH", "YNDX"};
        double[] ret   = {0.12, 0.10, 0.15, 0.11, 0.18};
        double[] risk  = {0.08, 0.09, 0.12, 0.07, 0.15};
        List<String> portfolio = greedyPortfolio(assets, ret, risk, 0.25);
        System.out.println("Портфель при риске <= 0.25: " + portfolio);
    }
}
