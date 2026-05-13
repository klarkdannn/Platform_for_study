package com.bank.basics;

import java.util.StringJoiner;

/**
 * УРОК 7: Строки
 * String (immutable), StringBuilder, StringJoiner, форматирование, regex
 */
public class Lesson07_Strings {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. СТРОКИ — НЕИЗМЕНЯЕМЫЕ (Immutable)
        // Каждая операция создаёт НОВУЮ строку!
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. String — неизменяемость ===");

        String name = "Иван Иванов";
        String upper = name.toUpperCase(); // создаёт НОВУЮ строку
        System.out.println("Оригинал: " + name);   // не изменился
        System.out.println("Upper:    " + upper);

        // ═══════════════════════════════════════════════════════════
        // 2. EQUALS VS == (ВАЖНО!)
        // == сравнивает ССЫЛКИ (адреса в памяти)
        // equals() сравнивает СОДЕРЖИМОЕ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. equals vs == ===");

        String s1 = "Алиса";
        String s2 = "Алиса";          // JVM оптимизирует — это тот же объект из пула
        String s3 = new String("Алиса"); // ПРИНУДИТЕЛЬНО новый объект

        System.out.println("s1 == s2:       " + (s1 == s2));       // true (пул строк)
        System.out.println("s1 == s3:       " + (s1 == s3));       // false (разные объекты!)
        System.out.println("s1.equals(s3):  " + s1.equals(s3));    // true (содержимое одинаково)
        System.out.println("s1.equalsIgnoreCase(\"АЛИСА\"): " + s1.equalsIgnoreCase("АЛИСА")); // true

        // ПРАВИЛО: для строк ВСЕГДА используй equals(), не ==

        // ═══════════════════════════════════════════════════════════
        // 3. ОСНОВНЫЕ МЕТОДЫ STRING
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. Методы String ===");

        String accountNum = "  40817 810 0000 0000 0001  ";

        System.out.println("length():        " + accountNum.length());
        System.out.println("trim():          '" + accountNum.trim() + "'");    // убирает пробелы по краям
        System.out.println("strip():         '" + accountNum.strip() + "'");   // Java 11+, юникод-aware

        String clean = accountNum.trim().replace(" ", "");
        System.out.println("Без пробелов:    " + clean);
        System.out.println("charAt(0):       " + clean.charAt(0));
        System.out.println("substring(0,5):  " + clean.substring(0, 5));
        System.out.println("indexOf('8'):    " + clean.indexOf('8'));
        System.out.println("contains('810'): " + clean.contains("810"));
        System.out.println("startsWith('40'): "+ clean.startsWith("40"));
        System.out.println("endsWith('01'):  " + clean.endsWith("01"));
        System.out.println("isEmpty():       " + "".isEmpty());
        System.out.println("isBlank():       " + "   ".isBlank());  // Java 11+

        // split:
        String csv = "Алиса,Боб,Вася,Маша";
        String[] names = csv.split(",");
        System.out.println("\nsplit(','):      " + names.length + " элементов");
        for (String n : names) System.out.println("  " + n);

        // join:
        String joined = String.join(" | ", names);
        System.out.println("join(' | '):     " + joined);

        // replace, replaceAll:
        String masked = "4081781000000000001";
        String stars = masked.replaceAll("\\d(?=\\d{4})", "*"); // маскируем всё кроме последних 4
        System.out.println("Маскировка:      " + stars);

        // ═══════════════════════════════════════════════════════════
        // 4. STRINGBUILDER — ИЗМЕНЯЕМАЯ СТРОКА
        // Используй когда нужно много конкатенаций (в цикле)
        // String + в цикле создаёт много объектов — неэффективно!
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. StringBuilder ===");

        StringBuilder sb = new StringBuilder();
        sb.append("Выписка по счёту: ");
        sb.append("ACC001");
        sb.append("\n");

        double[] txAmounts = {5000, -3000, 15000, -2500};
        for (int i = 0; i < txAmounts.length; i++) {
            sb.append(String.format("  %d. %+.2f руб.%n", i + 1, txAmounts[i]));
        }
        sb.append("Итого: ").append(15000 + 5000 - 3000 - 2500).append(" руб.");

        System.out.println(sb.toString());

        // Другие методы StringBuilder:
        StringBuilder sbDemo = new StringBuilder("Hello");
        sbDemo.insert(5, " World");    // вставить в позицию
        sbDemo.delete(0, 5);           // удалить символы 0..4
        sbDemo.reverse();              // перевернуть
        System.out.println("Манипуляции: " + sbDemo);

        // ═══════════════════════════════════════════════════════════
        // 5. ФОРМАТИРОВАНИЕ СТРОК
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 5. Форматирование ===");

        String clientName = "Алиса Иванова";
        double balance = 125_430.75;
        int txCount = 42;

        // String.format:
        String report = String.format("Клиент: %-20s | Баланс: %,12.2f руб. | Операций: %3d",
                clientName, balance, txCount);
        System.out.println(report);

        // Форматы: %s=строка, %d=целое, %f=дробное, %.2f=2 знака, %-10s=выравнивание влево
        // %,.2f = с разделителем тысяч

        // Text Blocks (Java 15+) — многострочные строки:
        String json = """
                {
                    "client": "%s",
                    "balance": %.2f,
                    "currency": "RUB"
                }
                """.formatted(clientName, balance);
        System.out.println("JSON:\n" + json);

        // ═══════════════════════════════════════════════════════════
        // 6. STRINGJOINER — удобный сборщик
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 6. StringJoiner ===");

        StringJoiner sj = new StringJoiner(", ", "[", "]"); // разделитель, префикс, суффикс
        sj.add("Дебетовый");
        sj.add("Накопительный");
        sj.add("Кредитный");
        System.out.println("Типы счетов: " + sj);

        // ═══════════════════════════════════════════════════════════
        // 7. РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ (базово)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 7. Регулярные выражения ===");

        // Проверка формата номера телефона
        String phone = "+7-999-123-45-67";
        boolean validPhone = phone.matches("\\+7[- ]?\\(?(\\d{3})\\)?[- ]?\\d{3}[- ]?\\d{2}[- ]?\\d{2}");
        System.out.println("Телефон '" + phone + "' валиден: " + validPhone);

        // Проверка email
        String email = "user@bank.ru";
        System.out.println("Email '" + email + "' валиден: " + email.matches("[\\w.+-]+@[\\w-]+\\.[\\w.]+"));

        // Проверка суммы (только цифры и точка)
        String amountStr = "12345.67";
        System.out.println("Сумма '" + amountStr + "' валидна: " + amountStr.matches("\\d+\\.?\\d*"));

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║              ЗАДАНИЯ — Урок 7: Строки                   ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Форматирование номера счёта:                     ║");
        System.out.println("║        \"40817810000000000001\"                           ║");
        System.out.println("║        → \"4081 7810 0000 0000 0001\"                    ║");
        System.out.println("║        Подсказка: substring(i, i+4) в цикле             ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Валидация email адреса:                          ║");
        System.out.println("║        boolean isValidEmail(String email):              ║");
        System.out.println("║        - содержит @                                     ║");
        System.out.println("║        - после @ есть точка                             ║");
        System.out.println("║        - не начинается с @                              ║");
        System.out.println("║        - используй matches(\"^[\\\\w.-]+@[\\\\w.-]+\\\\.[a-z]{2,}$\")");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Маскировка данных (безопасность):               ║");
        System.out.println("║        \"4081 7810 0000 0001\" → \"**** **** **** 0001\"   ║");
        System.out.println("║        Имя \"Иван Иванов\" → \"Иван И.\"                  ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Палиндром:                                      ║");
        System.out.println("║        boolean isPalindrome(String s)                   ║");
        System.out.println("║        \"рояль\" != палиндром                            ║");
        System.out.println("║        \"казак\" == палиндром                            ║");
        System.out.println("║        Игнорируй пробелы и регистр                     ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 5. Подсчёт слов в строке (без split):              ║");
        System.out.println("║        int countWords(String s) — через цикл           ║");
        System.out.println("║        Учитывай несколько пробелов подряд               ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
