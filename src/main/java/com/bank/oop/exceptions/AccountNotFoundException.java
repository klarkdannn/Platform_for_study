package com.bank.oop.exceptions;

/** Счёт не найден. */
public class AccountNotFoundException extends BankException {
    public AccountNotFoundException(String accountId) {
        super("ACCOUNT_NOT_FOUND", "Счёт не найден: " + accountId);
    }
}
