package com.bank.patterns;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/**
 * УРОК 27: Паттерны проектирования (Design Patterns)
 *
 * Паттерны — проверенные решения типичных задач проектирования.
 * НЕ готовый код — шаблон мышления.
 *
 * Категории (по GoF):
 *   Порождающие: Singleton, Builder, Factory, Abstract Factory, Prototype
 *   Структурные: Adapter, Decorator, Proxy, Facade, Composite
 *   Поведенческие: Observer, Strategy, Command, Iterator, Template Method
 *
 * Реализованы в этом файле: Singleton, Factory, Observer, Strategy, Command
 * (Builder — уже реализован в Client.java!)
 *
 * Запуск из Main: выбери пункт "15. Паттерны"
 */
public class PatternsDemo {

    public static void run() {
        System.out.println("=== ПАТТЕРНЫ ПРОЕКТИРОВАНИЯ ===\n");

        demoSingleton();
        demoFactory();
        demoObserver();
        demoStrategy();
        demoCommand();
        printTasks();
    }

    // ═══════════════════════════════════════════════════════════
    // SINGLETON — единственный экземпляр
    // Применение: настройки, пул соединений, реестр банков
    // Проблема: скрывает зависимости, усложняет тестирование
    // ═══════════════════════════════════════════════════════════

    static class BankRegistry {
        // volatile — гарантирует видимость между потоками
        private static volatile BankRegistry instance;
        private final List<String> registeredBanks = new ArrayList<>();

        // Приватный конструктор — никто не может создать напрямую
        private BankRegistry() {
            System.out.println("  [BankRegistry] Создан реестр банков");
        }

        // Double-checked locking — потокобезопасный Singleton
        public static BankRegistry getInstance() {
            if (instance == null) {                 // первая проверка без synchronized (быстро)
                synchronized (BankRegistry.class) { // блокировка только при создании
                    if (instance == null) {         // вторая проверка под блокировкой
                        instance = new BankRegistry();
                    }
                }
            }
            return instance;
        }

        public void register(String bankName) {
            registeredBanks.add(bankName);
            System.out.println("  Банк зарегистрирован: " + bankName);
        }

        public List<String> getAll() { return registeredBanks; }
    }

    private static void demoSingleton() {
        System.out.println("--- SINGLETON ---");

        BankRegistry reg1 = BankRegistry.getInstance();
        BankRegistry reg2 = BankRegistry.getInstance();
        System.out.println("Один объект? " + (reg1 == reg2)); // true!

        reg1.register("Сбер");
        reg2.register("Альфа");
        System.out.println("Реестр: " + reg1.getAll()); // оба банка!
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // FACTORY METHOD — создание объектов через фабрику
    // Применение: создание разных типов счетов
    // Плюс: клиент не знает о конкретных классах
    // ═══════════════════════════════════════════════════════════

    interface BankAccount {
        String getType();
        BigDecimal getBalance();
        void deposit(BigDecimal amount);
        void withdraw(BigDecimal amount);
        String getInfo();
    }

    static class SimpleDebit implements BankAccount {
        private BigDecimal balance;
        SimpleDebit(BigDecimal balance) { this.balance = balance; }
        @Override public String getType() { return "DEBIT"; }
        @Override public BigDecimal getBalance() { return balance; }
        @Override public void deposit(BigDecimal a) { balance = balance.add(a); }
        @Override public void withdraw(BigDecimal a) {
            if (balance.compareTo(a) < 0) throw new IllegalStateException("Недостаточно средств");
            balance = balance.subtract(a);
        }
        @Override public String getInfo() {
            return String.format("Дебетовый | Баланс: %,.2f руб.", balance);
        }
    }

    static class SimpleCredit implements BankAccount {
        private BigDecimal balance;
        private final BigDecimal limit;
        SimpleCredit(BigDecimal limit) { this.balance = BigDecimal.ZERO; this.limit = limit; }
        @Override public String getType() { return "CREDIT"; }
        @Override public BigDecimal getBalance() { return balance; }
        @Override public void deposit(BigDecimal a) { balance = balance.add(a); }
        @Override public void withdraw(BigDecimal a) {
            if (balance.subtract(a).compareTo(limit.negate()) < 0)
                throw new IllegalStateException("Превышен кредитный лимит");
            balance = balance.subtract(a);
        }
        @Override public String getInfo() {
            return String.format("Кредитный | Баланс: %,.2f | Лимит: %,.2f руб.", balance, limit);
        }
    }

    // Factory — решает КАКОЙ объект создать
    static class AccountFactory {
        public enum AccountType { DEBIT, CREDIT, SAVINGS }

        public static BankAccount create(AccountType type, BigDecimal amount) {
            return switch (type) {
                case DEBIT   -> new SimpleDebit(amount);
                case CREDIT  -> new SimpleCredit(amount);
                case SAVINGS -> new SimpleDebit(amount); // упрощённо для демо
            };
        }
    }

    private static void demoFactory() {
        System.out.println("--- FACTORY METHOD ---");

        BankAccount debit = AccountFactory.create(AccountFactory.AccountType.DEBIT, new BigDecimal("50000"));
        BankAccount credit = AccountFactory.create(AccountFactory.AccountType.CREDIT, new BigDecimal("200000"));

        debit.deposit(new BigDecimal("10000"));
        credit.withdraw(new BigDecimal("30000"));

        System.out.println("Дебетовый: " + debit.getInfo());
        System.out.println("Кредитный: " + credit.getInfo());
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // OBSERVER — подписка на события (Pub/Sub)
    // Применение: уведомления о транзакциях (SMS, email, push)
    // В Java 8+: можно использовать Consumer<T> вместо интерфейса
    // ═══════════════════════════════════════════════════════════

    record TransactionEvent(String accountId, String type, BigDecimal amount) {}

    static class TransactionBus {
        private final List<Consumer<TransactionEvent>> subscribers = new ArrayList<>();

        public void subscribe(Consumer<TransactionEvent> handler) {
            subscribers.add(handler);
        }

        public void publish(TransactionEvent event) {
            subscribers.forEach(handler -> handler.accept(event));
        }
    }

    private static void demoObserver() {
        System.out.println("--- OBSERVER (Event Bus) ---");

        TransactionBus bus = new TransactionBus();

        // Подписчики — лямбды, это и есть Observer'ы!
        bus.subscribe(e -> System.out.printf("  [SMS]   %s: %s на %,.0f руб.%n",
                e.accountId(), e.type(), e.amount()));
        bus.subscribe(e -> System.out.printf("  [Email] Уведомление: %s %,.0f руб. со счёта %s%n",
                e.type(), e.amount(), e.accountId()));
        bus.subscribe(e -> {
            if (e.amount().compareTo(new BigDecimal("100000")) > 0) {
                System.out.printf("  [ФРОД]  Крупная транзакция! %,.0f руб. — проверка...%n", e.amount());
            }
        });

        // Публикуем события
        bus.publish(new TransactionEvent("ACC001", "DEPOSIT",    new BigDecimal("50000")));
        bus.publish(new TransactionEvent("ACC002", "WITHDRAWAL", new BigDecimal("150000")));
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // STRATEGY — взаимозаменяемые алгоритмы
    // Применение: стратегии начисления процентов
    // Плюс: добавить новую стратегию без изменения существующего кода
    // ═══════════════════════════════════════════════════════════

    @FunctionalInterface
    interface InterestStrategy {
        BigDecimal calculate(BigDecimal balance, int months);
    }

    static class InterestCalculator {
        private InterestStrategy strategy;

        public InterestCalculator(InterestStrategy strategy) {
            this.strategy = strategy;
        }

        public void setStrategy(InterestStrategy strategy) {
            this.strategy = strategy; // стратегию можно менять в рантайме!
        }

        public BigDecimal calculate(BigDecimal balance, int months) {
            return strategy.calculate(balance, months);
        }
    }

    private static void demoStrategy() {
        System.out.println("--- STRATEGY ---");

        BigDecimal balance = new BigDecimal("100000");

        // Простые проценты: balance * rate/100 * months/12
        InterestStrategy simple = (b, m) ->
                b.multiply(new BigDecimal("0.085"))
                 .multiply(BigDecimal.valueOf(m))
                 .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        // Сложные проценты: balance * (1 + rate/12)^months - balance
        InterestStrategy compound = (b, m) -> {
            double result = b.doubleValue() * Math.pow(1 + 0.085 / 12, m) - b.doubleValue();
            return BigDecimal.valueOf(result).setScale(2, RoundingMode.HALF_UP);
        };

        // Ставка зависит от суммы (ступенчатая)
        InterestStrategy tiered = (b, m) -> {
            double rate = b.compareTo(new BigDecimal("500000")) >= 0 ? 0.12 : 0.085;
            return b.multiply(BigDecimal.valueOf(rate * m / 12)).setScale(2, RoundingMode.HALF_UP);
        };

        InterestCalculator calc = new InterestCalculator(simple);
        System.out.printf("Простые проценты (12 мес): +%,.2f руб.%n", calc.calculate(balance, 12));

        calc.setStrategy(compound); // меняем стратегию!
        System.out.printf("Сложные проценты (12 мес): +%,.2f руб.%n", calc.calculate(balance, 12));

        calc.setStrategy(tiered);
        System.out.printf("Ступенчатые (12 мес):      +%,.2f руб.%n", calc.calculate(balance, 12));
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // COMMAND — инкапсуляция действия как объекта
    // Применение: история операций, отмена (undo)
    // Плюс: можно откатывать операции, ставить в очередь
    // ═══════════════════════════════════════════════════════════

    interface BankCommand {
        void execute();
        void undo();
        String describe();
    }

    static class BankCommandHistory {
        private final java.util.Deque<BankCommand> history = new java.util.ArrayDeque<>();

        public void execute(BankCommand command) {
            command.execute();
            history.push(command); // сохраняем в историю
        }

        public void undoLast() {
            if (history.isEmpty()) { System.out.println("  Нечего отменять"); return; }
            BankCommand last = history.pop();
            System.out.println("  [UNDO] " + last.describe());
            last.undo();
        }

        public void printHistory() {
            System.out.println("  История команд (" + history.size() + "):");
            history.forEach(c -> System.out.println("    → " + c.describe()));
        }
    }

    private static void demoCommand() {
        System.out.println("--- COMMAND (с UNDO) ---");

        BigDecimal[] balance = { new BigDecimal("50000") }; // массив для захвата в лямбде

        BankCommandHistory cmdHistory = new BankCommandHistory();

        // Deposit Command
        BankCommand deposit = new BankCommand() {
            final BigDecimal amount = new BigDecimal("10000");
            @Override public void execute() {
                balance[0] = balance[0].add(amount);
                System.out.printf("  [+] Пополнение: +%,.0f → баланс: %,.0f%n", amount, balance[0]);
            }
            @Override public void undo() {
                balance[0] = balance[0].subtract(amount);
                System.out.printf("  [-] Откат:      -%,.0f → баланс: %,.0f%n", amount, balance[0]);
            }
            @Override public String describe() { return "Пополнение 10,000 руб."; }
        };

        // Withdraw Command
        BankCommand withdraw = new BankCommand() {
            final BigDecimal amount = new BigDecimal("3000");
            @Override public void execute() {
                balance[0] = balance[0].subtract(amount);
                System.out.printf("  [-] Снятие:     -%,.0f → баланс: %,.0f%n", amount, balance[0]);
            }
            @Override public void undo() {
                balance[0] = balance[0].add(amount);
                System.out.printf("  [+] Откат:      +%,.0f → баланс: %,.0f%n", amount, balance[0]);
            }
            @Override public String describe() { return "Снятие 3,000 руб."; }
        };

        System.out.println("Начальный баланс: " + balance[0]);
        cmdHistory.execute(deposit);
        cmdHistory.execute(withdraw);
        cmdHistory.execute(deposit);

        cmdHistory.printHistory();
        System.out.println("\nОтмена последних 2 операций:");
        cmdHistory.undoLast();
        cmdHistory.undoLast();
        System.out.println("Итоговый баланс: " + balance[0]);
        System.out.println();
    }

    private static void printTasks() {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                     ТВОИ ЗАДАНИЯ                        ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ 1. Реализуй паттерн Decorator:                          ║");
        System.out.println("║    SimpleAccount → LoggingAccount → SecuredAccount      ║");
        System.out.println("║    Каждый слой добавляет поведение без изменения кода   ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 2. Реализуй паттерн Proxy:                              ║");
        System.out.println("║    AccountProxy проверяет лимиты до операции            ║");
        System.out.println("║    Proxy реализует тот же интерфейс что и Account       ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 3. Реализуй паттерн Template Method:                   ║");
        System.out.println("║    abstract class ReportGenerator {                     ║");
        System.out.println("║      final void generate() {                            ║");
        System.out.println("║        header(); body(); footer(); // шаблон            ║");
        System.out.println("║      }                                                  ║");
        System.out.println("║      abstract void body(); // переопредели              ║");
        System.out.println("║    }                                                    ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
