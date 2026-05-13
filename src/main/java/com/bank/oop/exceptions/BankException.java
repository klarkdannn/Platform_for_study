package com.bank.oop.exceptions;

/**
 * ИСКЛЮЧЕНИЯ: Базовый класс для всех банковских исключений.
 *
 * Иерархия исключений в Java:
 *
 *   Throwable
 *   ├── Error (серьёзные ошибки JVM — не перехватывай)
 *   │   ├── OutOfMemoryError
 *   │   └── StackOverflowError
 *   └── Exception
 *       ├── RuntimeException (Unchecked — компилятор НЕ требует обработки)
 *       │   ├── NullPointerException
 *       │   ├── ArrayIndexOutOfBoundsException
 *       │   ├── ClassCastException
 *       │   ├── IllegalArgumentException
 *       │   └── BankException ← наш базовый класс
 *       │       ├── InsufficientFundsException
 *       │       ├── AccountNotFoundException
 *       │       └── AccountBlockedException
 *       └── IOException (Checked — компилятор ТРЕБУЕТ обработки)
 *           └── FileNotFoundException
 *
 * Unchecked (extends RuntimeException) — ошибки программирования
 * Checked   (extends Exception)        — ожидаемые внешние проблемы
 *
 * Рекомендация: в современных приложениях лучше Unchecked.
 */
public class BankException extends RuntimeException {

    private final String errorCode;   // код ошибки для API ответов

    public BankException(String message) {
        super(message);
        this.errorCode = "BANK_ERROR";
    }

    public BankException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    // Цепочка исключений (chaining) — причина исходного исключения
    public BankException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "BANK_ERROR";
    }

    public String getErrorCode() { return errorCode; }
}
