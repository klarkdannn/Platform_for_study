package com.bank.oop.model;

import com.bank.oop.enums.Currency;
import com.bank.oop.enums.TransactionType;
import com.bank.oop.exceptions.InsufficientFundsException;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * КРЕДИТНЫЙ СЧЁТ — демонстрирует переопределение (@Override) бизнес-логики.
 *
 * Отличие от DebitAccount:
 *   - Разрешено уйти в минус до -creditLimit (это и есть долг)
 *   - Начисляются проценты на сумму долга
 *   - getDebt() = abs(min(0, balance))
 *
 * Пример:
 *   balance = 0, creditLimit = 300_000
 *   withdraw(50_000) → balance = -50_000, долг = 50_000
 *   deposit(20_000)  → balance = -30_000, долг = 30_000
 *   withdraw(300_000) → ОШИБКА (превысит лимит: -30_000 - 300_000 = -330_000 > 300_000)
 */
public class CreditAccount extends Account {

    private final BigDecimal creditLimit;   // максимальная сумма кредита
    private final double annualInterestRate; // годовая ставка % на долг

    public CreditAccount(String clientId, BigDecimal initialBalance,
                         BigDecimal creditLimit, double annualInterestRate) {
        super(clientId, initialBalance, Currency.RUB);
        if (creditLimit.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Кредитный лимит должен быть положительным");
        }
        if (annualInterestRate <= 0) {
            throw new IllegalArgumentException("Процентная ставка должна быть положительной");
        }
        this.creditLimit = creditLimit;
        this.annualInterestRate = annualInterestRate;
    }

    // ═══════════════════════════════════════════════════════════
    // Реализация abstract методов родителя
    // ═══════════════════════════════════════════════════════════

    @Override
    public String getAccountType() { return "Кредитный"; }

    @Override
    public String getAdditionalInfo() {
        return String.format("Лимит: %,.0f руб. | Ставка: %.1f%% | Долг: %,.2f руб. | Доступно: %,.2f руб.",
                creditLimit, annualInterestRate, getDebt(), getAvailableCredit());
    }

    // ═══════════════════════════════════════════════════════════
    // @Override withdraw — переопределяем поведение родителя!
    // Ключевое отличие: можно уйти в минус (до -creditLimit)
    // ═══════════════════════════════════════════════════════════

    @Override
    public void withdraw(BigDecimal amount, String description) {
        validateOperation(amount); // проверяем статус счёта

        BigDecimal newBalance = balance.subtract(amount);
        // Нельзя выйти за пределы кредитного лимита
        if (newBalance.compareTo(creditLimit.negate()) < 0) {
            BigDecimal available = getAvailableCredit();
            throw new InsufficientFundsException(amount, available);
        }

        this.balance = newBalance;
        recordTransaction(null, amount, TransactionType.WITHDRAWAL, description);
        System.out.printf("  [-] Кредит %s: -%,.2f руб. → Баланс: %,.2f руб. (Долг: %,.2f руб.)%n",
                id, amount, balance, getDebt());
    }

    // ═══════════════════════════════════════════════════════════
    // Специфичные для кредитного счёта методы
    // ═══════════════════════════════════════════════════════════

    /**
     * Долг = сколько ты должен банку.
     * Если баланс отрицательный → долг = |баланс|.
     * Если баланс >= 0 → долга нет.
     */
    public BigDecimal getDebt() {
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            return balance.negate(); // -(-50_000) = 50_000
        }
        return BigDecimal.ZERO;
    }

    /**
     * Доступный остаток кредита.
     * = creditLimit - текущий долг
     */
    public BigDecimal getAvailableCredit() {
        return creditLimit.add(balance); // creditLimit + balance (balance отрицательный если долг)
    }

    /**
     * Начисление процентов на долг (ежемесячно).
     * Если долга нет — ничего не делает.
     *
     * ЗАДАНИЕ (Урок 11): вызывай из Bank.processMonthlyInterest(List<Account>)
     */
    public void accrueMonthlyInterest() {
        BigDecimal debt = getDebt();
        if (debt.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("  [%] Долга нет — проценты не начисляются (" + id + ")");
            return;
        }

        BigDecimal monthlyRate = BigDecimal.valueOf(annualInterestRate)
                .divide(BigDecimal.valueOf(1200), 6, RoundingMode.HALF_UP);
        BigDecimal interest = debt.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);

        this.balance = this.balance.subtract(interest); // долг увеличивается
        recordTransaction(null, interest, TransactionType.FEE,
                String.format("Проценты по кредиту %.1f%% годовых", annualInterestRate));

        System.out.printf("  [%%] Проценты по кредиту %s: +%,.2f руб. → Долг: %,.2f руб.%n",
                id, interest, getDebt());
    }

    public BigDecimal getCreditLimit()       { return creditLimit; }
    public double getAnnualInterestRate()    { return annualInterestRate; }
}
