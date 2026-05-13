package com.bank.datastructures;

import java.util.NoSuchElementException;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   ОЧЕРЕДЬ (QUEUE) — три реализации                      ║
 * ║   Кольцевой массив, связный список, две стека            ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ОЧЕРЕДЬ — структура данных "Первый вошёл — первый вышел"
 * FIFO: First In, First Out
 *
 * Как очередь в банке: первый пришёл — первый обслужился.
 *
 * ОПЕРАЦИИ:
 *   enqueue(x)  — добавить в конец    O(1)
 *   dequeue()   — убрать из начала    O(1)
 *   peek()      — посмотреть начало   O(1)
 *   isEmpty()   — очередь пуста?      O(1)
 *   size()      — размер              O(1)
 *
 * ПРИМЕНЕНИЯ В БАНКЕ:
 *   1. Очередь клиентов в отделении
 *   2. Обработка платёжных запросов (FIFO — в порядке поступления)
 *   3. Очередь сообщений (Kafka/RabbitMQ — это очереди!)
 *   4. BFS в графе транзакций
 *   5. Буфер для пакетной обработки транзакций
 *   6. Rate limiter (сколько запросов в секунду)
 */
public class QueueImpl {

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 1: Кольцевой буфер (Circular Array Queue)
    // ═══════════════════════════════════════════════════
    // Плюсы: O(1) все операции, фиксированная память
    // Минусы: максимальный размер известен заранее
    //
    // ИДЕЯ: head и tail "ходят по кругу" в массиве.
    // head → где брать (dequeue)
    // tail → куда класть (enqueue)

    public static class CircularQueue<T> {
        private final Object[] data;
        private int head = 0; // индекс первого элемента
        private int tail = 0; // индекс следующей свободной ячейки
        private int size = 0;
        private final int capacity;

        public CircularQueue(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
        }

        public void enqueue(T value) {
            if (size == capacity) throw new IllegalStateException("Очередь заполнена");
            data[tail] = value;
            tail = (tail + 1) % capacity; // переход по кругу
            size++;
        }

        @SuppressWarnings("unchecked")
        public T dequeue() {
            if (isEmpty()) throw new NoSuchElementException("Очередь пуста");
            T value = (T) data[head];
            data[head] = null; // GC
            head = (head + 1) % capacity; // переход по кругу
            size--;
            return value;
        }

        @SuppressWarnings("unchecked")
        public T peek() {
            if (isEmpty()) throw new NoSuchElementException();
            return (T) data[head];
        }

        public boolean isEmpty() { return size == 0; }
        public boolean isFull()  { return size == capacity; }
        public int size()        { return size; }

        @Override
        public String toString() {
            if (isEmpty()) return "Queue[]";
            StringBuilder sb = new StringBuilder("Queue[front→");
            int idx = head;
            for (int i = 0; i < size; i++) {
                sb.append(data[idx]);
                if (i < size - 1) sb.append(", ");
                idx = (idx + 1) % capacity;
            }
            return sb.append("←back]").toString();
        }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 2: Связный список (Linked Queue)
    // ═══════════════════════════════════════════════════
    // Плюсы: динамический размер, O(1) операции
    // Минусы: оверхед на узлы (Node объекты)

    public static class LinkedQueue<T> {
        private static class Node<T> {
            T value;
            Node<T> next;
            Node(T value) { this.value = value; }
        }

        private Node<T> head = null; // откуда берём
        private Node<T> tail = null; // куда кладём
        private int size = 0;

        public void enqueue(T value) {
            Node<T> node = new Node<>(value);
            if (tail != null) tail.next = node;
            tail = node;
            if (head == null) head = node;
            size++;
        }

        public T dequeue() {
            if (isEmpty()) throw new NoSuchElementException();
            T value = head.value;
            head = head.next;
            if (head == null) tail = null; // очередь опустела
            size--;
            return value;
        }

        public T peek()      { if (isEmpty()) throw new NoSuchElementException(); return head.value; }
        public boolean isEmpty() { return head == null; }
        public int size()    { return size; }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder("Queue[front→");
            Node<T> curr = head;
            while (curr != null) {
                sb.append(curr.value);
                if (curr.next != null) sb.append(", ");
                curr = curr.next;
            }
            return sb.append("←back]").toString();
        }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 3: Очередь из ДВУХ СТЕКОВ
    // ═══════════════════════════════════════════════════
    // Интересный трюк! Amortized O(1) на операцию.
    // Используется в функциональных языках.
    //
    // inStack  — принимает новые элементы
    // outStack — отдаёт элементы
    // Когда outStack пустой — переносим все из inStack.

    public static class TwoStackQueue<T> {
        private final java.util.Deque<T> inStack  = new java.util.ArrayDeque<>();
        private final java.util.Deque<T> outStack = new java.util.ArrayDeque<>();

        public void enqueue(T value) {
            inStack.push(value); // всегда в inStack
        }

        public T dequeue() {
            if (outStack.isEmpty()) {
                // перекладываем все из inStack в outStack (разворачиваем порядок)
                while (!inStack.isEmpty()) outStack.push(inStack.pop());
            }
            if (outStack.isEmpty()) throw new NoSuchElementException();
            return outStack.pop();
        }

        public T peek() {
            if (outStack.isEmpty()) {
                while (!inStack.isEmpty()) outStack.push(inStack.pop());
            }
            return outStack.peek();
        }

        public boolean isEmpty() { return inStack.isEmpty() && outStack.isEmpty(); }
        public int size()        { return inStack.size() + outStack.size(); }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 4: Приоритетная очередь (Min-Heap based)
    // ═══════════════════════════════════════════════════
    // Обрабатываем не по порядку, а по ПРИОРИТЕТУ.
    // БАНК: VIP клиент обслуживается быстрее.

    public static class PriorityBankQueue {
        record Client(String name, int priority) implements Comparable<Client> {
            @Override
            public int compareTo(Client other) {
                return Integer.compare(this.priority, other.priority); // меньше = важнее
            }
        }

        private final java.util.PriorityQueue<Client> pq = new java.util.PriorityQueue<>();

        public void addClient(String name, int priority) {
            pq.offer(new Client(name, priority));
        }

        public String serveNext() {
            if (pq.isEmpty()) return "Очередь пуста";
            Client c = pq.poll();
            return "Обслуживаем: " + c.name() + " (приоритет: " + c.priority() + ")";
        }

        public int size() { return pq.size(); }
    }

    // ═══════════════════════════════════════════════════
    // ПРАКТИКА: Rate Limiter на основе очереди
    // ═══════════════════════════════════════════════════
    // Банк: не более N запросов в секунду с одного IP.
    // Алгоритм скользящего окна (Sliding Window).

    public static class RateLimiter {
        private final java.util.Deque<Long> timestamps = new java.util.ArrayDeque<>();
        private final int maxRequests;
        private final long windowMs;

        public RateLimiter(int maxRequests, long windowMs) {
            this.maxRequests = maxRequests;
            this.windowMs = windowMs;
        }

        public boolean allowRequest() {
            long now = System.currentTimeMillis();
            long cutoff = now - windowMs;

            // удаляем устаревшие запросы
            while (!timestamps.isEmpty() && timestamps.peekFirst() < cutoff) {
                timestamps.pollFirst();
            }

            if (timestamps.size() < maxRequests) {
                timestamps.addLast(now);
                return true; // разрешаем
            }
            return false; // лимит превышен
        }
    }

    // ════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши BankServiceQueue:
    //    - Клиенты получают талончик с номером
    //    - addClient(name, isVIP)
    //    - VIP клиенты обслуживаются первыми
    //    - serveNext() — кого обслуживаем?
    //    - getCurrentWait() — сколько человек впереди?
    //    Используй приоритетную очередь.
    //
    // 2. Напиши BFS для банковского графа:
    //    Используй свою LinkedQueue вместо java.util.LinkedList.
    //    Найди минимальное число "прыжков" между счетами.
    //
    // 3. Реализуй BlockingQueue (упрощённую):
    //    - put(T item) — если полная, блокируемся (wait)
    //    - take() — если пустая, блокируемся (wait)
    //    Это основа для многопоточности в банке!
    //    Используй synchronized + wait/notifyAll.
    // ════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== ОЧЕРЕДЬ (QUEUE) ===\n");

        // Кольцевая
        System.out.println("── CircularQueue (Кольцевой буфер) ──");
        CircularQueue<String> cq = new CircularQueue<>(5);
        cq.enqueue("Клиент Иван");
        cq.enqueue("Клиент Мария");
        cq.enqueue("Клиент Пётр");
        System.out.println(cq);
        System.out.println("Dequeue: " + cq.dequeue());
        cq.enqueue("Клиент Анна");
        System.out.println(cq);

        // Связная
        System.out.println("\n── LinkedQueue ──");
        LinkedQueue<Integer> lq = new LinkedQueue<>();
        for (int i = 1; i <= 5; i++) lq.enqueue(i * 100);
        System.out.println(lq);
        System.out.println("Dequeue: " + lq.dequeue() + ", " + lq.dequeue());
        System.out.println(lq);

        // Приоритетная
        System.out.println("\n── PriorityQueue (банк — VIP первыми) ──");
        PriorityBankQueue pbq = new PriorityBankQueue();
        pbq.addClient("Обычный клиент Вася",   3);
        pbq.addClient("VIP клиент Лукашенко",  1); // приоритет 1 = самый важный
        pbq.addClient("Обычный клиент Петя",   3);
        pbq.addClient("Premium клиент Иванов", 2);
        while (pbq.size() > 0) System.out.println("  " + pbq.serveNext());

        // Rate Limiter
        System.out.println("\n── Rate Limiter (3 запроса в 100мс) ──");
        RateLimiter rl = new RateLimiter(3, 100);
        for (int i = 1; i <= 5; i++) {
            System.out.printf("  Запрос %d: %s%n", i, rl.allowRequest() ? "✓ РАЗРЕШЁН" : "✗ БЛОКИРОВАН");
        }
    }
}
