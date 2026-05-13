package com.bank.algorithms.recursion;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║          КЛАССИЧЕСКИЕ РЕКУРСИВНЫЕ АЛГОРИТМЫ             ║
 * ║  Ханойские башни, Fibonacci, Factorial, Power,           ║
 * ║  Permutations, Subsets, Flood Fill                       ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * РЕКУРСИЯ — функция вызывает сама себя.
 * Каждая рекурсивная функция ОБЯЗАНА иметь:
 *   1. Базовый случай (base case) — условие остановки
 *   2. Рекурсивный шаг — задача уменьшается
 *
 * СТЕК ВЫЗОВОВ (Call Stack):
 * Каждый вызов функции занимает память в стеке.
 * Глубокая рекурсия → StackOverflowError!
 * Для n > 10000 лучше использовать итерацию или хвостовую рекурсию.
 *
 * МЕМОИЗАЦИЯ — кэшируем уже вычисленные результаты.
 * Превращает экспоненциальный O(2^n) в линейный O(n).
 */
public class RecursionClassics {

    // ══════════════════════════════════════════════════════════
    // 1. ХАНОЙСКИЕ БАШНИ — О(2^n) время, O(n) память (стек)
    // ══════════════════════════════════════════════════════════
    // ЗАДАЧА: Перенести n дисков с колышка A на колышек C,
    // используя колышек B как вспомогательный.
    // ПРАВИЛА:
    //   - За один ход перемещаем только один диск
    //   - Нельзя класть больший диск на меньший
    //
    // МИНИМАЛЬНОЕ кол-во ходов: 2^n - 1
    // Для n=10: 1023 хода. Для n=64: 1.8 * 10^19 ходов!
    //
    // БАНК-АНАЛОГИЯ: Разработка новой платёжной системы
    // требует последовательного переноса компонентов с
    // минимальным временем простоя.

    public static int hanoiMoves = 0;

    public static void hanoi(int n, char from, char to, char aux) {
        if (n == 1) {
            hanoiMoves++;
            System.out.printf("  Ход %d: Диск 1: %c → %c%n", hanoiMoves, from, to);
            return;
        }
        hanoi(n - 1, from, aux, to); // переносим n-1 дисков на вспомог. колышек
        hanoiMoves++;
        System.out.printf("  Ход %d: Диск %d: %c → %c%n", hanoiMoves, n, from, to);
        hanoi(n - 1, aux, to, from); // переносим n-1 дисков с вспомог. на целевой
    }

    // ══════════════════════════════════════════════════════════
    // 2. ЧИСЛА ФИБОНАЧЧИ — три варианта
    // ══════════════════════════════════════════════════════════
    // Последовательность: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
    // fib(n) = fib(n-1) + fib(n-2)
    //
    // БАНК: Технический анализ рынка (уровни Фибоначчи 23.6%, 38.2%, 61.8%)

    // ❌ НАИВНАЯ РЕКУРСИЯ — O(2^n) — очень медленно!
    public static long fibNaive(int n) {
        if (n <= 1) return n;
        return fibNaive(n - 1) + fibNaive(n - 2); // считает одно и то же много раз!
    }

    // ✅ МЕМОИЗАЦИЯ — O(n) время, O(n) память
    private static Map<Integer, Long> memo = new HashMap<>();
    public static long fibMemo(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n); // берём из кэша
        long result = fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, result); // сохраняем в кэш
        return result;
    }

    // ✅ ИТЕРАЦИЯ — O(n) время, O(1) память — лучшее решение!
    public static long fibIterative(int n) {
        if (n <= 1) return n;
        long prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            long next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }

    // ══════════════════════════════════════════════════════════
    // 3. ФАКТОРИАЛ — O(n) время, O(n) стек вызовов
    // ══════════════════════════════════════════════════════════
    // n! = n * (n-1) * (n-2) * ... * 1
    // 0! = 1 (по определению)
    //
    // БАНК: Перестановки (сколько способов расставить 10 сотрудников)

    public static long factorial(int n) {
        if (n <= 1) return 1; // базовый случай
        return n * factorial(n - 1); // рекурсивный шаг
    }

    // Итеративный вариант (не переполнит стек):
    public static long factorialIterative(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        return result;
    }

    // ══════════════════════════════════════════════════════════
    // 4. БЫСТРОЕ ВОЗВЕДЕНИЕ В СТЕПЕНЬ — O(log n)
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: x^n = (x^(n/2))^2 если n чётное
    //             x * x^(n-1)   если n нечётное
    //
    // БАНК: Расчёт сложных процентов по формуле A = P * (1+r)^t
    //       При t=30 лет — 30 умножений обычно, 5 шагов здесь!

    public static double fastPower(double base, int exp) {
        if (exp == 0) return 1.0; // любое число в степени 0 = 1
        if (exp < 0) return 1.0 / fastPower(base, -exp);
        if (exp % 2 == 0) {
            double half = fastPower(base, exp / 2);
            return half * half; // x^n = (x^(n/2))^2
        } else {
            return base * fastPower(base, exp - 1);
        }
    }

    // ══════════════════════════════════════════════════════════
    // 5. БИНАРНЫЙ ПОИСК (рекурсивный) — O(log n)
    // ══════════════════════════════════════════════════════════
    // Массив ДОЛЖЕН быть отсортирован!
    // БАНК: Поиск транзакции по сумме в отсортированном журнале.

    public static int binarySearch(int[] arr, int target, int left, int right) {
        if (left > right) return -1; // не найдено

        int mid = left + (right - left) / 2; // избегаем переполнения!

        if (arr[mid] == target) return mid;
        if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
        return binarySearch(arr, target, left, mid - 1);
    }

    // ══════════════════════════════════════════════════════════
    // 6. ПРОВЕРКА ПАЛИНДРОМА — O(n) время
    // ══════════════════════════════════════════════════════════
    // Банк: Проверка симметричности кода транзакции

    public static boolean isPalindrome(String s, int left, int right) {
        if (left >= right) return true; // базовый случай
        if (s.charAt(left) != s.charAt(right)) return false;
        return isPalindrome(s, left + 1, right - 1);
    }

    // ══════════════════════════════════════════════════════════
    // 7. ГЕНЕРАЦИЯ ВСЕХ ПЕРЕСТАНОВОК — O(n!)
    // ══════════════════════════════════════════════════════════
    // БАНК: Перебор всех возможных комбинаций для криптографии,
    // тестирование всех порядков транзакций на атомарность.

    public static void generatePermutations(int[] arr, int start, List<int[]> result) {
        if (start == arr.length) {
            result.add(arr.clone());
            return;
        }
        for (int i = start; i < arr.length; i++) {
            // меняем start и i
            int temp = arr[start];
            arr[start] = arr[i];
            arr[i] = temp;

            generatePermutations(arr, start + 1, result); // рекурсия

            // откат (backtracking)
            temp = arr[start];
            arr[start] = arr[i];
            arr[i] = temp;
        }
    }

    // ══════════════════════════════════════════════════════════
    // 8. ГЕНЕРАЦИЯ ВСЕХ ПОДМНОЖЕСТВ — O(2^n)
    // ══════════════════════════════════════════════════════════
    // БАНК: Все возможные комбинации финансовых продуктов
    // для составления инвестиционного портфеля.

    public static void generateSubsets(int[] arr, int index, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current)); // добавляем текущее подмножество

        for (int i = index; i < arr.length; i++) {
            current.add(arr[i]);              // берём элемент
            generateSubsets(arr, i + 1, current, result); // рекурсия
            current.remove(current.size() - 1); // откат (убираем элемент)
        }
    }

    // ══════════════════════════════════════════════════════════
    // 9. ЗАДАЧА О РАЗМЕНЕ МОНЕТ (Coin Change) — динамика
    //    Сложность: O(amount * coins.length)
    // ══════════════════════════════════════════════════════════
    // ЗАДАЧА: Сколько минимум монет нужно для суммы amount?
    // БАНК: Банкомат выдаёт купюры 5000, 1000, 500, 100.
    // Как выдать сумму минимальным количеством купюр?

    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        java.util.Arrays.fill(dp, amount + 1); // заполняем "бесконечностью"
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // ══════════════════════════════════════════════════════════
    // 10. FLOOD FILL — O(n*m) — заливка области
    // ══════════════════════════════════════════════════════════
    // БАНК: Анализ транзакционных паттернов на "тепловой карте".
    // Или определение связных зон активности в регионах.

    public static void floodFill(int[][] grid, int row, int col, int oldColor, int newColor) {
        if (row < 0 || row >= grid.length) return;
        if (col < 0 || col >= grid[0].length) return;
        if (grid[row][col] != oldColor) return;
        if (oldColor == newColor) return;

        grid[row][col] = newColor; // закрашиваем текущую ячейку

        // рекурсивно закрашиваем соседей (4 направления)
        floodFill(grid, row + 1, col, oldColor, newColor);
        floodFill(grid, row - 1, col, oldColor, newColor);
        floodFill(grid, row, col + 1, oldColor, newColor);
        floodFill(grid, row, col - 1, oldColor, newColor);
    }

    // ══════════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Ханойские башни — ИТЕРАТИВНАЯ версия:
    //    Можно решить без рекурсии используя стек.
    //    Подсказка: для нечётного диска — шаг в одном направлении,
    //    для чётного — в другом. Попробуй реализовать!
    //
    // 2. Напиши fibMatrix(n) — через возведение матрицы в степень:
    //    | 1 1 |^n   | fib(n+1) fib(n)   |
    //    | 1 0 |   = | fib(n)   fib(n-1) |
    //    Сложность: O(log n) — быстрее мемоизации!
    //
    // 3. Задача "N ферзей" (N-Queens):
    //    Расставь N ферзей на доске N×N так чтобы ни один
    //    не бил другого. Используй backtracking.
    //    Банк: размещение N независимых датацентров без
    //    пересечения зон обслуживания.
    //
    // 4. Задача "Рюкзак" (0/1 Knapsack):
    //    Есть N предметов с весом и ценностью. Рюкзак вместит
    //    вес W. Максимизируй ценность.
    //    Банк: выбор инвестиций с максимальной доходностью
    //    при ограниченном капитале.
    // ══════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== РЕКУРСИЯ И КЛАССИЧЕСКИЕ АЛГОРИТМЫ ===\n");

        // Ханойские башни
        System.out.println("── Ханойские башни (3 диска) ──");
        hanoiMoves = 0;
        hanoi(3, 'A', 'C', 'B');
        System.out.println("Всего ходов: " + hanoiMoves + " (должно быть 2^3 - 1 = 7)");

        // Фибоначчи сравнение
        System.out.println("\n── Числа Фибоначчи ──");
        for (int n : new int[]{10, 30, 45}) {
            long start = System.nanoTime();
            long naive = (n <= 35) ? fibNaive(n) : -1;
            long naiveTime = System.nanoTime() - start;

            start = System.nanoTime();
            memo.clear();
            long memoized = fibMemo(n);
            long memoTime = System.nanoTime() - start;

            start = System.nanoTime();
            long iterative = fibIterative(n);
            long iterTime = System.nanoTime() - start;

            System.out.printf("fib(%d) = %d | Naive: %6.3f мс | Memo: %5.3f мс | Iter: %5.3f мс%n",
                    n, memoized,
                    naiveTime / 1_000_000.0,
                    memoTime / 1_000_000.0,
                    iterTime / 1_000_000.0);
        }

        // Факториал
        System.out.println("\n── Факториал ──");
        for (int n : new int[]{0, 1, 5, 10, 15, 20}) {
            System.out.printf("%2d! = %,d%n", n, factorial(n));
        }

        // Быстрое возведение в степень
        System.out.println("\n── Быстрое возведение в степень ──");
        System.out.printf("2^10 = %.0f (быстро: %.0f)%n", Math.pow(2, 10), fastPower(2, 10));
        System.out.printf("1.07^30 = %.4f (рост депозита 7%% за 30 лет)%n", fastPower(1.07, 30));

        // Задача о монетах
        System.out.println("\n── Задача о монетах (банкомат) ──");
        int[] bills = {5000, 1000, 500, 100, 50};
        int[] amounts = {6500, 3750, 1234, 100};
        for (int amount : amounts) {
            System.out.printf("Сумма %d руб → минимум %d купюр%n",
                    amount, coinChange(bills, amount));
        }

        // Перестановки
        System.out.println("\n── Перестановки [1,2,3] ──");
        List<int[]> perms = new ArrayList<>();
        generatePermutations(new int[]{1, 2, 3}, 0, perms);
        for (int[] p : perms) System.out.println("  " + java.util.Arrays.toString(p));
        System.out.println("Всего: " + perms.size() + " = 3! = 6");
    }
}
