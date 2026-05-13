package com.bank;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ТЕСТИРОВАНИЕ В JAVA — ЧАСТЬ 1: JUnit 5 ОСНОВЫ
 *
 * Зачем тесты?
 *   "Код без тестов — это легаси код." — Майкл Физерс
 *   В банке тесты обязательны: деньги должны считаться правильно ВСЕГДА.
 *
 * Пирамида тестов:
 *   E2E (UI) тесты   ← мало, медленно, дорого
 *   Integration тесты ← средне
 *   Unit тесты        ← много, быстро, дёшево  ← сейчас изучаем
 *
 * Паттерн AAA (Arrange-Act-Assert):
 *   Arrange — подготовить данные
 *   Act     — вызвать метод под тестом
 *   Assert  — проверить результат
 */
class BasicsTest {

    // ══════════════════════════════════════════════════════════════════════
    // 1. ЖИЗНЕННЫЙ ЦИКЛ ТЕСТА
    // ══════════════════════════════════════════════════════════════════════

    @BeforeAll
    static void setupClass() {
        // Вызывается ОДИН РАЗ перед всеми тестами в классе
        // Должен быть static
        System.out.println("=== Начинаем тестирование ===");
    }

    @AfterAll
    static void teardownClass() {
        // Вызывается ОДИН РАЗ после всех тестов
        System.out.println("=== Тестирование завершено ===");
    }

    @BeforeEach
    void setUp() {
        // Вызывается перед КАЖДЫМ тестом
        // Инициализация тестовых данных
    }

    @AfterEach
    void tearDown() {
        // Вызывается после КАЖДОГО теста
        // Очистка ресурсов
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. БАЗОВЫЕ ASSERTIONS
    // ══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Основные типы assertions")
    void basicAssertions() {
        // assertEquals — проверить равенство
        assertEquals(4, 2 + 2);
        assertEquals("Привет", "При" + "вет");
        assertEquals(100.0, 99.5 + 0.5, 0.001); // delta для double!

        // assertTrue / assertFalse
        assertTrue(5 > 3);
        assertFalse("".isEmpty() == false);

        // assertNull / assertNotNull
        assertNull(null);
        assertNotNull("не null");

        // assertSame / assertNotSame — проверяет ссылки (==)
        String s = "hello";
        assertSame(s, s);

        // assertArrayEquals
        assertArrayEquals(new int[]{1, 2, 3}, new int[]{1, 2, 3});

        // assertIterableEquals
        assertIterableEquals(
            java.util.List.of(1, 2, 3),
            java.util.List.of(1, 2, 3)
        );
    }

    @Test
    @DisplayName("Проверка исключений")
    void exceptionAssertions() {
        // assertThrows — проверяем что метод бросает исключение
        ArithmeticException ex = assertThrows(
            ArithmeticException.class,
            () -> { int x = 1 / 0; }
        );
        assertEquals("/ by zero", ex.getMessage());

        // assertDoesNotThrow — метод НЕ должен бросать исключение
        assertDoesNotThrow(() -> {
            int x = 10 / 2;
        });

        // assertThrowsExactly — именно этот тип, не подкласс
        assertThrowsExactly(
            NumberFormatException.class,
            () -> Integer.parseInt("не число")
        );
    }

    @Test
    @DisplayName("Группировка assertions (все выполняются даже если первое упало)")
    void groupedAssertions() {
        // assertAll: выполняет ВСЕ assertions и показывает ВСЕ ошибки
        // Без assertAll — первый провал = остановка теста
        assertAll("Проверка банковского счёта",
            () -> assertEquals(1000.0, 1000.0),
            () -> assertTrue(true),
            () -> assertNotNull("ACC-001")
        );
    }

    @Test
    @DisplayName("Проверка времени выполнения")
    void timeoutAssertions() {
        // assertTimeout — тест провалится если выполняется дольше
        assertTimeout(java.time.Duration.ofMillis(100), () -> {
            // Должно выполниться за 100ms
            Thread.sleep(10);
        });

        // assertTimeoutPreemptively — прерывает выполнение при таймауте
        assertTimeoutPreemptively(java.time.Duration.ofMillis(200), () -> {
            Thread.sleep(50);
        });
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. ПАРАМЕТРИЗОВАННЫЕ ТЕСТЫ
    // ══════════════════════════════════════════════════════════════════════

    @ParameterizedTest(name = "Перевод {0} → ожидается {1}")
    @CsvSource({
        "100, true",    // Валидная сумма
        "0, false",     // Ноль — не валидно
        "-50, false",   // Отрицательная — не валидно
        "1000000, false" // Превышает лимит
    })
    void transferAmountValidation(double amount, boolean expectedValid) {
        boolean isValid = amount > 0 && amount <= 500_000;
        assertEquals(expectedValid, isValid,
            "Валидация суммы " + amount + " неверна");
    }

    @ParameterizedTest(name = "Маскировка карты {0} → {1}")
    @CsvSource({
        "4111111111111111, **** **** **** 1111",
        "5500005555555559, **** **** **** 5559"
    })
    void cardMasking(String cardNumber, String expected) {
        String masked = "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
        assertEquals(expected, masked);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "  ", "\t", "\n"})
    void emptyStringsAreInvalid(String input) {
        assertTrue(input.isBlank(), "'" + input + "' должна быть пустой/пробельной");
    }

    @ParameterizedTest
    @EnumSource(value = TransactionType.class,
                names = {"DEPOSIT", "WITHDRAWAL"})
    void validTransactionTypes(TransactionType type) {
        assertNotNull(type);
    }

    enum TransactionType { DEPOSIT, WITHDRAWAL, TRANSFER, REFUND }

    @ParameterizedTest
    @MethodSource("provideAccountData")
    void accountValidation(String accountId, boolean expectedValid) {
        boolean isValid = accountId != null && accountId.startsWith("ACC-") && accountId.length() > 4;
        assertEquals(expectedValid, isValid);
    }

    static java.util.stream.Stream<Arguments> provideAccountData() {
        return java.util.stream.Stream.of(
            Arguments.of("ACC-001", true),
            Arguments.of("ACC-", false),
            Arguments.of(null, false),
            Arguments.of("123-001", false)
        );
    }

    // ══════════════════════════════════════════════════════════════════════
    // 4. УСЛОВНОЕ ВЫПОЛНЕНИЕ
    // ══════════════════════════════════════════════════════════════════════

    @Test
    @Disabled("Отключён до исправления BANK-456")
    void disabledTest() {
        fail("Этот тест не должен запускаться");
    }

    @Test
    @EnabledOnOs(OS.WINDOWS)
    void onlyOnWindows() {
        System.out.println("Windows-специфичный тест");
    }

    @Test
    @EnabledIfSystemProperty(named = "env", matches = "ci")
    void onlyInCI() {
        System.out.println("Только в CI среде");
    }

    @Test
    void skipOnSlowEnvironment() {
        org.junit.jupiter.api.Assumptions.assumeTrue(
            Runtime.getRuntime().availableProcessors() >= 4,
            "Пропускаем на слабых машинах"
        );
        // Тест выполнится только если у машины >= 4 процессоров
    }

    // ══════════════════════════════════════════════════════════════════════
    // 5. ТЕСТИРОВАНИЕ ВЕЩЕСТВЕННЫХ ЧИСЕЛ (ВАЖНО В ФИНАНСАХ!)
    // ══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("ВАЖНО: double не подходит для денег!")
    void floatingPointProblem() {
        // ПРОБЛЕМА:
        double result = 0.1 + 0.2;
        assertNotEquals(0.3, result); // 0.30000000000000004 ≠ 0.3 !!!

        // РЕШЕНИЕ 1: delta (погрешность)
        assertEquals(0.3, result, 0.0001);

        // РЕШЕНИЕ 2: BigDecimal (для денег ВСЕГДА используй BigDecimal!)
        java.math.BigDecimal bd1 = new java.math.BigDecimal("0.1");
        java.math.BigDecimal bd2 = new java.math.BigDecimal("0.2");
        java.math.BigDecimal sum = bd1.add(bd2);
        assertEquals(0, sum.compareTo(new java.math.BigDecimal("0.3")));
        // compareTo: 0 = равны, <0 = меньше, >0 = больше
    }

    // ══════════════════════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ
    // ══════════════════════════════════════════════════════════════════════

    // 1. Напиши параметризованный тест для проверки форматов IBAN:
    //    RU + 2 цифры + 20 символов = валидный формат (упрощённо)
    //
    // 2. Напиши тест который проверяет что перевод между счетами
    //    с одинаковым ID невозможен.
    //
    // 3. Напиши assertAll для объекта Account:
    //    - id не null
    //    - balance >= 0
    //    - owner не пустой
    //    - createdAt в прошлом
}

// Аннотация для conditional import
@interface EnabledOnOs {
    OS[] value();
}
enum OS { WINDOWS, LINUX, MAC }
@interface EnabledIfSystemProperty {
    String named();
    String matches();
}
