package com.bank.algorithms;

import java.util.*;

/**
 * УРОК 26: Структуры данных — свои реализации
 *
 * Зачем знать внутреннее устройство?
 *   1. Интервью (обязательный вопрос!)
 *   2. Выбор правильной структуры для задачи
 *   3. Понимание сложности O(n) операций
 *
 * Реализовано:
 *   - Linked List (односвязный)
 *   - Stack на массиве
 *   - Queue (кольцевой буфер)
 *   - Binary Search Tree
 *
 * Запуск из Main: выбери пункт "14. Структуры данных"
 */
public class DataStructures {

    public static void run() {
        System.out.println("=== СТРУКТУРЫ ДАННЫХ ===\n");

        demoLinkedList();
        demoStack();
        demoQueue();
        demoBinarySearchTree();
        printTasks();
    }

    // ════════════════════════════════════════════════════════════
    // LINKED LIST — односвязный список
    // Сложность: добавление в начало O(1), поиск O(n), удаление O(n)
    // Используй когда: часто вставляешь/удаляешь в начало/конец
    // ════════════════════════════════════════════════════════════

    static class LinkedList<T> {
        private static class Node<T> {
            T data;
            Node<T> next;
            Node(T data) { this.data = data; }
        }

        private Node<T> head;
        private int size;

        public void addFirst(T value) {
            Node<T> newNode = new Node<>(value);
            newNode.next = head;
            head = newNode;
            size++;
        }

        public void addLast(T value) {
            Node<T> newNode = new Node<>(value);
            if (head == null) { head = newNode; size++; return; }
            Node<T> current = head;
            while (current.next != null) current = current.next;
            current.next = newNode;
            size++;
        }

        public T removeFirst() {
            if (head == null) throw new NoSuchElementException("Список пуст");
            T value = head.data;
            head = head.next;
            size--;
            return value;
        }

        public boolean contains(T value) {
            Node<T> current = head;
            while (current != null) {
                if (Objects.equals(current.data, value)) return true;
                current = current.next;
            }
            return false;
        }

        public void reverse() {
            Node<T> prev = null;
            Node<T> current = head;
            while (current != null) {
                Node<T> next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }
            head = prev;
        }

        public int size() { return size; }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder("[");
            Node<T> current = head;
            while (current != null) {
                sb.append(current.data);
                if (current.next != null) sb.append(" → ");
                current = current.next;
            }
            return sb.append("]").toString();
        }
    }

    private static void demoLinkedList() {
        System.out.println("--- LINKED LIST ---");
        LinkedList<String> history = new LinkedList<>();

        history.addLast("Пополнение 1000");
        history.addLast("Снятие 500");
        history.addFirst("Открытие счёта"); // добавить в начало O(1)
        history.addLast("Перевод 2000");

        System.out.println("История: " + history);
        System.out.println("Размер: " + history.size());
        System.out.println("Содержит 'Снятие 500': " + history.contains("Снятие 500"));

        history.reverse();
        System.out.println("После reverse: " + history);
        System.out.println("Удалить первый: " + history.removeFirst());
        System.out.println("После удаления: " + history);
        System.out.println();
    }

    // ════════════════════════════════════════════════════════════
    // STACK — стек (LIFO: Last In, First Out)
    // Применение: отмена операций (undo), проверка скобок, рекурсия
    // Сложность: push O(1), pop O(1), peek O(1)
    // ════════════════════════════════════════════════════════════

    static class Stack<T> {
        private final Object[] data;
        private int top = -1;
        private final int capacity;

        Stack(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
        }

        public void push(T value) {
            if (top == capacity - 1) throw new IllegalStateException("Стек переполнен");
            data[++top] = value;
        }

        @SuppressWarnings("unchecked")
        public T pop() {
            if (isEmpty()) throw new EmptyStackException();
            T value = (T) data[top];
            data[top--] = null; // помогаем GC
            return value;
        }

        @SuppressWarnings("unchecked")
        public T peek() {
            if (isEmpty()) throw new EmptyStackException();
            return (T) data[top];
        }

        public boolean isEmpty() { return top == -1; }
        public int size()        { return top + 1; }
    }

    private static void demoStack() {
        System.out.println("--- STACK (LIFO) ---");
        Stack<String> undoStack = new Stack<>(10);

        // Применяем операции
        undoStack.push("deposit(1000)");
        undoStack.push("withdraw(500)");
        undoStack.push("transfer(2000)");
        System.out.println("Стек операций: размер=" + undoStack.size());
        System.out.println("Последняя операция (peek): " + undoStack.peek());

        // Отмена операций (Ctrl+Z)
        System.out.print("Отмена: ");
        while (!undoStack.isEmpty()) System.out.print(undoStack.pop() + " | ");
        System.out.println();

        // Практическое применение: проверка сбалансированности скобок
        System.out.println("\nПроверка скобок:");
        String[] expressions = { "(a + (b * c))", "({[]})", "(((" , "([)]" };
        for (String expr : expressions) {
            System.out.println("  \"" + expr + "\" → " + (isBalanced(expr) ? "OK" : "ОШИБКА"));
        }
        System.out.println();
    }

    private static boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) return false;
            }
        }
        return stack.isEmpty();
    }

    // ════════════════════════════════════════════════════════════
    // QUEUE — очередь (FIFO: First In, First Out)
    // Кольцевой буфер: избегает сдвига элементов O(n)
    // Применение: очередь транзакций, обработка запросов
    // ════════════════════════════════════════════════════════════

    static class CircularQueue<T> {
        private final Object[] data;
        private int head = 0, tail = 0, size = 0;
        private final int capacity;

        CircularQueue(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
        }

        public void enqueue(T value) {
            if (size == capacity) throw new IllegalStateException("Очередь переполнена");
            data[tail] = value;
            tail = (tail + 1) % capacity; // кольцевой сдвиг
            size++;
        }

        @SuppressWarnings("unchecked")
        public T dequeue() {
            if (isEmpty()) throw new NoSuchElementException("Очередь пуста");
            T value = (T) data[head];
            data[head] = null;
            head = (head + 1) % capacity; // кольцевой сдвиг
            size--;
            return value;
        }

        @SuppressWarnings("unchecked")
        public T peek() {
            if (isEmpty()) throw new NoSuchElementException("Очередь пуста");
            return (T) data[head];
        }

        public boolean isEmpty() { return size == 0; }
        public int size()        { return size; }
    }

    private static void demoQueue() {
        System.out.println("--- QUEUE (FIFO) — Кольцевой буфер ---");
        CircularQueue<String> txQueue = new CircularQueue<>(5);

        txQueue.enqueue("TX-001: Пополнение 5000");
        txQueue.enqueue("TX-002: Перевод 1000");
        txQueue.enqueue("TX-003: Снятие 500");
        System.out.println("В очереди: " + txQueue.size());
        System.out.println("Следующая на обработку: " + txQueue.peek());

        System.out.print("Обработка: ");
        while (!txQueue.isEmpty()) System.out.print(txQueue.dequeue() + " | ");
        System.out.println();

        // Кольцевой буфер: после dequeue можно добавить ещё
        txQueue.enqueue("TX-004: Платёж 3000");
        txQueue.enqueue("TX-005: Платёж 7000");
        System.out.println("Добавлено ещё 2, размер: " + txQueue.size());
        System.out.println();
    }

    // ════════════════════════════════════════════════════════════
    // BINARY SEARCH TREE (BST)
    // Сложность (в среднем): поиск O(log n), вставка O(log n)
    // Сложность (худший): O(n) при несбалансированном дереве
    // ════════════════════════════════════════════════════════════

    static class BinarySearchTree {
        private static class Node {
            int value;
            Node left, right;
            Node(int value) { this.value = value; }
        }

        private Node root;

        public void insert(int value) {
            root = insertRec(root, value);
        }

        private Node insertRec(Node node, int value) {
            if (node == null) return new Node(value);
            if (value < node.value) node.left  = insertRec(node.left, value);
            else if (value > node.value) node.right = insertRec(node.right, value);
            return node;
        }

        public boolean search(int value) {
            Node current = root;
            while (current != null) {
                if (value == current.value) return true;
                current = value < current.value ? current.left : current.right;
            }
            return false;
        }

        // Inorder: левое поддерево → корень → правое = ОТСОРТИРОВАНО!
        public List<Integer> inorder() {
            List<Integer> result = new ArrayList<>();
            inorderRec(root, result);
            return result;
        }

        private void inorderRec(Node node, List<Integer> result) {
            if (node == null) return;
            inorderRec(node.left, result);
            result.add(node.value);
            inorderRec(node.right, result);
        }

        public int height() { return heightRec(root); }

        private int heightRec(Node node) {
            if (node == null) return 0;
            return 1 + Math.max(heightRec(node.left), heightRec(node.right));
        }
    }

    private static void demoBinarySearchTree() {
        System.out.println("--- BINARY SEARCH TREE ---");
        BinarySearchTree bst = new BinarySearchTree();

        int[] values = {50000, 30000, 80000, 20000, 40000, 70000, 90000};
        System.out.print("Вставляем балансы: ");
        for (int v : values) {
            bst.insert(v);
            System.out.print(v + " ");
        }
        System.out.println();
        System.out.println("Inorder (отсортировано): " + bst.inorder());
        System.out.println("Высота дерева: " + bst.height());
        System.out.println("Поиск 40000: " + bst.search(40000));
        System.out.println("Поиск 55000: " + bst.search(55000));
        System.out.println();
    }

    private static void printTasks() {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                     ТВОИ ЗАДАНИЯ                        ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ 1. Реализуй DoublyLinkedList (двусвязный список):       ║");
        System.out.println("║    - Каждый узел имеет ссылку и на prev, и на next      ║");
        System.out.println("║    - addFirst, addLast, removeFirst, removeLast         ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 2. Реализуй LRU Cache через DoublyLinkedList + HashMap: ║");
        System.out.println("║    - get(key): O(1)                                     ║");
        System.out.println("║    - put(key, value): O(1), вытесняет LRU при N > max  ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 3. Реализуй Min-Heap (минимальная куча):                ║");
        System.out.println("║    - insert(value)                                      ║");
        System.out.println("║    - extractMin() → всегда возвращает минимум           ║");
        System.out.println("║    - Подсказка: массив, parent=(i-1)/2, child=2i+1      ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 4. Реализуй HashMap своими руками:                      ║");
        System.out.println("║    - Массив из 16 связных списков (buckets)             ║");
        System.out.println("║    - put(key, value), get(key), remove(key)             ║");
        System.out.println("║    - Разрешение коллизий через chaining                 ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
