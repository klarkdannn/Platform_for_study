package com.bank.oop.enums;

import java.math.BigDecimal;

/**
 * ENUM: Валюты с курсами и символами.
 * Пример enum с нетривиальными методами.
 */
public enum Currency {

    RUB ("Российский рубль",  "₽",  BigDecimal.ONE),
    USD ("Доллар США",        "$",  new BigDecimal("90.50")),  // примерный курс к рублю
    EUR ("Евро",              "€",  new BigDecimal("98.30")),
    CNY ("Китайский юань",   "¥",  new BigDecimal("12.50")),
    GBP ("Фунт стерлингов",  "£",  new BigDecimal("115.00"));

    private final String fullName;
    private final String symbol;
    private final BigDecimal rateToRub; // курс к рублю

    Currency(String fullName, String symbol, BigDecimal rateToRub) {
        this.fullName   = fullName;
        this.symbol     = symbol;
        this.rateToRub  = rateToRub;
    }

    public String getFullName()        { return fullName; }
    public String getSymbol()          { return symbol; }
    public BigDecimal getRateToRub()   { return rateToRub; }

    /**
     * Конвертирует сумму из этой валюты в рубли.
     */
    public BigDecimal toRub(BigDecimal amount) {
        return amount.multiply(rateToRub);
    }

    /**
     * Конвертирует сумму из рублей в эту валюту.
     */
    public BigDecimal fromRub(BigDecimal rubAmount) {
        return rubAmount.divide(rateToRub, 4, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Форматирует сумму с символом валюты.
     */
    public String format(BigDecimal amount) {
        return String.format("%s %,.2f", symbol, amount);
    }

    @Override
    public String toString() { return name() + " (" + symbol + ")"; }
}
