package com.bank.oop.model;

import com.bank.oop.enums.Currency;
import com.bank.oop.enums.TransactionType;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * НАКОПИТЕЛЬНЫЙ СЧЁТ — с начислением процентов.
 *
 * Реальная логика: банк начисляет проценты ежемесячно или ежегодно.
 * Ставка фиксированная или плавающая (зависит от суммы).
 */
public class SavingsAccount extends Account {

    private final double annualInterestRate; // годовая ставка в %
    private int accruedMonths;               // сколько раз начислены проценты

    public SavingsAccount(String clientId, BigDecimal initialBalance, double annualInterestRate) {
        super(clientId, initialBalance, Currency.RUB);

        if (annualInterestRate <= 0 || annualInterestRate > 100) {
            throw new IllegalArgumentException("Ставка должна быть от 0% до 100%");
        }
        this.annualInterestRate = annualInterestRate;
        this.accruedMonths = 0;
    }

    @Override
    public String getAccountType() { return "Накопительный"; }

    @Override
    public String getAdditionalInfo() {
        return String.format("Ставка: %.2f%% годовых | Месяцев начислено: %d",
                annualInterestRate, accruedMonths);
    }

    /**
     * Начисляет проценты за месяц.
     * Формула: баланс * (ставка / 12 / 100)
     */
    public void accrueInterest() {
        validateOperation(BigDecimal.ONE); // проверяем что счёт активен

        // Ежемесячная ставка = годовая / 12
        BigDecimal monthlyRate = BigDecimal.valueOf(annualInterestRate)
                .divide(BigDecimal.valueOf(1200), 6, RoundingMode.HALF_UP);

        BigDecimal interest = balance.multiply(monthlyRate)
                .setScale(2, RoundingMode.HALF_UP);

        this.balance = this.balance.add(interest);
        this.accruedMonths++;

        recordTransaction(null, interest, TransactionType.INTEREST,
                String.format("Начисление процентов (%.2f%% годовых, месяц %d)",
                        annualInterestRate, accruedMonths));

        System.out.printf("  [%%] Проценты %s: +%,.2f руб. → Баланс: %,.2f руб.%n",
                id, interest, balance);
    }

    /**
     * Начисляет проценты за N месяцев.
     * Показывает использование цикла в контексте бизнес-логики.
     */
    public void accrueInterestForMonths(int months) {
        for (int i = 0; i < months; i++) {
            accrueInterest();
        }
    }

    public double getAnnualInterestRate() { return annualInterestRate; }
    public int getAccruedMonths()         { return accruedMonths; }
}
