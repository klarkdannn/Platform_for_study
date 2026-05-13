package com.bank.oop.model;

import com.bank.oop.enums.AccountStatus;
import com.bank.oop.enums.Currency;
import com.bank.oop.enums.TransactionType;
import com.bank.oop.exceptions.AccountBlockedException;
import com.bank.oop.exceptions.InsufficientFundsException;
import com.bank.oop.interfaces.Auditable;
import com.bank.oop.interfaces.Transferable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * АБСТРАКТНЫЙ КЛАСС: Банковский счёт.
 *
 * abstract class — нельзя создать объект напрямую (new Account() — ОШИБКА).
 * Содержит общее поведение для всех типов счетов.
 * Подклассы ОБЯЗАНЫ реализовать abstract методы.
 *
 * Реализует два интерфейса — множественная реализация разрешена в Java.
 */
public abstract class Account implements Transferable, Auditable, Comparable<Account> {

    // ═══════════════════════════════════════════════════════════
    // ПОЛЯ — protected (видны в подклассах)
    // ═══════════════════════════════════════════════════════════

    protected final String id;           // UUID счёта
    protected final String clientId;     // ID владельца
    protected final Currency currency;
    protected final LocalDate openedDate;

    protected BigDecimal balance;        // текущий баланс
    protected AccountStatus status;      // статус счёта

    private final List<Transaction> history; // история транзакций

    // ═══════════════════════════════════════════════════════════
    // КОНСТРУКТОР — вызывается из super() подклассов
    // ═══════════════════════════════════════════════════════════

    protected Account(String clientId, BigDecimal initialBalance, Currency currency) {
        if (initialBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Начальный баланс не может быть отрицательным");
        }
        this.id          = UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        this.clientId    = clientId;
        this.currency    = currency;
        this.balance     = initialBalance;
        this.status      = AccountStatus.ACTIVE;
        this.openedDate  = LocalDate.now();
        this.history     = new ArrayList<>();

        // Если был начальный взнос — записываем как транзакцию
        if (initialBalance.compareTo(BigDecimal.ZERO) > 0) {
            recordTransaction(null, initialBalance, TransactionType.DEPOSIT, "Открытие счёта");
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ABSTRACT МЕТОДЫ — каждый подкласс реализует по-своему
    // ═══════════════════════════════════════════════════════════

    /** Название типа счёта для отображения. */
    public abstract String getAccountType();

    /** Дополнительная информация (ставка процентов, лимит и т.д.) */
    public abstract String getAdditionalInfo();

    // ═══════════════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА Transferable
    // ═══════════════════════════════════════════════════════════

    @Override
    public String getAccountId() { return id; }

    @Override
    public BigDecimal getBalance() { return balance; }

    @Override
    public void deposit(BigDecimal amount, String description) {
        validateOperation(amount);
        this.balance = this.balance.add(amount);
        recordTransaction(null, amount, TransactionType.DEPOSIT, description);
        System.out.printf("  [+] Пополнение %s: +%,.2f руб. → Баланс: %,.2f руб.%n",
                id, amount, balance);
    }

    @Override
    public void withdraw(BigDecimal amount, String description) {
        validateOperation(amount);
        if (balance.compareTo(amount) < 0) {
            throw new InsufficientFundsException(amount, balance);
        }
        this.balance = this.balance.subtract(amount);
        recordTransaction(null, amount, TransactionType.WITHDRAWAL, description);
        System.out.printf("  [-] Снятие %s: -%,.2f руб. → Баланс: %,.2f руб.%n",
                id, amount, balance);
    }

    // ═══════════════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА Auditable
    // ═══════════════════════════════════════════════════════════

    @Override
    public List<Transaction> getTransactionHistory() {
        return Collections.unmodifiableList(history); // защита от внешних изменений
    }

    // ═══════════════════════════════════════════════════════════
    // РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА Comparable<Account>
    // Сортировка по балансу (по умолчанию)
    // ═══════════════════════════════════════════════════════════

    @Override
    public int compareTo(Account other) {
        return this.balance.compareTo(other.balance); // порядок по возрастанию
    }

    // ═══════════════════════════════════════════════════════════
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ═══════════════════════════════════════════════════════════

    protected void validateOperation(BigDecimal amount) {
        if (status != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(id);
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сумма должна быть положительной");
        }
    }

    protected void recordTransaction(String counterpartyId, BigDecimal amount,
                                     TransactionType type, String description) {
        history.add(new Transaction(this.id, counterpartyId, amount, type, description, balance));
    }

    public void block()  { this.status = AccountStatus.BLOCKED; System.out.println("Счёт заблокирован: " + id); }
    public void freeze() { this.status = AccountStatus.FROZEN;  System.out.println("Счёт заморожен: " + id); }
    public void close()  { this.status = AccountStatus.CLOSED;  System.out.println("Счёт закрыт: " + id); }
    public void activate(){ this.status = AccountStatus.ACTIVE; System.out.println("Счёт активирован: " + id); }

    // ═══════════════════════════════════════════════════════════
    // toString, equals, hashCode
    // ═══════════════════════════════════════════════════════════

    @Override
    public String toString() {
        return String.format("%s[%s] Баланс: %,.2f %s | Статус: %s | %s",
                getAccountType(), id, balance, currency.getSymbol(),
                status.getDisplayName(), getAdditionalInfo());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;        // тот же объект
        if (!(o instanceof Account)) return false; // другой тип
        Account other = (Account) o;
        return this.id.equals(other.id);   // счета равны если у них одинаковый ID
    }

    @Override
    public int hashCode() {
        return id.hashCode(); // если переопределяешь equals — ОБЯЗАТЕЛЬНО переопредели hashCode!
    }

    // Геттеры:
    public String getId()           { return id; }
    public String getClientId()     { return clientId; }
    public Currency getCurrency()   { return currency; }
    public AccountStatus getStatus(){ return status; }
    public LocalDate getOpenedDate(){ return openedDate; }
}
