package com.bank.oop.exceptions;

import java.math.BigDecimal;

/** Недостаточно средств на счёте. */
public class InsufficientFundsException extends BankException {

    private final BigDecimal requested;
    private final BigDecimal available;

    public InsufficientFundsException(BigDecimal requested, BigDecimal available) {
        super("INSUFFICIENT_FUNDS",
              String.format("Недостаточно средств: запрошено %.2f руб., доступно %.2f руб.",
                      requested, available));
        this.requested = requested;
        this.available = available;
    }

    public BigDecimal getRequested() { return requested; }
    public BigDecimal getAvailable() { return available; }
}
