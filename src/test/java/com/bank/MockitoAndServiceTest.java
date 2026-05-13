package com.bank;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.mockito.InOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.*;

/**
 * ТЕСТИРОВАНИЕ — ЧАСТЬ 2: MOCKITO (МОКИ И СТАБЫ)
 *
 * Мок (Mock) — фиктивный объект который притворяется настоящим.
 * Нужен чтобы изолировать тестируемый класс от его зависимостей.
 *
 * Аналогия:
 *   Тестируем повара (TransferService).
 *   Не идём в реальный магазин (БД) за ингредиентами.
 *   Используем муляж (Mock Repository) который возвращает что нам нужно.
 *
 * ВАЖНО для понимания:
 *   Стаб (Stub) — настроен возвращать данные (when/thenReturn)
 *   Мок (Mock) — проверяем что метод вызывался (verify)
 *   Spy — реальный объект, но некоторые методы замокированы
 *
 * В Spring Boot: @MockBean вместо @Mock (для Spring Context)
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class MockitoAndServiceTest {

    // ══════════════════════════════════════════════════════════════════════
    // МОДЕЛИ ДЛЯ ТЕСТИРОВАНИЯ
    // ══════════════════════════════════════════════════════════════════════

    record Account(String id, BigDecimal balance, String ownerId) {
        Account withBalance(BigDecimal newBalance) {
            return new Account(id, newBalance, ownerId);
        }
    }

    record Transfer(String fromId, String toId, BigDecimal amount, String idempotencyKey) {}
    record TransferResult(boolean success, String message) {}

    static class InsufficientFundsException extends RuntimeException {
        InsufficientFundsException(String msg) { super(msg); }
    }
    static class AccountNotFoundException extends RuntimeException {
        AccountNotFoundException(String msg) { super(msg); }
    }
    static class DuplicateTransferException extends RuntimeException {
        DuplicateTransferException(String msg) { super(msg); }
    }

    // ══════════════════════════════════════════════════════════════════════
    // ЗАВИСИМОСТИ (интерфейсы которые мокируем)
    // ══════════════════════════════════════════════════════════════════════

    interface AccountRepository {
        Optional<Account> findById(String id);
        Account save(Account account);
    }

    interface IdempotencyCache {
        boolean isDuplicate(String key);
        void store(String key);
    }

    interface NotificationService {
        void sendTransferNotification(String userId, BigDecimal amount);
    }

    interface AuditLogger {
        void logTransfer(String fromId, String toId, BigDecimal amount);
    }

    // ══════════════════════════════════════════════════════════════════════
    // КЛАСС ПОД ТЕСТОМ
    // ══════════════════════════════════════════════════════════════════════

    static class TransferService {
        private final AccountRepository accountRepo;
        private final IdempotencyCache idempotencyCache;
        private final NotificationService notificationService;
        private final AuditLogger auditLogger;

        TransferService(AccountRepository accountRepo,
                        IdempotencyCache idempotencyCache,
                        NotificationService notificationService,
                        AuditLogger auditLogger) {
            this.accountRepo = accountRepo;
            this.idempotencyCache = idempotencyCache;
            this.notificationService = notificationService;
            this.auditLogger = auditLogger;
        }

        TransferResult transfer(Transfer transfer) {
            if (idempotencyCache.isDuplicate(transfer.idempotencyKey())) {
                throw new DuplicateTransferException("Дублирующийся перевод: " + transfer.idempotencyKey());
            }
            Account from = accountRepo.findById(transfer.fromId())
                .orElseThrow(() -> new AccountNotFoundException("Счёт не найден: " + transfer.fromId()));
            Account to = accountRepo.findById(transfer.toId())
                .orElseThrow(() -> new AccountNotFoundException("Счёт не найден: " + transfer.toId()));

            if (from.balance().compareTo(transfer.amount()) < 0) {
                throw new InsufficientFundsException("Недостаточно средств");
            }

            Account updatedFrom = from.withBalance(from.balance().subtract(transfer.amount()));
            Account updatedTo = to.withBalance(to.balance().add(transfer.amount()));

            accountRepo.save(updatedFrom);
            accountRepo.save(updatedTo);
            idempotencyCache.store(transfer.idempotencyKey());
            auditLogger.logTransfer(transfer.fromId(), transfer.toId(), transfer.amount());
            notificationService.sendTransferNotification(from.ownerId(), transfer.amount());

            return new TransferResult(true, "Перевод выполнен");
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // ТЕСТЫ
    // ══════════════════════════════════════════════════════════════════════

    @Mock AccountRepository accountRepo;
    @Mock IdempotencyCache idempotencyCache;
    @Mock NotificationService notificationService;
    @Mock AuditLogger auditLogger;

    @InjectMocks TransferService transferService;
    // @InjectMocks создаёт TransferService и инжектирует в него @Mock поля

    private static final Account FROM_ACCOUNT = new Account("ACC-001", new BigDecimal("50000"), "user-1");
    private static final Account TO_ACCOUNT   = new Account("ACC-002", new BigDecimal("10000"), "user-2");

    @BeforeEach
    void setUp() {
        // Настройка стандартного поведения (стабы)
        given(accountRepo.findById("ACC-001")).willReturn(Optional.of(FROM_ACCOUNT));
        given(accountRepo.findById("ACC-002")).willReturn(Optional.of(TO_ACCOUNT));
        given(idempotencyCache.isDuplicate(anyString())).willReturn(false);
        given(accountRepo.save(any(Account.class))).willAnswer(inv -> inv.getArgument(0));
    }

    // --- Тест 1: Счастливый путь ---
    @Test
    @DisplayName("Успешный перевод: баланс обновляется, вызываются уведомление и аудит")
    void transfer_success() {
        // Arrange
        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("1000"), "key-001");

        // Act
        TransferResult result = transferService.transfer(transfer);

        // Assert — результат
        assertTrue(result.success());
        assertEquals("Перевод выполнен", result.message());

        // Assert — side effects (verify вызовы)
        verify(accountRepo, times(2)).save(any(Account.class));

        // Проверяем что сохранён правильный баланс
        ArgumentCaptor<Account> captor = ArgumentCaptor.forClass(Account.class);
        verify(accountRepo, times(2)).save(captor.capture());
        List<Account> savedAccounts = captor.getAllValues();

        Account savedFrom = savedAccounts.stream().filter(a -> a.id().equals("ACC-001")).findFirst().orElseThrow();
        Account savedTo = savedAccounts.stream().filter(a -> a.id().equals("ACC-002")).findFirst().orElseThrow();

        assertEquals(new BigDecimal("49000"), savedFrom.balance());
        assertEquals(new BigDecimal("11000"), savedTo.balance());

        verify(auditLogger).logTransfer("ACC-001", "ACC-002", new BigDecimal("1000"));
        verify(notificationService).sendTransferNotification("user-1", new BigDecimal("1000"));
        verify(idempotencyCache).store("key-001");
    }

    // --- Тест 2: Недостаточно средств ---
    @Test
    @DisplayName("Перевод больше баланса → InsufficientFundsException")
    void transfer_insufficientFunds_throwsException() {
        // Arrange: Пытаемся перевести больше чем есть
        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("100000"), "key-002");

        // Act & Assert
        InsufficientFundsException ex = assertThrows(
            InsufficientFundsException.class,
            () -> transferService.transfer(transfer)
        );
        assertTrue(ex.getMessage().contains("Недостаточно средств"));

        // Ничего не должно быть сохранено!
        verify(accountRepo, never()).save(any());
        verify(notificationService, never()).sendTransferNotification(any(), any());
        verifyNoInteractions(auditLogger); // ни одного вызова на объект
    }

    // --- Тест 3: Счёт не найден ---
    @Test
    @DisplayName("Несуществующий счёт отправителя → AccountNotFoundException")
    void transfer_accountNotFound_throwsException() {
        given(accountRepo.findById("ACC-999")).willReturn(Optional.empty());
        Transfer transfer = new Transfer("ACC-999", "ACC-002", new BigDecimal("100"), "key-003");

        assertThrows(AccountNotFoundException.class, () -> transferService.transfer(transfer));
        verify(accountRepo, never()).save(any());
    }

    // --- Тест 4: Дубль идемпотентности ---
    @Test
    @DisplayName("Повторный запрос с тем же ключом → DuplicateTransferException")
    void transfer_duplicate_throwsException() {
        given(idempotencyCache.isDuplicate("key-already-used")).willReturn(true);
        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("100"), "key-already-used");

        assertThrows(DuplicateTransferException.class, () -> transferService.transfer(transfer));

        // Вообще не должны обращаться к репозиторию если дубль
        verifyNoInteractions(accountRepo);
    }

    // --- Тест 5: ArgumentCaptor — проверить ЧТО было передано ---
    @Test
    @DisplayName("ArgumentCaptor: проверяем точные значения аргументов")
    void transfer_captorVerifiesExactArguments() {
        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("5000"), "key-005");
        transferService.transfer(transfer);

        ArgumentCaptor<String> fromCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> toCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<BigDecimal> amountCaptor = ArgumentCaptor.forClass(BigDecimal.class);

        verify(auditLogger).logTransfer(
            fromCaptor.capture(), toCaptor.capture(), amountCaptor.capture()
        );

        assertEquals("ACC-001", fromCaptor.getValue());
        assertEquals("ACC-002", toCaptor.getValue());
        assertEquals(0, amountCaptor.getValue().compareTo(new BigDecimal("5000")));
    }

    // --- Тест 6: Spy — частичный мок реального объекта ---
    @Test
    @DisplayName("Spy: мокируем только один метод реального объекта")
    void spyDemo() {
        java.util.ArrayList<String> realList = new java.util.ArrayList<>();
        java.util.ArrayList<String> spyList = spy(realList);

        // Реальное поведение:
        spyList.add("один");
        spyList.add("два");
        assertEquals(2, spyList.size()); // Реальный size()

        // Но можем замокировать конкретный метод:
        doReturn(999).when(spyList).size(); // size() теперь мок
        assertEquals(999, spyList.size()); // Возвращает наш 999
        assertEquals("один", spyList.get(0)); // get() реальный
    }

    // --- Тест 7: Порядок вызовов ---
    @Test
    @DisplayName("InOrder: уведомление отправляется ПОСЛЕ аудита")
    void transfer_orderOfCalls() {
        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("1000"), "key-007");
        transferService.transfer(transfer);

        InOrder inOrder = inOrder(auditLogger, notificationService);
        inOrder.verify(auditLogger).logTransfer(any(), any(), any()); // Сначала аудит
        inOrder.verify(notificationService).sendTransferNotification(any(), any()); // Потом уведомление
    }

    // --- Тест 8: Мок бросает исключение ---
    @Test
    @DisplayName("Мок репозитория бросает RuntimeException → propagates")
    void transfer_repositoryThrows_propagates() {
        given(accountRepo.findById("ACC-001"))
            .willThrow(new RuntimeException("DB connection lost"));

        Transfer transfer = new Transfer("ACC-001", "ACC-002", new BigDecimal("100"), "key-008");

        assertThrows(RuntimeException.class, () -> transferService.transfer(transfer));
        verify(accountRepo, never()).save(any());
    }

    // --- Тест 9: Мок вызывается N раз ---
    @Test
    @DisplayName("Verify количество вызовов")
    void transfer_verifyInteractionCounts() {
        Transfer t1 = new Transfer("ACC-001", "ACC-002", new BigDecimal("100"), "key-09a");
        Transfer t2 = new Transfer("ACC-001", "ACC-002", new BigDecimal("200"), "key-09b");

        transferService.transfer(t1);
        transferService.transfer(t2);

        verify(accountRepo, times(4)).save(any()); // 2 счёта × 2 перевода
        verify(notificationService, times(2)).sendTransferNotification(eq("user-1"), any());
        verify(idempotencyCache, atLeast(2)).store(anyString());
        verify(idempotencyCache, atMost(3)).store(anyString());
    }

}
