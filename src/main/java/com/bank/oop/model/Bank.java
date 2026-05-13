package com.bank.oop.model;

import com.bank.oop.exceptions.AccountNotFoundException;

import java.math.BigDecimal;
import java.util.*;

/**
 * БАНК — центральный класс, управляет клиентами и счетами.
 *
 * Демонстрирует:
 *   - Агрегация (Bank содержит List<Client>, Map<String, Account>)
 *   - Implements Iterable<Client> — можно использовать в for-each
 *   - Фасад (Facade) — упрощает доступ к сложной системе
 *
 * Типичный сценарий:
 *   Bank bank = new Bank("Мой банк");
 *   Client alice = new Client.Builder("Алиса").email("a@mail.ru").build();
 *   bank.registerClient(alice);
 *   DebitAccount acc = bank.openDebitAccount(alice, new BigDecimal("50000"));
 *   bank.transfer(acc, otherAcc, new BigDecimal("10000"), "Оплата");
 */
public class Bank implements Iterable<Client> {

    private final String name;

    // Коллекции для хранения данных
    // LinkedHashMap сохраняет порядок вставки
    private final Map<String, Client>        clientsById;
    private final Map<String, Account>       accountsById;
    private final Map<String, List<Account>> accountsByClientId;

    private long transactionCount;

    public Bank(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Название банка не может быть пустым");
        }
        this.name               = name;
        this.clientsById        = new LinkedHashMap<>();
        this.accountsById       = new LinkedHashMap<>();
        this.accountsByClientId = new LinkedHashMap<>();
        this.transactionCount   = 0;

        System.out.println("Банк \"" + name + "\" открыт.");
    }

    // ═══════════════════════════════════════════════════════════
    // КЛИЕНТЫ
    // ═══════════════════════════════════════════════════════════

    public void registerClient(Client client) {
        Objects.requireNonNull(client, "Клиент не может быть null");
        if (clientsById.containsKey(client.getId())) {
            System.out.println("Клиент уже зарегистрирован: " + client.getFullName());
            return;
        }
        clientsById.put(client.getId(), client);
        accountsByClientId.put(client.getId(), new ArrayList<>());
        System.out.println("Зарегистрирован клиент: " + client.getFullName());
    }

    // Optional<Client> — безопасная альтернатива возврату null
    // ЗАДАНИЕ (Урок 23): используй orElseThrow(() -> new AccountNotFoundException(...))
    public Optional<Client> findClientById(String id) {
        return Optional.ofNullable(clientsById.get(id));
    }

    public Client getClientById(String id) {
        return findClientById(id)
                .orElseThrow(() -> new AccountNotFoundException("Клиент не найден: " + id));
    }

    public List<Client> getAllClients() {
        return Collections.unmodifiableList(new ArrayList<>(clientsById.values()));
    }

    // ═══════════════════════════════════════════════════════════
    // ОТКРЫТИЕ СЧЕТОВ
    // ═══════════════════════════════════════════════════════════

    public DebitAccount openDebitAccount(Client client, BigDecimal initialBalance) {
        checkClientRegistered(client);
        DebitAccount account = new DebitAccount(client.getId(), initialBalance);
        registerAccount(account, client);
        System.out.println("Открыт дебетовый счёт [" + account.getId() + "] для: " + client.getFullName());
        return account;
    }

    public SavingsAccount openSavingsAccount(Client client, BigDecimal initialBalance, double interestRate) {
        checkClientRegistered(client);
        SavingsAccount account = new SavingsAccount(client.getId(), initialBalance, interestRate);
        registerAccount(account, client);
        System.out.println("Открыт накопительный счёт [" + account.getId() + "] для: " + client.getFullName());
        return account;
    }

    public CreditAccount openCreditAccount(Client client, BigDecimal initialBalance,
                                            BigDecimal creditLimit, double interestRate) {
        checkClientRegistered(client);
        CreditAccount account = new CreditAccount(client.getId(), initialBalance, creditLimit, interestRate);
        registerAccount(account, client);
        System.out.println("Открыт кредитный счёт [" + account.getId() + "] для: " + client.getFullName());
        return account;
    }

    // ═══════════════════════════════════════════════════════════
    // ПЕРЕВОДЫ МЕЖДУ СЧЕТАМИ
    // ═══════════════════════════════════════════════════════════

    /**
     * Перевод средств между любыми счетами банка.
     *
     * Атомарность: если withdraw() бросил исключение,
     * deposit() не выполнится — деньги не потеряются.
     * (В реальном банке нужна транзакция БД или CompensatingTransaction)
     */
    public void transfer(Account from, Account to, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сумма перевода должна быть положительной");
        }
        System.out.printf("%n  [→] Перевод %,.2f руб.: %s → %s (%s)%n",
                amount, from.getId(), to.getId(), description);

        from.withdraw(amount, "Перевод → " + to.getId() + ": " + description);
        to.deposit(amount, "Перевод ← " + from.getId() + ": " + description);
        transactionCount++;
    }

    // ═══════════════════════════════════════════════════════════
    // ЕЖЕМЕСЯЧНЫЕ ОПЕРАЦИИ
    // ═══════════════════════════════════════════════════════════

    /**
     * ЗАДАНИЕ (Урок 11): Обработка ежемесячных процентов.
     * Для каждого счёта:
     *   - SavingsAccount → accrueInterest()
     *   - CreditAccount  → accrueMonthlyInterest()
     * Используй instanceof и полиморфизм.
     */
    public void processMonthlyInterest() {
        System.out.println("\n[БАНК] Ежемесячное начисление процентов:");
        for (Account account : accountsById.values()) {
            if (account instanceof SavingsAccount savings) {
                savings.accrueInterest();
            } else if (account instanceof CreditAccount credit) {
                credit.accrueMonthlyInterest();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // СТАТИСТИКА
    // ═══════════════════════════════════════════════════════════

    public void printStats() {
        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.printf( "║  СТАТИСТИКА: %-29s║%n", name);
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println("  Клиентов:   " + clientsById.size());
        System.out.println("  Счетов:     " + accountsById.size());
        System.out.println("  Переводов:  " + transactionCount);

        BigDecimal totalBalance = accountsById.values().stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        System.out.printf("  Общий баланс: %,.2f руб.%n", totalBalance);

        System.out.println("\n  Клиенты и их счета:");
        for (Client client : clientsById.values()) {
            System.out.println("  → " + client.getFullName() + ":");
            List<Account> accounts = accountsByClientId.getOrDefault(
                    client.getId(), Collections.emptyList());
            if (accounts.isEmpty()) {
                System.out.println("      (нет счетов)");
            } else {
                for (Account acc : accounts) {
                    System.out.println("      " + acc);
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ И ГЕТТЕРЫ
    // ═══════════════════════════════════════════════════════════

    private void registerAccount(Account account, Client client) {
        accountsById.put(account.getId(), account);
        accountsByClientId.get(client.getId()).add(account);
    }

    private void checkClientRegistered(Client client) {
        if (!clientsById.containsKey(client.getId())) {
            throw new IllegalStateException(
                    "Клиент не зарегистрирован в банке: " + client.getFullName() +
                    ". Сначала вызови bank.registerClient(client)");
        }
    }

    public String getName()              { return name; }
    public int getClientCount()          { return clientsById.size(); }
    public int getAccountCount()         { return accountsById.size(); }
    public long getTransactionCount()    { return transactionCount; }

    public List<Account> getClientAccounts(Client client) {
        return Collections.unmodifiableList(
                accountsByClientId.getOrDefault(client.getId(), Collections.emptyList()));
    }

    // Implements Iterable<Client> — банк можно использовать в for-each цикле!
    // for (Client c : bank) { ... }
    @Override
    public Iterator<Client> iterator() {
        return clientsById.values().iterator();
    }
}
