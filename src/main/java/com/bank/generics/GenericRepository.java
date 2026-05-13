package com.bank.generics;

import com.bank.oop.model.Account;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * УРОК 17: Generics (обобщённые типы)
 *
 * Зачем Generics?
 *   БЕЗ: repository.find("id") → Object → нужно приводить типы → ClassCastException в рантайме
 *   С:   repository.find("id") → T       → компилятор проверяет тип → ошибки на этапе компиляции
 *
 * Синтаксис: class Имя<T> { ... }
 *   T — Type (тип)
 *   E — Element (элемент коллекции)
 *   K — Key, V — Value (ключ/значение в Map)
 *   N — Number
 *
 * Запуск из Main: выбери пункт "11. Generics"
 */
public class GenericRepository<T extends Identifiable> {

    // ═══════════════════════════════════════════════════════════
    // Интерфейс с ограничением типа
    // ═══════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════
    // Generic класс — хранилище
    // (Identifiable — см. Identifiable.java в том же пакете)
    // ═══════════════════════════════════════════════════════════

    private final Map<String, T> storage = new LinkedHashMap<>();
    private final String repositoryName;

    public GenericRepository(String name) {
        this.repositoryName = name;
    }

    /** Сохранить объект */
    public void save(T item) {
        Objects.requireNonNull(item, "Элемент не может быть null");
        storage.put(item.getId(), item);
    }

    /** Найти по ID — возвращает Optional (безопасно!) */
    public Optional<T> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    /** Получить все */
    public List<T> findAll() {
        return Collections.unmodifiableList(new ArrayList<>(storage.values()));
    }

    /** Удалить по ID */
    public boolean deleteById(String id) {
        return storage.remove(id) != null;
    }

    /** Количество элементов */
    public int count() { return storage.size(); }

    /** Проверить существование */
    public boolean exists(String id) { return storage.containsKey(id); }

    // ═══════════════════════════════════════════════════════════
    // Generic методы — метод сам определяет тип-параметр
    // ═══════════════════════════════════════════════════════════

    /** Generic метод фильтрации */
    public List<T> findWhere(Predicate<T> predicate) {
        return storage.values().stream()
                .filter(predicate)
                .collect(Collectors.toList());
    }

    /**
     * Generic статический метод — утилита для работы с любыми коллекциями.
     * <E> — тип-параметр самого метода, не класса.
     */
    public static <E> E getFirst(List<E> list) {
        if (list == null || list.isEmpty()) {
            throw new NoSuchElementException("Список пуст");
        }
        return list.get(0);
    }

    /** Найти максимум из любых Comparable */
    public static <N extends Comparable<N>> N findMax(List<N> list) {
        if (list == null || list.isEmpty()) {
            throw new NoSuchElementException("Список пуст");
        }
        N max = list.get(0);
        for (N item : list) {
            if (item.compareTo(max) > 0) max = item;
        }
        return max;
    }

    // ═══════════════════════════════════════════════════════════
    // WILDCARD — подстановочный символ <?>
    // ═══════════════════════════════════════════════════════════

    /**
     * <? extends Account> — принимает List<DebitAccount>, List<SavingsAccount> и т.д.
     * Только для ЧТЕНИЯ (covariance).
     */
    public static void printBalances(List<? extends Account> accounts) {
        System.out.println("Балансы счетов:");
        for (Account acc : accounts) {
            System.out.printf("  [%s] %,.2f руб.%n", acc.getId(), acc.getBalance());
        }
    }

    /**
     * <? super Account> — принимает List<Account>, List<Object> и т.д.
     * Только для ЗАПИСИ (contravariance).
     */
    public static void fillWithDefault(List<? super Integer> list, int count) {
        for (int i = 0; i < count; i++) {
            list.add(0); // добавляем нули как заглушку
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ДЕМО-ЗАПУСК
    // ═══════════════════════════════════════════════════════════

    public static void runDemo() {
        System.out.println("=== GENERICS ===\n");

        // Хранилище для простых объектов-примеров
        GenericRepository<SimpleClient> clientRepo = new GenericRepository<>("ClientRepository");

        // Сохраняем
        clientRepo.save(new SimpleClient("CLI001", "Алиса Иванова", 120_000.0));
        clientRepo.save(new SimpleClient("CLI002", "Боб Петров",    50_000.0));
        clientRepo.save(new SimpleClient("CLI003", "Чарли Смит",    200_000.0));
        clientRepo.save(new SimpleClient("CLI004", "Дана Орлова",   15_000.0));

        System.out.println("--- Базовые операции ---");
        System.out.println("Всего клиентов: " + clientRepo.count());
        System.out.println("CLI002: " + clientRepo.findById("CLI002").orElse(null));
        System.out.println("Существует CLI999: " + clientRepo.exists("CLI999"));

        System.out.println("\n--- Фильтрация (Predicate) ---");
        // Predicate передаётся как лямбда — работает с конкретным типом T=SimpleClient
        List<SimpleClient> richClients = clientRepo.findWhere(c -> c.balance() > 100_000);
        System.out.println("Клиенты с балансом > 100k:");
        richClients.forEach(c -> System.out.println("  " + c));

        System.out.println("\n--- Generic методы ---");
        List<Double> balances = Arrays.asList(50_000.0, 120_000.0, 8_000.0, 200_000.0);
        System.out.println("Первый: " + GenericRepository.getFirst(balances));
        System.out.println("Максимум: " + GenericRepository.findMax(balances));

        List<String> names = Arrays.asList("Боб", "Алиса", "Чарли");
        System.out.println("Первое имя: " + GenericRepository.<String>getFirst(names));
        System.out.println("Макс. имя (алфавит): " + GenericRepository.findMax(names));

        System.out.println("\n--- Type Erasure ---");
        System.out.println("В рантайме GenericRepository<SimpleClient> = GenericRepository");
        System.out.println("Тип T 'стирается' компилятором (для совместимости с Java 1.4)");
        System.out.println("Поэтому нельзя: new T(), T.class, instanceof T");

        System.out.println("\n--- Pair<A, B> ---");
        Pair<String, Double> clientBalance = new Pair<>("Алиса", 120_000.0);
        System.out.println("Pair: " + clientBalance);
        System.out.println("Первый: " + clientBalance.first() + ", Второй: " + clientBalance.second());

        printTasks();
    }

    // ═══════════════════════════════════════════════════════════
    // Вспомогательные классы для демонстрации
    // ═══════════════════════════════════════════════════════════

    /** Простой клиент для демонстрации */
    record SimpleClient(String id, String name, double balance) implements Identifiable {
        @Override
        public String getId() { return id; }

        @Override
        public String toString() {
            return String.format("SimpleClient[%s] %-15s %,.0f руб.", id, name, balance);
        }
    }

    /**
     * ЗАДАНИЕ (Урок 17): Реализуй класс Pair<A, B>.
     * Хранит два связанных объекта любых типов.
     * Уже реализован ниже — изучи и добавь метод swap()!
     */
    record Pair<A, B>(A first, B second) {
        @Override
        public String toString() {
            return "(" + first + ", " + second + ")";
        }
        // ЗАДАНИЕ: добавь метод swap() → Pair<B, A>
    }

    private static void printTasks() {
        System.out.println("\n╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                     ТВОИ ЗАДАНИЯ                        ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ 1. В Pair<A, B> добавь метод swap() → Pair<B, A>        ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 2. Создай PagedRepository<T> который умеет:             ║");
        System.out.println("║    - getPage(int page, int size) → List<T>              ║");
        System.out.println("║    - getTotalPages(int size) → int                      ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 3. Добавь метод saveAll(List<? extends T> items)        ║");
        System.out.println("║    который сохраняет коллекцию объектов                 ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 4. Реализуй Cache<K, V> с ограничением по размеру:     ║");
        System.out.println("║    - максимум N элементов                               ║");
        System.out.println("║    - при переполнении вытесняет самый старый            ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
