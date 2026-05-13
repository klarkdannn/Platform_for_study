package com.bank.oop.enums;

/**
 * ENUM: Статус банковского счёта.
 */
public enum AccountStatus {

    ACTIVE  ("Активен",    true),
    BLOCKED ("Заблокирован", false),
    CLOSED  ("Закрыт",    false),
    FROZEN  ("Заморожен", false); // судебный арест

    private final String displayName;
    private final boolean operationsAllowed;

    AccountStatus(String displayName, boolean operationsAllowed) {
        this.displayName         = displayName;
        this.operationsAllowed   = operationsAllowed;
    }

    public String getDisplayName()      { return displayName; }
    public boolean isOperationsAllowed(){ return operationsAllowed; }

    @Override
    public String toString() { return displayName; }
}
