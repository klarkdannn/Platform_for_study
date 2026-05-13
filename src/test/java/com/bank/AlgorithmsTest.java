package com.bank;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ТЕСТЫ ДЛЯ АЛГОРИТМОВ
 *
 * Как тестировать алгоритмы:
 *   1. Happy path (нормальные данные)
 *   2. Edge cases: пустой массив, один элемент, уже отсортирован
 *   3. Граничные значения: отрицательные числа, дубликаты, обратный порядок
 *   4. Property-based: свойства которые ВСЕГДА должны выполняться
 *
 * Property-based testing:
 *   Вместо конкретных значений проверяем свойства:
 *   - После сортировки массив отсортирован
 *   - После сортировки все элементы присутствуют (нет потерь/дублей)
 *   - Размер массива не изменился
 */
class AlgorithmsTest {

    // ══════════════════════════════════════════════════════════════════════
    // АЛГОРИТМЫ ПОД ТЕСТОМ
    // ══════════════════════════════════════════════════════════════════════

    static int[] bubbleSort(int[] arr) {
        int[] a = Arrays.copyOf(arr, arr.length);
        for (int i = 0; i < a.length - 1; i++)
            for (int j = 0; j < a.length - 1 - i; j++)
                if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
        return a;
    }

    static int[] mergeSort(int[] arr) {
        if (arr.length <= 1) return Arrays.copyOf(arr, arr.length);
        int mid = arr.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
        int[] result = new int[arr.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length)
            result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }

    static int binarySearch(int[] sorted, int target) {
        int lo = 0, hi = sorted.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (sorted[mid] == target) return mid;
            if (sorted[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    static long fibonacci(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }
        return b;
    }

    // ══════════════════════════════════════════════════════════════════════
    // 1. ТЕСТЫ СОРТИРОВКИ — NESTED CLASSES ДЛЯ ОРГАНИЗАЦИИ
    // ══════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("BubbleSort")
    class BubbleSortTests {

        @Test
        @DisplayName("Обычный массив сортируется верно")
        void normalArray() {
            assertArrayEquals(new int[]{1, 1, 3, 4, 5}, bubbleSort(new int[]{3, 1, 4, 1, 5}));
        }

        @Test
        @DisplayName("Уже отсортированный массив не меняется")
        void alreadySorted() {
            int[] input = {1, 2, 3, 4, 5};
            assertArrayEquals(input, bubbleSort(input));
        }

        @Test
        @DisplayName("Обратный порядок")
        void reverseOrder() {
            assertArrayEquals(new int[]{1, 2, 3, 4, 5}, bubbleSort(new int[]{5, 4, 3, 2, 1}));
        }

        @Test
        @DisplayName("Пустой массив → пустой массив")
        void emptyArray() {
            assertArrayEquals(new int[]{}, bubbleSort(new int[]{}));
        }

        @Test
        @DisplayName("Один элемент")
        void singleElement() {
            assertArrayEquals(new int[]{42}, bubbleSort(new int[]{42}));
        }

        @Test
        @DisplayName("Все одинаковые элементы")
        void allSame() {
            assertArrayEquals(new int[]{7, 7, 7}, bubbleSort(new int[]{7, 7, 7}));
        }

        @Test
        @DisplayName("Отрицательные числа")
        void negativeNumbers() {
            assertArrayEquals(new int[]{-5, -3, -1, 0, 2},
                bubbleSort(new int[]{0, -3, 2, -5, -1}));
        }

        @Test
        @DisplayName("Исходный массив не изменяется (нет side effects)")
        void originalArrayUnchanged() {
            int[] original = {5, 3, 1, 4, 2};
            int[] copy = Arrays.copyOf(original, original.length);
            bubbleSort(original);
            assertArrayEquals(copy, original, "Оригинал не должен меняться");
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. PROPERTY-BASED TEST — СРАВНИВАЕМ ОБА АЛГОРИТМА
    // ══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("PROPERTY: сортировка всегда корректна для случайных массивов")
    void sortingPropertyTest() {
        java.util.Random rng = new java.util.Random(42); // Fixed seed = воспроизводимо

        for (int trial = 0; trial < 200; trial++) {
            int size = rng.nextInt(50);
            int[] arr = rng.ints(size, -1000, 1000).toArray();

            int[] expected = Arrays.copyOf(arr, arr.length);
            Arrays.sort(expected); // Эталон — встроенная сортировка Java

            assertArrayEquals(expected, bubbleSort(arr),
                "BubbleSort fail на trial " + trial);
            assertArrayEquals(expected, mergeSort(arr),
                "MergeSort fail на trial " + trial);
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. ТЕСТЫ BINARY SEARCH
    // ══════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("BinarySearch")
    class BinarySearchTests {

        private final int[] sorted = {1, 3, 5, 7, 9, 11, 13, 15};

        @Test void findsFirstElement()  { assertEquals(0, binarySearch(sorted, 1)); }
        @Test void findsLastElement()   { assertEquals(7, binarySearch(sorted, 15)); }
        @Test void findsMiddleElement() { assertEquals(3, binarySearch(sorted, 7)); }
        @Test void notFoundReturnsMinusOne() { assertEquals(-1, binarySearch(sorted, 6)); }
        @Test void emptyArray()         { assertEquals(-1, binarySearch(new int[]{}, 5)); }

        @ParameterizedTest(name = "search({0}) == {1}")
        @CsvSource({"1,0", "3,1", "5,2", "7,3", "9,4", "11,5", "13,6", "15,7"})
        void findsAllElements(int target, int expectedIdx) {
            assertEquals(expectedIdx, binarySearch(sorted, target));
        }

        @Test
        @DisplayName("PROPERTY: если элемент есть в массиве — search находит его")
        void propertyFoundIfPresent() {
            java.util.Random rng = new java.util.Random(7);
            for (int trial = 0; trial < 100; trial++) {
                int[] arr = rng.ints(20, 0, 100).distinct().sorted().toArray();
                int target = arr[rng.nextInt(arr.length)]; // Выбираем существующий элемент
                int idx = binarySearch(arr, target);
                assertTrue(idx >= 0, "Элемент " + target + " должен быть найден");
                assertEquals(target, arr[idx], "Индекс указывает на неверный элемент");
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 4. ТЕСТЫ FIBONACCI
    // ══════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("Fibonacci")
    class FibonacciTests {

        @ParameterizedTest(name = "fib({0}) = {1}")
        @CsvSource({
            "0, 0", "1, 1", "2, 1", "3, 2",
            "4, 3", "5, 5", "6, 8", "10, 55",
            "20, 6765", "30, 832040"
        })
        void knownValues(int n, long expected) {
            assertEquals(expected, fibonacci(n));
        }

        @Test
        @DisplayName("PROPERTY: fib(n) = fib(n-1) + fib(n-2)")
        void fibonacciProperty() {
            for (int n = 2; n <= 40; n++) {
                assertEquals(fibonacci(n - 1) + fibonacci(n - 2), fibonacci(n),
                    "Нарушено свойство Фибоначчи для n=" + n);
            }
        }

        @Test
        @DisplayName("PROPERTY: числа Фибоначчи монотонно возрастают (n >= 1)")
        void fibonacciIncreasing() {
            for (int n = 1; n < 40; n++) {
                assertTrue(fibonacci(n + 1) >= fibonacci(n),
                    "fib(" + (n+1) + ") должно быть >= fib(" + n + ")");
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 5. ФИНАНСОВЫЕ ВЫЧИСЛЕНИЯ (банковый контекст)
    // ══════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("Финансовые вычисления")
    class FinancialTests {

        static double simpleInterest(double principal, double ratePercent, int days) {
            return principal * (ratePercent / 100.0) * (days / 365.0);
        }

        static java.math.BigDecimal exactInterest(java.math.BigDecimal principal,
                                                   java.math.BigDecimal ratePercent, int days) {
            return principal
                .multiply(ratePercent.divide(java.math.BigDecimal.valueOf(100)))
                .multiply(java.math.BigDecimal.valueOf(days))
                .divide(java.math.BigDecimal.valueOf(365), 2, java.math.RoundingMode.HALF_UP);
        }

        @Test
        @DisplayName("100 000 × 10% × 365 дней = 10 000")
        void simpleInterestCorrect() {
            assertEquals(10_000.0, simpleInterest(100_000, 10, 365), 0.01);
        }

        @Test
        @DisplayName("Нулевой срок = нулевые проценты")
        void zeroDays() {
            assertEquals(0.0, simpleInterest(100_000, 10, 0), 0.001);
        }

        @Test
        @DisplayName("BigDecimal: точный расчёт без потери копеек")
        void exactDecimalCalculation() {
            var principal = new java.math.BigDecimal("100000.00");
            var rate = new java.math.BigDecimal("10");
            var result = exactInterest(principal, rate, 365);
            assertEquals(0, result.compareTo(new java.math.BigDecimal("10000.00")));
        }

        @Test
        @DisplayName("0.1 + 0.2 ≠ 0.3 (проблема double — ВАЖНО ЗНАТЬ!)")
        void doublePrecisionProblem() {
            assertNotEquals(0.3, 0.1 + 0.2); // 0.30000000000000004 ≠ 0.3
            assertEquals(0.3, 0.1 + 0.2, 0.0001); // С погрешностью — OK
        }

        @Test
        @DisplayName("Разбивка суммы на части без потери копеек")
        void splitAmountNoMoneyLost() {
            var total = new java.math.BigDecimal("1000.00");
            int parts = 3;
            var each = total.divide(java.math.BigDecimal.valueOf(parts), 2,
                java.math.RoundingMode.FLOOR); // 333.33
            var remainder = total.subtract(each.multiply(java.math.BigDecimal.valueOf(parts)));
            var lastPart = each.add(remainder); // 333.34

            var reconstructed = each.multiply(java.math.BigDecimal.valueOf(parts - 1))
                .add(lastPart);
            assertEquals(0, total.compareTo(reconstructed),
                "Сумма частей должна равняться оригиналу");
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. ТЕСТЫ СТРУКТУР ДАННЫХ
    // ══════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("Stack")
    class StackTests {

        static class Stack<T> {
            private final java.util.Deque<T> data = new java.util.ArrayDeque<>();
            void push(T item)  { data.push(item); }
            T pop()   { if (isEmpty()) throw new java.util.EmptyStackException(); return data.pop(); }
            T peek()  { if (isEmpty()) throw new java.util.EmptyStackException(); return data.peek(); }
            boolean isEmpty() { return data.isEmpty(); }
            int size()        { return data.size(); }
        }

        @Test void newStackIsEmpty()     { assertTrue(new Stack<>().isEmpty()); }
        @Test void pushIncreasesSize()   { var s = new Stack<Integer>(); s.push(1); assertEquals(1, s.size()); }
        @Test void peekDoesNotRemove()   { var s = new Stack<String>(); s.push("x"); s.peek(); assertEquals(1, s.size()); }
        @Test void popEmptyThrows()      { assertThrows(java.util.EmptyStackException.class, () -> new Stack<>().pop()); }
        @Test void peekEmptyThrows()     { assertThrows(java.util.EmptyStackException.class, () -> new Stack<>().peek()); }

        @Test
        @DisplayName("LIFO порядок: push 1,2,3 → pop 3,2,1")
        void lifoOrder() {
            var stack = new Stack<Integer>();
            stack.push(1); stack.push(2); stack.push(3);
            assertEquals(3, stack.pop());
            assertEquals(2, stack.pop());
            assertEquals(1, stack.pop());
            assertTrue(stack.isEmpty());
        }

        @ParameterizedTest(name = "isValidBrackets(\"{0}\") = {1}")
        @CsvSource({
            "'()', true",
            "'{()[]}', true",
            "'', true",
            "'(]', false",
            "'([)', false",
            "'(', false",
            "')', false",
            "'((()))', true"
        })
        void bracketValidation(String input, boolean expected) {
            assertEquals(expected, isValidBrackets(input));
        }

        boolean isValidBrackets(String s) {
            java.util.Deque<Character> stack = new java.util.ArrayDeque<>();
            for (char c : s.toCharArray()) {
                if (c == '(' || c == '[' || c == '{') stack.push(c);
                else if (c == ')' && (stack.isEmpty() || stack.pop() != '(')) return false;
                else if (c == ']' && (stack.isEmpty() || stack.pop() != '[')) return false;
                else if (c == '}' && (stack.isEmpty() || stack.pop() != '{')) return false;
            }
            return stack.isEmpty();
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // 7. ТЕСТ МНОГОПОТОЧНОСТИ
    // ══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("AtomicLong: 100 потоков × 1000 операций = точный результат")
    void atomicConcurrencyTest() throws InterruptedException {
        var balance = new java.util.concurrent.atomic.AtomicLong(0);
        int threads = 100, ops = 1000;

        Thread[] workers = new Thread[threads];
        for (int i = 0; i < threads; i++) {
            workers[i] = new Thread(() -> {
                for (int j = 0; j < ops; j++) balance.incrementAndGet();
            });
            workers[i].start();
        }
        for (Thread w : workers) w.join();

        assertEquals((long) threads * ops, balance.get(),
            "Atomic операции должны давать точный результат");
    }

    // ★ ЗАДАНИЯ
    // 1. Напиши тесты для quickSort (те же что для bubbleSort + property test)
    // 2. Напиши Nested класс для тестирования HashMap: put, get, null key, resize
    // 3. Напиши тест для LRU кеша: capacity=2, проверь eviction при добавлении 3-го
    // 4. Напиши parametrized тест для конвертации валют (USD→RUB, EUR→RUB)
}
