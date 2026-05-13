package com.bank.basics;

import java.math.BigDecimal;

/**
 * УРОК 2: Переменные и типы данных
 *
 * Java — строго типизированный язык. У каждой переменной есть тип.
 * Типы делятся на:
 *   - Примитивные (primitive): хранят значение напрямую
 *   - Ссылочные (reference):  хранят адрес объекта в памяти
 */
public class Lesson02_VariablesAndTypes {

    // ═══════════════════════════════════════════════════════════
    // ПОЛЯ КЛАССА (переменные уровня класса)
    // static — принадлежит классу, не объекту
    // ═══════════════════════════════════════════════════════════

    // Константа (final + static) — значение нельзя изменить
    static final int MAX_ACCOUNTS_PER_CLIENT = 5;
    static final double MIN_INTEREST_RATE    = 0.01;
    static final String BANK_NAME            = "Учебный Банк Java";

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. ПРИМИТИВНЫЕ ТИПЫ (8 штук)
        // ═══════════════════════════════════════════════════════════

        System.out.println("=== 1. Примитивные типы ===");

        // byte: 1 байт, -128 до 127
        byte monthNumber = 12;
        System.out.println("byte  (месяц):   " + monthNumber + "  [от " + Byte.MIN_VALUE + " до " + Byte.MAX_VALUE + "]");

        // short: 2 байта, -32_768 до 32_767
        short branchCode = 1024;
        System.out.println("short (код офис):" + branchCode + " [до " + Short.MAX_VALUE + "]");

        // int: 4 байта, ~2 миллиарда (самый частый тип)
        int transactionCount = 1_000_000; // _ для читаемости
        System.out.println("int   (кол-во):  " + transactionCount + " [до " + Integer.MAX_VALUE + "]");

        // long: 8 байт, ~9 квинтиллионов. Суффикс L обязателен!
        long accountNumber = 4081781000000000001L; // L — это long литерал (реальный номер счёта — String!)
        System.out.println("long  (номер сч):" + accountNumber + " [до " + Long.MAX_VALUE + "]");

        // float: 4 байта, 6-7 знаков точности. Суффикс f обязателен!
        float taxRate = 0.13f; // f — это float литерал
        System.out.println("float (ставка):  " + taxRate);

        // double: 8 байт, 15-16 знаков точности (обычно для дробей)
        double interestRate = 8.75; // без суффикса — это double
        System.out.println("double(процент): " + interestRate);

        // char: 2 байта, один символ Unicode. Одинарные кавычки!
        char currencySymbol = '₽';
        System.out.println("char  (символ):  " + currencySymbol);

        // boolean: true или false (не 0 и 1 как в C!)
        boolean isActive = true;
        System.out.println("bool  (активен): " + isActive);

        // ═══════════════════════════════════════════════════════════
        // 2. ССЫЛОЧНЫЕ ТИПЫ — СТРОКИ И ОБЪЕКТЫ
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 2. Ссылочные типы ===");

        // String — не примитив! Это класс. Двойные кавычки.
        String clientName = "Иван Иванов";
        String accountId  = null; // ссылочный тип может быть null!
        // int x = null; // ОШИБКА — примитив не может быть null

        System.out.println("String: " + clientName);
        System.out.println("null:   " + accountId); // выведет "null"

        // ═══════════════════════════════════════════════════════════
        // 3. VAR — АВТОВЫВОД ТИПА (Java 10+)
        // Компилятор сам определяет тип по правой части
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 3. Ключевое слово var ===");

        var balance  = 50000;       // компилятор знает: это int
        var rate     = 8.5;         // это double
        var name     = "Алиса";     // это String
        var isBlocked= false;       // это boolean

        System.out.println("var balance  = " + balance + " (тип: " + ((Object)balance).getClass().getSimpleName() + ")");
        System.out.println("var rate     = " + rate    + " (тип: " + ((Object)rate).getClass().getSimpleName()    + ")");
        System.out.println("var name     = " + name    + " (тип: " + name.getClass().getSimpleName()              + ")");

        // var НЕЛЬЗЯ: без инициализации, в параметрах методов, в полях класса
        // var x; // ОШИБКА

        // ═══════════════════════════════════════════════════════════
        // 4. КЛАССЫ-ОБЁРТКИ (Wrapper Classes)
        // Нужны для работы с коллекциями (List<Integer>, не List<int>)
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 4. Wrapper классы и Autoboxing ===");

        Integer wrappedInt = 42;        // Autoboxing: int → Integer (автоматически)
        int primitiveInt  = wrappedInt; // Unboxing:   Integer → int (автоматически)

        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;

        // ВАЖНО: Integer кешируется от -128 до 127
        System.out.println("127 == 127: " + (a == b)); // true (один объект из кеша)
        System.out.println("128 == 128: " + (c == d)); // false (разные объекты!)
        System.out.println("128.equals: " + c.equals(d)); // true (правильное сравнение!)

        // Полезные методы обёрток:
        int parsed = Integer.parseInt("12345");          // String → int
        String str = Integer.toString(12345);            // int → String
        int maxVal = Integer.MAX_VALUE;                  // константа
        int binary = Integer.parseInt("1010", 2);        // из двоичной: 10
        System.out.println("Разбор строки: " + parsed + ", двоичное 1010 = " + binary);

        // ═══════════════════════════════════════════════════════════
        // 5. ПРИВЕДЕНИЕ ТИПОВ (TYPE CASTING)
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 5. Приведение типов ===");

        // Расширяющее преобразование (widening) — автоматически, без потерь
        int intVal     = 1000;
        long longVal   = intVal;   // int → long: OK, автоматически
        double dblVal  = intVal;   // int → double: OK, автоматически
        System.out.println("int→long:   " + longVal);
        System.out.println("int→double: " + dblVal);

        // Сужающее преобразование (narrowing) — вручную, возможна потеря данных
        double bigDouble = 9.99;
        int    truncated = (int) bigDouble; // отбрасывает дробную часть!
        System.out.println("double→int: " + bigDouble + " → " + truncated + " (потеря .99)");

        long hugeNumber = 300_000_000_000L;
        int  overflow   = (int) hugeNumber; // ПЕРЕПОЛНЕНИЕ! Данные теряются
        System.out.println("long→int overflow: " + hugeNumber + " → " + overflow);

        // ═══════════════════════════════════════════════════════════
        // 6. BIGDECIMAL — ДЛЯ ДЕНЕГ (ОБЯЗАТЕЛЬНО!)
        // Почему не double? Потому что float/double неточны для денег
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 6. BigDecimal для денег ===");

        // ПРОБЛЕМА с double:
        double d1 = 0.1 + 0.2;
        System.out.println("0.1 + 0.2 = " + d1); // 0.30000000000000004 (НЕВЕРНО!)

        // РЕШЕНИЕ — BigDecimal:
        BigDecimal bd1 = new BigDecimal("0.1"); // всегда через строку!
        BigDecimal bd2 = new BigDecimal("0.2");
        BigDecimal sum = bd1.add(bd2);
        System.out.println("BigDecimal: 0.1 + 0.2 = " + sum); // 0.3 (ВЕРНО!)

        BigDecimal deposit = new BigDecimal("50000.00");
        BigDecimal amount  = new BigDecimal("12500.75");
        BigDecimal newBalance = deposit.subtract(amount);
        System.out.println("Баланс: " + deposit + " - " + amount + " = " + newBalance);

        // Сравнение BigDecimal — только через compareTo, не equals!
        // (equals учитывает scale: 2.0 != 2.00)
        BigDecimal x = new BigDecimal("2.0");
        BigDecimal y = new BigDecimal("2.00");
        System.out.println("equals:    " + x.equals(y));      // false (разный scale)
        System.out.println("compareTo: " + (x.compareTo(y) == 0)); // true (одинаковые значения)

        // ═══════════════════════════════════════════════════════════
        // 7. ОБЛАСТЬ ВИДИМОСТИ ПЕРЕМЕННЫХ
        // ═══════════════════════════════════════════════════════════

        System.out.println("\n=== 7. Область видимости ===");
        System.out.println("Макс. счетов:  " + MAX_ACCOUNTS_PER_CLIENT);
        System.out.println("Мин. ставка:   " + MIN_INTEREST_RATE);
        System.out.println("Имя банка:     " + BANK_NAME);

        {
            // Блок — переменная видна только внутри {}
            int localVar = 42;
            System.out.println("Локальная: " + localVar);
        }
        // System.out.println(localVar); // ОШИБКА — не видна здесь

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║          ЗАДАНИЯ — Урок 2: Переменные и типы            ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Объяви переменные для клиента банка:             ║");
        System.out.println("║        String  fullName    = \"Иван Иванов\";             ║");
        System.out.println("║        int     age         = 30;                        ║");
        System.out.println("║        boolean isActive    = true;                      ║");
        System.out.println("║        BigDecimal balance  = new BigDecimal(\"50000\");   ║");
        System.out.println("║        String  accountNum  = \"40817810000000000001\";    ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Что выведет этот код? Проверь:                  ║");
        System.out.println("║        int a = 10, b = 3;                               ║");
        System.out.println("║        System.out.println(a / b);   // ?               ║");
        System.out.println("║        System.out.println(a % b);   // ?               ║");
        System.out.println("║        System.out.println((double)a / b); // ?         ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Integer overflow — что произойдёт?              ║");
        System.out.println("║        int max = Integer.MAX_VALUE;                     ║");
        System.out.println("║        System.out.println(max + 1); // ?               ║");
        System.out.println("║        Как исправить? → используй long                 ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. BigDecimal — сравни результаты:                 ║");
        System.out.println("║        double d = 0.1 + 0.2;                           ║");
        System.out.println("║        BigDecimal bd = new BigDecimal(\"0.1\")           ║");
        System.out.println("║                        .add(new BigDecimal(\"0.2\"));    ║");
        System.out.println("║        Почему d != 0.3, а bd == 0.3?                   ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 5. Autoboxing: что выведет?                        ║");
        System.out.println("║        Integer x = 127; Integer y = 127;               ║");
        System.out.println("║        System.out.println(x == y);  // ?               ║");
        System.out.println("║        Integer a = 200; Integer b = 200;               ║");
        System.out.println("║        System.out.println(a == b);  // ?               ║");
        System.out.println("║        (Объясни почему разные результаты!)              ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
