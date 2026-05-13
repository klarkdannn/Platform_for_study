package com.bank.algorithms;

import java.util.Arrays;
import java.util.Random;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║           АЛГОРИТМЫ СОРТИРОВКИ — ПОЛНЫЙ КУРС            ║
 * ║  Сортировки от O(n²) до O(n log n) с примерами банка   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ЗАЧЕМ БАНКУ СОРТИРОВКА?
 * - Сортировка транзакций по дате/сумме
 * - Ранжирование клиентов по балансу
 * - Сортировка заявок на кредит по приоритету
 * - Топ-N клиентов по обороту
 */
public class SortingAlgorithms {

    // ══════════════════════════════════════════════════════════
    // 1. BUBBLE SORT — O(n²) время, O(1) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Сравниваем соседние элементы и меняем если нужно.
    // "Пузырёк" (большой элемент) всплывает вправо.
    // Лучший случай: O(n) — если массив уже отсортирован (с флагом)
    // Худший/средний: O(n²)
    // Используют: никогда в production, только для обучения

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false; // оптимизация: если не было обменов — уже отсортировано
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // меняем местами
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break; // массив отсортирован досрочно
        }
    }

    // ══════════════════════════════════════════════════════════
    // 2. SELECTION SORT — O(n²) время, O(1) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: На каждом шаге находим МИНИМУМ в неотсортированной части
    // и ставим его на правильное место.
    // Количество ОБМЕНОВ минимально (n-1) — хорошо если обмен дорогой.
    // Банк: когда "перемещение" дорого (перезапись в БД), а "чтение" дешево.

    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            // ищем минимум в arr[i+1..n-1]
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // ставим минимум на позицию i
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    // ══════════════════════════════════════════════════════════
    // 3. INSERTION SORT — O(n²) время, O(1) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Как сортировка карт в руке. Берём новую карту и
    // вставляем её на правильное место среди уже отсортированных.
    // ЛУЧШИЙ случай: O(n) — почти отсортированные данные!
    // ИСПОЛЬЗУЮТ: для маленьких массивов (< 20 элементов),
    //             как часть других алгоритмов (TimSort в Java!)
    // Банк: новые транзакции приходят почти по порядку дат.

    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i]; // текущий элемент для вставки
            int j = i - 1;
            // сдвигаем вправо все элементы которые больше key
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key; // вставляем на нужную позицию
        }
    }

    // ══════════════════════════════════════════════════════════
    // 4. MERGE SORT — O(n log n) время, O(n) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: "Разделяй и властвуй". Делим массив пополам рекурсивно,
    // затем СЛИВАЕМ (merge) уже отсортированные половины.
    // СТАБИЛЬНАЯ — сохраняет относительный порядок равных элементов.
    // Банк: сортировка транзакций с сохранением порядка при равных суммах.

    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2; // избегаем переполнения (лучше чем (left+right)/2)
            mergeSort(arr, left, mid);        // сортируем левую половину
            mergeSort(arr, mid + 1, right);   // сортируем правую половину
            merge(arr, left, mid, right);     // сливаем
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        // создаём временные массивы
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int[] leftArr  = Arrays.copyOfRange(arr, left, mid + 1);
        int[] rightArr = Arrays.copyOfRange(arr, mid + 1, right + 1);

        int i = 0, j = 0, k = left;
        // сравниваем и сливаем
        while (i < n1 && j < n2) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k++] = leftArr[i++];
            } else {
                arr[k++] = rightArr[j++];
            }
        }
        // копируем остаток
        while (i < n1) arr[k++] = leftArr[i++];
        while (j < n2) arr[k++] = rightArr[j++];
    }

    // ══════════════════════════════════════════════════════════
    // 5. QUICK SORT — O(n log n) среднее, O(n²) худший, O(log n) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Выбираем ОПОРНЫЙ элемент (pivot). Переставляем так,
    // чтобы всё меньшее было слева, большее — справа. Рекурсия.
    // Самый быстрый НА ПРАКТИКЕ из-за кэш-friendly доступа к памяти.
    // НЕ стабильная сортировка.
    // Банк: основная рабочая лошадка для больших массивов.

    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);  // сортируем левую часть
            quickSort(arr, pivotIndex + 1, high); // сортируем правую часть
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // берём последний элемент как опорный
        int i = low - 1; // индекс меньшего элемента

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                // меняем arr[i] и arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        // ставим pivot на правильное место
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    // ══════════════════════════════════════════════════════════
    // 6. HEAP SORT — O(n log n) время, O(1) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Строим MAX-HEAP (родитель >= детей). Затем извлекаем
    // максимум (корень), помещаем в конец, перестраиваем кучу.
    // Гарантированно O(n log n) в любом случае. Не стабильная.
    // Банк: когда нужна гарантия времени (real-time системы).

    public static void heapSort(int[] arr) {
        int n = arr.length;

        // строим max-heap: начинаем с последнего нелистового узла
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // извлекаем элементы из кучи по одному
        for (int i = n - 1; i > 0; i--) {
            // максимум (корень) идёт в конец
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            // перестраиваем кучу без последнего элемента
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;      // корень
        int left  = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest])   largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest); // рекурсивно восстанавливаем
        }
    }

    // ══════════════════════════════════════════════════════════
    // 7. COUNTING SORT — O(n + k) время, O(k) память
    //    где k — диапазон значений
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Не сравниваем элементы! Считаем сколько раз встречается
    // каждое значение. Работает только для целых чисел в диапазоне.
    // Банк: сортировка транзакций по типу (только 5 видов).

    public static int[] countingSort(int[] arr, int maxVal) {
        int[] count = new int[maxVal + 1];
        for (int x : arr) count[x]++;  // считаем

        // накопительная сумма (prefix sum)
        for (int i = 1; i <= maxVal; i++) {
            count[i] += count[i - 1];
        }

        int[] output = new int[arr.length];
        for (int i = arr.length - 1; i >= 0; i--) { // обратный порядок для стабильности
            output[--count[arr[i]]] = arr[i];
        }
        return output;
    }

    // ══════════════════════════════════════════════════════════
    // СРАВНЕНИЕ ПРОИЗВОДИТЕЛЬНОСТИ
    // ══════════════════════════════════════════════════════════

    public static void compareSortingAlgorithms() {
        System.out.println("\n╔═══════════════════════════════════════════════════╗");
        System.out.println("║        СРАВНЕНИЕ АЛГОРИТМОВ СОРТИРОВКИ           ║");
        System.out.println("╚═══════════════════════════════════════════════════╝");

        int[] sizes = {1_000, 10_000, 50_000};

        for (int size : sizes) {
            System.out.printf("%n── Размер массива: %,d ──%n", size);

            int[] original = generateRandom(size);

            // Bubble Sort
            int[] arr = original.clone();
            long start = System.nanoTime();
            bubbleSort(arr);
            long bubbleTime = System.nanoTime() - start;

            // Merge Sort
            arr = original.clone();
            start = System.nanoTime();
            mergeSort(arr, 0, arr.length - 1);
            long mergeTime = System.nanoTime() - start;

            // Quick Sort
            arr = original.clone();
            start = System.nanoTime();
            quickSort(arr, 0, arr.length - 1);
            long quickTime = System.nanoTime() - start;

            // Heap Sort
            arr = original.clone();
            start = System.nanoTime();
            heapSort(arr);
            long heapTime = System.nanoTime() - start;

            // Java built-in (TimSort)
            arr = original.clone();
            start = System.nanoTime();
            Arrays.sort(arr);
            long javaTime = System.nanoTime() - start;

            System.out.printf("  Bubble Sort:  %8.2f мс%n", bubbleTime / 1_000_000.0);
            System.out.printf("  Merge Sort:   %8.2f мс%n", mergeTime / 1_000_000.0);
            System.out.printf("  Quick Sort:   %8.2f мс%n", quickTime / 1_000_000.0);
            System.out.printf("  Heap Sort:    %8.2f мс%n", heapTime / 1_000_000.0);
            System.out.printf("  Java (Tim):   %8.2f мс  ← стандарт%n", javaTime / 1_000_000.0);
        }

        System.out.println("\n┌───────────────────────────────────────────────────┐");
        System.out.println("│  ТАБЛИЦА СЛОЖНОСТЕЙ                               │");
        System.out.println("├──────────────────┬────────┬────────┬──────────────┤");
        System.out.println("│ Алгоритм         │ Лучший │ Средний│ Доп. память  │");
        System.out.println("├──────────────────┼────────┼────────┼──────────────┤");
        System.out.println("│ Bubble Sort      │ O(n)   │ O(n²)  │ O(1)         │");
        System.out.println("│ Selection Sort   │ O(n²)  │ O(n²)  │ O(1)         │");
        System.out.println("│ Insertion Sort   │ O(n)   │ O(n²)  │ O(1)         │");
        System.out.println("│ Merge Sort       │ O(nln) │ O(nln) │ O(n) ←стабил.│");
        System.out.println("│ Quick Sort       │ O(nln) │ O(nln) │ O(log n)     │");
        System.out.println("│ Heap Sort        │ O(nln) │ O(nln) │ O(1)         │");
        System.out.println("│ Counting Sort    │ O(n+k) │ O(n+k) │ O(k)         │");
        System.out.println("│ Java TimSort     │ O(n)   │ O(nln) │ O(n) ←лучший │");
        System.out.println("└──────────────────┴────────┴────────┴──────────────┘");
    }

    private static int[] generateRandom(int size) {
        Random rnd = new Random(42);
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) arr[i] = rnd.nextInt(1_000_000);
        return arr;
    }

    // ══════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    // 1. Реализуй Shell Sort (сортировка Шелла) — улучшенный Insertion Sort
    //    Идея: сортируем с большим шагом, постепенно уменьшаем шаг до 1.
    //    Сложность: от O(n^1.5) до O(n log² n) зависит от шага.
    //
    // 2. Реализуй Radix Sort (цифровая сортировка):
    //    Идея: сортируем по каждой цифре числа (с правой к левой).
    //    Используй Counting Sort для каждого разряда.
    //    Сложность: O(d * (n + k)) где d — кол-во цифр.
    //
    // 3. Напиши BankTransactionSorter:
    //    - Хранит список транзакций (суммы и даты)
    //    - Метод sortByAmount() — по сумме
    //    - Метод sortByDate() — по дате
    //    - Используй Merge Sort (стабильный — не меняет порядок равных)
    // ══════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== АЛГОРИТМЫ СОРТИРОВКИ ===\n");

        int[] demo = {64, 34, 25, 12, 22, 11, 90, 43, 7, 55};
        System.out.println("Исходный: " + Arrays.toString(demo));

        int[] arr = demo.clone();
        bubbleSort(arr);
        System.out.println("Bubble:   " + Arrays.toString(arr));

        arr = demo.clone();
        selectionSort(arr);
        System.out.println("Selection:" + Arrays.toString(arr));

        arr = demo.clone();
        insertionSort(arr);
        System.out.println("Insertion:" + Arrays.toString(arr));

        arr = demo.clone();
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("Merge:    " + Arrays.toString(arr));

        arr = demo.clone();
        quickSort(arr, 0, arr.length - 1);
        System.out.println("Quick:    " + Arrays.toString(arr));

        arr = demo.clone();
        heapSort(arr);
        System.out.println("Heap:     " + Arrays.toString(arr));

        compareSortingAlgorithms();
    }
}
