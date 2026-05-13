package com.bank.algorithms.complexity;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(log n) — ЛОГАРИФМИЧЕСКОЕ ВРЕМЯ                      ║
 * ║   "Каждый шаг вдвое уменьшает задачу"                   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Очень быстро! При n=1_000_000_000 нужно всего ~30 шагов.
 *
 * ПОЧЕМУ log n?
 *   Если каждый шаг делит задачу пополам:
 *   n → n/2 → n/4 → ... → 1
 *   Число шагов = log₂(n)
 *
 *   n=8:     шагов 3  (log₂8 = 3)
 *   n=1024:  шагов 10 (log₂1024 = 10)
 *   n=10^9:  шагов 30 (log₂(10^9) ≈ 30)
 *
 * ПРИМЕРЫ O(log n):
 *   - Бинарный поиск в отсортированном массиве
 *   - Операции с двоичным деревом поиска (BST)
 *   - Операции с кучей (Heap): insert, extract
 *   - Быстрое возведение в степень
 *   - Поиск в телефонной книге (метод половинного деления)
 *
 * КАК УЗНАТЬ O(log n)?
 *   Переменная делится или умножается на константу в цикле.
 *   while (n > 1) { n /= 2; }  ← классика
 */
public class OLogN_Logarithmic {

    // ── ПРИМЕР 1: Бинарный поиск — O(log n) ──────────────────
    // Требование: массив ОТСОРТИРОВАН.
    // БАНК: Поиск транзакции по сумме в отсортированном журнале.

    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2; // safe midpoint
            if (arr[mid] == target)    return mid;
            else if (arr[mid] < target) left = mid + 1;  // ищем в правой половине
            else                       right = mid - 1; // ищем в левой половине
        }
        return -1; // не найдено
    }

    // ── ПРИМЕР 2: Нижняя граница (lower bound) — O(log n) ───
    // Найти первый элемент >= target.
    // БАНК: Найти первую транзакцию с суммой >= 10000.

    public static int lowerBound(int[] arr, int target) {
        int left = 0, right = arr.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < target) left = mid + 1;
            else                   right = mid;
        }
        return left;
    }

    // ── ПРИМЕР 3: Подсчёт цифр числа — O(log n) ─────────────
    // n = 1234 → 4 цифры. Каждый шаг делит на 10.

    public static int countDigits(long n) {
        if (n == 0) return 1;
        int count = 0;
        n = Math.abs(n);
        while (n > 0) {
            n /= 10; // делим на 10
            count++;
        }
        return count; // O(log₁₀ n)
    }

    // ── ПРИМЕР 4: Сколько раз 2 входит в n — O(log n) ────────
    // n = 8 = 2³, значит 2 входит 3 раза (степень 2).

    public static int powerOfTwo(long n) {
        int power = 0;
        while (n > 1 && n % 2 == 0) {
            n /= 2;
            power++;
        }
        return power; // O(log n)
    }

    // ── ПРИМЕР 5: Быстрое возведение в степень — O(log n) ────
    // БАНК: Расчёт сложных процентов: 1.07^365 за log₂(365) ≈ 9 шагов

    public static long fastPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if (exp % 2 == 1) result = result * base % mod; // нечётная степень
            base = base * base % mod;                        // квадрат
            exp /= 2;                                        // делим пополам
        }
        return result; // O(log exp)
    }

    // ── ПРИМЕР 6: НОД (GCD) — алгоритм Евклида — O(log n) ───
    // НОД(a, b) = НОД(b, a % b)
    // БАНК: Упрощение дробей при расчёте долей капитала.

    public static long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a; // O(log(min(a,b)))
    }

    // ── ПРИМЕР 7: Бинарный поиск ответа — O(log n * f(n)) ───
    // Мощная техника: когда можно проверить "Является ли X ответом?"
    // БАНК: Найти максимальную сумму платежа X при которой
    // комиссия не превысит лимит.

    public static int findMaxPayment(int maxFee, int[] feeTable) {
        // feeTable[i] = комиссия за платёж суммой i
        // Ищем максимальное i при котором feeTable[i] <= maxFee
        int left = 0, right = feeTable.length - 1, answer = 0;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (feeTable[mid] <= maxFee) {
                answer = mid;   // mid подходит, ищем правее (больше)
                left = mid + 1;
            } else {
                right = mid - 1; // слишком большая комиссия, уменьшаем
            }
        }
        return answer; // O(log n)
    }

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши binarySearchRange(arr, low, high):
    //    Найти все индексы элементов в диапазоне [low, high].
    //    Используй lowerBound дважды.
    //    Банк: Найти все транзакции в диапазоне сумм [1000, 5000].
    //
    // 2. Реализуй sqrt(n) через бинарный поиск:
    //    Ищем x: x*x <= n < (x+1)*(x+1)
    //    Без Math.sqrt()! Только бинарный поиск.
    //    Сложность: O(log n).
    //
    // 3. Напиши rotatedBinarySearch(arr, target):
    //    Массив был отсортирован, потом "повёрнут": [4,5,6,7,0,1,2]
    //    Найди элемент за O(log n).
    //    Это классическая задача с собеседований!
    //
    // 4. Реализуй минимальную кучу (MinHeap) на массиве:
    //    - insert(value)   — O(log n)
    //    - extractMin()    — O(log n)
    //    - peek()          — O(1)
    //    Банк: Очередь заявок по приоритету (срочность).
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(log n) — ЛОГАРИФМИЧЕСКОЕ ВРЕМЯ ===\n");

        int[] sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println("Массив: {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}");
        System.out.println("Размер: 10 элементов → log₂(10) ≈ 3-4 сравнения");

        System.out.printf("Поиск 23: индекс %d%n", binarySearch(sorted, 23));
        System.out.printf("Поиск 50: индекс %d (нет в массиве)%n", binarySearch(sorted, 50));
        System.out.printf("Нижняя граница для 15: индекс %d (первый >= 15)%n",
                lowerBound(sorted, 15));

        System.out.println("\nСравнение шагов:");
        for (int n : new int[]{10, 100, 1_000, 1_000_000, 1_000_000_000}) {
            System.out.printf("  n=%,12d → log₂(n) ≈ %2d шагов%n",
                    n, (int)(Math.log(n) / Math.log(2)) + 1);
        }

        System.out.printf("%nНОД(48, 36) = %d%n", gcd(48, 36));
        System.out.printf("2^10 mod 1000 = %d%n", fastPow(2, 10, 1000));
        System.out.printf("Цифр в 1234567890: %d%n", countDigits(1234567890L));

        System.out.println("\nВывод: O(log n) — почти так же быстро как O(1).");
        System.out.println("Миллиард элементов — всего 30 сравнений!");
    }
}
