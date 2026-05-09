export const CATEGORIES = [
  {
    id: 'basics',
    title: '☕ Базовый синтаксис',
    lessons: [
      { id: 'l01', title: 'Hello World', subtitle: 'Первая программа на Java' },
      { id: 'l02', title: 'Переменные и типы', subtitle: 'Примитивы, String, auto-boxing' },
      { id: 'l03', title: 'Операторы', subtitle: 'Арифметика, логика, битовые' },
      { id: 'l04', title: 'Условия и Switch', subtitle: 'if/else, switch expression' },
      { id: 'l05', title: 'Циклы', subtitle: 'for, while, do-while, for-each' },
      { id: 'l06', title: 'Массивы', subtitle: 'Одномерные, 2D, Arrays' },
      { id: 'l07', title: 'Строки', subtitle: 'String, StringBuilder, regex' },
      { id: 'l08', title: 'Математика', subtitle: 'Math, BigDecimal, Random' },
    ]
  },
  {
    id: 'oop',
    title: '🏗️ ООП',
    lessons: [
      { id: 'l09', title: 'Классы и Объекты', subtitle: 'Инкапсуляция, конструкторы' },
      { id: 'l10', title: 'Наследование', subtitle: 'extends, super, override' },
      { id: 'l11', title: 'Полиморфизм и Интерфейсы', subtitle: 'abstract, interface, instanceof' },
    ]
  },
  {
    id: 'collections',
    title: '📦 Коллекции и Алгоритмы',
    lessons: [
      { id: 'l12', title: 'Коллекции', subtitle: 'List, Set, Map, Queue' },
      { id: 'l13', title: 'Структуры Данных', subtitle: 'LinkedList, Stack, BST своими руками' },
    ]
  },
  {
    id: 'functional',
    title: '⚡ Функциональная Java',
    lessons: [
      { id: 'l14', title: 'Stream API и Lambdas', subtitle: 'filter, map, reduce, Collectors' },
      { id: 'l15', title: 'Generics', subtitle: 'Дженерики, wildcards, type bounds' },
    ]
  },
  {
    id: 'patterns',
    title: '🎨 Паттерны и Многопоточность',
    lessons: [
      { id: 'l16', title: 'Паттерны проектирования', subtitle: 'Singleton, Factory, Observer, Strategy' },
      { id: 'l17', title: 'Потоки и Concurrency', subtitle: 'Thread, ExecutorService, synchronized' },
      { id: 'l18', title: 'Асинхронность', subtitle: 'CompletableFuture, async patterns' },
    ]
  },
  {
    id: 'spring',
    title: '🌱 Spring Boot',
    lessons: [
      { id: 'l19', title: 'Spring Core & DI', subtitle: 'IoC, бины, аннотации' },
      { id: 'l20', title: 'Spring MVC & REST API', subtitle: '@RestController, @RequestMapping' },
      { id: 'l21', title: 'Spring Data JPA', subtitle: 'Repository, Entity, JPQL' },
      { id: 'l22', title: 'Spring Security', subtitle: 'JWT, OAuth2, аутентификация' },
    ]
  },
  {
    id: 'databases',
    title: '🗄️ Базы Данных',
    lessons: [
      { id: 'l23', title: 'SQL Основы', subtitle: 'SELECT, INSERT, JOIN, агрегация' },
      { id: 'l24', title: 'PostgreSQL & JDBC', subtitle: 'Подключение, prepared statements' },
      { id: 'l25', title: 'JPA & Hibernate', subtitle: 'ORM, Entity, отношения' },
    ]
  }
]

export const LESSONS = {
  l01: {
    title: 'Урок 1: Hello World',
    content: `
# ☕ Hello World — Первая программа на Java

Java — один из самых популярных языков в мире. Каждый Java-разработчик начинает с простой программы.

## Структура программы

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

## Разбор по частям

| Часть | Значение |
|-------|----------|
| \`public class Main\` | Объявление класса с именем Main |
| \`public static void main\` | Точка входа — JVM вызывает этот метод первым |
| \`String[] args\` | Аргументы командной строки |
| \`System.out.println\` | Вывод строки с переносом строки |
| \`System.out.print\` | Вывод без переноса строки |
| \`System.out.printf\` | Форматированный вывод |

## Форматированный вывод

\`\`\`java
// %s = строка, %d = целое, %f = дробное, %n = перевод строки
System.out.printf("Привет, %s! Баланс: %.2f руб.%n", "Алиса", 1500.0);
// → Привет, Алиса! Баланс: 1500.00 руб.

// Выравнивание: %-20s (влево), %20s (вправо)
System.out.printf("%-20s %10.2f%n", "Депозит", 50000.0);
\`\`\`

## Правила именования

- **Класс**: \`PascalCase\` → \`BankAccount\`, \`TransactionManager\`
- **Метод**: \`camelCase\` → \`getBalance\`, \`processPayment\`
- **Константа**: \`UPPER_SNAKE_CASE\` → \`MAX_ATTEMPTS\`, \`TAX_RATE\`

> **Важно:** Имя файла должно совпадать с именем класса: класс \`Main\` → файл \`Main.java\`

## Компиляция и запуск

\`\`\`bash
javac Main.java   # компиляция → Main.class
java Main         # запуск
\`\`\`
    `
  },

  l02: {
    title: 'Урок 2: Переменные и типы',
    content: `
# Переменные и типы данных

## Примитивные типы

| Тип | Размер | Диапазон | Пример |
|-----|--------|----------|--------|
| \`byte\` | 1 байт | -128…127 | \`byte b = 100;\` |
| \`short\` | 2 байта | -32768…32767 | \`short s = 1000;\` |
| \`int\` | 4 байта | -2.1B…2.1B | \`int i = 42;\` |
| \`long\` | 8 байт | ±9.2 * 10^18 | \`long l = 10_000_000L;\` |
| \`float\` | 4 байта | 7 знаков | \`float f = 3.14f;\` |
| \`double\` | 8 байт | 15 знаков | \`double d = 3.14;\` |
| \`boolean\` | 1 бит | true/false | \`boolean ok = true;\` |
| \`char\` | 2 байта | Unicode | \`char c = 'A';\` |

## Строки (String)

\`\`\`java
String name = "Алиса";
int len = name.length();           // 5
String upper = name.toUpperCase(); // "АЛИСА"
boolean empty = name.isEmpty();    // false
\`\`\`

## Var (Java 10+) — вывод типа

\`\`\`java
var balance = 100_000.0;  // JVM определяет тип как double
var name    = "Банк";     // String
\`\`\`

## Auto-boxing: Integer vs int

\`\`\`java
int primitive = 42;
Integer boxed = 42;         // auto-boxing
int back = boxed;           // auto-unboxing

// ЛОВУШКА: == для Integer сравнивает ссылки!
Integer a = 200, b = 200;
System.out.println(a == b);       // false (разные объекты!)
System.out.println(a.equals(b));  // true  ← правильно
\`\`\`

## Константы

\`\`\`java
final double TAX_RATE = 0.13;   // нельзя изменить
final int MAX_ATTEMPTS = 3;
\`\`\`

## Приведение типов

\`\`\`java
int i = 1000;
long l = i;          // неявное (widening)
int j = (int) l;     // явное (narrowing)

double d = 9.9;
int truncated = (int) d;  // 9 — отсекаем дробную часть!
\`\`\`
    `
  },

  l03: {
    title: 'Урок 3: Операторы',
    content: `
# Операторы Java

## Арифметические

\`\`\`java
int a = 17, b = 5;
System.out.println(a + b);   // 22
System.out.println(a - b);   // 12
System.out.println(a * b);   // 85
System.out.println(a / b);   // 3  (целочисленное деление!)
System.out.println(a % b);   // 2  (остаток)

// Деление с дробью:
double result = (double) a / b;  // 3.4
\`\`\`

## Логические операторы

\`\`\`java
boolean adult  = age >= 18;
boolean active = status.equals("ACTIVE");
boolean hasIncome = income > 30_000;

// AND (оба true)
boolean canGetCredit = adult && active && hasIncome;

// OR (хотя бы одно true)
boolean canEnter = isVip || hasTicket;

// NOT
boolean blocked = !active;

// Short-circuit: второй операнд не вычисляется если первый определяет результат
if (obj != null && obj.isValid()) { ... }
\`\`\`

## Операторы сравнения

\`\`\`java
==   !=   >   <   >=   <=
\`\`\`

> **Важно:** Строки сравнивай через \`equals()\`, не \`==\`

## Битовые операторы (для флагов)

\`\`\`java
final int READ  = 0b001;  // 1
final int WRITE = 0b010;  // 2
final int ADMIN = 0b100;  // 4

int userPerm = READ | WRITE;       // 3 = 0b011

boolean canRead  = (userPerm & READ)  != 0;  // true
boolean canAdmin = (userPerm & ADMIN) != 0;  // false

userPerm |= ADMIN;   // добавить право
userPerm &= ~WRITE;  // убрать право
\`\`\`

## Тернарный оператор

\`\`\`java
// condition ? ifTrue : ifFalse
String category = balance >= 100_000 ? "Золото" : "Стандарт";
double fee = isVip ? 0.0 : 100.0;
\`\`\`

## Pre/Post инкремент

\`\`\`java
int x = 5;
int a = x++;  // a=5, x=6 (сначала присвоить, потом увеличить)
int b = ++x;  // b=7, x=7 (сначала увеличить, потом присвоить)
\`\`\`
    `
  },

  l04: {
    title: 'Урок 4: Условия и Switch',
    content: `
# Условия и Switch

## if / else if / else

\`\`\`java
double balance = 75_000.0;

if (balance >= 1_000_000) {
    System.out.println("Премиум");
} else if (balance >= 100_000) {
    System.out.println("Золото");
} else if (balance >= 10_000) {
    System.out.println("Серебро");
} else {
    System.out.println("Стандарт");
}
\`\`\`

## Switch Expression (Java 14+) — рекомендуется

\`\`\`java
String txType = "TRANSFER";

String desc = switch (txType) {
    case "DEPOSIT"    -> "Зачисление";
    case "WITHDRAWAL" -> "Списание";
    case "TRANSFER"   -> "Перевод";
    default           -> "Неизвестно";
};
\`\`\`

## Switch с блоком и yield

\`\`\`java
double fee = switch (txType) {
    case "DEPOSIT"    -> 0.0;
    case "WITHDRAWAL" -> 50.0;
    case "TRANSFER"   -> {
        double base = 100.0;
        yield base + base * 0.01;  // yield возвращает значение
    }
    default -> 0.0;
};
\`\`\`

## Switch с Enum (исчерпывающий — default не нужен)

\`\`\`java
enum Status { ACTIVE, BLOCKED, CLOSED }

Status s = Status.BLOCKED;
String msg = switch (s) {
    case ACTIVE  -> "Счёт активен";
    case BLOCKED -> "Счёт заблокирован";
    case CLOSED  -> "Счёт закрыт";
};
\`\`\`

## Pattern Matching Switch (Java 21)

\`\`\`java
Object amount = 50_000;
String type = switch (amount) {
    case Integer i when i < 0    -> "Ошибка: отрицательная сумма";
    case Integer i when i < 1000 -> "Малая: " + i;
    case Integer i               -> "Обычная: " + i;
    case Double  d               -> "Дробная: " + d;
    case null                    -> "Не указана";
    default                      -> "Неизвестный тип";
};
\`\`\`
    `
  },

  l05: {
    title: 'Урок 5: Циклы',
    content: `
# Циклы

## for — классический

\`\`\`java
// Рост вклада по годам
double balance = 10_000.0;
for (int year = 1; year <= 5; year++) {
    balance *= 1.07;
    System.out.printf("Год %d: %.2f руб.%n", year, balance);
}
\`\`\`

## while — с предусловием

\`\`\`java
// Погашение долга
double debt = 50_000.0;
int month = 0;
while (debt > 0) {
    debt = debt * 1.02 - 5_000;
    if (debt < 0) debt = 0;
    month++;
}
System.out.println("Погашен за " + month + " мес.");
\`\`\`

## do-while — хотя бы один раз

\`\`\`java
int attempts = 0;
do {
    System.out.println("Введите PIN:");
    // ... чтение PIN
    attempts++;
} while (attempts < 3 && !correctPin);
\`\`\`

## for-each — для массивов и коллекций

\`\`\`java
double[] transactions = {5000, -3000, 15000, -500};
double total = 0;
for (double tx : transactions) {
    total += tx;
}
\`\`\`

## break и continue

\`\`\`java
// break — выйти из цикла
for (double amount : amounts) {
    if (amount > 10_000) {
        System.out.println("Найдена крупная: " + amount);
        break;
    }
}

// continue — пропустить итерацию
for (double amount : amounts) {
    if (amount < 0) continue;  // пропустить отрицательные
    System.out.printf("%.2f%n", amount);
}
\`\`\`

## Вложенные циклы с метками

\`\`\`java
outer:
for (int i = 0; i < clients.length; i++) {
    for (int j = 0; j < accounts.length; j++) {
        if (accounts[j].equals(target)) {
            System.out.println("Найдено у клиента " + i);
            break outer;  // выйти из ВНЕШНЕГО цикла
        }
    }
}
\`\`\`
    `
  },

  l06: {
    title: 'Урок 6: Массивы',
    content: `
# Массивы

## Одномерный массив

\`\`\`java
// Создание
double[] balances = new double[5];
balances[0] = 50_000.0;

// Инициализатор
String[] ids = {"ACC001", "ACC002", "ACC003"};

// Длина — поле, не метод!
System.out.println(ids.length);  // 3
\`\`\`

## Класс Arrays

\`\`\`java
import java.util.Arrays;

double[] amounts = {5000, 15000, 3000, 50000, 1000};
Arrays.sort(amounts);                          // сортировка
System.out.println(Arrays.toString(amounts));  // [1000.0, 3000.0, ...]

int idx = Arrays.binarySearch(amounts, 15000); // бинарный поиск

double[] copy = Arrays.copyOf(amounts, 3);     // первые 3
Arrays.fill(copy, 0.0);                        // заполнить нулями
System.out.println(Arrays.equals(a, b));       // сравнение
\`\`\`

## Двумерный массив

\`\`\`java
// [клиент][месяц]
double[][] data = {
    {5000, 15000, 3000},   // клиент 0
    {20000, 5000, 12000},  // клиент 1
};

for (int i = 0; i < data.length; i++) {
    for (int j = 0; j < data[i].length; j++) {
        System.out.printf("%-10.0f", data[i][j]);
    }
    System.out.println();
}
\`\`\`

## Зубчатый массив (Jagged)

\`\`\`java
// Разное количество счетов у каждого клиента
double[][] accounts = new double[3][];
accounts[0] = new double[]{10000, 50000};      // 2 счёта
accounts[1] = new double[]{5000, 25000, 100000}; // 3 счёта
accounts[2] = new double[]{75000};              // 1 счёт
\`\`\`
    `
  },

  l07: {
    title: 'Урок 7: Строки',
    content: `
# Строки (String)

## Неизменяемость (Immutable)

\`\`\`java
String s = "Банк";
s.toUpperCase();             // создаёт НОВУЮ строку!
System.out.println(s);       // "Банк" — оригинал не изменился
String upper = s.toUpperCase();  // правильно — сохраняем результат
\`\`\`

## equals vs ==

\`\`\`java
String a = "Алиса";
String b = new String("Алиса");
System.out.println(a == b);       // false (разные объекты!)
System.out.println(a.equals(b));  // true  ← ПРАВИЛЬНО
\`\`\`

## Основные методы

\`\`\`java
String s = "  40817 810 0000 0001  ";
s.trim()                // убрать пробелы по краям
s.strip()               // Java 11+, unicode-aware
s.replace(" ", "")      // удалить пробелы
s.substring(0, 5)       // подстрока
s.indexOf('8')          // индекс символа
s.contains("810")       // содержит
s.startsWith("40")      // начинается с
s.endsWith("01")        // заканчивается на
s.isEmpty()             // пустая?
s.isBlank()             // пустая или только пробелы?
s.split(",")            // разбить по разделителю
String.join(", ", arr)  // соединить
\`\`\`

## StringBuilder — для много конкатенаций

\`\`\`java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < txAmounts.length; i++) {
    sb.append(String.format("  %d. %+.2f руб.%n", i + 1, txAmounts[i]));
}
System.out.println(sb.toString());
\`\`\`

## Форматирование

\`\`\`java
// String.format: %s=строка, %d=целое, %.2f=2 знака, %n=перевод
String report = String.format("%-20s %,12.2f руб.", name, balance);

// Text Blocks (Java 15+)
String json = """
    {
        "name": "%s",
        "balance": %.2f
    }
    """.formatted(name, balance);
\`\`\`

## Регулярные выражения

\`\`\`java
// Маскировка карты: оставить только последние 4 цифры
String masked = "4081781000000001".replaceAll("\\\\d(?=\\\\d{4})", "*");
// → ************0001

// Проверка email
boolean valid = email.matches("[\\\\w.+-]+@[\\\\w-]+\\\\.[\\\\w.]+");
\`\`\`
    `
  },

  l08: {
    title: 'Урок 8: Математика и BigDecimal',
    content: `
# Математика и числа

## Класс Math

\`\`\`java
Math.abs(-500)      // 500 — модуль
Math.min(100, 200)  // 100 — минимум
Math.max(100, 200)  // 200 — максимум
Math.pow(2, 10)     // 1024.0 — степень
Math.sqrt(144)      // 12.0 — квадратный корень
Math.round(4.6)     // 5 — ближайшее целое
Math.floor(4.9)     // 4.0 — вниз
Math.ceil(4.1)      // 5.0 — вверх
Math.log10(1000)    // 3.0
\`\`\`

## BigDecimal — ОБЯЗАТЕЛЬНО для денег!

> ⚠️ **Никогда** не используй double/float для финансовых вычислений!
> \`0.1 + 0.2 = 0.30000000000000004\` — ошибка представления!

\`\`\`java
// ВСЕГДА создавай через строку, не через double!
BigDecimal principal = new BigDecimal("100000.00");
BigDecimal rate      = new BigDecimal("0.085");

// Арифметика
BigDecimal interest = principal.multiply(rate);
BigDecimal total    = principal.add(interest);

// Деление — ВСЕГДА указывай scale и RoundingMode!
BigDecimal monthly = interest.divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);

// Сравнение — используй compareTo, не equals!
int cmp = total.compareTo(new BigDecimal("100000")); // -1, 0, 1
\`\`\`

## RoundingMode

\`\`\`java
new BigDecimal("1.555").setScale(2, RoundingMode.HALF_UP)   // 1.56
new BigDecimal("1.555").setScale(2, RoundingMode.HALF_DOWN) // 1.55
new BigDecimal("2.5").setScale(0,  RoundingMode.HALF_EVEN)  // 2 (банковское!)
new BigDecimal("3.5").setScale(0,  RoundingMode.HALF_EVEN)  // 4 (банковское!)
\`\`\`

## Формула сложных процентов

\`\`\`
A = P * (1 + r/n)^(n*t)
P = начальная сумма
r = годовая ставка (0.10 = 10%)
n = количество начислений в год
t = срок в годах
\`\`\`

\`\`\`java
BigDecimal base = BigDecimal.ONE.add(r.divide(new BigDecimal(n), 10, HALF_UP));
BigDecimal A    = P.multiply(base.pow(n * t)).setScale(2, HALF_UP);
\`\`\`

## Random

\`\`\`java
Random rng = new Random(42);          // seed для воспроизводимости
rng.nextInt(100)                      // 0..99
rng.nextInt(10, 100)                  // 10..99 (Java 17+)
rng.nextDouble()                      // 0.0..1.0

ThreadLocalRandom.current().nextInt(100_000, 999_999)  // OTP
\`\`\`
    `
  },

  l09: {
    title: 'Урок 9: Классы и Объекты',
    content: `
# Классы и Объекты

## Encapsulation (инкапсуляция)

\`\`\`java
public class BankAccount {
    private String id;          // private — только класс видит
    private double balance;
    private String owner;

    // Конструктор
    public BankAccount(String id, String owner, double initialBalance) {
        this.id = id;
        this.owner = owner;
        this.balance = initialBalance;
    }

    // Геттеры
    public String getId()      { return id; }
    public double getBalance() { return balance; }

    // Бизнес-методы с валидацией
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Сумма должна быть > 0");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Недостаточно средств");
        balance -= amount;
    }

    @Override
    public String toString() {
        return String.format("BankAccount{id='%s', owner='%s', balance=%.2f}", id, owner, balance);
    }
}
\`\`\`

## Builder Pattern

\`\`\`java
Client client = new Client.Builder()
    .fullName("Алиса Иванова")
    .email("alice@bank.ru")
    .phone("+7-999-123-45-67")
    .build();
\`\`\`

## Static методы и поля

\`\`\`java
public class BankAccount {
    private static int counter = 0;       // shared по всем объектам

    public static int getCount() {        // static метод
        return counter;
    }

    public static final String CURRENCY = "RUB";  // константа
}
\`\`\`
    `
  },

  l10: {
    title: 'Урок 10: Наследование',
    content: `
# Наследование

## extends

\`\`\`java
public abstract class Account {
    protected String id;
    protected BigDecimal balance;

    public abstract void withdraw(BigDecimal amount);  // обязателен в подклассе

    public BigDecimal getBalance() { return balance; }
}

public class DebitAccount extends Account {
    @Override
    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0)
            throw new InsufficientFundsException("Недостаточно средств");
        balance = balance.subtract(amount);
    }
}

public class CreditAccount extends Account {
    private BigDecimal creditLimit;

    @Override
    public void withdraw(BigDecimal amount) {
        BigDecimal available = balance.add(creditLimit);
        if (amount.compareTo(available) > 0)
            throw new InsufficientFundsException("Превышен кредитный лимит");
        balance = balance.subtract(amount);
    }
}
\`\`\`

## super — вызов родителя

\`\`\`java
public class SavingsAccount extends Account {
    private BigDecimal interestRate;

    public SavingsAccount(String id, BigDecimal balance, BigDecimal rate) {
        super(id, balance);     // вызов конструктора родителя
        this.interestRate = rate;
    }

    public void accrueInterest() {
        BigDecimal interest = balance.multiply(interestRate);
        balance = balance.add(interest);
    }
}
\`\`\`
    `
  },

  l11: {
    title: 'Урок 11: Полиморфизм и Интерфейсы',
    content: `
# Полиморфизм и Интерфейсы

## Интерфейсы

\`\`\`java
public interface Transactional {
    void deposit(BigDecimal amount);
    void withdraw(BigDecimal amount);
    BigDecimal getBalance();

    // Default метод (реализация в интерфейсе)
    default boolean hasSufficientFunds(BigDecimal amount) {
        return getBalance().compareTo(amount) >= 0;
    }
}

// Один класс может реализовывать много интерфейсов
public class DebitAccount extends Account
        implements Transactional, Printable, Auditable {
    // ...
}
\`\`\`

## Полиморфизм

\`\`\`java
// Массив разных типов счетов
Account[] accounts = {
    new DebitAccount(...),
    new CreditAccount(...),
    new SavingsAccount(...)
};

// Один код — разное поведение
for (Account acc : accounts) {
    acc.withdraw(new BigDecimal("1000"));  // каждый по-своему!
}
\`\`\`

## instanceof и Pattern Matching (Java 16+)

\`\`\`java
// Старый способ
if (acc instanceof SavingsAccount) {
    SavingsAccount sa = (SavingsAccount) acc;
    sa.accrueInterest();
}

// Новый способ (Java 16+)
if (acc instanceof SavingsAccount sa) {
    sa.accrueInterest();  // sa уже приведён!
}

// Pattern matching switch (Java 21)
String type = switch (acc) {
    case DebitAccount d   -> "Дебетовый";
    case CreditAccount c  -> "Кредитный, лимит: " + c.getCreditLimit();
    case SavingsAccount s -> "Накопительный, ставка: " + s.getRate();
    default               -> "Неизвестный";
};
\`\`\`
    `
  },

  l12: {
    title: 'Урок 12: Коллекции',
    content: `
# Коллекции Java

## List — упорядоченный список

\`\`\`java
List<String> accounts = new ArrayList<>();
accounts.add("ACC001");
accounts.add("ACC002");
accounts.get(0);          // "ACC001"
accounts.size();          // 2
accounts.contains("ACC001"); // true
accounts.remove("ACC001");
Collections.sort(accounts);

// Неизменяемый список
List<String> fixed = List.of("A", "B", "C");
\`\`\`

## Set — уникальные элементы

\`\`\`java
Set<String> emails = new HashSet<>();
emails.add("alice@bank.ru");
emails.add("alice@bank.ru");  // дубликат!
emails.size();                // 1 — только уникальные

// LinkedHashSet — сохраняет порядок добавления
// TreeSet — сортирует автоматически
\`\`\`

## Map — ключ → значение

\`\`\`java
Map<String, Double> balances = new HashMap<>();
balances.put("ACC001", 50_000.0);
balances.get("ACC001");           // 50000.0
balances.getOrDefault("ACC999", 0.0); // 0.0

// Итерация
for (Map.Entry<String, Double> e : balances.entrySet()) {
    System.out.printf("%s: %.2f%n", e.getKey(), e.getValue());
}

// Лямбда
balances.forEach((key, val) -> System.out.println(key + " → " + val));
\`\`\`

## Queue и Deque

\`\`\`java
Queue<String> queue = new LinkedList<>();
queue.offer("TX001");    // добавить
queue.peek();            // посмотреть первый
queue.poll();            // взять первый

Deque<String> stack = new ArrayDeque<>();
stack.push("TX001");     // push на вершину
stack.pop();             // снять с вершины
\`\`\`
    `
  },

  l14: {
    title: 'Урок 14: Stream API и Lambdas',
    content: `
# Stream API и Lambda-выражения

## Lambda — функция как объект

\`\`\`java
// Обычный метод
Comparator<Account> byBalance = new Comparator<>() {
    @Override
    public int compare(Account a, Account b) {
        return a.getBalance().compareTo(b.getBalance());
    }
};

// Lambda (короче)
Comparator<Account> byBalance = (a, b) -> a.getBalance().compareTo(b.getBalance());

// Ещё короче — method reference
Comparator<Account> byBalance = Comparator.comparing(Account::getBalance);
\`\`\`

## Stream API

\`\`\`java
List<Transaction> txList = ...;

// Сумма всех положительных транзакций
BigDecimal totalDeposits = txList.stream()
    .filter(tx -> tx.amount().compareTo(BigDecimal.ZERO) > 0)
    .map(Transaction::amount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);

// Группировка по типу
Map<String, List<Transaction>> byType = txList.stream()
    .collect(Collectors.groupingBy(Transaction::type));

// Топ-5 крупнейших транзакций
List<Transaction> top5 = txList.stream()
    .sorted(Comparator.comparing(Transaction::amount).reversed())
    .limit(5)
    .toList();
\`\`\`

## Optional — избегаем NullPointerException

\`\`\`java
Optional<Client> client = clients.stream()
    .filter(c -> c.getId().equals(id))
    .findFirst();

// Использование
String name = client
    .map(Client::getName)
    .orElse("Неизвестный");

// Выброс исключения если пусто
Client c = client.orElseThrow(() -> new ClientNotFoundException(id));
\`\`\`
    `
  },

  l13: {
    title: 'Урок 13: Структуры данных',
    content: `
# Структуры данных своими руками

## LinkedList (связный список)

\`\`\`java
public class LinkedList<T> {
    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }

    private Node<T> head;
    private int size;

    public void addFirst(T value) {
        Node<T> node = new Node<>(value);
        node.next = head;
        head = node;
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T val = head.data;
        head = head.next;
        size--;
        return val;
    }

    public int size() { return size; }
}
\`\`\`

## Stack (стек) — LIFO

\`\`\`java
// Реализация через ArrayDeque (встроенная, быстрая)
Deque<String> stack = new ArrayDeque<>();
stack.push("операция1");    // добавить наверх
stack.push("операция2");
stack.peek();               // посмотреть верхний: "операция2"
stack.pop();                // снять верхний: "операция2"

// Применение: проверка скобок
boolean isBalanced(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[') st.push(c);
        else if (c == ')' && (st.isEmpty() || st.pop() != '(')) return false;
        else if (c == ']' && (st.isEmpty() || st.pop() != '[')) return false;
    }
    return st.isEmpty();
}
\`\`\`

## Queue (очередь) — FIFO

\`\`\`java
Queue<String> queue = new LinkedList<>();
queue.offer("задача1");     // добавить в конец
queue.offer("задача2");
queue.peek();               // посмотреть первый
queue.poll();               // взять первый: "задача1"
\`\`\`

## HashMap — как работает внутри

\`\`\`
1. key.hashCode() → вычислить хэш
2. hash % capacity → индекс бакета
3. Если бакет занят → сравнить через equals()
4. При коллизии → цепочка / красно-чёрное дерево (Java 8+)
5. При load factor > 0.75 → resize (×2)
\`\`\`

\`\`\`java
// Своя упрощённая HashMap
public class SimpleMap<K, V> {
    private Object[][] buckets = new Object[16][];

    public void put(K key, V value) {
        int idx = Math.abs(key.hashCode()) % buckets.length;
        // ... добавить в бакет
    }
}
\`\`\`

## Бинарное дерево поиска (BST)

\`\`\`java
class BST {
    record Node(int val, Node left, Node right) {}

    Node insert(Node root, int val) {
        if (root == null) return new Node(val, null, null);
        if (val < root.val()) return new Node(root.val(), insert(root.left(), val), root.right());
        if (val > root.val()) return new Node(root.val(), root.left(), insert(root.right(), val));
        return root; // duplicate
    }

    void inOrder(Node root) {        // обход → отсортированный вывод
        if (root == null) return;
        inOrder(root.left());
        System.out.print(root.val() + " ");
        inOrder(root.right());
    }
}
\`\`\`

## Когда что использовать?

| Задача | Структура |
|--------|-----------|
| Быстрый доступ по индексу | ArrayList / массив |
| Частые вставки/удаления в середину | LinkedList |
| Уникальные значения | HashSet |
| Отсортированные уникальные значения | TreeSet |
| Пары ключ-значение | HashMap |
| Стек (LIFO) | ArrayDeque |
| Очередь (FIFO) | ArrayDeque / LinkedList |
    `
  },

  l15: {
    title: 'Урок 15: Generics',
    content: `
# Дженерики (Generics)

## Зачем нужны

\`\`\`java
// Без дженериков — ClassCastException в рантайме!
List list = new ArrayList();
list.add("Алиса");
list.add(42);
String name = (String) list.get(1); // ← ClassCastException!

// С дженериками — ошибка компиляции (безопасно)
List<String> names = new ArrayList<>();
names.add("Алиса");
names.add(42); // ← ошибка компиляции
\`\`\`

## Generic класс

\`\`\`java
public class Repository<T> {
    private final List<T> items = new ArrayList<>();

    public void add(T item) { items.add(item); }

    public Optional<T> findById(String id) {
        return items.stream()
            .filter(item -> item.getId().equals(id))
            .findFirst();
    }

    public List<T> findAll() { return Collections.unmodifiableList(items); }
}

// Использование
Repository<Client> clients = new Repository<>();
Repository<Account> accounts = new Repository<>();
\`\`\`

## Generic метод

\`\`\`java
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

String s = max("abc", "xyz");    // "xyz"
Integer n = max(42, 100);        // 100
\`\`\`

## Wildcards (символы подстановки)

\`\`\`java
// ? extends T — можно только читать (producer)
double totalBalance(List<? extends Account> accounts) {
    return accounts.stream().mapToDouble(Account::getBalance).sum();
}

// ? super T — можно только добавлять (consumer)
void addAll(List<? super Client> target, List<Client> source) {
    target.addAll(source);
}

// Правило PECS: Producer → extends, Consumer → super
\`\`\`

## Bounded type parameters

\`\`\`java
// T должен реализовывать Comparable
public <T extends Comparable<T>> T findMin(List<T> list) {
    return list.stream().min(Comparator.naturalOrder()).orElseThrow();
}

// T должен быть Account и Serializable
public <T extends Account & Serializable> void save(T account) { ... }
\`\`\`

## Type Erasure

\`\`\`java
// Дженерики существуют только при компиляции!
// В байт-коде List<String> и List<Integer> — одно и то же: List
// Поэтому нельзя: new T(), T.class, instanceof List<String>
\`\`\`
    `
  },

  l16: {
    title: 'Урок 16: Паттерны проектирования',
    content: `
# Паттерны проектирования (Design Patterns)

## Singleton — один объект на всю программу

\`\`\`java
// Thread-safe Singleton через enum (рекомендуется)
public enum DatabaseConfig {
    INSTANCE;
    private final String url = System.getenv("DB_URL");
    public String getUrl() { return url; }
}

// Использование
DatabaseConfig.INSTANCE.getUrl();

// Через double-checked locking (классика)
public class ConnectionPool {
    private static volatile ConnectionPool instance;

    private ConnectionPool() { /* инициализация пула */ }

    public static ConnectionPool getInstance() {
        if (instance == null) {
            synchronized (ConnectionPool.class) {
                if (instance == null) instance = new ConnectionPool();
            }
        }
        return instance;
    }
}
\`\`\`

## Factory / Factory Method

\`\`\`java
public abstract class AccountFactory {
    public abstract Account createAccount(String owner, double balance);

    // Factory Method
    public static Account of(String type, String owner, double balance) {
        return switch (type) {
            case "DEBIT"   -> new DebitAccount(owner, balance);
            case "CREDIT"  -> new CreditAccount(owner, balance, 100_000);
            case "SAVINGS" -> new SavingsAccount(owner, balance, 0.08);
            default -> throw new IllegalArgumentException("Неизвестный тип: " + type);
        };
    }
}
\`\`\`

## Builder — пошаговое создание объекта

\`\`\`java
public class TransactionRequest {
    private final String fromAccount;
    private final String toAccount;
    private final BigDecimal amount;
    private final String description;
    private final boolean notify;

    private TransactionRequest(Builder b) {
        this.fromAccount = b.fromAccount;
        this.toAccount   = b.toAccount;
        this.amount      = b.amount;
        this.description = b.description;
        this.notify      = b.notify;
    }

    public static class Builder {
        private final String fromAccount;
        private final String toAccount;
        private final BigDecimal amount;
        private String description = "";
        private boolean notify = false;

        public Builder(String from, String to, BigDecimal amount) {
            this.fromAccount = from; this.toAccount = to; this.amount = amount;
        }
        public Builder description(String d) { this.description = d; return this; }
        public Builder notify(boolean n)     { this.notify = n; return this; }
        public TransactionRequest build()    { return new TransactionRequest(this); }
    }
}

// Использование
var req = new TransactionRequest.Builder("ACC001", "ACC002", new BigDecimal("5000"))
    .description("Оплата аренды")
    .notify(true)
    .build();
\`\`\`

## Observer — подписка на события

\`\`\`java
// Встроенный в Java: EventListener pattern
interface TransactionListener {
    void onTransaction(Transaction tx);
}

class NotificationService implements TransactionListener {
    @Override
    public void onTransaction(Transaction tx) {
        System.out.println("SMS: " + tx.amount() + " руб. на " + tx.account());
    }
}

class Account {
    private final List<TransactionListener> listeners = new ArrayList<>();

    public void addListener(TransactionListener l) { listeners.add(l); }

    public void transfer(Account to, BigDecimal amount) {
        balance = balance.subtract(amount);
        to.balance = to.balance.add(amount);
        var tx = new Transaction(id, to.id, amount);
        listeners.forEach(l -> l.onTransaction(tx));
    }
}
\`\`\`

## Strategy — сменный алгоритм

\`\`\`java
@FunctionalInterface
interface FeeStrategy {
    BigDecimal calculate(BigDecimal amount);
}

class TransactionService {
    private FeeStrategy feeStrategy;

    public void setFeeStrategy(FeeStrategy strategy) { this.feeStrategy = strategy; }

    public void process(BigDecimal amount) {
        BigDecimal fee = feeStrategy.calculate(amount);
        System.out.println("Комиссия: " + fee);
    }
}

// Использование с лямбдами
service.setFeeStrategy(amount -> amount.multiply(new BigDecimal("0.01")));   // 1%
service.setFeeStrategy(amount -> new BigDecimal("50"));                       // фиксированная
service.setFeeStrategy(amount -> amount.compareTo(new BigDecimal("10000")) > 0
    ? amount.multiply(new BigDecimal("0.005"))   // 0.5% для крупных
    : new BigDecimal("50"));                      // 50 руб. для мелких
\`\`\`
    `
  },

  l17: {
    title: 'Урок 17: Потоки и Concurrency',
    content: `
# Многопоточность (Concurrency)

## Thread — создание потока

\`\`\`java
// Способ 1: Runnable (рекомендуется)
Thread t = new Thread(() -> {
    System.out.println("Поток: " + Thread.currentThread().getName());
});
t.start();
t.join();  // подождать завершения

// Способ 2: extends Thread (редко используется)
class WorkerThread extends Thread {
    @Override
    public void run() { /* ... */ }
}
\`\`\`

## ExecutorService — пул потоков

\`\`\`java
// Фиксированный пул из 4 потоков
ExecutorService pool = Executors.newFixedThreadPool(4);

// Отправить задачу
Future<BigDecimal> future = pool.submit(() -> {
    return calculateInterest(accountId);  // возвращает результат
});

BigDecimal result = future.get(5, TimeUnit.SECONDS);  // подождать результат

pool.shutdown();  // мягкая остановка (ждёт задачи)
pool.awaitTermination(10, TimeUnit.SECONDS);
\`\`\`

## Проблема гонки (Race Condition)

\`\`\`java
// НЕБЕЗОПАСНО — два потока одновременно меняют баланс!
class UnsafeAccount {
    private double balance = 1000;

    void deposit(double amount) {
        balance += amount;  // НЕ атомарная операция!
    }
}

// БЕЗОПАСНО 1: synchronized
class SafeAccount {
    private double balance = 1000;

    synchronized void deposit(double amount) { balance += amount; }
    synchronized void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException();
        balance -= amount;
    }
}

// БЕЗОПАСНО 2: ReentrantLock (гибче)
class LockAccount {
    private final ReentrantLock lock = new ReentrantLock();
    private double balance;

    void deposit(double amount) {
        lock.lock();
        try { balance += amount; }
        finally { lock.unlock(); }
    }
}
\`\`\`

## AtomicInteger, AtomicLong

\`\`\`java
// Счётчик транзакций — потокобезопасный без synchronized
AtomicLong txCounter = new AtomicLong(0);
long txId = txCounter.incrementAndGet();

// CAS (compare-and-swap) — основа атомиков
AtomicInteger version = new AtomicInteger(1);
boolean updated = version.compareAndSet(1, 2);  // если == 1, поставить 2
\`\`\`

## Virtual Threads (Java 21) — революция

\`\`\`java
// До Java 21: каждый поток = OS thread (дорого, ~1MB стека)
// Java 21: виртуальные потоки — миллионы потоков на JVM!
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 100_000; i++) {
        final int id = i;
        executor.submit(() -> processAccount(id));
    }
}
\`\`\`

## Deadlock — как избежать

\`\`\`java
// DEADLOCK: поток 1 держит lockA, ждёт lockB
//            поток 2 держит lockB, ждёт lockA

// Решение: всегда захватывать блокировки в одном порядке!
void transfer(Account from, Account to, double amount) {
    Account first  = from.id < to.id ? from : to;
    Account second = from.id < to.id ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.balance -= amount;
            to.balance   += amount;
        }
    }
}
\`\`\`
    `
  },

  l18: {
    title: 'Урок 18: Асинхронность',
    content: `
# CompletableFuture — асинхронное программирование

## Основы

\`\`\`java
// Запустить задачу асинхронно (в ForkJoinPool)
CompletableFuture<BigDecimal> cf = CompletableFuture.supplyAsync(() -> {
    return fetchBalanceFromDB(accountId);  // не блокирует текущий поток
});

// Получить результат (блокирует текущий поток!)
BigDecimal balance = cf.get();

// Лучше — обработать когда готово:
cf.thenAccept(balance -> System.out.println("Баланс: " + balance));
\`\`\`

## Цепочка операций

\`\`\`java
CompletableFuture<String> report = CompletableFuture
    .supplyAsync(() -> fetchClient(clientId))           // получить клиента
    .thenApply(client -> fetchAccounts(client.getId()))  // получить счета
    .thenApply(accounts -> generateReport(accounts))     // создать отчёт
    .exceptionally(ex -> "Ошибка: " + ex.getMessage()); // обработать ошибку

// Методы трансформации:
// thenApply(fn)   — как map() в Stream, не асинхронно
// thenCompose(fn) — как flatMap(), для вложенных CF
// thenAccept(fn)  — получить результат, ничего не возвращать
// thenRun(fn)     — запустить после завершения, без результата
\`\`\`

## Несколько задач параллельно

\`\`\`java
CompletableFuture<Client>  clientCF  = CompletableFuture.supplyAsync(() -> fetchClient(id));
CompletableFuture<Account> accountCF = CompletableFuture.supplyAsync(() -> fetchAccount(id));
CompletableFuture<List<Transaction>> txCF = CompletableFuture.supplyAsync(() -> fetchTx(id));

// Дождаться ВСЕХ (как Promise.all)
CompletableFuture.allOf(clientCF, accountCF, txCF).join();
Client  client  = clientCF.join();
Account account = accountCF.join();

// Взять ПЕРВЫЙ результат (как Promise.race)
CompletableFuture<String> fastest = CompletableFuture.anyOf(cache1CF, cache2CF)
    .thenApply(obj -> (String) obj);
\`\`\`

## Обработка ошибок

\`\`\`java
CompletableFuture<BigDecimal> result = CompletableFuture
    .supplyAsync(() -> {
        if (network.isDown()) throw new RuntimeException("Сеть недоступна");
        return fetchBalance();
    })
    .handle((balance, ex) -> {
        if (ex != null) {
            log.error("Ошибка: " + ex.getMessage());
            return BigDecimal.ZERO;  // дефолтное значение
        }
        return balance;
    });
\`\`\`

## Timeout (Java 9+)

\`\`\`java
CompletableFuture<String> withTimeout = CompletableFuture
    .supplyAsync(() -> slowOperation())
    .orTimeout(3, TimeUnit.SECONDS)           // исключение если > 3с
    .completeOnTimeout("дефолт", 3, TimeUnit.SECONDS); // значение если > 3с
\`\`\`
    `
  },

  l19: {
    title: 'Урок 19: Spring Core & DI',
    content: `
# Spring Boot — основы

## Что такое Spring Boot

Spring Boot = Spring Framework + автоконфигурация + embedded Tomcat

\`\`\`java
@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class BankApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankApplication.class, args);
    }
}
\`\`\`

## Dependency Injection (DI) — внедрение зависимостей

\`\`\`java
// Компонент — бин Spring
@Service
public class TransactionService {
    private final AccountRepository accountRepo;
    private final NotificationService notifications;

    // Внедрение через конструктор (рекомендуется)
    public TransactionService(AccountRepository accountRepo,
                               NotificationService notifications) {
        this.accountRepo   = accountRepo;
        this.notifications = notifications;
    }

    public void transfer(String fromId, String toId, BigDecimal amount) {
        Account from = accountRepo.findById(fromId).orElseThrow();
        Account to   = accountRepo.findById(toId).orElseThrow();
        from.withdraw(amount);
        to.deposit(amount);
        accountRepo.save(from);
        accountRepo.save(to);
        notifications.sendAlert(fromId, "Перевод " + amount + " выполнен");
    }
}
\`\`\`

## Аннотации бинов

| Аннотация | Назначение |
|-----------|-----------|
| \`@Component\` | Любой бин |
| \`@Service\` | Бизнес-логика |
| \`@Repository\` | Работа с БД |
| \`@Controller\` / \`@RestController\` | HTTP-обработчики |
| \`@Configuration\` | Конфигурационный класс |

## Жизненный цикл бина

\`\`\`java
@Service
public class CacheService {
    @PostConstruct
    void init() {
        // Выполнится после создания бина и внедрения зависимостей
        loadFromDB();
    }

    @PreDestroy
    void cleanup() {
        // Выполнится перед уничтожением бина
        flushToCache();
    }
}
\`\`\`

## application.properties / application.yml

\`\`\`yaml
# application.yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bankdb
    username: \${DB_USER:postgres}
    password: \${DB_PASS:secret}
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: validate

bank:
  max-transfer-amount: 1000000
  fee-rate: 0.01
\`\`\`

\`\`\`java
@Value("\${bank.fee-rate}")
private BigDecimal feeRate;

// Или через @ConfigurationProperties
@ConfigurationProperties(prefix = "bank")
public record BankConfig(BigDecimal maxTransferAmount, BigDecimal feeRate) {}
\`\`\`
    `
  },

  l20: {
    title: 'Урок 20: Spring MVC & REST API',
    content: `
# Spring MVC — REST API

## @RestController

\`\`\`java
@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    // GET /api/accounts
    @GetMapping
    public List<AccountDto> getAllAccounts() {
        return service.findAll();
    }

    // GET /api/accounts/{id}
    @GetMapping("/{id}")
    public AccountDto getAccount(@PathVariable String id) {
        return service.findById(id)
            .orElseThrow(() -> new AccountNotFoundException(id));
    }

    // POST /api/accounts
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountDto createAccount(@Valid @RequestBody CreateAccountRequest req) {
        return service.create(req);
    }

    // PUT /api/accounts/{id}/deposit
    @PutMapping("/{id}/deposit")
    public AccountDto deposit(@PathVariable String id,
                               @RequestBody DepositRequest req) {
        return service.deposit(id, req.amount());
    }

    // DELETE /api/accounts/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable String id) {
        service.delete(id);
    }
}
\`\`\`

## Request / Response DTO

\`\`\`java
// Запрос
public record CreateAccountRequest(
    @NotBlank String owner,
    @NotNull @DecimalMin("0") BigDecimal initialBalance,
    @NotBlank String type
) {}

// Ответ
public record AccountDto(
    String id,
    String owner,
    BigDecimal balance,
    String type,
    LocalDateTime createdAt
) {}
\`\`\`

## Обработка ошибок

\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccountNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(AccountNotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return new ErrorResponse("VALIDATION_ERROR", msg);
    }

    record ErrorResponse(String code, String message) {}
}
\`\`\`

## Query параметры и фильтрация

\`\`\`java
// GET /api/transactions?account=ACC001&from=2024-01-01&limit=50
@GetMapping("/transactions")
public Page<TransactionDto> getTransactions(
    @RequestParam String account,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
    @RequestParam(defaultValue = "50") int limit,
    Pageable pageable
) {
    return transactionService.findByAccount(account, from, pageable);
}
\`\`\`
    `
  },

  l21: {
    title: 'Урок 21: Spring Data JPA',
    content: `
# Spring Data JPA

## Entity — объект базы данных

\`\`\`java
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String owner;

    @Column(precision = 15, scale = 2)
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    private AccountType type;  // DEBIT, CREDIT, SAVINGS

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Version
    private int version;  // Optimistic locking

    // геттеры/сеттеры...
}
\`\`\`

## Отношения между сущностями

\`\`\`java
@Entity
public class Client {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Account> accounts = new ArrayList<>();
}

@Entity
public class Account {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();
}
\`\`\`

## Repository

\`\`\`java
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // Spring генерирует SQL из имени метода!
    List<Account> findByOwner(String owner);
    List<Account> findByBalanceGreaterThan(BigDecimal amount);
    Optional<Account> findByIdAndType(Long id, AccountType type);
    long countByType(AccountType type);

    // Кастомный JPQL
    @Query("SELECT a FROM Account a WHERE a.balance > :min ORDER BY a.balance DESC")
    List<Account> findRichAccounts(@Param("min") BigDecimal min);

    // Нативный SQL
    @Query(value = "SELECT * FROM accounts WHERE owner ILIKE :name", nativeQuery = true)
    List<Account> searchByName(@Param("name") String name);
}
\`\`\`

## Транзакции

\`\`\`java
@Service
@Transactional
public class TransactionService {

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepo.findById(fromId).orElseThrow();
        Account to   = accountRepo.findById(toId).orElseThrow();

        if (from.getBalance().compareTo(amount) < 0)
            throw new InsufficientFundsException();

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        // JPA автоматически сохранит изменения в конце транзакции (dirty checking)
    }

    @Transactional(readOnly = true)  // оптимизация — нет dirty checking
    public List<Account> getAccounts() {
        return accountRepo.findAll();
    }
}
\`\`\`
    `
  },

  l22: {
    title: 'Урок 22: Spring Security',
    content: `
# Spring Security — аутентификация и авторизация

## Базовая конфигурация (JWT)

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())   // для REST API
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/accounts/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // cost factor 12
    }
}
\`\`\`

## JWT Token

\`\`\`java
// Зависимость: io.jsonwebtoken:jjwt-api
@Component
public class JwtService {
    @Value("\${jwt.secret}") private String secret;
    @Value("\${jwt.expiration}") private long expiration;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .subject(user.getUsername())
            .claim("roles", user.getAuthorities())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getKey())
            .compact();
    }

    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isExpired(token);
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
\`\`\`

## Контроллер аутентификации

\`\`\`java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        var user = new User(req.email(),
            passwordEncoder.encode(req.password()), List.of(new SimpleGrantedAuthority("ROLE_USER")));
        userRepo.save(user);
        return ResponseEntity.ok(new AuthResponse(jwtService.generateToken(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        var user = userRepo.findByEmail(req.email()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(jwtService.generateToken(user)));
    }
}
\`\`\`

## Защита методов аннотациями

\`\`\`java
@EnableMethodSecurity  // в Security конфиге
...

@Service
public class AccountService {
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
    public Account getAccount(String userId, Long accountId) { ... }

    @PostAuthorize("returnObject.owner == authentication.name")
    public Account findById(Long id) { ... }

    @Secured("ROLE_ADMIN")
    public void deleteAccount(Long id) { ... }
}
\`\`\`
    `
  },

  l23: {
    title: 'Урок 23: SQL Основы',
    content: `
# SQL для Java-разработчика

## Основные команды

\`\`\`sql
-- Создание таблицы
CREATE TABLE accounts (
    id      BIGSERIAL PRIMARY KEY,
    owner   VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    type    VARCHAR(20) CHECK (type IN ('DEBIT','CREDIT','SAVINGS')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Вставка
INSERT INTO accounts (owner, balance, type)
VALUES ('Алиса Иванова', 50000.00, 'DEBIT');

-- Выборка
SELECT owner, balance FROM accounts WHERE balance > 10000 ORDER BY balance DESC;

-- Обновление
UPDATE accounts SET balance = balance + 5000 WHERE id = 1;

-- Удаление
DELETE FROM accounts WHERE id = 1;
\`\`\`

## JOIN — объединение таблиц

\`\`\`sql
SELECT c.name, a.balance, t.amount, t.created_at
FROM clients c
JOIN accounts a ON a.client_id = c.id
JOIN transactions t ON t.account_id = a.id
WHERE t.created_at >= NOW() - INTERVAL '30 days'
ORDER BY t.created_at DESC;
\`\`\`

## Агрегация

\`\`\`sql
SELECT
    client_id,
    COUNT(*) AS tx_count,
    SUM(amount) AS total,
    AVG(amount) AS average,
    MAX(amount) AS max_tx
FROM transactions
WHERE amount > 0
GROUP BY client_id
HAVING COUNT(*) > 5
ORDER BY total DESC;
\`\`\`

## Индексы (производительность)

\`\`\`sql
CREATE INDEX idx_accounts_owner ON accounts(owner);
CREATE INDEX idx_transactions_date ON transactions(created_at);
\`\`\`

## JDBC в Java

\`\`\`java
try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = conn.prepareStatement(
         "SELECT * FROM accounts WHERE balance > ?")) {
    ps.setDouble(1, 10000);
    ResultSet rs = ps.executeQuery();
    while (rs.next()) {
        System.out.println(rs.getString("owner") + ": " + rs.getDouble("balance"));
    }
}
\`\`\`
    `
  },

  l24: {
    title: 'Урок 24: PostgreSQL & JDBC',
    content: `
# PostgreSQL & JDBC

## Подключение к PostgreSQL

\`\`\`xml
<!-- pom.xml -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
</dependency>
\`\`\`

\`\`\`java
String url  = "jdbc:postgresql://localhost:5432/bankdb";
String user = "postgres";
String pass = "secret";

Connection conn = DriverManager.getConnection(url, user, pass);
\`\`\`

## Connection Pool (HikariCP) — обязательно для продакшна

\`\`\`java
// В Spring Boot подключается автоматически
// application.yml:
// spring.datasource.url: jdbc:postgresql://localhost/bankdb
// spring.datasource.hikari.maximum-pool-size: 10

// Ручная настройка
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/bankdb");
config.setMaximumPoolSize(10);
config.setMinimumIdle(2);
config.setConnectionTimeout(30_000);
DataSource ds = new HikariDataSource(config);
\`\`\`

## PreparedStatement — безопасные запросы

\`\`\`java
// НИКОГДА не делай так! — SQL Injection!
String bad = "SELECT * FROM users WHERE name = '" + name + "'";

// ПРАВИЛЬНО — параметры через ?
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(
         "INSERT INTO transactions(from_id, to_id, amount, note) VALUES (?, ?, ?, ?)")) {

    ps.setString(1, fromId);
    ps.setString(2, toId);
    ps.setBigDecimal(3, amount);
    ps.setString(4, note);
    int rows = ps.executeUpdate();  // возвращает кол-во изменённых строк
}
\`\`\`

## Транзакции в JDBC

\`\`\`java
Connection conn = ds.getConnection();
conn.setAutoCommit(false);  // отключить автокоммит!
try {
    // Снять с первого счёта
    try (PreparedStatement ps = conn.prepareStatement(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?")) {
        ps.setBigDecimal(1, amount);
        ps.setString(2, fromId);
        ps.executeUpdate();
    }
    // Зачислить на второй
    try (PreparedStatement ps = conn.prepareStatement(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
        ps.setBigDecimal(1, amount);
        ps.setString(2, toId);
        ps.executeUpdate();
    }
    conn.commit();
} catch (Exception e) {
    conn.rollback();  // откатить если ошибка!
    throw e;
} finally {
    conn.setAutoCommit(true);
    conn.close();
}
\`\`\`

## Полезные фичи PostgreSQL

\`\`\`sql
-- UUID как первичный ключ
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner TEXT NOT NULL,
    balance NUMERIC(15,2) NOT NULL DEFAULT 0
);

-- JSONB — хранение JSON с поиском
ALTER TABLE clients ADD COLUMN metadata JSONB;
SELECT * FROM clients WHERE metadata->>'vip' = 'true';

-- Полнотекстовый поиск
SELECT * FROM clients WHERE to_tsvector('russian', name) @@ to_tsquery('russian', 'Иванов');

-- EXPLAIN ANALYZE — анализ запроса
EXPLAIN ANALYZE SELECT * FROM accounts WHERE owner = 'Алиса';
\`\`\`
    `
  },

  l25: {
    title: 'Урок 25: JPA & Hibernate',
    content: `
# JPA & Hibernate — ORM в Java

## Что такое ORM

ORM (Object-Relational Mapping) — автоматическое отображение таблиц БД в Java-классы.

\`\`\`
БД таблица accounts    ←→   Java класс Account
  id BIGINT            ←→   Long id
  owner VARCHAR        ←→   String owner
  balance NUMERIC      ←→   BigDecimal balance
\`\`\`

## Маппинг связей

\`\`\`java
// One-to-Many: Клиент имеет много счетов
@Entity
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accounts = new ArrayList<>();

    public void addAccount(Account account) {
        accounts.add(account);
        account.setClient(this);  // синхронизировать обе стороны!
    }
}

// Many-to-Many: Клиент имеет много продуктов, продукт у многих клиентов
@Entity
public class Client {
    @ManyToMany
    @JoinTable(name = "client_products",
        joinColumns = @JoinColumn(name = "client_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> products = new HashSet<>();
}
\`\`\`

## Проблема N+1 запросов

\`\`\`java
// ПЛОХО — 1 запрос для клиентов + N запросов для счетов каждого!
List<Client> clients = clientRepo.findAll();
for (Client c : clients) {
    System.out.println(c.getAccounts().size()); // lazy load = доп. запрос!
}

// ХОРОШО — JOIN FETCH = один запрос
@Query("SELECT c FROM Client c LEFT JOIN FETCH c.accounts")
List<Client> findAllWithAccounts();

// Или @EntityGraph
@EntityGraph(attributePaths = {"accounts", "accounts.transactions"})
List<Client> findAll();
\`\`\`

## Inheritance стратегии

\`\`\`java
// SINGLE_TABLE — все подклассы в одной таблице (быстрее, NULL в столбцах)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "account_type")
public abstract class Account { ... }

@Entity @DiscriminatorValue("CREDIT")
public class CreditAccount extends Account {
    private BigDecimal creditLimit;
}

// JOINED — отдельная таблица для каждого (нормализация, JOIN при выборке)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Account { ... }
\`\`\`

## Кэширование (2nd Level Cache)

\`\`\`java
// 1st level cache: встроен в EntityManager (сессию), автоматически
// 2nd level cache: между сессиями, нужно настраивать

@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Account { ... }

// application.yml
// spring.jpa.properties.hibernate.cache.use_second_level_cache: true
// spring.jpa.properties.hibernate.cache.region.factory_class: jcache
\`\`\`

## Audit — кто и когда изменил

\`\`\`java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}

@Entity
public class Account extends Auditable { ... }

// В конфиге
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
\`\`\`
    `
  },
}
