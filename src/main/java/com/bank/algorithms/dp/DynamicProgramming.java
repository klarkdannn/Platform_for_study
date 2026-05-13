package com.bank.algorithms.dp;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║          ДИНАМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ (DP)             ║
 * ║   Полный разбор: мемоизация, табуляция, паттерны        ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * DP — разбиваем задачу на ПОДЗАДАЧИ и кэшируем результаты.
 *
 * КОГДА ПРИМЕНЯТЬ DP:
 *   1. Оптимальная подструктура: оптимальное решение большой задачи
 *      строится из оптимальных решений подзадач.
 *   2. Перекрывающиеся подзадачи: одни и те же подзадачи встречаются
 *      много раз (в отличие от "разделяй и властвуй").
 *
 * ДВА ПОДХОДА:
 *   Top-Down (мемоизация): рекурсия + кэш.
 *     Естественно, пишется как рекурсия.
 *   Bottom-Up (табуляция): итерация снизу вверх.
 *     Обычно быстрее (нет стека вызовов).
 *
 * КАК В БАНКЕ:
 *   - Оптимизация портфеля (задача о рюкзаке)
 *   - Кратчайший путь конвертации валют
 *   - Расчёт оптимального графика выплат кредита
 *   - Предсказание поведения клиентов (edit distance)
 *   - Оптимальная стратегия хеджирования рисков
 */
public class DynamicProgramming {

    // ══════════════════════════════════════════════════════════
    // 1. FIBONACCI — классический старт в DP
    //    O(n) время, O(n) память (memo) или O(1) (optimal)
    // ══════════════════════════════════════════════════════════

    // Top-Down: рекурсия + HashMap
    public static long fibMemo(int n, Map<Integer, Long> cache) {
        if (n <= 1) return n;
        if (cache.containsKey(n)) return cache.get(n);
        long result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
        cache.put(n, result);
        return result;
    }

    // Bottom-Up: dp массив — классический вид DP
    public static long fibDP(int n) {
        if (n <= 1) return n;
        long[] dp = new long[n + 1];
        dp[0] = 0; dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }

    // Оптимизация памяти O(1): нужны только два предыдущих
    public static long fibOptimal(int n) {
        if (n <= 1) return n;
        long prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) { long t = prev + curr; prev = curr; curr = t; }
        return curr;
    }

    // ══════════════════════════════════════════════════════════
    // 2. ЗАДАЧА О РЮКЗАКЕ 0/1 (0/1 Knapsack)
    //    O(n*W) время и память
    // ══════════════════════════════════════════════════════════
    // ЗАДАЧА: N предметов, вес w[i], ценность v[i].
    // Рюкзак вместимостью W. Максимизировать ценность.
    //
    // БАНК: Выбрать инвестиционные инструменты при ограниченном
    // капитале W, максимизируя ожидаемую доходность.

    public static int knapsack01(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];
        // dp[i][w] = максимальная ценность, используя первые i предметов и вместимость w

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                dp[i][w] = dp[i - 1][w]; // не берём i-й предмет
                if (weights[i - 1] <= w) {
                    // берём i-й предмет
                    dp[i][w] = Math.max(dp[i][w],
                            dp[i - 1][w - weights[i - 1]] + values[i - 1]);
                }
            }
        }
        return dp[n][W];
    }

    // Оптимизация памяти до O(W):
    public static int knapsack01Optimized(int[] weights, int[] values, int W) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = W; w >= weights[i]; w--) { // ВАЖНО: идём справа налево!
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[W];
    }

    // ══════════════════════════════════════════════════════════
    // 3. РАЗМЕН МОНЕТ (Coin Change) — O(amount * coins)
    // ══════════════════════════════════════════════════════════
    // Вариант 1: Минимальное количество монет
    // БАНК: Банкомат выдаёт сумму минимальным числом купюр.

    public static int coinChangeMin(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // "бесконечность"
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // Вариант 2: Количество способов разменять (Unbounded Knapsack)
    // БАНК: Сколькими способами можно собрать сумму из купюр?

    public static long coinChangeWays(int[] coins, int amount) {
        long[] dp = new long[amount + 1];
        dp[0] = 1; // один способ собрать 0 — ничего не брать
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }
        return dp[amount];
    }

    // ══════════════════════════════════════════════════════════
    // 4. НАИБОЛЬШАЯ ОБЩАЯ ПОДПОСЛЕДОВАТЕЛЬНОСТЬ (LCS)
    //    O(n*m) время и память
    // ══════════════════════════════════════════════════════════
    // БАНК: Сравнение последовательностей операций.
    // Похожие транзакционные паттерны двух клиентов.

    public static int lcs(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                else
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[n][m];
    }

    // ══════════════════════════════════════════════════════════
    // 5. РАССТОЯНИЕ РЕДАКТИРОВАНИЯ (Edit Distance / Levenshtein)
    //    O(n*m) время
    // ══════════════════════════════════════════════════════════
    // БАНК: Поиск похожих имён клиентов (дубликаты в БД).
    // "Иван Иванов" и "Иван Иваноф" → расстояние 1.

    public static int editDistance(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i; // удалить i символов
        for (int j = 0; j <= m; j++) dp[0][j] = j; // вставить j символов
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1]; // символы совпадают — бесплатно
                else
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],  // замена
                                   Math.min(dp[i - 1][j],       // удаление
                                            dp[i][j - 1]));     // вставка
            }
        }
        return dp[n][m];
    }

    // ══════════════════════════════════════════════════════════
    // 6. НАИБОЛЬШАЯ ВОЗРАСТАЮЩАЯ ПОДПОСЛЕДОВАТЕЛЬНОСТЬ (LIS)
    //    O(n²) DP, O(n log n) с бинарным поиском
    // ══════════════════════════════════════════════════════════
    // БАНК: Найти самый длинный период непрерывного роста курса.

    public static int lis(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n]; // dp[i] = длина LIS заканчивающейся в i
        Arrays.fill(dp, 1);
        int maxLen = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            maxLen = Math.max(maxLen, dp[i]);
        }
        return maxLen;
    }

    // O(n log n) версия с patience sorting:
    public static int lisOptimal(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < x) lo = mid + 1; else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }

    // ══════════════════════════════════════════════════════════
    // 7. МАКСИМАЛЬНАЯ СУММА ПОДМАССИВА (Kadane + DP)
    //    O(n) — уже в ON_Linear.java, здесь DP-версия
    // ══════════════════════════════════════════════════════════

    public static int maxSubarrayDP(int[] nums) {
        int[] dp = new int[nums.length]; // dp[i] = макс. сумма, заканчивающаяся в i
        dp[0] = nums[0];
        int max = dp[0];
        for (int i = 1; i < nums.length; i++) {
            dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
            max = Math.max(max, dp[i]);
        }
        return max;
    }

    // ══════════════════════════════════════════════════════════
    // 8. ПОДЪЁМ ПО СТУПЕНЬКАМ — O(n)
    // ══════════════════════════════════════════════════════════
    // Можно прыгнуть на 1 или 2 ступеньки. Сколько способов подняться на n?
    // Это Fibonacci! dp[n] = dp[n-1] + dp[n-2]
    // БАНК: Сколько путей выполнения цепочки зависимых операций?

    public static long climbStairs(int n) {
        if (n <= 2) return n;
        long prev = 1, curr = 2;
        for (int i = 3; i <= n; i++) { long t = prev + curr; prev = curr; curr = t; }
        return curr;
    }

    // ══════════════════════════════════════════════════════════
    // 9. МАТРИЧНОЕ УМНОЖЕНИЕ (Matrix Chain) — O(n³)
    // ══════════════════════════════════════════════════════════
    // Найти оптимальный порядок перемножения матриц с минимальными операциями.
    // БАНК: Оптимизация порядка выполнения аналитических запросов.

    public static int matrixChain(int[] dims) {
        int n = dims.length - 1; // количество матриц
        int[][] dp = new int[n][n];
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                    dp[i][j] = Math.min(dp[i][j], cost);
                }
            }
        }
        return dp[0][n - 1];
    }

    // ══════════════════════════════════════════════════════════
    // 10. ЗАДАЧА "ПРЫЖКИ" (Jump Game) — O(n)
    // ══════════════════════════════════════════════════════════
    // Можно ли добраться до конца массива?
    // nums[i] = максимальная длина прыжка из позиции i.
    // БАНК: Можно ли выполнить цепочку платежей при ограничениях?

    public static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false; // не можем добраться до i
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    // Минимальное число прыжков — O(n) жадный
    public static int minJumps(int[] nums) {
        int jumps = 0, currentEnd = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == currentEnd) { jumps++; currentEnd = farthest; }
        }
        return jumps;
    }

    // ══════════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Unbounded Knapsack (неограниченный рюкзак):
    //    Каждый предмет можно брать сколько угодно раз.
    //    Банк: Инвестировать весь капитал в один инструмент можно.
    //    Изменение от 0/1: for (int w = weights[i]; w <= W; w++) ←слева!
    //
    // 2. Palindromic Substrings — O(n²):
    //    Найти все палиндромные подстроки.
    //    "aaa" → 6 ("a","a","a","aa","aa","aaa")
    //    Используй dp[i][j] = true если s[i..j] — палиндром.
    //    Банк: Анализ симметричных паттернов транзакций.
    //
    // 3. Stock Buy & Sell (k транзакций) — O(n*k):
    //    Купить/продать акцию не более k раз для максимальной прибыли.
    //    dp[k][i] = макс. прибыль с k транзакциями до дня i.
    //    Банк: Оптимальная стратегия торговли ценными бумагами.
    //
    // 4. Regular Expression Matching — O(n*m):
    //    Совпадает ли строка с паттерном (с '*' и '.')?
    //    dp[i][j] = совпадает ли s[0..i-1] с p[0..j-1].
    //    Банк: Гибкий поиск по шаблону в истории транзакций.
    // ══════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== ДИНАМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ ===\n");

        // Fibonacci
        System.out.println("── Fibonacci ──");
        for (int n : new int[]{10, 20, 40, 50}) {
            System.out.printf("fib(%d) = %d%n", n, fibOptimal(n));
        }

        // Knapsack
        System.out.println("\n── Рюкзак (инвестиционный портфель) ──");
        int[] weights = {2, 3, 4, 5};  // риск активов
        int[] values  = {3, 4, 5, 6};  // доходность
        int capacity  = 8;             // бюджет
        System.out.printf("Макс. доходность (бюджет=%d): %d%n",
                capacity, knapsack01(weights, values, capacity));

        // Coin Change
        System.out.println("\n── Банкомат (минимум купюр) ──");
        int[] bills = {100, 200, 500, 1000, 2000, 5000};
        for (int amount : new int[]{1700, 3300, 6500, 11100}) {
            System.out.printf("  %5d руб → %d купюр%n",
                    amount, coinChangeMin(bills, amount));
        }

        // Edit Distance
        System.out.println("\n── Расстояние редактирования (дубликаты клиентов) ──");
        String[][] pairs = {
            {"Иван Иванов", "Иван Иваноф"},
            {"Алексей", "Александр"},
            {"bank", "blank"}
        };
        for (String[] p : pairs) {
            System.out.printf("  \"%s\" ↔ \"%s\" = %d%n",
                    p[0], p[1], editDistance(p[0], p[1]));
        }

        // LIS — рост курса
        System.out.println("\n── Наибольшая возрастающая подпоследовательность ──");
        int[] rates = {10, 22, 9, 33, 21, 50, 41, 60, 80};
        System.out.println("Курс: " + Arrays.toString(rates));
        System.out.printf("Длина LIS: %d (O(n²)), %d (O(n log n))%n",
                lis(rates), lisOptimal(rates));

        // Jump Game
        System.out.println("\n── Прыжки ──");
        int[] nums1 = {2, 3, 1, 1, 4};
        int[] nums2 = {3, 2, 1, 0, 4};
        System.out.printf("{2,3,1,1,4}: доберёмся? %b, минимум прыжков: %d%n",
                canJump(nums1), minJumps(nums1));
        System.out.printf("{3,2,1,0,4}: доберёмся? %b%n", canJump(nums2));
    }
}
