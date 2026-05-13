package com.bank.oop.interfaces;

import com.bank.oop.model.Transaction;

import java.util.List;

/**
 * ИНТЕРФЕЙС: Контракт для объектов с историей операций (аудит).
 * Любой счёт должен хранить историю транзакций.
 */
public interface Auditable {

    List<Transaction> getTransactionHistory();

    default void printTransactionHistory() {
        List<Transaction> history = getTransactionHistory();
        if (history.isEmpty()) {
            System.out.println("История транзакций пуста.");
            return;
        }
        System.out.println("История транзакций:");
        history.forEach(tx -> System.out.println("  " + tx));
    }

    default int getTransactionCount() {
        return getTransactionHistory().size();
    }
}
