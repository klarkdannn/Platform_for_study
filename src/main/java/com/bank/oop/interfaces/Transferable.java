package com.bank.oop.interfaces;

import com.bank.oop.exceptions.AccountBlockedException;
import com.bank.oop.exceptions.InsufficientFundsException;

import java.math.BigDecimal;

/**
 * ИНТЕРФЕЙС: Контракт для счетов, поддерживающих переводы.
 *
 * Интерфейс определяет ЧТО должен делать объект (контракт),
 * но НЕ КАК (реализацию). Реализация — в классах.
 *
 * Java 8+: интерфейсы могут иметь:
 *   - abstract методы (без тела — обязательны для реализации)
 *   - default методы (с телом — можно переопределить)
 *   - static методы (принадлежат интерфейсу)
 *   - private методы (Java 9+, для переиспользования в default)
 */
public interface Transferable {

    // Абстрактный метод — ОБЯЗАТЕЛЕН к реализации в классе
    BigDecimal getBalance();

    // Абстрактные методы (неявно public abstract):
    void deposit(BigDecimal amount, String description)
            throws AccountBlockedException;

    void withdraw(BigDecimal amount, String description)
            throws InsufficientFundsException, AccountBlockedException;

    String getAccountId();

    // Default метод — реализация по умолчанию (можно переопределить)
    default boolean hasSufficientFunds(BigDecimal amount) {
        return getBalance().compareTo(amount) >= 0;
    }

    // Default метод — конвертация валюты (упрощённо)
    default String getFormattedBalance() {
        return String.format("%,.2f руб.", getBalance());
    }

    // Static метод в интерфейсе — утилита (не наследуется!)
    static boolean isValidAmount(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
}
