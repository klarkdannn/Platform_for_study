package com.bank.basics;

/**
 * УРОК 1: Hello World — первая программа на Java
 *
 * Ключевые понятия:
 *   - Пакет (package) — организация классов по папкам
 *   - Класс (class)   — основная единица кода в Java
 *   - Метод main      — точка входа в программу
 *   - System.out      — стандартный вывод в консоль
 *   - Комментарии     — // однострочный, /* многострочный, /** JavaDoc
 */
public class Lesson01_HelloWorld {

    /**
     * Метод run() вызывается из Main.java.
     * В Java каждый исполняемый код находится внутри метода.
     */
    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. БАЗОВЫЙ ВЫВОД В КОНСОЛЬ
        // ═══════════════════════════════════════════════════════════

        System.out.println("Привет, Мир!"); // println = print + newline (перевод строки)
        System.out.print("Без ");           // print — без перевода строки
        System.out.print("переноса ");
        System.out.println("строки");

        System.out.println(); // пустая строка

        // ═══════════════════════════════════════════════════════════
        // 2. ВЫВОД РАЗНЫХ ТИПОВ ДАННЫХ
        // ═══════════════════════════════════════════════════════════

        System.out.println("Строка: " + "Банк Java");
        System.out.println("Число: " + 42);
        System.out.println("Дробное: " + 3.14);
        System.out.println("Булево: " + true);
        System.out.println("Символ: " + 'A');

        // ═══════════════════════════════════════════════════════════
        // 3. ФОРМАТИРОВАННЫЙ ВЫВОД (как printf в C)
        // ═══════════════════════════════════════════════════════════

        // %s = String, %d = int, %f = float/double, %n = перенос строки
        System.out.printf("Клиент: %s, Баланс: %.2f руб.%n", "Иван Иванов", 50000.75);

        // Форматирование чисел с разделителями: 1,000,000.00
        System.out.printf("Большая сумма: %,.2f руб.%n", 1_000_000.50);

        // ═══════════════════════════════════════════════════════════
        // 4. СТРУКТУРА ПРОГРАММЫ Java
        // ═══════════════════════════════════════════════════════════

        /*
         * Структура Java-программы:
         *
         * package com.bank.basics;   ← 1. Пакет (опционально)
         *
         * import java.util.Scanner;  ← 2. Импорты (опционально)
         *
         * public class MyClass {     ← 3. Объявление класса (обязательно)
         *
         *     public static void main(String[] args) {  ← 4. Точка входа
         *         // твой код
         *     }
         * }
         *
         * Правила именования:
         *   - Класс:    PascalCase  → BankAccount, ClientService
         *   - Метод:    camelCase   → getBalance(), transferMoney()
         *   - Переменная: camelCase → accountBalance, clientName
         *   - Константа: UPPER_CASE → MAX_BALANCE, MIN_TRANSFER_AMOUNT
         *   - Пакет:    lowercase   → com.bank.model
         */

        System.out.println();
        System.out.println("Банк Java запущен. Добро пожаловать!");

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║             ЗАДАНИЯ — Урок 1: Hello World               ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Напиши программу которая выводит 5 строк:        ║");
        System.out.println("║        - Твоё имя                                       ║");
        System.out.println("║        - Твой город                                     ║");
        System.out.println("║        - Цель (стать Java-разработчиком)                ║");
        System.out.println("║        - Любимое число через printf                     ║");
        System.out.println("║        - Текущая дата через LocalDate.now()             ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Выведи таблицу умножения на 3 (от 1 до 10)      ║");
        System.out.println("║        Формат: 3 x 1 = 3                               ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Используя printf, выведи чек покупки:           ║");
        System.out.println("║        Товар            Цена     Кол-во   Итого         ║");
        System.out.println("║        Кофе             150.00   2        300.00 руб.   ║");
        System.out.println("║        Сэндвич          230.00   1        230.00 руб.   ║");
        System.out.println("║        ИТОГО:                             530.00 руб.   ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Выведи пирамиду из * (5 строк):                 ║");
        System.out.println("║          *                                               ║");
        System.out.println("║          ***                                             ║");
        System.out.println("║          *****                                           ║");
        System.out.println("║          *******                                         ║");
        System.out.println("║          *********                                       ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 5. Найди и изучи: чем отличается System.out.print  ║");
        System.out.println("║        от System.out.println и System.out.printf?       ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
