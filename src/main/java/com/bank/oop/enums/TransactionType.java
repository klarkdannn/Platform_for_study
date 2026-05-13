package com.bank.oop.enums;

/**
 * ENUM: Типы банковских транзакций.
 *
 * Enum — перечисление. Это специальный класс с фиксированным набором констант.
 * Преимущества: типобезопасность, встроенные методы, использование в switch.
 */
public enum TransactionType {

    // ═══════════════════════════════════════════════════════════
    // КОНСТАНТЫ ENUM (с полями!)
    // Каждая константа — это объект этого enum
    // ═══════════════════════════════════════════════════════════

    DEPOSIT    ("Пополнение",          true,   0.0),
    WITHDRAWAL ("Снятие наличных",     false,  50.0),
    TRANSFER   ("Перевод",             false,  100.0),
    PAYMENT    ("Оплата услуг",        false,  30.0),
    FEE        ("Комиссия банка",      false,  0.0),
    INTEREST   ("Начисление процентов",true,   0.0),
    REFUND     ("Возврат средств",     true,   0.0);

    // ═══════════════════════════════════════════════════════════
    // ПОЛЯ ENUM
    // ═══════════════════════════════════════════════════════════

    private final String displayName;  // название для отображения
    private final boolean isCredit;    // true = деньги поступают, false = уходят
    private final double fee;          // комиссия в рублях

    // ═══════════════════════════════════════════════════════════
    // КОНСТРУКТОР ENUM — всегда private
    // ═══════════════════════════════════════════════════════════

    TransactionType(String displayName, boolean isCredit, double fee) {
        this.displayName = displayName;
        this.isCredit    = isCredit;
        this.fee         = fee;
    }

    // ═══════════════════════════════════════════════════════════
    // МЕТОДЫ ENUM
    // ═══════════════════════════════════════════════════════════

    public String getDisplayName() { return displayName; }
    public boolean isCredit()      { return isCredit; }
    public boolean isDebit()       { return !isCredit; }
    public double getFee()         { return fee; }

    /** Возвращает знак (+/-) для суммы транзакции */
    public String getSign() {
        return isCredit ? "+" : "-";
    }

    // ═══════════════════════════════════════════════════════════
    // ВСТРОЕННЫЕ МЕТОДЫ ENUM (доступны для всех enum):
    //   name()    — имя константы как строка: "DEPOSIT"
    //   ordinal() — порядковый номер (с 0): DEPOSIT=0, WITHDRAWAL=1...
    //   values()  — массив всех констант
    //   valueOf() — из строки в константу: valueOf("DEPOSIT") → DEPOSIT
    // ═══════════════════════════════════════════════════════════

    public static void runDemo() {
        System.out.println("=== Демонстрация TransactionType enum ===");

        // Все значения:
        for (TransactionType type : TransactionType.values()) {
            System.out.printf("  [%d] %-12s → %-25s (комиссия: %.0f руб., знак: %s)%n",
                    type.ordinal(), type.name(), type.getDisplayName(),
                    type.getFee(), type.getSign());
        }

        // Из строки (из БД, API):
        TransactionType fromString = TransactionType.valueOf("TRANSFER");
        System.out.println("Из строки 'TRANSFER': " + fromString.getDisplayName());

        // Switch по enum (без default — компилятор проверит полноту):
        TransactionType t = PAYMENT;
        String msg = switch (t) {
            case DEPOSIT, INTEREST, REFUND -> "Деньги поступили";
            case WITHDRAWAL, TRANSFER, PAYMENT, FEE -> "Деньги ушли";
        };
        System.out.println(t + ": " + msg);
    }
}
