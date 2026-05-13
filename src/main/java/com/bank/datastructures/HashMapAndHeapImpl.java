package com.bank.datastructures;

import java.util.Arrays;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   HASHMAP + HEAP — своя реализация                      ║
 * ║   Хэш-таблица с цепочками + Минимальная куча            ║
 * ╚══════════════════════════════════════════════════════════╝
 */
public class HashMapAndHeapImpl {

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ: HashMap (хэш-таблица с цепочками)
    // ═══════════════════════════════════════════════════
    //
    // КАК РАБОТАЕТ HashMap:
    // 1. Вычисляем hashCode ключа
    // 2. hash % capacity → индекс в массиве (бакет)
    // 3. В бакете — связный список пар {key, value}
    //    (разрешение коллизий методом цепочек)
    //
    // СЛОЖНОСТЬ:
    //   get, put, remove — O(1) среднее, O(n) худший (все в одном бакете)
    //   При load factor > 0.75 → resize (удваиваем и перехэшируем)
    //
    // БАНК: Кэш баланса счетов. ID счёта → баланс.
    //   100 000 счетов → мгновенный доступ к любому.

    public static class SimpleHashMap<K, V> {
        private static final int DEFAULT_CAPACITY = 16;
        private static final double LOAD_FACTOR = 0.75;

        private static class Entry<K, V> {
            K key;
            V value;
            Entry<K, V> next; // для разрешения коллизий (цепочка)

            Entry(K key, V value) {
                this.key = key;
                this.value = value;
            }
        }

        @SuppressWarnings("unchecked")
        private Entry<K, V>[] buckets = new Entry[DEFAULT_CAPACITY];
        private int size = 0;
        private int capacity = DEFAULT_CAPACITY;

        // Вычисляем индекс бакета
        private int getBucket(K key) {
            return Math.abs(key.hashCode()) % capacity;
        }

        // put(key, value) — O(1) среднее
        public void put(K key, V value) {
            if ((double) size / capacity > LOAD_FACTOR) {
                resize(); // расширяем при переполнении
            }
            int idx = getBucket(key);
            Entry<K, V> curr = buckets[idx];

            // ищем существующий ключ в цепочке
            while (curr != null) {
                if (curr.key.equals(key)) {
                    curr.value = value; // обновляем существующий
                    return;
                }
                curr = curr.next;
            }

            // добавляем новый узел в начало цепочки
            Entry<K, V> newEntry = new Entry<>(key, value);
            newEntry.next = buckets[idx];
            buckets[idx] = newEntry;
            size++;
        }

        // get(key) — O(1) среднее
        public V get(K key) {
            int idx = getBucket(key);
            Entry<K, V> curr = buckets[idx];
            while (curr != null) {
                if (curr.key.equals(key)) return curr.value;
                curr = curr.next;
            }
            return null; // не найдено
        }

        // remove(key) — O(1) среднее
        public boolean remove(K key) {
            int idx = getBucket(key);
            Entry<K, V> curr = buckets[idx], prev = null;
            while (curr != null) {
                if (curr.key.equals(key)) {
                    if (prev == null) buckets[idx] = curr.next;
                    else              prev.next = curr.next;
                    size--;
                    return true;
                }
                prev = curr;
                curr = curr.next;
            }
            return false;
        }

        public boolean containsKey(K key) { return get(key) != null; }
        public int size()                  { return size; }
        public boolean isEmpty()           { return size == 0; }

        // Расширение при достижении load factor
        @SuppressWarnings("unchecked")
        private void resize() {
            int newCapacity = capacity * 2;
            Entry<K, V>[] newBuckets = new Entry[newCapacity];

            for (Entry<K, V> head : buckets) {
                Entry<K, V> curr = head;
                while (curr != null) {
                    Entry<K, V> next = curr.next;
                    int newIdx = Math.abs(curr.key.hashCode()) % newCapacity;
                    curr.next = newBuckets[newIdx];
                    newBuckets[newIdx] = curr;
                    curr = next;
                }
            }
            buckets = newBuckets;
            capacity = newCapacity;
            System.out.printf("  [HashMap] Resize: %d → %d (load factor exceeded 0.75)%n",
                    capacity / 2, capacity);
        }

        // Показать заполненность бакетов
        public void showStats() {
            int usedBuckets = 0;
            int maxChain = 0;
            for (Entry<K, V> bucket : buckets) {
                if (bucket != null) {
                    usedBuckets++;
                    int chainLen = 0;
                    Entry<K, V> curr = bucket;
                    while (curr != null) { chainLen++; curr = curr.next; }
                    maxChain = Math.max(maxChain, chainLen);
                }
            }
            System.out.printf("HashMap: size=%d, capacity=%d, buckets used=%d/%d, max chain=%d%n",
                    size, capacity, usedBuckets, capacity, maxChain);
        }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ: MinHeap (Минимальная куча)
    // ═══════════════════════════════════════════════════
    //
    // КАК РАБОТАЕТ КУЧА:
    // Полное двоичное дерево, хранящееся в массиве.
    // Родитель МЕНЬШЕ обоих детей (для MinHeap).
    //
    // Индексы:
    //   parent(i)      = (i - 1) / 2
    //   leftChild(i)   = 2 * i + 1
    //   rightChild(i)  = 2 * i + 2
    //
    // СЛОЖНОСТЬ:
    //   insert(x)    — O(log n)
    //   extractMin() — O(log n)
    //   getMin()     — O(1) — всегда корень!
    //   buildHeap(n) — O(n) — не O(n log n)!
    //
    // БАНК: Очередь заявок на кредит по приоритету.
    //   Наименьшая задержка → обрабатывается первой.
    //   Dijkstra использует MinHeap для ближайшей вершины.

    public static class MinHeap {
        private int[] data;
        private int size;
        private int capacity;

        public MinHeap(int capacity) {
            this.capacity = capacity;
            this.data = new int[capacity];
        }

        // Вспомогательные индексы
        private int parent(int i)     { return (i - 1) / 2; }
        private int leftChild(int i)  { return 2 * i + 1; }
        private int rightChild(int i) { return 2 * i + 2; }

        private void swap(int i, int j) {
            int tmp = data[i]; data[i] = data[j]; data[j] = tmp;
        }

        // Добавить элемент — O(log n)
        public void insert(int value) {
            if (size == capacity) {
                capacity *= 2;
                data = Arrays.copyOf(data, capacity);
            }
            data[size] = value;
            siftUp(size);
            size++;
        }

        // "Всплытие" — восстанавливаем свойство кучи снизу вверх
        private void siftUp(int i) {
            while (i > 0 && data[parent(i)] > data[i]) {
                swap(i, parent(i));
                i = parent(i);
            }
        }

        // Извлечь минимум — O(log n)
        public int extractMin() {
            if (size == 0) throw new java.util.NoSuchElementException();
            int min = data[0];
            data[0] = data[--size]; // ставим последний на место корня
            siftDown(0); // "тонем" вниз
            return min;
        }

        // "Погружение" — восстанавливаем свойство кучи сверху вниз
        private void siftDown(int i) {
            int smallest = i;
            int left = leftChild(i), right = rightChild(i);
            if (left < size && data[left] < data[smallest]) smallest = left;
            if (right < size && data[right] < data[smallest]) smallest = right;
            if (smallest != i) {
                swap(i, smallest);
                siftDown(smallest);
            }
        }

        public int getMin()    { if (size == 0) throw new java.util.NoSuchElementException(); return data[0]; }
        public boolean isEmpty() { return size == 0; }
        public int size()        { return size; }

        // Построить кучу из массива — O(n) (Floyd's algorithm)
        public static MinHeap buildHeap(int[] arr) {
            MinHeap h = new MinHeap(arr.length);
            h.data = Arrays.copyOf(arr, arr.length);
            h.size = arr.length;
            // начинаем с последнего нелистового узла
            for (int i = h.size / 2 - 1; i >= 0; i--) h.siftDown(i);
            return h;
        }

        // Heap Sort использует MaxHeap — для демонстрации
        public static int[] heapSort(int[] arr) {
            // Строим MaxHeap (инвертируем порядок сравнения)
            int n = arr.length;
            int[] a = Arrays.copyOf(arr, n);
            // build max-heap
            for (int i = n/2-1; i >= 0; i--) maxHeapify(a, n, i);
            // извлекаем максимумы
            for (int i = n-1; i > 0; i--) {
                int tmp = a[0]; a[0] = a[i]; a[i] = tmp;
                maxHeapify(a, i, 0);
            }
            return a;
        }
        private static void maxHeapify(int[] a, int n, int i) {
            int largest = i, l = 2*i+1, r = 2*i+2;
            if (l < n && a[l] > a[largest]) largest = l;
            if (r < n && a[r] > a[largest]) largest = r;
            if (largest != i) { int t = a[i]; a[i] = a[largest]; a[largest] = t; maxHeapify(a, n, largest); }
        }

        public String toArrayString() {
            return "Heap" + Arrays.toString(Arrays.copyOf(data, size));
        }
    }

    // ════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Реализуй LinkedHashMap:
    //    Сочетание HashMap и DoublyLinkedList.
    //    Обычный HashMap не помнит порядок вставки.
    //    LinkedHashMap помнит!
    //    put/get O(1), итерация в порядке вставки O(n).
    //    Это реальный java.util.LinkedHashMap — сделай свой!
    //
    // 2. Реализуй MaxHeap:
    //    Измени компаратор: parent > children.
    //    Банк: Топ-N самых крупных транзакций за день.
    //
    // 3. Задача K-th Largest Element:
    //    Найди k-й наибольший элемент в массиве за O(n log k).
    //    Используй MinHeap размером k.
    //    Банк: Топ-100 клиентов по обороту из 10 миллионов.
    //
    // 4. Реализуй TreeMap (красно-чёрное дерево схематично):
    //    Или хотя бы BST с балансировкой (AVL дерево).
    //    O(log n) для всех операций + итерация в порядке.
    //    Банк: Диапазонные запросы по дате/сумме.
    // ════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== HASHMAP + HEAP ===\n");

        System.out.println("── SimpleHashMap ──");
        SimpleHashMap<String, Double> balances = new SimpleHashMap<>();
        balances.put("ACC-001", 50_000.0);
        balances.put("ACC-002", 123_456.78);
        balances.put("ACC-003", 8_000.0);
        balances.put("ACC-004", 1_000_000.0);
        System.out.println("Баланс ACC-002: " + balances.get("ACC-002"));
        balances.put("ACC-002", 125_000.0); // обновляем
        System.out.println("Новый баланс ACC-002: " + balances.get("ACC-002"));
        balances.remove("ACC-003");
        System.out.println("ACC-003 удалён. Содержит? " + balances.containsKey("ACC-003"));
        balances.showStats();

        System.out.println("\n── MinHeap ──");
        MinHeap heap = new MinHeap(10);
        int[] amounts = {500, 200, 800, 100, 600, 300};
        System.out.print("Вставляем: ");
        for (int x : amounts) { System.out.print(x + " "); heap.insert(x); }
        System.out.println("\n" + heap.toArrayString());
        System.out.println("Минимум: " + heap.getMin());
        System.out.print("ExtractMin по очереди: ");
        while (!heap.isEmpty()) System.out.print(heap.extractMin() + " ");
        System.out.println("← отсортировано!");

        System.out.println("\n── BuildHeap O(n) ──");
        MinHeap h2 = MinHeap.buildHeap(new int[]{9, 3, 7, 1, 5, 8, 2});
        System.out.println(h2.toArrayString());
        System.out.println("Минимум: " + h2.getMin());

        System.out.println("\n── HeapSort ──");
        int[] arr = {64, 25, 12, 22, 11, 90, 43, 7};
        System.out.println("Исходный: " + Arrays.toString(arr));
        System.out.println("HeapSort: " + Arrays.toString(MinHeap.heapSort(arr)));
    }
}
