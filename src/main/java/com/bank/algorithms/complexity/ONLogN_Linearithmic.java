package com.bank.algorithms.complexity;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(n log n) — ЛИНЕЙНО-ЛОГАРИФМИЧЕСКОЕ ВРЕМЯ            ║
 * ║   "Самый быстрый класс для задач сортировки"             ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Доказано: невозможно отсортировать быстрее O(n log n)
 * используя сравнения элементов.
 *
 * ПРИМЕРЫ O(n log n):
 *   - Merge Sort, Heap Sort, Quick Sort (среднее)
 *   - TreeMap/TreeSet операции на всех элементах
 *   - Построение кучи из n элементов
 *   - Fast Fourier Transform (FFT)
 *
 * ИНТУИЦИЯ:
 *   n log n = n * log n
 *   = "проходим по данным n раз, каждый раз разбивая пополам"
 *   Merge Sort: log n уровней разбиения, на каждом n работы.
 */
public class ONLogN_Linearithmic {

    // ── ПРИМЕР 1: Merge Sort — O(n log n) ────────────────────
    // Стабильная сортировка — сохраняет порядок равных.
    // БАНК: Сортировка транзакций по сумме с сохранением порядка
    // транзакций с одинаковой суммой (по дате).

    public static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = Arrays.copyOfRange(arr, left, right + 1);
        int i = 0, j = mid - left + 1, k = left;
        int m = mid - left;
        while (i <= m && j < temp.length) {
            arr[k++] = (temp[i] <= temp[j]) ? temp[i++] : temp[j++];
        }
        while (i <= m) arr[k++] = temp[i++];
        while (j < temp.length) arr[k++] = temp[j++];
    }

    // ── ПРИМЕР 2: Подсчёт инверсий — O(n log n) ─────────────
    // Инверсия: пара (i,j) где i<j, но arr[i] > arr[j].
    // БАНК: Насколько "разупорядочены" транзакции от идеального порядка?

    static long inversionCount = 0;

    public static long countInversions(int[] arr) {
        inversionCount = 0;
        int[] copy = arr.clone();
        mergeCount(copy, 0, copy.length - 1);
        return inversionCount; // O(n log n)
    }

    private static void mergeCount(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeCount(arr, left, mid);
        mergeCount(arr, mid + 1, right);
        mergeAndCount(arr, left, mid, right);
    }

    private static void mergeAndCount(int[] arr, int left, int mid, int right) {
        int[] temp = Arrays.copyOfRange(arr, left, right + 1);
        int i = 0, j = mid - left + 1, k = left;
        int m = mid - left;
        while (i <= m && j < temp.length) {
            if (temp[i] <= temp[j]) {
                arr[k++] = temp[i++];
            } else {
                inversionCount += (m - i + 1); // все оставшиеся слева больше temp[j]
                arr[k++] = temp[j++];
            }
        }
        while (i <= m) arr[k++] = temp[i++];
        while (j < temp.length) arr[k++] = temp[j++];
    }

    // ── ПРИМЕР 3: Ближайшая пара точек — O(n log n) ──────────
    // Найти две ближайшие точки из n.
    // Наивно O(n²). Оптимально — O(n log n).
    // БАНК: Найти два банкомата ближайших друг к другу для
    // оптимизации сети обслуживания.

    static class Point {
        double x, y;
        Point(double x, double y) { this.x = x; this.y = y; }
        double distanceTo(Point other) {
            double dx = x - other.x, dy = y - other.y;
            return Math.sqrt(dx*dx + dy*dy);
        }
    }

    public static double closestPair(List<Point> points) {
        // Сортируем по X: O(n log n)
        points.sort(Comparator.comparingDouble(p -> p.x));
        return closestPairRec(points, 0, points.size() - 1);
    }

    private static double closestPairRec(List<Point> pts, int l, int r) {
        if (r - l <= 3) {
            // базовый случай — перебор
            double d = Double.MAX_VALUE;
            for (int i = l; i <= r; i++)
                for (int j = i + 1; j <= r; j++)
                    d = Math.min(d, pts.get(i).distanceTo(pts.get(j)));
            return d;
        }
        int mid = l + (r - l) / 2;
        double midX = pts.get(mid).x;
        double d = Math.min(
                closestPairRec(pts, l, mid),
                closestPairRec(pts, mid + 1, r));

        // проверяем точки в "полосе" вокруг midX
        List<Point> strip = new ArrayList<>();
        for (int i = l; i <= r; i++) {
            if (Math.abs(pts.get(i).x - midX) < d) strip.add(pts.get(i));
        }
        strip.sort(Comparator.comparingDouble(p -> p.y));

        // в отсортированной полосе каждая точка проверяется максимум с 7 соседями
        for (int i = 0; i < strip.size(); i++) {
            for (int j = i + 1; j < strip.size() && strip.get(j).y - strip.get(i).y < d; j++) {
                d = Math.min(d, strip.get(i).distanceTo(strip.get(j)));
            }
        }
        return d;
    }

    // ── ПРИМЕР 4: Largest Rectangle in Histogram — O(n log n)
    // БАНК: Найти самый "плотный" период активности транзакций.
    // (stack-based решение даёт O(n))

    public static long largestRectangle(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        long maxArea = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = (i == heights.length) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, (long) height * width);
            }
            stack.push(i);
        }
        return maxArea; // O(n)
    }

    // ── ПРИМЕР 5: Сортировка объектов (Comparator) — O(n log n)
    // БАНК: Сортировка транзакций по дате, затем по сумме.

    record Transaction(int amount, int day) {}

    public static List<Transaction> sortTransactions(List<Transaction> txs) {
        return txs.stream()
                .sorted(Comparator.comparingInt(Transaction::day)
                        .thenComparingInt(Transaction::amount))
                .toList(); // O(n log n) TimSort под капотом
    }

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Реализуй сортировку слиянием для объектов:
    //    mergeSort(List<BankTransaction> list, Comparator<BankTransaction> cmp)
    //    Сначала по сумме, при равенстве — по дате.
    //
    // 2. Задача "Сколько дней нужно ждать следующей более тёплой температуры?"
    //    temps = [73, 74, 75, 71, 69, 72, 76, 73]
    //    output= [1,  1,  4,  2,  1,  1,  0,  0]
    //    Используй монотонный стек — O(n).
    //    Банк: Через сколько дней курс валюты станет выше текущего?
    //
    // 3. Реализуй внешнюю сортировку (External Sort) схематично:
    //    Данные не помещаются в RAM (100ГБ транзакций).
    //    1. Читаем чанки размером M, сортируем, сохраняем.
    //    2. Сливаем отсортированные чанки (k-way merge).
    //    Это реальная задача в банках с большими данными!
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(n log n) — ЛИНЕЙНО-ЛОГАРИФМИЧЕСКОЕ ВРЕМЯ ===\n");

        int[] arr = {64, 25, 12, 22, 11, 90, 43};
        System.out.println("Исходный: " + Arrays.toString(arr));
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("Merge Sort: " + Arrays.toString(arr));

        int[] inv = {3, 1, 2, 5, 4};
        System.out.printf("%nИнверсий в %s: %d%n",
                Arrays.toString(inv), countInversions(inv));

        int[] heights = {2, 1, 5, 6, 2, 3};
        System.out.printf("Макс. прямоугольник в гистограмме %s: %d%n",
                Arrays.toString(heights), largestRectangle(heights));

        System.out.println("\nСравнение: n=1_000_000");
        System.out.printf("  O(n)      = 1_000_000 операций%n");
        System.out.printf("  O(n log n)= %,d операций%n",
                (long)(1_000_000 * (Math.log(1_000_000) / Math.log(2))));
        System.out.printf("  O(n²)     = 1_000_000_000_000 операций%n");
    }
}
