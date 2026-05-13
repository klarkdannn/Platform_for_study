package com.bank.oop.model;

import com.bank.oop.enums.Currency;

import java.math.BigDecimal;

/**
 * ДЕБЕТОВЫЙ СЧЁТ — самый простой вид счёта.
 *
 * extends Account — наследует все поля и методы Account.
 * Нельзя уйти в минус (баланс >= 0).
 * Нет процентов, нет кредитного лимита.
 *
 * Демонстрирует: наследование, super(), @Override
 */
public class DebitAccount extends Account {

    private static final BigDecimal DAILY_WITHDRAWAL_LIMIT = new BigDecimal("300000");
    private BigDecimal withdrawnToday = BigDecimal.ZERO;

    // Конструктор: обязательно вызываем super() — конструктор родителя
    public DebitAccount(String clientId, BigDecimal initialBalance) {
        super(clientId, initialBalance, Currency.RUB); // super() всегда первым!
    }

    public DebitAccount(String clientId, BigDecimal initialBalance, Currency currency) {
        super(clientId, initialBalance, currency);
    }

    // ═══════════════════════════════════════════════════════════
    // @Override — переопределение абстрактных методов родителя
    // ═══════════════════════════════════════════════════════════

    @Override
    public String getAccountType() {
        return "Дебетовый";
    }

    @Override
    public String getAdditionalInfo() {
        return String.format("Лимит снятия/день: %,.0f руб. | Снято сегодня: %,.2f руб.",
                DAILY_WITHDRAWAL_LIMIT, withdrawnToday);
    }

    // Можно переопределить и конкретный метод родителя:
    @Override
    public void withdraw(BigDecimal amount, String description) {
        validateOperation(amount);

        // Доп. проверка: дневной лимит
        BigDecimal newWithdrawn = withdrawnToday.add(amount);
        if (newWithdrawn.compareTo(DAILY_WITHDRAWAL_LIMIT) > 0) {
            throw new IllegalStateException(
                String.format("Превышен дневной лимит снятия: %,.0f руб. Доступно: %,.2f руб.",
                    DAILY_WITHDRAWAL_LIMIT, DAILY_WITHDRAWAL_LIMIT.subtract(withdrawnToday))
            );
        }

        super.withdraw(amount, description); // вызываем метод РОДИТЕЛЯ
        withdrawnToday = newWithdrawn;
    }

    public void resetDailyLimit() {
        this.withdrawnToday = BigDecimal.ZERO;
    }

    public BigDecimal getRemainingDailyLimit() {
        return DAILY_WITHDRAWAL_LIMIT.subtract(withdrawnToday);
    }
}
