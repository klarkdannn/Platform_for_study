package com.bank.basics;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * УРОК 8: Математика и числа
 * Math, BigDecimal (обязательно для денег!), Random
 */
public class Lesson08_Math {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. КЛАСС Math
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. Класс Math ===");

        System.out.println("abs(-500):     " + Math.abs(-500));              // модуль
        System.out.println("min(100,200):  " + Math.min(100, 200));          // минимум
        System.out.println("max(100,200):  " + Math.max(100, 200));          // максимум
        System.out.println("pow(2,10):     " + (int)Math.pow(2, 10));        // 2^10 = 1024
        System.out.println("sqrt(144):     " + Math.sqrt(144));              // √144 = 12
        System.out.println("round(4.6):    " + Math.round(4.6));             // округление
        System.out.println("floor(4.9):    " + Math.floor(4.9));             // вниз: 4
        System.out.println("ceil(4.1):     " + Math.ceil(4.1));              // вверх: 5
        System.out.println("log10(1000):   " + Math.log10(1000));            // log₁₀(1000) = 3
        System.out.println("PI:            " + Math.PI);
        System.out.println("E:             " + Math.E);

        // Важно для финансов — округление процентов:
        double rate = 0.12345;
        double rounded = Math.round(rate * 10000.0) / 10000.0; // до 4 знаков
        System.out.println("Ставка:        " + rounded);

        // ═══════════════════════════════════════════════════════════
        // 2. BIGDECIMAL — ДЛЯ ФИНАНСОВЫХ ВЫЧИСЛЕНИЙ
        // НИКОГДА не используй double/float для денег!
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. BigDecimal — точные деньги ===");

        // Создание — ВСЕГДА через строку, не через double!
        BigDecimal principal = new BigDecimal("100000.00"); // сумма вклада
        BigDecimal rate_bd   = new BigDecimal("0.085");      // 8.5% годовых
        BigDecimal one       = BigDecimal.ONE;
        BigDecimal twelve    = new BigDecimal("12");

        System.out.println("Начальный вклад: " + principal + " руб.");

        // Арифметика BigDecimal:
        BigDecimal interest = principal.multiply(rate_bd); // простые проценты за год
        System.out.println("Проценты за год: " + interest + " руб.");

        BigDecimal total = principal.add(interest);
        System.out.println("Итого через год: " + total + " руб.");

        // Деление — ВСЕГНО указывай scale и RoundingMode!
        BigDecimal monthlyInterest = interest.divide(twelve, 2, RoundingMode.HALF_UP);
        System.out.println("Проценты/месяц: " + monthlyInterest + " руб.");

        // Сравнение:
        BigDecimal threshold = new BigDecimal("100000");
        int cmp = total.compareTo(threshold); // -1, 0, 1
        System.out.println("total > 100000: " + (cmp > 0));

        // Масштаб (scale) — количество знаков после запятой:
        BigDecimal money = new BigDecimal("1234.5");
        System.out.println("scale:          " + money.scale());    // 1
        BigDecimal money2 = money.setScale(2, RoundingMode.HALF_UP);
        System.out.println("setScale(2):    " + money2);           // 1234.50

        // RoundingMode:
        BigDecimal val = new BigDecimal("1.555");
        System.out.println("\nЗначение: " + val);
        System.out.println("HALF_UP:   " + val.setScale(2, RoundingMode.HALF_UP));   // 1.56
        System.out.println("HALF_DOWN: " + val.setScale(2, RoundingMode.HALF_DOWN)); // 1.55
        System.out.println("FLOOR:     " + val.setScale(2, RoundingMode.FLOOR));     // 1.55
        System.out.println("CEILING:   " + val.setScale(2, RoundingMode.CEILING));   // 1.56

        // ═══════════════════════════════════════════════════════════
        // 3. СЛОЖНЫЕ ПРОЦЕНТЫ — реальная банковская формула
        // A = P * (1 + r/n)^(n*t)
        //   P = начальная сумма
        //   r = годовая процентная ставка (0.085 = 8.5%)
        //   n = количество начислений в год (12 = ежемесячно)
        //   t = срок в годах
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. Сложные проценты ===");

        BigDecimal P = new BigDecimal("50000.00"); // 50 000 руб.
        BigDecimal r = new BigDecimal("0.10");     // 10% годовых
        int n = 12; // ежемесячное начисление
        int t = 3;  // 3 года

        // (1 + r/n)
        BigDecimal rPerN = r.divide(new BigDecimal(n), 10, RoundingMode.HALF_UP);
        BigDecimal base  = BigDecimal.ONE.add(rPerN); // 1 + r/n

        // (1 + r/n)^(n*t)
        BigDecimal factor = base.pow(n * t); // Java BigDecimal pow только для int степеней

        // A = P * factor
        BigDecimal A = P.multiply(factor).setScale(2, RoundingMode.HALF_UP);

        System.out.printf("P = %,.2f руб.%n", P);
        System.out.printf("r = %.0f%%, n = %d, t = %d лет%n", r.multiply(new BigDecimal(100)), n, t);
        System.out.printf("A = %,.2f руб.%n", A);
        System.out.printf("Заработано: %,.2f руб.%n", A.subtract(P));

        // Таблица роста по годам:
        System.out.println("\nГодовой рост:");
        for (int year = 1; year <= t; year++) {
            BigDecimal yearFactor = base.pow(n * year);
            BigDecimal yearAmount = P.multiply(yearFactor).setScale(2, RoundingMode.HALF_UP);
            System.out.printf("  Год %d: %,.2f руб.%n", year, yearAmount);
        }

        // ═══════════════════════════════════════════════════════════
        // 4. RANDOM — ГЕНЕРАЦИЯ СЛУЧАЙНЫХ ЧИСЕЛ
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. Random ===");

        Random random = new Random(42); // seed для воспроизводимости

        System.out.println("nextInt(100):     " + random.nextInt(100));    // 0..99
        System.out.println("nextInt(10,100):  " + random.nextInt(10,100)); // 10..99 (Java 17+)
        System.out.printf ("nextDouble():     %.4f%n", random.nextDouble());// 0.0..1.0
        System.out.println("nextBoolean():    " + random.nextBoolean());

        // Генерация случайных сумм транзакций:
        System.out.println("\n5 случайных транзакций:");
        ThreadLocalRandom tlr = ThreadLocalRandom.current(); // потокобезопасный Random
        for (int i = 0; i < 5; i++) {
            double amount = tlr.nextDouble(100, 50000);
            System.out.printf("  %.2f руб.%n", amount);
        }

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║          ЗАДАНИЯ — Урок 8: Математика и BigDecimal      ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Сложные проценты (compound interest):            ║");
        System.out.println("║        Формула: A = P * (1 + r/n)^(n*t)               ║");
        System.out.println("║        P=начальная сумма, r=ставка, n=раз/год, t=лет  ║");
        System.out.println("║        Посчитай для P=100000, r=8.5%, n=12, t=5        ║");
        System.out.println("║        Используй BigDecimal для точности!              ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Ипотечный калькулятор:                          ║");
        System.out.println("║        Ежемесячный платёж:                              ║");
        System.out.println("║        M = P * r(1+r)^n / ((1+r)^n - 1)              ║");
        System.out.println("║        P=3_000_000, годовая=12%, срок=20 лет           ║");
        System.out.println("║        Выведи: платёж, общая выплата, переплата        ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Округление в банке (HALF_UP vs HALF_EVEN):     ║");
        System.out.println("║        new BigDecimal(\"2.5\").setScale(0, HALF_UP)   = ?║");
        System.out.println("║        new BigDecimal(\"2.5\").setScale(0, HALF_EVEN) = ?║");
        System.out.println("║        new BigDecimal(\"3.5\").setScale(0, HALF_EVEN) = ?║");
        System.out.println("║        (HALF_EVEN = банковское округление!)            ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Генератор кодов подтверждения:                 ║");
        System.out.println("║        String generateOTP() — 6-значный код            ║");
        System.out.println("║        Используй ThreadLocalRandom.current()            ║");
        System.out.println("║           .nextInt(100_000, 999_999)                   ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
