package com.bank.collections;

import java.util.*;
import java.util.stream.Collectors;

/**
 * УРОК 18-20: Коллекции Java (Collections Framework)
 *
 * Иерархия коллекций:
 *   Collection
 *   ├── List   → ArrayList, LinkedList (порядок важен, дубликаты разрешены)
 *   ├── Set    → HashSet, LinkedHashSet, TreeSet (уникальные элементы)
 *   └── Queue  → ArrayDeque, PriorityQueue (очередь)
 *   Map (отдельно) → HashMap, LinkedHashMap, TreeMap, EnumMap
 *
 * Запуск из Main: выбери пункт "10. Коллекции"
 */
public class CollectionsLesson {

    public static void run() {
        System.out.println("=== КОЛЛЕКЦИИ JAVA ===\n");

        demoList();
        demoSet();
        demoMap();
        demoQueue();
        demoComparators();
        demoCollectionsUtility();
        printTasks();
    }

    // ═══════════════════════════════════════════════════════════
    // LIST — упорядоченная коллекция с дубликатами
    // ═══════════════════════════════════════════════════════════

    private static void demoList() {
        System.out.println("--- LIST ---");

        // ArrayList: быстрый доступ по индексу O(1), медленная вставка в середину O(n)
        List<String> clientNames = new ArrayList<>();
        clientNames.add("Алиса");
        clientNames.add("Боб");
        clientNames.add("Чарли");
        clientNames.add("Алиса"); // дубликат разрешён!
        System.out.println("ArrayList: " + clientNames);
        System.out.println("Размер: " + clientNames.size());
        System.out.println("Элемент [1]: " + clientNames.get(1));

        // LinkedList: быстрая вставка/удаление O(1), медленный доступ по индексу O(n)
        LinkedList<Double> transactions = new LinkedList<>();
        transactions.add(1500.0);
        transactions.addFirst(500.0);   // вставка в начало
        transactions.addLast(3000.0);   // вставка в конец
        System.out.println("LinkedList: " + transactions);
        System.out.println("Первый: " + transactions.getFirst() + ", Последний: " + transactions.getLast());

        // Сортировка
        List<Integer> balances = new ArrayList<>(Arrays.asList(5000, 1000, 8000, 3000, 2000));
        Collections.sort(balances);
        System.out.println("После сортировки: " + balances);

        // List.of() — неизменяемый список (Java 9+)
        List<String> immutable = List.of("RUB", "USD", "EUR");
        System.out.println("Неизменяемый список: " + immutable);
        // immutable.add("CNY"); // UnsupportedOperationException!

        // Итерация разными способами
        System.out.print("for-each: ");
        for (String name : clientNames) System.out.print(name + " ");
        System.out.println();

        System.out.print("Iterator: ");
        Iterator<String> it = clientNames.iterator();
        while (it.hasNext()) System.out.print(it.next() + " ");
        System.out.println("\n");
    }

    // ═══════════════════════════════════════════════════════════
    // SET — уникальные элементы
    // ═══════════════════════════════════════════════════════════

    private static void demoSet() {
        System.out.println("--- SET ---");

        // HashSet: O(1) добавление/поиск, НЕТ порядка
        Set<String> currencies = new HashSet<>();
        currencies.add("RUB");
        currencies.add("USD");
        currencies.add("EUR");
        currencies.add("RUB"); // дубликат игнорируется!
        System.out.println("HashSet (порядок не гарантирован): " + currencies);
        System.out.println("Содержит USD: " + currencies.contains("USD"));

        // LinkedHashSet: сохраняет порядок вставки
        Set<String> ordered = new LinkedHashSet<>(Arrays.asList("EUR", "USD", "RUB", "CNY"));
        System.out.println("LinkedHashSet (порядок сохранён): " + ordered);

        // TreeSet: отсортирован по естественному порядку (или Comparator)
        Set<Integer> sorted = new TreeSet<>(Arrays.asList(500, 100, 300, 200, 400));
        System.out.println("TreeSet (отсортирован): " + sorted);

        // Операции с множествами
        Set<String> setA = new HashSet<>(Arrays.asList("Алиса", "Боб", "Чарли"));
        Set<String> setB = new HashSet<>(Arrays.asList("Боб", "Дэвид", "Алиса"));

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB); // пересечение
        System.out.println("Пересечение: " + intersection);

        Set<String> union = new HashSet<>(setA);
        union.addAll(setB); // объединение
        System.out.println("Объединение: " + union);
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // MAP — ключ → значение
    // ═══════════════════════════════════════════════════════════

    private static void demoMap() {
        System.out.println("--- MAP ---");

        // HashMap: O(1) поиск по ключу, НЕТ порядка
        Map<String, Double> accountBalances = new HashMap<>();
        accountBalances.put("ACC001", 50000.0);
        accountBalances.put("ACC002", 120000.0);
        accountBalances.put("ACC003", 8500.0);
        System.out.println("HashMap: " + accountBalances);
        System.out.println("Баланс ACC001: " + accountBalances.get("ACC001"));
        System.out.println("Не существует: " + accountBalances.get("ACC999")); // null

        // getOrDefault — безопасное получение
        double balance = accountBalances.getOrDefault("ACC999", 0.0);
        System.out.println("getOrDefault для несуществующего: " + balance);

        // putIfAbsent — добавить только если нет
        accountBalances.putIfAbsent("ACC001", 99999.0); // не перезапишет!
        System.out.println("После putIfAbsent: " + accountBalances.get("ACC001")); // всё ещё 50000

        // LinkedHashMap — сохраняет порядок вставки
        Map<String, String> clientInfo = new LinkedHashMap<>();
        clientInfo.put("id", "CLI001");
        clientInfo.put("name", "Алиса Иванова");
        clientInfo.put("email", "alice@bank.ru");
        System.out.println("LinkedHashMap (порядок): " + clientInfo);

        // TreeMap — отсортирован по ключу
        Map<String, Integer> sortedAccounts = new TreeMap<>();
        sortedAccounts.put("ACC003", 100);
        sortedAccounts.put("ACC001", 300);
        sortedAccounts.put("ACC002", 200);
        System.out.println("TreeMap (ключи отсортированы): " + sortedAccounts);

        // Перебор Map
        System.out.println("\nПеребор через entrySet:");
        for (Map.Entry<String, Double> entry : accountBalances.entrySet()) {
            System.out.printf("  %s → %,.2f руб.%n", entry.getKey(), entry.getValue());
        }

        // Частота транзакций — groupingBy через Collections
        List<String> txTypes = Arrays.asList("DEPOSIT", "WITHDRAWAL", "DEPOSIT", "TRANSFER",
                "DEPOSIT", "WITHDRAWAL", "DEPOSIT");
        Map<String, Long> frequency = new HashMap<>();
        for (String type : txTypes) {
            frequency.merge(type, 1L, Long::sum); // merge — удобный способ считать частоту
        }
        System.out.println("Частота типов транзакций: " + frequency);
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // QUEUE / DEQUE — очередь
    // ═══════════════════════════════════════════════════════════

    private static void demoQueue() {
        System.out.println("--- QUEUE / DEQUE ---");

        // ArrayDeque — реализует и Queue, и Stack (НЕ используй класс Stack!)
        Deque<String> operationQueue = new ArrayDeque<>();
        operationQueue.offer("Перевод 1000 руб");  // добавить в конец (как Queue)
        operationQueue.offer("Пополнение 5000 руб");
        operationQueue.offer("Снятие 2000 руб");
        System.out.println("Очередь: " + operationQueue);
        System.out.println("Первый (peek): " + operationQueue.peek());
        System.out.println("Забрать из очереди (poll): " + operationQueue.poll());
        System.out.println("После poll: " + operationQueue);

        // Использование как Stack (LIFO)
        Deque<String> callStack = new ArrayDeque<>();
        callStack.push("main()");
        callStack.push("processTransfer()");
        callStack.push("validateAmount()");
        System.out.println("\nСтек вызовов (push): " + callStack);
        System.out.println("Pop: " + callStack.pop()); // вернёт validateAmount()

        // PriorityQueue — очередь с приоритетом (min-heap по умолчанию)
        PriorityQueue<Integer> urgentTransactions = new PriorityQueue<>();
        urgentTransactions.add(5000);
        urgentTransactions.add(1000);
        urgentTransactions.add(8000);
        urgentTransactions.add(2000);
        System.out.print("\nPriorityQueue (мин первый): ");
        while (!urgentTransactions.isEmpty()) {
            System.out.print(urgentTransactions.poll() + " ");
        }
        System.out.println("\n");
    }

    // ═══════════════════════════════════════════════════════════
    // COMPARATOR — сортировка по нескольким критериям
    // ═══════════════════════════════════════════════════════════

    private static void demoComparators() {
        System.out.println("--- COMPARATOR ---");

        List<String[]> clients = new ArrayList<>(); // [имя, баланс]
        clients.add(new String[]{"Боб", "50000"});
        clients.add(new String[]{"Алиса", "120000"});
        clients.add(new String[]{"Чарли", "50000"});
        clients.add(new String[]{"Дэвид", "80000"});

        // Сортировка по балансу (убывание), затем по имени (алфавит)
        clients.sort(Comparator
                .comparingInt((String[] c) -> -Integer.parseInt(c[1])) // по балансу убывание
                .thenComparing(c -> c[0]));                             // по имени алфавит

        System.out.println("Отсортировано по балансу (убыв.), затем по имени:");
        for (String[] c : clients) {
            System.out.printf("  %-10s %s руб.%n", c[0], c[1]);
        }
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // Collections utility class
    // ═══════════════════════════════════════════════════════════

    private static void demoCollectionsUtility() {
        System.out.println("--- Collections УТИЛИТЫ ---");

        List<Integer> numbers = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5, 3));
        System.out.println("Исходный: " + numbers);
        System.out.println("min: " + Collections.min(numbers));
        System.out.println("max: " + Collections.max(numbers));
        System.out.println("frequency(5): " + Collections.frequency(numbers, 5));

        Collections.sort(numbers);
        System.out.println("После sort: " + numbers);

        Collections.shuffle(numbers);
        System.out.println("После shuffle: " + numbers);

        // reverse, fill, nCopies
        Collections.sort(numbers);
        Collections.reverse(numbers);
        System.out.println("Reversed: " + numbers);

        List<String> filledList = new ArrayList<>(Collections.nCopies(5, "RUB"));
        System.out.println("nCopies: " + filledList);

        // Защита от изменений
        List<Integer> unmodifiable = Collections.unmodifiableList(numbers);
        System.out.println("Unmodifiable (попытка изменить вызовет UnsupportedOperationException)");
        System.out.println();
    }

    // ═══════════════════════════════════════════════════════════
    // ЗАДАНИЯ
    // ═══════════════════════════════════════════════════════════

    private static void printTasks() {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                     ТВОИ ЗАДАНИЯ                        ║");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ 1. Создай Map<String, List<String>> clientAccounts       ║");
        System.out.println("║    где ключ — имя клиента, значение — список счетов     ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 2. Реализуй Iterator для TransactionHistory:             ║");
        System.out.println("║    итерируй от самой новой транзакции к самой старой    ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 3. Отсортируй List<Transaction> по:                     ║");
        System.out.println("║    - Дате (новые первые)                                 ║");
        System.out.println("║    - Сумме (убывание)                                   ║");
        System.out.println("║    Используй Comparator.comparing().thenComparing()     ║");
        System.out.println("║                                                          ║");
        System.out.println("║ 4. Найди дубликаты в списке транзакций                  ║");
        System.out.println("║    (одна и та же сумма в один день)                     ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}
