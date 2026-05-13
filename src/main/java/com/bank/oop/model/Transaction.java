package com.bank.oop.model;

import com.bank.oop.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * ТРАНЗАКЦИЯ — неизменяемый (immutable) класс.
 *
 * Immutable объект: все поля final, нет сеттеров, нет изменяемого состояния.
 * Преимущества: потокобезопасность, простота, предсказуемость.
 *
 * Реальная транзакция в банке: атомарна (всё или ничего), записывается в БД,
 * имеет уникальный ID, дату, сумму, отправителя, получателя, тип, статус.
 */
public final class Transaction { // final — нельзя унаследовать

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    // Все поля final — значения устанавливаются только в конструкторе
    private final String id;
    private final String accountId;          // счёт, к которому относится транзакция
    private final String counterpartyId;     // счёт контрагента (для переводов)
    private final BigDecimal amount;
    private final TransactionType type;
    private final String description;
    private final LocalDateTime timestamp;
    private final BigDecimal balanceAfter;   // баланс после операции

    // Конструктор с автогенерацией ID и времени:
    public Transaction(String accountId, String counterpartyId,
                       BigDecimal amount, TransactionType type,
                       String description, BigDecimal balanceAfter) {
        this.id             = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.accountId      = accountId;
        this.counterpartyId = counterpartyId;
        this.amount         = amount;
        this.type           = type;
        this.description    = description;
        this.timestamp      = LocalDateTime.now();
        this.balanceAfter   = balanceAfter;
    }

    // Геттеры (нет сеттеров — объект immutable):
    public String getId()            { return id; }
    public String getAccountId()     { return accountId; }
    public String getCounterpartyId(){ return counterpartyId; }
    public BigDecimal getAmount()    { return amount; }
    public TransactionType getType() { return type; }
    public String getDescription()   { return description; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }

    @Override
    public String toString() {
        String sign = type.isCredit() ? "+" : "-";
        String counterparty = counterpartyId != null ? " ↔ " + counterpartyId : "";
        return String.format("[%s] %s | %s%,.2f руб. | %s%s | Баланс: %,.2f",
                id, timestamp.format(FORMATTER), sign, amount,
                type.getDisplayName(), counterparty, balanceAfter);
    }
}
