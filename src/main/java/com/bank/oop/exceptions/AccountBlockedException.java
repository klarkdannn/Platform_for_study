package com.bank.oop.exceptions;

/** Операция на заблокированном счёте. */
public class AccountBlockedException extends BankException {
    public AccountBlockedException(String accountId) {
        super("ACCOUNT_BLOCKED",
              "Операция невозможна: счёт заблокирован. ID: " + accountId);
    }
}
