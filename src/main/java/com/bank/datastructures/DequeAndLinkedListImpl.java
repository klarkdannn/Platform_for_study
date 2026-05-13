package com.bank.datastructures;

import java.util.NoSuchElementException;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   ДЕК (DEQUE) + ДВУСВЯЗНЫЙ СПИСОК                       ║
 * ║   Double-Ended Queue и DoublyLinkedList                  ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ДЕК — структура данных, где добавление и удаление
 * доступно с ОБОИХ КОНЦОВ.
 *
 * ОПЕРАЦИИ:
 *   addFirst(x)   — добавить в начало    O(1)
 *   addLast(x)    — добавить в конец     O(1)
 *   removeFirst() — убрать из начала     O(1)
 *   removeLast()  — убрать из конца      O(1)
 *   peekFirst()   — посмотреть начало    O(1)
 *   peekLast()    — посмотреть конец     O(1)
 *
 * ДЕК = Стек + Очередь одновременно!
 *
 * ПРИМЕНЕНИЯ В БАНКЕ:
 *   1. Sliding window для анализа транзакций
 *   2. Очередь возврата (отмена последней ЛИБО первой операции)
 *   3. Кэш с вытеснением (LRU Cache)
 *   4. Буфер двустороннего обмена данными
 *   5. Алгоритм Monotonic Deque
 */
public class DequeAndLinkedListImpl {

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 1: Дек на ДВУСВЯЗНОМ СПИСКЕ
    // ═══════════════════════════════════════════════════

    public static class DoublyLinkedList<T> {
        public static class Node<T> {
            T value;
            Node<T> prev;
            Node<T> next;

            Node(T value) { this.value = value; }
        }

        private Node<T> head = null; // начало
        private Node<T> tail = null; // конец
        private int size = 0;

        // Добавить в НАЧАЛО — O(1)
        public void addFirst(T value) {
            Node<T> node = new Node<>(value);
            if (isEmpty()) {
                head = tail = node;
            } else {
                node.next = head;
                head.prev = node;
                head = node;
            }
            size++;
        }

        // Добавить в КОНЕЦ — O(1)
        public void addLast(T value) {
            Node<T> node = new Node<>(value);
            if (isEmpty()) {
                head = tail = node;
            } else {
                tail.next = node;
                node.prev = tail;
                tail = node;
            }
            size++;
        }

        // Убрать из НАЧАЛА — O(1)
        public T removeFirst() {
            if (isEmpty()) throw new NoSuchElementException();
            T value = head.value;
            head = head.next;
            if (head != null) head.prev = null;
            else              tail = null;
            size--;
            return value;
        }

        // Убрать из КОНЦА — O(1)
        public T removeLast() {
            if (isEmpty()) throw new NoSuchElementException();
            T value = tail.value;
            tail = tail.prev;
            if (tail != null) tail.next = null;
            else              head = null;
            size--;
            return value;
        }

        // Добавить после указанного узла — O(1)
        public void addAfter(Node<T> node, T value) {
            if (node == tail) { addLast(value); return; }
            Node<T> newNode = new Node<>(value);
            newNode.next = node.next;
            newNode.prev = node;
            if (node.next != null) node.next.prev = newNode;
            node.next = newNode;
            size++;
        }

        // Удалить конкретный узел — O(1)
        public void remove(Node<T> node) {
            if (node.prev != null) node.prev.next = node.next;
            else head = node.next; // удаляем голову
            if (node.next != null) node.next.prev = node.prev;
            else tail = node.prev; // удаляем хвост
            size--;
        }

        // Найти по значению — O(n)
        public Node<T> find(T value) {
            Node<T> curr = head;
            while (curr != null) {
                if (curr.value.equals(value)) return curr;
                curr = curr.next;
            }
            return null;
        }

        public T peekFirst()     { if (isEmpty()) throw new NoSuchElementException(); return head.value; }
        public T peekLast()      { if (isEmpty()) throw new NoSuchElementException(); return tail.value; }
        public boolean isEmpty() { return size == 0; }
        public int size()        { return size; }
        public Node<T> getHead() { return head; }
        public Node<T> getTail() { return tail; }

        public String toForwardString() {
            StringBuilder sb = new StringBuilder("[");
            Node<T> curr = head;
            while (curr != null) {
                sb.append(curr.value);
                if (curr.next != null) sb.append(" ↔ ");
                curr = curr.next;
            }
            return sb.append("]").toString();
        }

        public String toBackwardString() {
            StringBuilder sb = new StringBuilder("[");
            Node<T> curr = tail;
            while (curr != null) {
                sb.append(curr.value);
                if (curr.prev != null) sb.append(" ↔ ");
                curr = curr.prev;
            }
            return sb.append("] (обратно)").toString();
        }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 2: Дек как обёртка над DoublyLinkedList
    // ═══════════════════════════════════════════════════

    public static class Deque<T> {
        private final DoublyLinkedList<T> list = new DoublyLinkedList<>();

        // Операции стека
        public void push(T value)  { list.addFirst(value); }
        public T pop()             { return list.removeFirst(); }

        // Операции очереди
        public void enqueue(T value) { list.addLast(value); }
        public T dequeue()           { return list.removeFirst(); }

        // Дек-специфичные
        public void   addFirst(T value)  { list.addFirst(value); }
        public void   addLast(T value)   { list.addLast(value); }
        public T      removeFirst()      { return list.removeFirst(); }
        public T      removeLast()       { return list.removeLast(); }
        public T      peekFirst()        { return list.peekFirst(); }
        public T      peekLast()         { return list.peekLast(); }
        public boolean isEmpty()         { return list.isEmpty(); }
        public int    size()             { return list.size(); }

        @Override
        public String toString() { return "Deque" + list.toForwardString(); }
    }

    // ═══════════════════════════════════════════════════
    // ПРАКТИКА: LRU Cache (Least Recently Used)
    // ═══════════════════════════════════════════════════
    // БАНК: Кэш последних N запрошенных балансов счетов.
    // При переполнении вытесняем ДАВНО НЕ ИСПОЛЬЗОВАННЫЕ.
    //
    // Реализация: HashMap + DoublyLinkedList
    // get(key) → O(1), put(key) → O(1)

    public static class LRUCache {
        private final int capacity;
        private final java.util.HashMap<String, DoublyLinkedList.Node<String[]>> map;
        private final DoublyLinkedList<String[]> list; // String[] = {key, value}

        public LRUCache(int capacity) {
            this.capacity = capacity;
            this.map = new java.util.HashMap<>();
            this.list = new DoublyLinkedList<>();
        }

        public String get(String key) {
            if (!map.containsKey(key)) return null;
            DoublyLinkedList.Node<String[]> node = map.get(key);
            moveToFront(node); // используем — перемещаем в начало
            return node.value[1];
        }

        public void put(String key, String value) {
            if (map.containsKey(key)) {
                DoublyLinkedList.Node<String[]> node = map.get(key);
                node.value[1] = value;
                moveToFront(node);
            } else {
                if (map.size() == capacity) {
                    // вытесняем последний (давно не используемый)
                    DoublyLinkedList.Node<String[]> lru = list.getTail();
                    if (lru != null) {
                        map.remove(lru.value[0]);
                        list.removeLast();
                    }
                }
                list.addFirst(new String[]{key, value});
                map.put(key, list.getHead());
            }
        }

        private void moveToFront(DoublyLinkedList.Node<String[]> node) {
            list.remove(node);
            list.addFirst(node.value);
            map.put(node.value[0], list.getHead());
        }

        public void printCache() {
            System.out.print("LRU Cache (MRU→LRU): ");
            DoublyLinkedList.Node<String[]> curr = list.getHead();
            while (curr != null) {
                System.out.print("[" + curr.value[0] + "=" + curr.value[1] + "]");
                if (curr.next != null) System.out.print("→");
                curr = curr.next;
            }
            System.out.println();
        }
    }

    // ═══════════════════════════════════════════════════
    // ПРАКТИКА: Sliding Window Maximum — Monotonic Deque O(n)
    // ═══════════════════════════════════════════════════
    // Найти максимум в каждом скользящем окне размером k.
    // Наивно O(n*k), с деком O(n).
    // БАНК: Максимальная транзакция за последние k дней.

    public static int[] slidingWindowMax(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        java.util.Deque<Integer> deque = new java.util.ArrayDeque<>(); // храним индексы

        for (int i = 0; i < n; i++) {
            // убираем из начала устаревшие индексы (вышли из окна)
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            // убираем с конца всё меньше текущего элемента
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            deque.addLast(i);
            // когда окно сформировано
            if (i >= k - 1) result[i - k + 1] = nums[deque.peekFirst()];
        }
        return result; // O(n)
    }

    // ════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Реализуй reverseLinkedList(DoublyLinkedList<T>):
    //    Поменяй prev и next у всех узлов.
    //    Нет нужды создавать новый список.
    //    Банк: Вывод истории транзакций в обратном порядке.
    //
    // 2. Реализуй LFU Cache (Least Frequently Used):
    //    Аналогично LRU, но вытесняем РЕЖЕ ВСЕГО используемый.
    //    Если у нескольких одинаковая частота — LRU среди них.
    //    Сложность: O(1) на get/put.
    //    Это сложнее LRU — популярная задача с собеседований!
    //
    // 3. Реализуй mergeKSortedLists:
    //    Есть K отсортированных связных списков.
    //    Слей их в один отсортированный.
    //    Используй PriorityQueue — O(n log k).
    //    Банк: Слить К потоков транзакций по дате.
    // ════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== ДЕК И ДВУСВЯЗНЫЙ СПИСОК ===\n");

        System.out.println("── DoublyLinkedList ──");
        DoublyLinkedList<String> dll = new DoublyLinkedList<>();
        dll.addLast("Транзакция 1");
        dll.addLast("Транзакция 2");
        dll.addFirst("Транзакция 0 (вставлена в начало)");
        dll.addLast("Транзакция 3");
        System.out.println("Вперёд: " + dll.toForwardString());
        System.out.println("Назад:  " + dll.toBackwardString());
        System.out.println("Размер: " + dll.size());
        dll.removeFirst();
        dll.removeLast();
        System.out.println("После removeFirst/removeLast: " + dll.toForwardString());

        System.out.println("\n── Дек как стек+очередь ──");
        Deque<Integer> deque = new Deque<>();
        deque.addFirst(1);
        deque.addLast(2);
        deque.addFirst(0);
        deque.addLast(3);
        System.out.println(deque);
        System.out.println("removeFirst: " + deque.removeFirst());
        System.out.println("removeLast:  " + deque.removeLast());
        System.out.println(deque);

        System.out.println("\n── LRU Cache (ёмкость 3) ──");
        LRUCache cache = new LRUCache(3);
        cache.put("ACC-001", "50000");
        cache.put("ACC-002", "123000");
        cache.put("ACC-003", "8000");
        cache.printCache();
        System.out.println("Обращаемся к ACC-001: " + cache.get("ACC-001"));
        cache.put("ACC-004", "999"); // вытеснит ACC-002 (LRU)
        cache.printCache();

        System.out.println("\n── Sliding Window Maximum (k=3) ──");
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        System.out.println("Массив: " + java.util.Arrays.toString(nums));
        System.out.println("Max k=3: " + java.util.Arrays.toString(slidingWindowMax(nums, 3)));
        System.out.println("Ожидается: [3, 3, 5, 5, 6, 7]");
    }
}
