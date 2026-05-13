package com.bank.datastructures;

import java.util.EmptyStackException;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   СТЕК (STACK) — две реализации                         ║
 * ║   На массиве и на связном списке                         ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * СТЕК — структура данных "Последний вошёл — первый вышел"
 * LIFO: Last In, First Out
 *
 * Как стопка тарелок: добавляешь сверху, берёшь сверху.
 *
 * ОПЕРАЦИИ:
 *   push(x)   — добавить на верх     O(1)
 *   pop()     — убрать с верха       O(1)
 *   peek()    — посмотреть на верх   O(1)
 *   isEmpty() — стек пуст?           O(1)
 *   size()    — размер               O(1)
 *
 * ПРИМЕНЕНИЯ В БАНКЕ:
 *   1. История навигации (назад в мобильном приложении)
 *   2. Отмена операций (Ctrl+Z)
 *   3. Стек вызовов при обработке транзакций
 *   4. Скобочные выражения в SQL запросах
 *   5. DFS в графе транзакций
 *   6. Вычисление выражений (кредитный калькулятор)
 *
 * КОГДА ВЫБИРАТЬ СТЕК VS ОЧЕРЕДЬ:
 *   Стек — когда нужно "откатить" (последнее действие)
 *   Очередь — когда нужно обработать "по порядку"
 */
public class StackImpl {

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 1: Стек на МАССИВЕ
    // ═══════════════════════════════════════════════════
    // Плюсы: O(1) все операции, кэш-дружественный, нет оверхеда объектов
    // Минусы: фиксированный или растущий размер

    public static class ArrayStack<T> {
        private Object[] data;
        private int top = -1;
        private int capacity;

        @SuppressWarnings("unchecked")
        public ArrayStack(int capacity) {
            this.capacity = capacity;
            this.data = new Object[capacity];
        }

        public void push(T value) {
            if (top == capacity - 1) {
                resize(); // автоматическое расширение как в ArrayList
            }
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

        private void resize() {
            capacity *= 2;
            Object[] newData = new Object[capacity];
            System.arraycopy(data, 0, newData, 0, data.length);
            data = newData;
        }

        @Override
        public String toString() {
            if (isEmpty()) return "Stack[]";
            StringBuilder sb = new StringBuilder("Stack[");
            for (int i = top; i >= 0; i--) {
                sb.append(data[i]);
                if (i > 0) sb.append(", ");
            }
            return sb.append("] ← top").toString();
        }
    }

    // ═══════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ 2: Стек на СВЯЗНОМ СПИСКЕ
    // ═══════════════════════════════════════════════════
    // Плюсы: динамический размер, O(1) все операции
    // Минусы: дополнительная память на указатели (next)

    public static class LinkedStack<T> {
        private static class Node<T> {
            T value;
            Node<T> next;
            Node(T value, Node<T> next) {
                this.value = value;
                this.next = next;
            }
        }

        private Node<T> top = null;
        private int size = 0;

        public void push(T value) {
            top = new Node<>(value, top); // новый узел указывает на старый top
            size++;
        }

        public T pop() {
            if (isEmpty()) throw new EmptyStackException();
            T value = top.value;
            top = top.next; // top перемещается вниз
            size--;
            return value;
        }

        public T peek() {
            if (isEmpty()) throw new EmptyStackException();
            return top.value;
        }

        public boolean isEmpty() { return top == null; }
        public int size()        { return size; }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder("Stack[");
            Node<T> curr = top;
            while (curr != null) {
                sb.append(curr.value);
                if (curr.next != null) sb.append(", ");
                curr = curr.next;
            }
            return sb.append("] ← top").toString();
        }
    }

    // ═══════════════════════════════════════════════════
    // ПРАКТИЧЕСКИЕ ЗАДАЧИ СО СТЕКОМ
    // ═══════════════════════════════════════════════════

    // Задача 1: Проверка правильности скобок — O(n)
    // "([]{})" → true    "([)]" → false
    // БАНК: Проверка синтаксиса SQL запросов

    public static boolean isValidBrackets(String s) {
        ArrayStack<Character> stack = new ArrayStack<>(s.length());
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if (c == ')' && open != '(') return false;
                if (c == ']' && open != '[') return false;
                if (c == '}' && open != '{') return false;
            }
        }
        return stack.isEmpty();
    }

    // Задача 2: Обратная польская запись (RPN) — вычисление выражений
    // "3 4 + 2 * 7 /" → (3+4)*2/7 = 2
    // БАНК: Кредитный калькулятор, вычисление формул риска

    public static double evalRPN(String[] tokens) {
        ArrayStack<Double> stack = new ArrayStack<>(tokens.length);
        for (String token : tokens) {
            switch (token) {
                case "+" -> stack.push(stack.pop() + stack.pop());
                case "*" -> stack.push(stack.pop() * stack.pop());
                case "-" -> {
                    double b = stack.pop(), a = stack.pop();
                    stack.push(a - b);
                }
                case "/" -> {
                    double b = stack.pop(), a = stack.pop();
                    stack.push(a / b);
                }
                default  -> stack.push(Double.parseDouble(token));
            }
        }
        return stack.pop();
    }

    // Задача 3: Следующий больший элемент — Monotonic Stack O(n)
    // [2, 1, 2, 4, 3] → [4, 2, 4, -1, -1]
    // БАНК: Для каждой транзакции — когда следующий раз сумма была больше?

    public static int[] nextGreaterElement(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        java.util.Arrays.fill(result, -1);
        ArrayStack<Integer> stack = new ArrayStack<>(n); // храним индексы

        for (int i = 0; i < n; i++) {
            // пока стек не пуст и текущий элемент больше верхушки стека
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return result;
    }

    // Задача 4: Стек с поддержкой getMin() за O(1) — MinStack
    // Используем вспомогательный стек минимумов

    public static class MinStack {
        private final ArrayStack<Integer> main   = new ArrayStack<>(100);
        private final ArrayStack<Integer> minSt  = new ArrayStack<>(100);

        public void push(int val) {
            main.push(val);
            // в minStack храним минимум на текущий момент
            if (minSt.isEmpty() || val <= minSt.peek()) {
                minSt.push(val);
            }
        }

        public int pop() {
            int val = main.pop();
            if (val == minSt.peek()) minSt.pop();
            return val;
        }

        public int top()    { return main.peek(); }
        public int getMin() { return minSt.peek(); } // O(1)!
    }

    // ════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши TransactionHistory (история действий):
    //    - addTransaction(Transaction t)
    //    - undoLast() — отмена последней транзакции
    //    - redoLast() — повтор отменённой транзакции
    //    Используй ДВА стека: undoStack и redoStack.
    //    Это паттерн Command + History!
    //
    // 2. Реализуй sortStack(Stack<Integer>):
    //    Отсортируй стек используя ТОЛЬКО ещё один стек.
    //    Не используй массивы или другие структуры.
    //    Алгоритм похож на Insertion Sort.
    //
    // 3. Задача "Ежедневные температуры":
    //    temps = [73, 74, 75, 71, 69, 72, 76, 73]
    //    output = [1, 1, 4, 2, 1, 1, 0, 0]
    //    Для каждого дня — через сколько дней будет теплее?
    //    Используй monotonic stack.
    // ════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== СТЕК (STACK) ===\n");

        // ArrayStack
        System.out.println("── ArrayStack ──");
        ArrayStack<String> stack = new ArrayStack<>(4);
        stack.push("Открытие счёта");
        stack.push("Пополнение 5000");
        stack.push("Снятие 2000");
        System.out.println(stack);
        System.out.println("Pop: " + stack.pop());
        System.out.println("Peek: " + stack.peek());
        System.out.println(stack);

        // LinkedStack
        System.out.println("\n── LinkedStack ──");
        LinkedStack<Integer> lstack = new LinkedStack<>();
        lstack.push(1);
        lstack.push(2);
        lstack.push(3);
        System.out.println(lstack);
        System.out.println("Pop: " + lstack.pop());

        // Скобки
        System.out.println("\n── Проверка скобок ──");
        String[] tests = {"([]{})", "([)]", "((()))", "{[}", ""};
        for (String t : tests) {
            System.out.printf("  \"%s\" → %s%n", t, isValidBrackets(t) ? "✓" : "✗");
        }

        // RPN
        System.out.println("\n── Обратная польская запись ──");
        System.out.printf("  \"3 4 + 2 *\" = %.0f (ожидается 14)%n",
                evalRPN(new String[]{"3", "4", "+", "2", "*"}));

        // Следующий больший
        System.out.println("\n── Следующий больший элемент ──");
        int[] nums = {2, 1, 2, 4, 3};
        System.out.println("  Входной:  " + java.util.Arrays.toString(nums));
        System.out.println("  Следующий:" + java.util.Arrays.toString(nextGreaterElement(nums)));

        // MinStack
        System.out.println("\n── MinStack ──");
        MinStack ms = new MinStack();
        ms.push(5); ms.push(3); ms.push(7); ms.push(1); ms.push(4);
        System.out.println("Минимум: " + ms.getMin() + " (ожидается 1)");
        ms.pop(); ms.pop();
        System.out.println("После двух pop(), минимум: " + ms.getMin() + " (ожидается 3)");
    }
}
