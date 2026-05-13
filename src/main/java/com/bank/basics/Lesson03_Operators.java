package com.bank.basics;

import java.math.BigDecimal;

/**
 * УРОК 3: Операторы
 * Арифметические, сравнения, логические, побитовые, тернарный, instanceof
 */
public class Lesson03_Operators {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. АРИФМЕТИЧЕСКИЕ ОПЕРАТОРЫ
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. Арифметические операторы ===");

        int a = 100, b = 30;
        System.out.println("a = " + a + ", b = " + b);
        System.out.println("a + b = " + (a + b)); // сложение
        System.out.println("a - b = " + (a - b)); // вычитание
        System.out.println("a * b = " + (a * b)); // умножение
        System.out.println("a / b = " + (a / b)); // целочисленное деление! 100/30 = 3
        System.out.println("a % b = " + (a % b)); // остаток от деления: 100%30 = 10

        // ВАЖНО: целочисленное деление
        System.out.println("\nЦелочисленное деление: 7 / 2 = " + (7 / 2));      // 3, НЕ 3.5
        System.out.println("Дробное деление:       7.0 / 2 = " + (7.0 / 2));   // 3.5
        System.out.println("Дробное деление:       7 / 2.0 = " + (7 / 2.0));   // 3.5

        // Инкремент и декремент
        int counter = 5;
        System.out.println("\nCounter = " + counter);
        System.out.println("counter++ = " + counter++); // сначала вернуть, потом увеличить → 5
        System.out.println("после++:  " + counter);     // теперь 6
        System.out.println("++counter = " + ++counter); // сначала увеличить, потом вернуть → 7

        // Составные операторы присваивания
        int balance = 10000;
        balance += 5000;  // balance = balance + 5000
        balance -= 3000;  // balance = balance - 3000
        balance *= 2;     // balance = balance * 2
        balance /= 4;     // balance = balance / 4
        balance %= 7;     // balance = balance % 7
        System.out.println("\nПосле операций, balance = " + balance);

        // ═══════════════════════════════════════════════════════════
        // 2. ОПЕРАТОРЫ СРАВНЕНИЯ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. Операторы сравнения ===");

        int deposit = 50000;
        int limit   = 30000;

        System.out.println("deposit == limit: " + (deposit == limit)); // false
        System.out.println("deposit != limit: " + (deposit != limit)); // true
        System.out.println("deposit >  limit: " + (deposit > limit));  // true
        System.out.println("deposit <  limit: " + (deposit < limit));  // false
        System.out.println("deposit >= limit: " + (deposit >= limit)); // true
        System.out.println("deposit <= limit: " + (deposit <= limit)); // false

        // ═══════════════════════════════════════════════════════════
        // 3. ЛОГИЧЕСКИЕ ОПЕРАТОРЫ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. Логические операторы ===");

        boolean hasEnoughMoney = deposit > 20000;
        boolean accountActive  = true;
        boolean notBlocked     = true;

        // && — И (оба true → true). Short-circuit: если первый false, второй не проверяется
        boolean canWithdraw = hasEnoughMoney && accountActive && notBlocked;
        System.out.println("Можно снять: " + canWithdraw);

        // || — ИЛИ (хотя бы один true → true). Short-circuit: если первый true, второй не проверяется
        boolean isSuspicious = deposit > 1_000_000 || deposit < 0;
        System.out.println("Подозрительно: " + isSuspicious);

        // ! — НЕ (инверсия)
        System.out.println("Не заблокирован: " + !false);

        // & и | — НЕ short-circuit (оба операнда вычисляются всегда)
        // Используй редко, обычно && и || лучше
        boolean check = (deposit > 0) & (accountActive); // оба всегда вычисляются

        // ═══════════════════════════════════════════════════════════
        // 4. ПОБИТОВЫЕ ОПЕРАТОРЫ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. Побитовые операторы ===");

        int x = 0b1010; // 10 в двоичной
        int y = 0b1100; // 12 в двоичной

        System.out.println("x = " + x + " (1010)");
        System.out.println("y = " + y + " (1100)");
        System.out.println("x & y  = " + (x & y)  + " (1000 = 8)");  // AND
        System.out.println("x | y  = " + (x | y)  + " (1110 = 14)"); // OR
        System.out.println("x ^ y  = " + (x ^ y)  + " (0110 = 6)");  // XOR
        System.out.println("~x     = " + (~x));                        // NOT
        System.out.println("x << 1 = " + (x << 1) + " (умножить на 2)");  // сдвиг влево
        System.out.println("x >> 1 = " + (x >> 1) + " (разделить на 2)"); // сдвиг вправо

        // Практика: проверить флаги разрешений (bitmasking)
        int READ    = 0b001; // 1
        int WRITE   = 0b010; // 2
        int EXECUTE = 0b100; // 4

        int permissions = READ | WRITE; // пользователь может читать и писать
        System.out.println("\nПрава: " + permissions + " (двоич: " + Integer.toBinaryString(permissions) + ")");
        System.out.println("Есть READ:    " + ((permissions & READ)    != 0)); // true
        System.out.println("Есть WRITE:   " + ((permissions & WRITE)   != 0)); // true
        System.out.println("Есть EXECUTE: " + ((permissions & EXECUTE) != 0)); // false

        // ═══════════════════════════════════════════════════════════
        // 5. ТЕРНАРНЫЙ ОПЕРАТОР
        // условие ? значение_если_true : значение_если_false
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 5. Тернарный оператор ===");

        double accountBalance = 75000.0;
        String category = accountBalance > 50000 ? "Золото" : "Стандарт";
        System.out.println("Категория клиента: " + category);

        // Можно вкладывать (но не злоупотреблять — ухудшает читаемость):
        String level = accountBalance > 1_000_000 ? "Премиум"
                     : accountBalance > 100_000   ? "Золото"
                     : accountBalance > 10_000    ? "Серебро"
                                                  : "Стандарт";
        System.out.println("Уровень (вложенный тернарник): " + level);

        // ═══════════════════════════════════════════════════════════
        // 6. INSTANCEOF — ПРОВЕРКА ТИПА
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 6. instanceof ===");

        Object obj = "Привет, банк!"; // String хранится как Object

        // Классический instanceof
        if (obj instanceof String) {
            String str = (String) obj; // приведение типа — нужно вручную
            System.out.println("Это строка длиной: " + str.length());
        }

        // Pattern matching instanceof (Java 16+) — объявляем переменную сразу!
        if (obj instanceof String str) { // str доступна сразу в блоке if
            System.out.println("Pattern matching: " + str.toUpperCase());
        }

        // Проверка числа
        Object number = 42;
        System.out.println("number instanceof Integer: " + (number instanceof Integer));
        System.out.println("number instanceof Double:  " + (number instanceof Double));
        System.out.println("number instanceof Number:  " + (number instanceof Number)); // Integer extends Number

        // ═══════════════════════════════════════════════════════════
        // 7. ПРИОРИТЕТ ОПЕРАТОРОВ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 7. Приоритет операторов ===");

        // Высокий приоритет: ++ -- (постфикс), * / %, + -, сравнения, &&, ||
        int result1 = 2 + 3 * 4;     // 14, не 20 (умножение приоритетнее)
        int result2 = (2 + 3) * 4;   // 20 (скобки меняют приоритет)
        System.out.println("2 + 3 * 4   = " + result1);
        System.out.println("(2 + 3) * 4 = " + result2);

        boolean tricky = true || false && false; // && приоритетнее || → true || false → true
        System.out.println("true || false && false = " + tricky);

        // Совет: при сомнении — ставь скобки! Код будет понятнее.

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║            ЗАДАНИЯ — Урок 3: Операторы                  ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Напиши метод isTransactionSuspicious(double amt)  ║");
        System.out.println("║        Возвращает true если:                             ║");
        System.out.println("║        - сумма > 100_000 (крупная)                      ║");
        System.out.println("║        - сумма <= 0 (ошибочная)                         ║");
        System.out.println("║        - сумма ровно круглая: amt % 10000 == 0          ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Посчитай комиссию банка:                         ║");
        System.out.println("║        - До 1000 руб: комиссия 1%                       ║");
        System.out.println("║        - 1000-50000: комиссия 0.5%                      ║");
        System.out.println("║        - Свыше 50000: комиссия 0.3%                     ║");
        System.out.println("║        Минимальная комиссия: 30 руб.                    ║");
        System.out.println("║        (используй Math.max и тернарный оператор)        ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Что выведет? Объясни:                            ║");
        System.out.println("║        int a = 5;                                       ║");
        System.out.println("║        System.out.println(a++ + \" \" + ++a); // ?        ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Побитовые операции — практика:                  ║");
        System.out.println("║        Флаги прав пользователя:                         ║");
        System.out.println("║        int READ = 1, WRITE = 2, TRANSFER = 4;          ║");
        System.out.println("║        int userPerms = READ | TRANSFER; // = 5          ║");
        System.out.println("║        Проверь: есть ли у пользователя WRITE?           ║");
        System.out.println("║        (userPerms & WRITE) != 0                         ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 5. Напиши метод без if/switch:                     ║");
        System.out.println("║        boolean canWithdraw(double balance, double amt)  ║");
        System.out.println("║        Используй только операторы && || ! <= >=         ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
