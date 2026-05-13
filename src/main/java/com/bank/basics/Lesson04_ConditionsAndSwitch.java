package com.bank.basics;

/**
 * УРОК 4: Условия и Switch
 */
public class Lesson04_ConditionsAndSwitch {

    public static void run() {

        // ═══════════════════════════════════════════════════════════
        // 1. IF / ELSE IF / ELSE
        // ═══════════════════════════════════════════════════════════
        System.out.println("=== 1. if / else ===");

        double balance = 75_000.0;

        if (balance >= 1_000_000) {
            System.out.println("Категория: Премиум");
        } else if (balance >= 100_000) {
            System.out.println("Категория: Золото");
        } else if (balance >= 10_000) {
            System.out.println("Категория: Серебро");
        } else if (balance >= 0) {
            System.out.println("Категория: Стандарт");
        } else {
            System.out.println("ОШИБКА: Отрицательный баланс!");
        }

        // Без фигурных скобок (только для однострочных, не рекомендуется):
        boolean isActive = true;
        if (isActive) System.out.println("Счёт активен");
        else          System.out.println("Счёт закрыт");

        // ═══════════════════════════════════════════════════════════
        // 2. SWITCH STATEMENT (классический)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 2. Switch statement (классический) ===");

        String transactionType = "DEPOSIT";

        // ВАЖНО: Без break — "проваливание" (fall-through) в следующий case!
        switch (transactionType) {
            case "DEPOSIT":
                System.out.println("Пополнение счёта");
                break; // без break — выполнится следующий case!
            case "WITHDRAWAL":
                System.out.println("Снятие наличных");
                break;
            case "TRANSFER":
                System.out.println("Перевод");
                break;
            default:
                System.out.println("Неизвестный тип");
        }

        // Fall-through используется намеренно:
        int dayOfWeek = 6; // суббота
        String dayType;
        switch (dayOfWeek) {
            case 1: case 2: case 3: case 4: case 5:
                dayType = "Рабочий день";
                break;
            case 6: case 7:
                dayType = "Выходной";
                break;
            default:
                dayType = "Неверный день";
        }
        System.out.println("День " + dayOfWeek + ": " + dayType);

        // ═══════════════════════════════════════════════════════════
        // 3. SWITCH EXPRESSION (Java 14+) — возвращает значение
        // Стрелочный синтаксис -> (без fall-through, без break)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 3. Switch expression (Java 14+) ===");

        String txType = "TRANSFER";

        // Switch как выражение (возвращает значение):
        String description = switch (txType) {
            case "DEPOSIT"    -> "Зачисление на счёт";
            case "WITHDRAWAL" -> "Списание со счёта";
            case "TRANSFER"   -> "Перевод между счетами";
            case "PAYMENT"    -> "Платёж";
            default           -> "Неизвестная операция";
        };
        System.out.println(txType + " → " + description);

        // Switch expression с блоком и yield (когда нужна логика):
        double fee = switch (txType) {
            case "DEPOSIT"    -> 0.0;
            case "WITHDRAWAL" -> 50.0;
            case "TRANSFER"   -> {
                double baseFee = 100.0;
                double extraFee = baseFee * 0.01; // доп. комиссия 1%
                yield baseFee + extraFee; // yield возвращает значение из блока
            }
            default -> 0.0;
        };
        System.out.println("Комиссия за " + txType + ": " + fee + " руб.");

        // ═══════════════════════════════════════════════════════════
        // 4. SWITCH С ENUM (очень удобно)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 4. Switch с Enum ===");

        // Используем анонимный enum для демонстрации:
        enum Status { ACTIVE, BLOCKED, CLOSED, FROZEN }
        Status status = Status.BLOCKED;

        String statusMsg = switch (status) {
            case ACTIVE  -> "Счёт активен, операции разрешены";
            case BLOCKED -> "Счёт заблокирован, обратитесь в банк";
            case CLOSED  -> "Счёт закрыт";
            case FROZEN  -> "Счёт заморожен (судебный арест)";
        }; // enum switch исчерпывающий — default не нужен!
        System.out.println("Статус: " + statusMsg);

        // ═══════════════════════════════════════════════════════════
        // 5. PATTERN MATCHING в SWITCH (Java 17+ preview, Java 21 stable)
        // ═══════════════════════════════════════════════════════════
        System.out.println("\n=== 5. Pattern Matching в Switch (Java 21) ===");

        Object amount = 50_000;

        String amountType = switch (amount) {
            case Integer i when i < 0       -> "Отрицательная сумма (ошибка)";
            case Integer i when i == 0      -> "Нулевая сумма";
            case Integer i when i < 10_000  -> "Малая сумма: " + i;
            case Integer i                  -> "Обычная сумма: " + i;
            case Double  d                  -> "Дробная сумма: " + d;
            case String  s                  -> "Строковая сумма: " + s;
            case null                       -> "Сумма не указана";
            default                         -> "Неизвестный тип: " + amount.getClass();
        };
        System.out.println(amountType);

        printTasks();
    }

    private static void printTasks() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║         ЗАДАНИЯ — Урок 4: Условия и Switch              ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ [ ] 1. Напиши getClientCategory(double balance):        ║");
        System.out.println("║        < 10_000      → \"Стандарт\"                      ║");
        System.out.println("║        < 100_000     → \"Серебро\"                       ║");
        System.out.println("║        < 1_000_000   → \"Золото\"                        ║");
        System.out.println("║        >= 1_000_000  → \"Премиум\"                       ║");
        System.out.println("║        Напиши ТРЕМЯ способами: if, switch, тернарный   ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 2. Одобрение кредита (все условия через &&):       ║");
        System.out.println("║        - возраст от 18 до 70                            ║");
        System.out.println("║        - доход >= 30_000                               ║");
        System.out.println("║        - кредитный рейтинг >= 600                      ║");
        System.out.println("║        - нет текущих долгов                            ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 3. Pattern matching switch (Java 21):               ║");
        System.out.println("║        Account acc = ...;                               ║");
        System.out.println("║        String type = switch (acc) {                     ║");
        System.out.println("║            case DebitAccount d   -> \"дебет\";           ║");
        System.out.println("║            case CreditAccount c  -> \"кредит\";          ║");
        System.out.println("║            case SavingsAccount s -> \"накоп\";           ║");
        System.out.println("║            default -> \"неизвестно\";                    ║");
        System.out.println("║        };                                               ║");
        System.out.println("║                                                          ║");
        System.out.println("║ [ ] 4. Напиши FizzBuzz для транзакций (1-20):          ║");
        System.out.println("║        Кратно 3 → \"Fee\"                                ║");
        System.out.println("║        Кратно 5 → \"Tax\"                                ║");
        System.out.println("║        Кратно 15 → \"FeeTax\"                            ║");
        System.out.println("║        Иначе → сумма транзакции                        ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
