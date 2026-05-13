package com.bank.algorithms.complexity;

import java.util.HashMap;
import java.util.Map;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   O(1) — КОНСТАНТНОЕ ВРЕМЯ                              ║
 * ║   "Время выполнения не зависит от размера данных"        ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Мгновенно при любом размере данных.
 * Будь то 10 или 10 000 000 элементов — время одинаковое.
 *
 * ПРИМЕРЫ O(1):
 *   - Получить элемент массива по индексу: arr[5]
 *   - Добавить в конец ArrayList (амортизированно)
 *   - HashMap.get(key) / HashMap.put(key, value)
 *   - Stack.push() / Stack.pop()
 *   - Математические вычисления: a + b, a * b
 *
 * КАК УЗНАТЬ O(1)?
 *   Нет циклов, нет рекурсии. Одно действие.
 */
public class O1_Constant {

    // ── ПРИМЕР 1: Доступ к элементу массива ──────────────────
    // Независимо от размера массива — ВСЕГДА одна операция.
    // В памяти адрес элемента = базовый_адрес + индекс * размер_типа

    public static int getElement(int[] array, int index) {
        return array[index]; // O(1) — прямой доступ по адресу
    }

    // ── ПРИМЕР 2: Проверка баланса счёта ─────────────────────
    // Не важно сколько транзакций было — баланс уже посчитан.

    public static boolean hasEnoughFunds(double balance, double amount) {
        return balance >= amount; // O(1) — одно сравнение
    }

    // ── ПРИМЕР 3: HashMap — O(1) среднее ─────────────────────
    // Хэш-функция превращает ключ в индекс массива напрямую.
    // В худшем случае O(n) (все ключи в одном бакете).

    static Map<String, Double> accounts = new HashMap<>();

    public static Double getAccountBalance(String accountId) {
        return accounts.get(accountId); // O(1) среднее
    }

    public static void setAccountBalance(String accountId, double balance) {
        accounts.put(accountId, balance); // O(1) среднее
    }

    // ── ПРИМЕР 4: Первый и последний элемент ─────────────────

    public static int getFirst(int[] arr) { return arr[0]; }            // O(1)
    public static int getLast(int[] arr)  { return arr[arr.length - 1]; } // O(1)

    // ── ПРИМЕР 5: Формула — всегда O(1) ──────────────────────
    // Расчёт процентов за 1 день — формула, не цикл.

    public static double dailyInterest(double principal, double annualRate) {
        return principal * (annualRate / 365.0); // O(1)
    }

    // ── ПРИМЕР 6: Стек — push/pop это O(1) ───────────────────
    // Стек операций для "отмены" транзакций в банке.

    private final int[] stack = new int[1000];
    private int top = -1;

    public void push(int value) { stack[++top] = value; } // O(1)
    public int pop()            { return stack[top--]; }  // O(1)
    public int peek()           { return stack[top]; }    // O(1)
    public boolean isEmpty()    { return top == -1; }     // O(1)

    // ════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. Напиши метод swapTwoVariables(int a, int b):
    //    Поменяй значения двумя способами:
    //    а) Через третью переменную (классика)
    //    б) XOR trick: a ^= b; b ^= a; a ^= b;
    //    Оба O(1). Зачем XOR вариант? (без лишней памяти)
    //
    // 2. Реализуй класс ConstantQueue (Deque trick):
    //    Очередь с O(1) для всех операций включая getMin().
    //    Подсказка: храни дополнительный deque с минимумами.
    //    Это классическая задача с собеседований!
    //
    // 3. Напиши BankCache:
    //    - HashMap<String, Account> для хранения счетов по ID
    //    - getAccount(id) — O(1)
    //    - setAccount(id, account) — O(1)
    //    - deleteAccount(id) — O(1)
    //    - containsAccount(id) — O(1)
    //    Это реальный паттерн кэширования в банке!
    // ════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== O(1) — КОНСТАНТНОЕ ВРЕМЯ ===\n");

        int[] arr = {10, 20, 30, 40, 50};
        System.out.println("Массив: [10, 20, 30, 40, 50]");
        System.out.printf("arr[2] = %d — O(1) прямой доступ%n", getElement(arr, 2));
        System.out.printf("Первый: %d, Последний: %d%n", getFirst(arr), getLast(arr));

        accounts.put("ACC-001", 50000.0);
        accounts.put("ACC-002", 123456.78);
        System.out.printf("%nБаланс ACC-001 = %.2f — O(1) из HashMap%n", getAccountBalance("ACC-001"));

        System.out.printf("Дневные проценты (100000 @ 7%% годовых) = %.2f руб.%n",
                dailyInterest(100_000, 0.07));

        System.out.println("\nКлючевой момент: время НЕ меняется при увеличении данных.");
        System.out.println("1 элемент или 100 млн — arr[i] всегда одно действие.");
    }
}
