'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'oop',
  title: 'ООП в Java',
  icon: '🏗️',
  description: 'Классы, наследование, интерфейсы, полиморфизм, исключения, дженерики',
  color: '#8b5cf6',
  chapters: [

    /* ═══════════════════════════════════════════════════════
       CHAPTER 1 — Классы и объекты
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch1',
      title: 'Классы и объекты',
      lecture: `<h2>Классы и объекты</h2>

<p>ООП (объектно-ориентированное программирование) — это способ организации кода вокруг
<strong>объектов</strong>, которые объединяют данные и поведение. Четыре столпа ООП:</p>

<ul>
  <li><strong>Инкапсуляция</strong> — скрываем внутреннее устройство, показываем только нужный интерфейс</li>
  <li><strong>Наследование</strong> — новый класс строится на основе уже существующего</li>
  <li><strong>Полиморфизм</strong> — один интерфейс, разное поведение для разных типов</li>
  <li><strong>Абстракция</strong> — работаем с обобщёнными понятиями, скрывая детали реализации</li>
</ul>

<div class="note"><strong>Аналогия:</strong> Класс — это <em>чертёж</em> дома. Объект — конкретный дом, построенный по этому чертежу. Можно построить сколько угодно домов по одному чертежу, и каждый будет своим независимым экземпляром.</div>

<h3>Структура класса</h3>
<pre><code>public class BankAccount {

    // ── Поля (состояние объекта) ──────────────────────────
    private String owner;          // private — доступ только внутри класса
    private double balance;
    private static int totalAccounts = 0;  // static — одно на весь класс

    // ── Конструктор ───────────────────────────────────────
    public BankAccount(String owner, double initialBalance) {
        this.owner   = owner;           // this — ссылка на текущий объект
        this.balance = initialBalance;
        totalAccounts++;                // считаем созданные счета
    }

    // Перегрузка конструктора — можно иметь несколько
    public BankAccount(String owner) {
        this(owner, 0.0);  // вызов другого конструктора этого класса
    }

    // ── Методы (поведение) ────────────────────────────────
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }

    // ── Геттеры / сеттеры ─────────────────────────────────
    public double getBalance() { return balance; }
    public String getOwner()   { return owner;   }
    public static int getTotal() { return totalAccounts; }

    // ── toString — вывод объекта в строку ─────────────────
    @Override
    public String toString() {
        return "BankAccount{owner=" + owner + ", balance=" + balance + "}";
    }
}</code></pre>

<h3>Создание объектов</h3>
<pre><code>BankAccount acc1 = new BankAccount("Иван", 1000.0);
BankAccount acc2 = new BankAccount("Мария");    // balance = 0

acc1.deposit(500);
System.out.println(acc1.withdraw(200));  // true
System.out.println(acc1.getBalance());   // 1300.0
System.out.println(acc1);               // BankAccount{owner=Иван, balance=1300.0}
System.out.println(BankAccount.getTotal()); // 2  (статический вызов)</code></pre>

<h3>Модификаторы доступа — инкапсуляция</h3>
<table>
<tr><th>Модификатор</th><th>Свой класс</th><th>Пакет</th><th>Подкласс</th><th>Везде</th></tr>
<tr><td><code>private</code></td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td><code>package</code> (по умолч.)</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
<tr><td><code>protected</code></td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
<tr><td><code>public</code></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
</table>

<h3>this — ссылка на текущий объект</h3>
<pre><code>public class Point {
    private int x, y;

    public Point(int x, int y) {
        this.x = x;   // this.x — поле класса, x — параметр метода
        this.y = y;
    }

    // Метод возвращает this — позволяет цепочку вызовов (builder-style)
    public Point move(int dx, int dy) {
        this.x += dx;
        this.y += dy;
        return this;
    }
}

Point p = new Point(0, 0).move(3, 4).move(1, 1);
// можно цепочкой вызовов</code></pre>

<h3>Статические члены</h3>
<pre><code>public class MathHelper {
    public static final double PI = 3.14159265; // константа

    // Статический метод — вызывается без объекта
    public static double circleArea(double r) {
        return PI * r * r;
    }
}

double area = MathHelper.circleArea(5); // не нужен new MathHelper()</code></pre>

<h3>equals и hashCode</h3>
<pre><code>// Оператор == сравнивает ССЫЛКИ, equals — СОДЕРЖИМОЕ
String a = new String("Hello");
String b = new String("Hello");
System.out.println(a == b);      // false (разные объекты в памяти)
System.out.println(a.equals(b)); // true  (одинаковое содержимое)

// В своих классах нужно переопределять equals:
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof BankAccount ba)) return false;
    return owner.equals(ba.owner);
}

@Override
public int hashCode() {
    return Objects.hash(owner);  // всегда переопределяйте вместе с equals
}</code></pre>

<div class="tip"><strong>Правило:</strong> поля всегда <code>private</code>, доступ через <code>get/set</code>. Если поле только для чтения — только геттер. Переопределяйте <code>toString()</code> для удобной отладки.</div>
<div class="warning"><strong>Помните:</strong> <code>==</code> для объектов сравнивает адреса в памяти, а не значения. Используйте <code>equals()</code>.</div>`,

      tasks: [
        {
          id: 'oop_t1', title: 'Класс Student', difficulty: 'easy',
          description: '<p>Создайте класс <code>Student</code> с полями <code>name</code> (String) и <code>grade</code> (int, оценка 1–5). Добавьте конструктор, геттеры и метод <code>toString()</code>. Создайте объект и выведите его.</p>',
          hints: ['private String name; private int grade;', '@Override public String toString() { return "Student{name=" + name + ", grade=" + grade + "}"; }'],
          startCode: `public class Main {
    static class Student {
        // TODO: поля name (String) и grade (int)

        // TODO: конструктор Student(String name, int grade)

        // TODO: геттеры getName() и getGrade()

        // TODO: toString()
    }

    public static void main(String[] args) {
        Student s = new Student("Алиса", 5);
        System.out.println(s.getName());  // Алиса
        System.out.println(s.getGrade()); // 5
        System.out.println(s);            // Student{name=Алиса, grade=5}
    }
}`
        },
        {
          id: 'oop_t1b', title: 'Класс Rectangle', difficulty: 'easy',
          description: '<p>Создайте класс <code>Rectangle</code> с полями <code>width</code> и <code>height</code>. Методы: <code>area()</code> — площадь, <code>perimeter()</code> — периметр. Создайте прямоугольник 4×6 и выведите оба значения.</p>',
          hints: ['area = width * height', 'perimeter = 2 * (width + height)'],
          startCode: `public class Main {
    static class Rectangle {
        private double width, height;

        Rectangle(double width, double height) {
            this.width  = width;
            this.height = height;
        }

        double area() {
            // TODO: площадь
            return 0;
        }

        double perimeter() {
            // TODO: периметр
            return 0;
        }
    }

    public static void main(String[] args) {
        Rectangle r = new Rectangle(4, 6);
        System.out.println("Площадь: "   + r.area());      // 24.0
        System.out.println("Периметр: "  + r.perimeter()); // 20.0
    }
}`
        },
        {
          id: 'oop_t1c', title: 'Класс Circle', difficulty: 'easy',
          description: '<p>Создайте класс <code>Circle</code> с полем <code>radius</code>. Методы: <code>area()</code> (π×r²), <code>circumference()</code> (2πr), <code>isLargerThan(Circle c)</code>. Используйте <code>Math.PI</code>.</p>',
          hints: ['Math.PI * radius * radius', 'this.radius > other.radius'],
          startCode: `public class Main {
    static class Circle {
        private double radius;
        Circle(double radius) { this.radius = radius; }

        double area()          { return Math.PI * radius * radius; }
        double circumference() { return 2 * Math.PI * radius; }

        boolean isLargerThan(Circle other) {
            // TODO: сравните радиусы
            return false;
        }
    }

    public static void main(String[] args) {
        Circle c1 = new Circle(5), c2 = new Circle(3);
        System.out.printf("Площадь c1: %.2f%n",  c1.area()); // 78.54
        System.out.println("c1 > c2: " + c1.isLargerThan(c2)); // true
    }
}`
        },
        {
          id: 'oop_t2', title: 'Счётчик объектов (static)', difficulty: 'easy',
          description: '<p>Создайте класс <code>Counter</code> со <strong>статическим</strong> полем <code>count</code>, которое увеличивается при каждом создании объекта. Создайте 3 объекта и выведите <code>Counter.getCount()</code>.</p>',
          hints: ['private static int count = 0;', 'В конструкторе: count++;', 'static int getCount() { return count; }'],
          startCode: `public class Main {
    static class Counter {
        private static int count = 0;

        Counter() {
            // TODO: увеличьте count
        }

        static int getCount() { return count; }
    }

    public static void main(String[] args) {
        new Counter();
        new Counter();
        new Counter();
        System.out.println(Counter.getCount()); // 3
    }
}`
        },
        {
          id: 'oop_t2b', title: 'Цепочка вызовов (Builder-style)', difficulty: 'easy',
          description: '<p>Создайте класс <code>StringBuilder2</code> (упрощённый). Методы <code>append(String s)</code> и <code>prepend(String s)</code> должны возвращать <code>this</code>, чтобы можно было писать цепочку вызовов. Метод <code>build()</code> возвращает итоговую строку.</p>',
          hints: ['return this; — чтобы цепочка работала', 'private String content = "";'],
          startCode: `public class Main {
    static class StringBuilder2 {
        private String content = "";

        StringBuilder2 append(String s) {
            content += s;
            return this; // возвращаем себя для цепочки
        }

        StringBuilder2 prepend(String s) {
            // TODO: добавьте s перед content, верните this
            return this;
        }

        String build() { return content; }
    }

    public static void main(String[] args) {
        String result = new StringBuilder2()
            .append("World")
            .prepend("Hello, ")
            .append("!")
            .build();
        System.out.println(result); // Hello, World!
    }
}`
        },
        {
          id: 'oop_t3', title: 'Банковский счёт', difficulty: 'medium',
          description: '<p>Реализуйте класс <code>BankAccount</code> с полями <code>owner</code>, <code>balance</code>. Методы: <code>deposit(amount)</code>, <code>withdraw(amount)</code> (возвращает <code>false</code> если недостаточно средств), <code>transfer(BankAccount to, double amount)</code>.</p>',
          hints: ['withdraw: if (balance >= amount) { balance -= amount; return true; }', 'transfer: this.withdraw(amount) && to.deposit(...) — или проверьте вручную'],
          startCode: `public class Main {
    static class BankAccount {
        private String owner;
        private double balance;

        BankAccount(String owner, double balance) {
            this.owner   = owner;
            this.balance = balance;
        }

        void deposit(double amount) {
            if (amount > 0) balance += amount;
        }

        boolean withdraw(double amount) {
            // TODO: проверьте баланс, спишите, верните true/false
            return false;
        }

        boolean transfer(BankAccount to, double amount) {
            // TODO: снимите с this и зачислите на to
            return false;
        }

        double getBalance() { return balance; }
        public String toString() { return owner + ": " + balance; }
    }

    public static void main(String[] args) {
        BankAccount a = new BankAccount("Иван", 1000);
        BankAccount b = new BankAccount("Мария", 500);
        System.out.println(a.withdraw(200));       // true
        System.out.println(a.withdraw(2000));      // false
        System.out.println(a.transfer(b, 300));    // true
        System.out.println(a);  // Иван: 500.0
        System.out.println(b);  // Мария: 800.0
    }
}`
        },
        {
          id: 'oop_t3b', title: 'Класс Time', difficulty: 'medium',
          description: '<p>Создайте класс <code>Time</code> с полями <code>hours</code>, <code>minutes</code>, <code>seconds</code>. Метод <code>addSeconds(int s)</code> прибавляет секунды с переносом в минуты и часы. <code>toString()</code> выводит "HH:MM:SS".</p>',
          hints: ['seconds += s; minutes += seconds / 60; seconds %= 60; hours = (hours + minutes / 60) % 24; minutes %= 60;', 'String.format("%02d:%02d:%02d", hours, minutes, seconds)'],
          startCode: `public class Main {
    static class Time {
        private int hours, minutes, seconds;

        Time(int h, int m, int s) {
            this.hours = h; this.minutes = m; this.seconds = s;
        }

        void addSeconds(int s) {
            // TODO: добавьте секунды с переносом в минуты и часы
        }

        public String toString() {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        }
    }

    public static void main(String[] args) {
        Time t = new Time(23, 59, 45);
        System.out.println(t);          // 23:59:45
        t.addSeconds(20);
        System.out.println(t);          // 00:00:05
        t.addSeconds(3661);
        System.out.println(t);          // 01:01:06
    }
}`
        },
        {
          id: 'oop_t4', title: 'Неизменяемый класс Money', difficulty: 'medium',
          description: '<p>Создайте <strong>immutable</strong> класс <code>Money</code>. Все поля <code>final</code>, нет сеттеров. Метод <code>add(Money other)</code> возвращает <em>новый</em> объект, не изменяя текущий. Метод <code>multiply(double factor)</code> — тоже новый объект.</p>',
          hints: ['private final double amount; private final String currency;', 'add(): return new Money(this.amount + other.amount, this.currency);'],
          startCode: `public class Main {
    static final class Money {
        private final double amount;
        private final String currency;

        Money(double amount, String currency) {
            this.amount   = amount;
            this.currency = currency;
        }

        Money add(Money other) {
            // TODO: верните НОВЫЙ объект, не изменяйте this
            return null;
        }

        Money multiply(double factor) {
            // TODO: верните НОВЫЙ объект
            return null;
        }

        double getAmount()   { return amount; }
        public String toString() { return String.format("%.2f %s", amount, currency); }
    }

    public static void main(String[] args) {
        Money m1 = new Money(100, "RUB");
        Money m2 = new Money(50, "RUB");
        Money m3 = m1.add(m2);
        System.out.println(m1);            // 100.00 RUB (не изменился!)
        System.out.println(m3);            // 150.00 RUB
        System.out.println(m1.multiply(1.1)); // 110.00 RUB
    }
}`
        },
        {
          id: 'oop_t4b', title: 'Матрица 2×2', difficulty: 'hard',
          description: '<p>Реализуйте класс <code>Matrix2x2</code> для матрицы 2×2. Методы: <code>add(Matrix2x2 m)</code> — сложение, <code>multiply(Matrix2x2 m)</code> — умножение матриц, <code>det()</code> — определитель (ad - bc).</p>',
          hints: ['Поля: a, b, c, d (элементы матрицы)', 'multiply: новый a = this.a*m.a + this.b*m.c', 'det = a*d - b*c'],
          startCode: `public class Main {
    static class Matrix2x2 {
        private final double a, b, c, d;
        // [a b]
        // [c d]

        Matrix2x2(double a, double b, double c, double d) {
            this.a=a; this.b=b; this.c=c; this.d=d;
        }

        Matrix2x2 add(Matrix2x2 m) {
            return new Matrix2x2(a+m.a, b+m.b, c+m.c, d+m.d);
        }

        Matrix2x2 multiply(Matrix2x2 m) {
            // TODO: результат = [[a*m.a+b*m.c, a*m.b+b*m.d],[c*m.a+d*m.c, c*m.b+d*m.d]]
            return null;
        }

        double det() {
            // TODO: a*d - b*c
            return 0;
        }

        public String toString() {
            return String.format("[%.1f %.1f]%n[%.1f %.1f]", a, b, c, d);
        }
    }

    public static void main(String[] args) {
        Matrix2x2 m1 = new Matrix2x2(1,2,3,4);
        Matrix2x2 m2 = new Matrix2x2(5,6,7,8);
        System.out.println("det(m1) = " + m1.det());  // -2.0
        System.out.println("m1*m2:");
        System.out.println(m1.multiply(m2));
    }
}`
        },

        /* ── SYNTAX MEMORIZATION (easy) ── */
        {
          id: 'oop_syn_1', title: '⌨️ Геттеры и сеттеры — BankAccount', difficulty: 'easy',
          description: `<p>Создайте класс <code>BankAccount</code> с приватными полями <code>owner</code> (String) и <code>balance</code> (double).</p>
<h3>Задание:</h3>
<ul>
  <li>Напишите <strong>геттер</strong> <code>getOwner()</code> и <code>getBalance()</code></li>
  <li>Напишите <strong>сеттер</strong> <code>setBalance(double amount)</code> — устанавливает баланс только если <code>amount &gt;= 0</code></li>
  <li>Метод <code>toString()</code> возвращает: <code>"[Иван: 1500.0 руб.]"</code></li>
</ul>
<div class="tip">Геттеры называются <code>get + ИмяПоля()</code>, сеттеры — <code>set + ИмяПоля()</code>. Сеттеры обычно содержат валидацию.</div>`,
          tests: [
            { description: 'Программа выводит "Иван"', check: 'contains', value: 'Иван' },
            { description: 'Баланс 1500.0 присутствует', check: 'contains', value: '1500' },
            { description: 'Неверный баланс -500 не принимается (баланс не изменился)', check: 'contains', value: '1500' },
            { description: 'Нет ошибок компиляции', check: 'noError', value: '' }
          ],
          hints: ['public double getBalance() { return balance; }', 'public void setBalance(double amount) { if (amount >= 0) this.balance = amount; }', 'toString: return "[" + owner + ": " + balance + " руб.]";'],
          startCode: `public class Main {
    static class BankAccount {
        private String owner;
        private double balance;

        BankAccount(String owner, double balance) {
            this.owner   = owner;
            this.balance = balance;
        }

        // TODO: геттер getOwner()

        // TODO: геттер getBalance()

        // TODO: сеттер setBalance(double amount) — только если amount >= 0

        // TODO: toString() — "[Иван: 1500.0 руб.]"
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Иван", 1000.0);
        acc.setBalance(1500.0);
        System.out.println(acc.getOwner());   // Иван
        System.out.println(acc.getBalance()); // 1500.0
        acc.setBalance(-500);                 // игнорируется
        System.out.println(acc.getBalance()); // 1500.0  (не изменился)
        System.out.println(acc);              // [Иван: 1500.0 руб.]
    }
}`
        },
        {
          id: 'oop_syn_2', title: '⌨️ Перегрузка конструктора — Customer', difficulty: 'easy',
          description: `<p>Создайте класс <code>Customer</code> (клиент банка) с тремя конструкторами:</p>
<ul>
  <li><code>Customer(String name)</code> — телефон = "не указан", возраст = 0</li>
  <li><code>Customer(String name, String phone)</code> — возраст = 0</li>
  <li><code>Customer(String name, String phone, int age)</code> — полный конструктор</li>
</ul>
<p>Используйте <code>this(...)</code> для вызова другого конструктора из того же класса.</p>
<div class="tip"><strong>Цепочка конструкторов:</strong> <code>this("не указан")</code> вызывает другой конструктор этого же класса. Первой строкой!</div>`,
          tests: [
            { description: 'Вывод содержит "не указан"', check: 'contains', value: 'не указан' },
            { description: 'Возраст 25 выводится', check: 'contains', value: '25' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['Customer(String name) { this(name, "не указан"); }', 'Customer(String name, String phone) { this(name, phone, 0); }', 'toString: return name + " | " + phone + " | возраст: " + age;'],
          startCode: `public class Main {
    static class Customer {
        private String name;
        private String phone;
        private int    age;

        // TODO: конструктор только с name (phone = "не указан", age = 0)
        // используй this(...)

        // TODO: конструктор с name и phone (age = 0)
        // используй this(...)

        // TODO: полный конструктор (name, phone, age)

        public String toString() {
            return name + " | " + phone + " | возраст: " + age;
        }
    }

    public static void main(String[] args) {
        Customer c1 = new Customer("Алиса");
        Customer c2 = new Customer("Борис", "+79001234567");
        Customer c3 = new Customer("Вера", "+79007654321", 25);
        System.out.println(c1); // Алиса | не указан | возраст: 0
        System.out.println(c2); // Борис | +79001234567 | возраст: 0
        System.out.println(c3); // Вера | +79007654321 | возраст: 25
    }
}`
        },
        {
          id: 'oop_syn_3', title: '⌨️ toString() и equals() — банковская карта', difficulty: 'easy',
          description: `<p>Создайте класс <code>Card</code> (банковская карта) с полями <code>number</code> (String, 16 цифр) и <code>owner</code> (String).</p>
<h3>Задание:</h3>
<ul>
  <li><code>toString()</code> — маскирует все цифры кроме последних 4: <code>"**** **** **** 1234 (Иван)"</code></li>
  <li><code>equals(Object o)</code> — две карты равны, если совпадают номера</li>
  <li><code>hashCode()</code> — используйте <code>Objects.hash(number)</code></li>
</ul>
<div class="warning"><strong>Важно:</strong> всегда переопределяйте equals и hashCode вместе!</div>`,
          tests: [
            { description: 'toString маскирует номер — есть ****', check: 'contains', value: '****' },
            { description: 'Последние 4 цифры видны (1234)', check: 'contains', value: '1234' },
            { description: 'Карты с одинаковым номером равны (true)', check: 'contains', value: 'true' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['import java.util.Objects;', 'toString: "**** **** **** " + number.substring(12) + " (" + owner + ")"', 'equals: if (!(o instanceof Card c)) return false; return number.equals(c.number);'],
          startCode: `import java.util.Objects;

public class Main {
    static class Card {
        private String number; // 16 символов
        private String owner;

        Card(String number, String owner) {
            this.number = number;
            this.owner  = owner;
        }

        // TODO: toString() — "**** **** **** XXXX (Имя)"
        // Подсказка: number.substring(12) — последние 4 символа

        // TODO: equals(Object o)

        // TODO: hashCode()
    }

    public static void main(String[] args) {
        Card c1 = new Card("1234567890121234", "Иван");
        Card c2 = new Card("1234567890121234", "Другой");
        Card c3 = new Card("9999888877776666", "Иван");

        System.out.println(c1);            // **** **** **** 1234 (Иван)
        System.out.println(c1.equals(c2)); // true  (номера одинаковые)
        System.out.println(c1.equals(c3)); // false (номера разные)
    }
}`
        },
        {
          id: 'oop_syn_4', title: '⌨️ static — счётчик клиентов банка', difficulty: 'easy',
          description: `<p>Добавьте в класс <code>BankClient</code> статические члены для отслеживания статистики банка.</p>
<h3>Задание:</h3>
<ul>
  <li>Статическое поле <code>totalClients</code> — увеличивается в конструкторе</li>
  <li>Статическое поле <code>totalBalance</code> — суммарный начальный баланс всех клиентов</li>
  <li>Статический метод <code>getStats()</code> возвращает строку: <code>"Клиентов: 3, суммарный баланс: 5000.0"</code></li>
</ul>
<div class="tip">Статические члены принадлежат <strong>классу</strong>, а не объекту. Вызывайте через <code>BankClient.getStats()</code>.</div>`,
          tests: [
            { description: 'Счётчик показывает 3 клиентов', check: 'contains', value: '3' },
            { description: 'Суммарный баланс 5000', check: 'contains', value: '5000' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['private static int totalClients = 0;', 'private static double totalBalance = 0;', 'В конструкторе: totalClients++; totalBalance += initialBalance;', 'public static String getStats() { return "Клиентов: " + totalClients + ", суммарный баланс: " + totalBalance; }'],
          startCode: `public class Main {
    static class BankClient {
        private String name;
        private double balance;

        // TODO: статическое поле totalClients (количество клиентов)
        // TODO: статическое поле totalBalance  (суммарный баланс)

        BankClient(String name, double initialBalance) {
            this.name    = name;
            this.balance = initialBalance;
            // TODO: увеличьте счётчики
        }

        // TODO: статический метод getStats()
        // возвращает "Клиентов: X, суммарный баланс: Y"
    }

    public static void main(String[] args) {
        new BankClient("Иван",   2000.0);
        new BankClient("Мария",  1500.0);
        new BankClient("Сергей", 1500.0);
        System.out.println(BankClient.getStats());
        // Клиентов: 3, суммарный баланс: 5000.0
    }
}`
        },

        /* ── BANK-THEMED TASKS (medium) ── */
        {
          id: 'oop_bank_m1', title: '🏦 Клиент с несколькими счетами', difficulty: 'medium',
          description: `<p>В настоящем банке у клиента может быть несколько счетов. Реализуйте систему:</p>
<h3>Задание:</h3>
<ul>
  <li>Класс <code>BankAccount(String id, double balance)</code> — методы <code>deposit</code>, <code>withdraw</code>, <code>getBalance</code></li>
  <li>Класс <code>Client(String name)</code> — хранит список счетов <code>List&lt;BankAccount&gt;</code></li>
  <li>Метод <code>addAccount(BankAccount a)</code> — добавляет счёт клиенту</li>
  <li>Метод <code>totalBalance()</code> — суммирует балансы всех счетов</li>
  <li>Метод <code>printAccounts()</code> — выводит все счета клиента</li>
</ul>`,
          tests: [
            { description: 'Вывод содержит имя клиента "Иван"', check: 'contains', value: 'Иван' },
            { description: 'Суммарный баланс 2500.0', check: 'contains', value: '2500' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['import java.util.ArrayList; import java.util.List;', 'private List<BankAccount> accounts = new ArrayList<>();', 'totalBalance: accounts.stream().mapToDouble(BankAccount::getBalance).sum() — или цикл for'],
          startCode: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static class BankAccount {
        private String id;
        private double balance;

        BankAccount(String id, double balance) {
            this.id      = id;
            this.balance = balance;
        }

        void deposit(double amount)  { if (amount > 0) balance += amount; }
        boolean withdraw(double amount) {
            if (amount > 0 && balance >= amount) { balance -= amount; return true; }
            return false;
        }
        double getBalance() { return balance; }
        public String toString() { return "Счёт[" + id + "]: " + balance + " руб."; }
    }

    static class Client {
        private String name;
        private List<BankAccount> accounts = new ArrayList<>();

        Client(String name) { this.name = name; }

        void addAccount(BankAccount a) {
            // TODO: добавьте счёт в список
        }

        double totalBalance() {
            // TODO: верните суммарный баланс всех счетов
            return 0;
        }

        void printAccounts() {
            System.out.println("Клиент: " + name);
            // TODO: выведите каждый счёт
        }
    }

    public static void main(String[] args) {
        Client ivan = new Client("Иван");
        ivan.addAccount(new BankAccount("ACC-001", 1000.0));
        ivan.addAccount(new BankAccount("ACC-002", 1500.0));
        ivan.printAccounts();
        System.out.println("Итого: " + ivan.totalBalance() + " руб."); // 2500.0
    }
}`
        },
        {
          id: 'oop_bank_m2', title: '💳 Кредитный калькулятор', difficulty: 'medium',
          description: `<p>Банк выдаёт кредиты. Реализуйте класс <code>Loan</code> (кредит).</p>
<h3>Задание:</h3>
<ul>
  <li>Поля: <code>principal</code> (сумма), <code>annualRate</code> (ставка %, например 12.0), <code>months</code> (срок)</li>
  <li>Метод <code>monthlyPayment()</code> — ежемесячный платёж по формуле аннуитета:<br>
  <code>M = P × r × (1+r)^n / ((1+r)^n - 1)</code><br>
  где <code>r = annualRate/100/12</code>, <code>n = months</code></li>
  <li>Метод <code>totalPayment()</code> — полная выплата: <code>monthlyPayment() × months</code></li>
  <li>Метод <code>overpayment()</code> — переплата: <code>totalPayment() - principal</code></li>
</ul>`,
          tests: [
            { description: 'Вычисляется ежемесячный платёж (примерно 2224)', check: 'contains', value: '2224' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['double r = annualRate / 100.0 / 12;', 'double pow = Math.pow(1 + r, months);', 'return principal * r * pow / (pow - 1);'],
          startCode: `public class Main {
    static class Loan {
        private double principal;  // сумма кредита
        private double annualRate; // годовая ставка, %
        private int    months;     // срок в месяцах

        Loan(double principal, double annualRate, int months) {
            this.principal  = principal;
            this.annualRate = annualRate;
            this.months     = months;
        }

        double monthlyPayment() {
            // TODO: формула аннуитетного платежа
            // r = annualRate / 100 / 12
            // M = principal * r * (1+r)^months / ((1+r)^months - 1)
            return 0;
        }

        double totalPayment()  { return monthlyPayment() * months; }
        double overpayment()   { return totalPayment() - principal; }

        public String toString() {
            return String.format(
                "Кредит: %.0f руб. на %d мес. под %.1f%%%n" +
                "Ежемесячный платёж: %.2f руб.%n" +
                "Итого выплат: %.2f руб.%n" +
                "Переплата: %.2f руб.",
                principal, months, annualRate,
                monthlyPayment(), totalPayment(), overpayment());
        }
    }

    public static void main(String[] args) {
        Loan loan = new Loan(100_000, 12.0, 48); // 100т. на 4 года под 12%
        System.out.println(loan);
        // Ежемесячный платёж: ~2633.00 руб.
    }
}`
        },
        {
          id: 'oop_bank_m3', title: '🔐 Защита аккаунта — PIN и попытки', difficulty: 'medium',
          description: `<p>Реализуйте класс <code>SecureAccount</code> — счёт с PIN-защитой.</p>
<h3>Правила:</h3>
<ul>
  <li>PIN из 4 цифр задаётся при создании</li>
  <li>Методы <code>deposit</code> и <code>withdraw</code> требуют PIN</li>
  <li>После 3 неверных попыток подряд — счёт <strong>блокируется</strong></li>
  <li>При правильном PIN счётчик попыток сбрасывается</li>
  <li>Метод <code>isBlocked()</code> — возвращает состояние блокировки</li>
</ul>`,
          tests: [
            { description: 'Успешное снятие выводит сообщение', check: 'contains', value: '500' },
            { description: 'Блокировка происходит после 3 попыток', check: 'contains', value: 'заблокирован' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['private int failedAttempts = 0;', 'private boolean blocked = false;', 'if (blocked) { System.out.println("Счёт заблокирован"); return false; }', 'if (!enteredPin.equals(pin)) { failedAttempts++; if (failedAttempts >= 3) blocked = true; return false; }'],
          startCode: `public class Main {
    static class SecureAccount {
        private String pin;
        private double balance;
        private int    failedAttempts = 0;
        private boolean blocked       = false;

        SecureAccount(String pin, double initialBalance) {
            this.pin     = pin;
            this.balance = initialBalance;
        }

        boolean deposit(String enteredPin, double amount) {
            if (!checkPin(enteredPin)) return false;
            balance += amount;
            System.out.println("Пополнено на " + amount + ". Баланс: " + balance);
            return true;
        }

        boolean withdraw(String enteredPin, double amount) {
            // TODO: проверьте PIN, проверьте баланс, спишите
            return false;
        }

        private boolean checkPin(String enteredPin) {
            // TODO: проверьте заблокирован ли счёт
            // TODO: если PIN верный — сбросьте failedAttempts, вернuте true
            // TODO: если PIN неверный — увеличьте failedAttempts, при >= 3 заблокируйте
            return false;
        }

        boolean isBlocked() { return blocked; }
        double getBalance() { return balance; }
    }

    public static void main(String[] args) {
        SecureAccount acc = new SecureAccount("1234", 1000.0);
        acc.withdraw("1234", 500.0);    // успех, баланс 500
        acc.withdraw("0000", 100.0);    // неверный PIN
        acc.withdraw("0000", 100.0);    // неверный PIN
        acc.withdraw("0000", 100.0);    // блокировка!
        acc.withdraw("1234", 100.0);    // счёт заблокирован
        System.out.println("Заблокирован: " + acc.isBlocked()); // true
    }
}`
        },

        /* ── BANK-THEMED TASK (hard) ── */
        {
          id: 'oop_bank_h1', title: '🏦 Банк — управление счетами', difficulty: 'hard',
          description: `<p>Реализуйте полноценный класс <code>Bank</code>, управляющий счетами клиентов.</p>
<h3>Требования:</h3>
<ul>
  <li><code>createAccount(String owner, double balance)</code> — создаёт счёт с уникальным ID (например "ACC-001")</li>
  <li><code>getAccount(String id)</code> — возвращает счёт по ID</li>
  <li><code>transfer(String fromId, String toId, double amount)</code> — перевод между счетами</li>
  <li><code>printStatement()</code> — выводит все счета и общий баланс банка</li>
  <li><code>topAccounts(int n)</code> — выводит N счетов с наибольшим балансом</li>
</ul>`,
          hints: ['import java.util.*; Используй HashMap<String, BankAccount>', 'ID: "ACC-" + String.format("%03d", ++counter)', 'transfer: снимаем с одного, зачисляем на другой — проверяем успех', 'topAccounts: sorted list by balance desc'],
          startCode: `import java.util.*;

public class Main {
    static class BankAccount {
        String id;
        String owner;
        double balance;

        BankAccount(String id, String owner, double balance) {
            this.id = id; this.owner = owner; this.balance = balance;
        }
        void deposit(double a)  { balance += a; }
        boolean withdraw(double a) {
            if (balance >= a) { balance -= a; return true; } return false;
        }
        public String toString() {
            return String.format("%-10s %-15s %10.2f руб.", id, owner, balance);
        }
    }

    static class Bank {
        private String name;
        private Map<String, BankAccount> accounts = new HashMap<>();
        private int counter = 0;

        Bank(String name) { this.name = name; }

        BankAccount createAccount(String owner, double balance) {
            // TODO: создайте ID ("ACC-001"), создайте счёт, добавьте в accounts
            return null;
        }

        BankAccount getAccount(String id) {
            // TODO: верните счёт или null
            return null;
        }

        boolean transfer(String fromId, String toId, double amount) {
            // TODO: снимите с fromId, зачислите на toId
            // если не хватает денег или счёт не найден — вернuте false
            return false;
        }

        void printStatement() {
            System.out.println("=== " + name + " — Выписка ===");
            System.out.printf("%-10s %-15s %10s%n", "ID", "Владелец", "Баланс");
            System.out.println("-".repeat(38));
            // TODO: выведите все счета
            double total = accounts.values().stream().mapToDouble(a -> a.balance).sum();
            System.out.println("-".repeat(38));
            System.out.printf("Итого в банке: %,.2f руб.%n", total);
        }

        void topAccounts(int n) {
            System.out.println("\\nТОП-" + n + " счетов:");
            accounts.values().stream()
                .sorted((a, b) -> Double.compare(b.balance, a.balance))
                .limit(n)
                .forEach(System.out::println);
        }
    }

    public static void main(String[] args) {
        Bank bank = new Bank("ЯваБанк");
        bank.createAccount("Иван Петров",    50_000);
        bank.createAccount("Мария Сидорова", 120_000);
        bank.createAccount("Алексей Козлов", 35_000);
        bank.createAccount("Ольга Новикова", 280_000);

        bank.transfer("ACC-001", "ACC-003", 10_000);
        bank.printStatement();
        bank.topAccounts(2);
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 2 — Наследование и полиморфизм
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch2',
      title: 'Наследование и полиморфизм',
      lecture: `<h2>Наследование и полиморфизм</h2>

<p><strong>Наследование</strong> — механизм ООП, позволяющий создать новый класс (подкласс)
на основе существующего (суперкласса). Подкласс <em>наследует</em> поля и методы родителя
и может добавлять свои или переопределять существующие.</p>

<div class="note"><strong>Аналогия:</strong> <code>Транспортное средство</code> — общее понятие.
<code>Автомобиль</code> и <code>Велосипед</code> — конкретные виды транспорта. Они разделяют
общие свойства (скорость, вес), но каждый добавляет свои особенности.</div>

<h3>Синтаксис extends и super</h3>
<pre><code>// Родительский класс
public class Animal {
    protected String name;   // protected — доступно в подклассах
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    public void eat() {
        System.out.println(name + " ест");
    }

    public String sound() { return "..."; }

    @Override
    public String toString() {
        return name + " (возраст: " + age + ")";
    }
}

// Дочерний класс — ключевое слово extends
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);   // ОБЯЗАТЕЛЬНО первой строкой!
        this.breed = breed;
    }

    @Override                    // аннотация — предупреждает компилятор
    public String sound() {
        return "Гав!";           // ПЕРЕОПРЕДЕЛЕНИЕ метода
    }

    public void fetch() {        // НОВЫЙ метод, только у Dog
        System.out.println(name + " приносит мяч");
    }

    @Override
    public String toString() {
        return super.toString() + ", порода: " + breed;
        // super.toString() — вызов метода РОДИТЕЛЯ
    }
}</code></pre>

<h3>Полиморфизм</h3>
<p>Переменная типа-родителя может хранить объект любого подкласса.
Вызов метода <strong>всегда определяется реальным типом объекта</strong>, а не типом переменной.</p>

<pre><code>Animal[] animals = {
    new Dog("Рекс", 3, "Овчарка"),
    new Cat("Мурка", 2),
    new Dog("Бобик", 5, "Дворняжка")
};

for (Animal a : animals) {
    System.out.println(a.name + " говорит: " + a.sound());
    // Java вызывает sound() у реального типа объекта
}
// Рекс говорит: Гав!
// Мурка говорит: Мяу!
// Бобик говорит: Гав!</code></pre>

<h3>Абстрактный класс</h3>
<pre><code>// abstract — нельзя создать объект, только наследовать
public abstract class Shape {
    protected String color;

    public Shape(String color) { this.color = color; }

    // abstract метод — ОБЯЗАН быть реализован в каждом подклассе
    public abstract double area();

    // Обычный метод — наследуется как есть
    public void describe() {
        System.out.printf("%s фигура, площадь: %.2f%n", color, area());
    }
}

// Shape s = new Shape("Red"); // ОШИБКА компиляции!
Shape c = new Circle("Красный", 5); // OK: Circle extends Shape</code></pre>

<h3>instanceof и приведение типов</h3>
<pre><code>Animal a = new Dog("Рекс", 3, "Овчарка");

if (a instanceof Dog) {
    Dog d = (Dog) a;    // явный каст — безопасен после instanceof
    d.fetch();
}

// Java 16+ — Pattern Matching (удобнее):
if (a instanceof Dog d) {
    d.fetch();          // d уже нужного типа
}</code></pre>

<h3>Как работает import между файлами</h3>
<p>В реальных проектах каждый класс живёт в своём <code>.java</code> файле.
Для использования класса из другого файла того же <strong>пакета</strong> — импорт не нужен.
Из другого пакета — нужен <code>import имя.пакета.ИмяКласса;</code></p>

<pre><code>// файл Animal.java
public class Animal { ... }

// файл Dog.java — тот же пакет, import не нужен!
public class Dog extends Animal { ... }

// файл Main.java
public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Рекс", 3, "Овчарка"); // просто используем
    }
}</code></pre>

<table>
<tr><th>Ключевое слово</th><th>Назначение</th></tr>
<tr><td><code>extends</code></td><td>Наследование класса (одиночное в Java)</td></tr>
<tr><td><code>super()</code></td><td>Вызов конструктора родителя (первая строка!)</td></tr>
<tr><td><code>super.method()</code></td><td>Вызов метода родителя из переопределённого</td></tr>
<tr><td><code>@Override</code></td><td>Аннотация переопределения — компилятор проверяет сигнатуру</td></tr>
<tr><td><code>abstract</code></td><td>Класс/метод без реализации, нельзя создать объект</td></tr>
<tr><td><code>final</code></td><td>Запрет наследования класса или переопределения метода</td></tr>
</table>

<div class="important"><strong>Java не поддерживает множественное наследование классов.</strong>
Класс может наследовать только <em>один</em> класс. Для "множественного наследования" используйте интерфейсы.</div>

<div class="tip">В Multi-file заданиях вы будете создавать несколько классов в отдельных файлах — как в настоящем Java-проекте! Нажмите <strong>"+ Файл"</strong> в шапке редактора чтобы добавить файл.</div>`,

      tasks: [
        {
          id: 'oop_t5', title: 'Иерархия животных', difficulty: 'easy',
          description: '<p>Создайте абстрактный класс <code>Animal</code> с полем <code>name</code> и методом <code>makeSound()</code>. Реализуйте <code>Dog</code> (выводит "Гав!") и <code>Cat</code> (выводит "Мяу!"). Создайте массив и вызовите <code>makeSound()</code> для каждого.</p>',
          hints: ['abstract class Animal { abstract void makeSound(); }', '@Override void makeSound() { System.out.println("Гав!"); }'],
          startCode: `public class Main {
    abstract static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        abstract void makeSound();
        public String toString() { return name; }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }
        @Override
        void makeSound() {
            // TODO: выведите "Гав!"
        }
    }

    static class Cat extends Animal {
        Cat(String name) { super(name); }
        @Override
        void makeSound() {
            // TODO: выведите "Мяу!"
        }
    }

    public static void main(String[] args) {
        Animal[] animals = {new Dog("Рекс"), new Cat("Мурка"), new Dog("Бобик")};
        for (Animal a : animals) {
            System.out.print(a.name + ": ");
            a.makeSound();
        }
    }
}`
        },
        {
          id: 'oop_t5b', title: 'Транспорт — maxSpeed', difficulty: 'easy',
          description: '<p>Создайте абстрактный класс <code>Vehicle</code> с полем <code>brand</code> и абстрактным методом <code>maxSpeed()</code>. Реализуйте <code>Car</code> (120), <code>Bicycle</code> (30), <code>Plane</code> (900). Найдите самый быстрый.</p>',
          hints: ['abstract int maxSpeed();', 'Перебрать массив, сравнить maxSpeed()'],
          startCode: `public class Main {
    abstract static class Vehicle {
        String brand;
        Vehicle(String brand) { this.brand = brand; }
        abstract int maxSpeed();
        public String toString() { return brand + " (" + maxSpeed() + " км/ч)"; }
    }

    static class Car     extends Vehicle { Car(String b)     { super(b); } public int maxSpeed() { return 120; } }
    static class Bicycle extends Vehicle { Bicycle(String b) { super(b); } public int maxSpeed() { return 30;  } }
    static class Plane   extends Vehicle { Plane(String b)   { super(b); } public int maxSpeed() { return 900; } }

    public static void main(String[] args) {
        Vehicle[] vs = {new Car("BMW"), new Bicycle("Trek"), new Plane("Boeing")};
        Vehicle fastest = vs[0];
        for (Vehicle v : vs) {
            System.out.println(v);
            if (v.maxSpeed() > fastest.maxSpeed()) fastest = v;
        }
        System.out.println("Самый быстрый: " + fastest);
    }
}`
        },
        {
          id: 'oop_t6', title: 'super в конструкторе', difficulty: 'easy',
          description: '<p>Создайте класс <code>Employee(name, salary)</code>. Наследуйте <code>Manager(name, salary, department)</code>. В конструкторе Manager используйте <code>super()</code>. Переопределите <code>toString()</code>.</p>',
          hints: ['super(name, salary); в конструкторе Manager', '@Override public String toString() { return super.toString() + ", отдел: " + department; }'],
          startCode: `public class Main {
    static class Employee {
        protected String name;
        protected double salary;
        Employee(String name, double salary) { this.name=name; this.salary=salary; }
        public String toString() { return name + " (зарплата: " + salary + ")"; }
        void raiseBy(double pct) { salary *= (1 + pct/100); }
    }

    static class Manager extends Employee {
        private String department;

        Manager(String name, double salary, String department) {
            // TODO: вызовите super(name, salary)
            this.department = department;
        }

        @Override
        public String toString() {
            // TODO: super.toString() + ", отдел: " + department
            return "";
        }
    }

    public static void main(String[] args) {
        Employee e = new Employee("Иван", 50000);
        Manager  m = new Manager("Алиса", 100000, "IT");
        System.out.println(e);  // Иван (зарплата: 50000.0)
        System.out.println(m);  // Алиса (зарплата: 100000.0), отдел: IT
        m.raiseBy(10);          // унаследованный метод
        System.out.println(m);  // Алиса (зарплата: 110000.0), отдел: IT
    }
}`
        },
        {
          id: 'oop_t6b', title: 'instanceof и кастинг', difficulty: 'easy',
          description: '<p>Создайте иерархию: <code>Shape</code> → <code>Circle</code>, <code>Rectangle</code>. В массиве <code>Shape[]</code> посчитайте количество кругов и прямоугольников, используя <code>instanceof</code>.</p>',
          hints: ['if (s instanceof Circle) circles++;', 'for (Shape s : shapes) { ... }'],
          startCode: `public class Main {
    abstract static class Shape { abstract double area(); }
    static class Circle    extends Shape { double r;   Circle(double r)   { this.r=r; } public double area() { return Math.PI*r*r; } }
    static class Rectangle extends Shape { double w,h; Rectangle(double w,double h){this.w=w;this.h=h;} public double area(){return w*h;} }

    public static void main(String[] args) {
        Shape[] shapes = {new Circle(3), new Rectangle(4,5), new Circle(7), new Rectangle(2,3), new Circle(1)};
        int circles = 0, rectangles = 0;
        for (Shape s : shapes) {
            // TODO: используйте instanceof для подсчёта
        }
        System.out.println("Кругов: "        + circles);     // 3
        System.out.println("Прямоугольников: " + rectangles); // 2
    }
}`
        },
        {
          id: 'oop_t7', title: 'Полиморфный калькулятор скидок', difficulty: 'medium',
          description: '<p>Создайте абстрактный класс <code>Discount</code> с методом <code>apply(double price)</code>. Реализуйте <code>PercentDiscount(percent)</code>, <code>FixedDiscount(amount)</code>, <code>NoDiscount</code>. Примените все скидки к цене 1000 руб.</p>',
          hints: ['PercentDiscount: price * (1 - percent / 100)', 'FixedDiscount: Math.max(0, price - amount)'],
          startCode: `public class Main {
    abstract static class Discount {
        abstract double apply(double price);
        abstract String description();
    }

    static class PercentDiscount extends Discount {
        private double percent;
        PercentDiscount(double percent) { this.percent = percent; }
        public double apply(double price) { return price * (1 - percent / 100); }
        public String description() { return percent + "% скидка"; }
    }

    static class FixedDiscount extends Discount {
        private double amount;
        FixedDiscount(double amount) { this.amount = amount; }
        public double apply(double price) {
            // TODO: вычтите amount, но не меньше 0
            return 0;
        }
        public String description() { return amount + " руб. фиксированная скидка"; }
    }

    static class NoDiscount extends Discount {
        public double apply(double price) { return price; }
        public String description() { return "без скидки"; }
    }

    public static void main(String[] args) {
        double price = 1000;
        Discount[] discounts = {new PercentDiscount(10), new FixedDiscount(150), new NoDiscount()};
        for (Discount d : discounts)
            System.out.printf("%s: %.2f руб.%n", d.description(), d.apply(price));
    }
}`
        },
        {
          id: 'oop_multi_t1', title: '🗂️ Иерархия животных (Multi-file)', difficulty: 'medium',
          multiFile: true,
          files: [
            {
              name: 'Animal.java',
              code: `// Базовый класс для всех животных
public abstract class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    // Абстрактный метод — каждое животное реализует по-своему
    public abstract String sound();

    // Обычный метод — наследуется всеми подклассами
    public void eat() {
        System.out.println(name + " ест");
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{name=" + name + ", age=" + age + "}";
    }
}
`
            },
            {
              name: 'Dog.java',
              code: `public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);   // вызываем конструктор Animal
        this.breed = breed;
    }

    @Override
    public String sound() {
        return "Гав!";
    }

    // Метод есть только у Dog
    public void fetch() {
        System.out.println(name + " приносит мяч");
    }

    @Override
    public String toString() {
        return super.toString() + ", порода: " + breed;
    }
}
`
            },
            {
              name: 'Cat.java',
              code: `public class Cat extends Animal {
    private boolean isIndoor;

    public Cat(String name, int age, boolean isIndoor) {
        super(name, age);
        this.isIndoor = isIndoor;
    }

    @Override
    public String sound() {
        return "Мяу!";
    }

    public void purr() {
        System.out.println(name + " мурлычет...");
    }

    @Override
    public String toString() {
        return super.toString() + ", домашняя: " + isIndoor;
    }
}
`
            },
            {
              name: 'Main.java',
              code: `public class Main {
    public static void main(String[] args) {
        // Создаём объекты — каждый класс в своём файле
        Dog dog = new Dog("Рекс", 3, "Немецкая овчарка");
        Cat cat = new Cat("Мурка", 2, true);

        // Полиморфизм: Animal[] может хранить Dog и Cat
        Animal[] animals = { dog, cat, new Dog("Бобик", 5, "Дворняжка") };

        System.out.println("=== Все животные ===");
        for (Animal a : animals) {
            System.out.println(a);
            System.out.println("  Звук: " + a.sound());
        }

        System.out.println("\n=== Специфичные методы ===");
        // TODO: с помощью instanceof вызовите fetch() у Dog и purr() у Cat
        for (Animal a : animals) {
            if (a instanceof Dog d) {
                d.fetch();
            }
            // TODO: добавьте проверку для Cat
        }
    }
}
`
            }
          ],
          description: `<p>В этом задании несколько классов живут в <strong>разных файлах</strong> — как в настоящем Java-проекте!</p>
<p>Посмотрите вкладки <code>Animal.java</code>, <code>Dog.java</code>, <code>Cat.java</code>. Классы из того же пакета используются без import.</p>
<h3>Задание:</h3>
<ul>
  <li>В <code>Main.java</code> добавьте проверку <code>instanceof Cat</code> и вызов <code>purr()</code></li>
  <li>Создайте нового кота Барсика (возраст 4, домашний) и добавьте в массив</li>
  <li>Выведите общее количество животных</li>
</ul>`,
          hints: [
            'if (a instanceof Cat c) { c.purr(); }',
            'Для добавления ещё одного кота нужно расширить массив или использовать List',
            'animals.length — количество элементов'
          ]
        },
        {
          id: 'oop_multi_t2', title: '🗂️ Геометрические фигуры (Multi-file)', difficulty: 'hard',
          multiFile: true,
          files: [
            {
              name: 'Shape.java',
              code: `// Абстрактный базовый класс для фигур
public abstract class Shape {
    private String color;

    public Shape(String color) {
        this.color = color;
    }

    public String getColor() { return color; }

    // Подклассы ОБЯЗАНЫ реализовать эти методы
    public abstract double area();
    public abstract double perimeter();
    public abstract String name();

    public void describe() {
        System.out.printf("%-12s | цвет: %-8s | площадь: %7.2f | периметр: %7.2f%n",
            name(), color, area(), perimeter());
    }
}
`
            },
            {
              name: 'Circle.java',
              code: `public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override public double area()      { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }
    @Override public String name()      { return "Круг(r=" + radius + ")"; }
}
`
            },
            {
              name: 'Rectangle.java',
              code: `public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width  = width;
        this.height = height;
    }

    @Override public double area()      { return width * height; }
    @Override public double perimeter() { return 2 * (width + height); }
    @Override public String name()      { return "Прямоугольник(" + width + "x" + height + ")"; }
}
`
            },
            {
              name: 'Triangle.java',
              code: `public class Triangle extends Shape {
    private double a, b, c;  // стороны

    public Triangle(String color, double a, double b, double c) {
        super(color);
        this.a = a; this.b = b; this.c = c;
    }

    @Override
    public double area() {
        // Формула Герона: s = (a+b+c)/2, area = sqrt(s*(s-a)*(s-b)*(s-c))
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s-a) * (s-b) * (s-c));
    }

    @Override public double perimeter() { return a + b + c; }
    @Override public String name()      { return "Треугольник(" + a + "," + b + "," + c + ")"; }
}
`
            },
            {
              name: 'Main.java',
              code: `public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle("Красный", 5),
            new Rectangle("Синий", 4, 6),
            new Triangle("Зелёный", 3, 4, 5),
            new Circle("Жёлтый", 3),
            new Rectangle("Белый", 10, 2)
        };

        System.out.println("Все фигуры:");
        System.out.println("-".repeat(65));
        for (Shape s : shapes) {
            s.describe();
        }

        // TODO: найдите фигуру с максимальной площадью
        Shape maxShape = shapes[0];
        for (Shape s : shapes) {
            // допишите условие
        }
        System.out.println("\nМаксимальная площадь: " + maxShape.name());

        // TODO: посчитайте суммарную площадь всех фигур
        double totalArea = 0;
        // ...
        System.out.printf("Суммарная площадь: %.2f%n", totalArea);
    }
}
`
            }
          ],
          description: `<p>Задача на <strong>полиморфизм с несколькими файлами</strong>. Каждая фигура — отдельный класс в своём файле.</p>
<h3>Задание:</h3>
<ul>
  <li>Завершите код в <code>Main.java</code>: найдите фигуру с максимальной площадью</li>
  <li>Посчитайте суммарную площадь всех фигур</li>
  <li>Добавьте новый файл <code>Square.java</code> — квадрат как частный случай Rectangle</li>
  <li>Добавьте 2 квадрата в массив shapes и убедитесь, что всё работает</li>
</ul>`,
          hints: [
            'if (s.area() > maxShape.area()) maxShape = s;',
            'for (Shape s : shapes) totalArea += s.area();',
            'Square extends Rectangle: Square(color, side) { super(color, side, side); }'
          ]
        },
        {
          id: 'oop_t8', title: 'Система оценок', difficulty: 'hard',
          description: '<p>Создайте абстрактный класс <code>GradeSystem</code> с методом <code>getGrade(double score)</code>. Реализуйте: <code>RussianGrades</code> (1–5), <code>LetterGrades</code> (A/B/C/D/F, US), <code>PassFail</code> (Зачёт/Незачёт, порог 60%). Для оценок {45, 62, 75, 90, 100} выведите результат каждой системы.</p>',
          hints: ['abstract String getGrade(double score);', 'RussianGrades: score>=90→5, >=75→4, >=60→3, >=50→2, else→1'],
          startCode: `public class Main {
    abstract static class GradeSystem {
        abstract String getGrade(double score);
        String name() { return getClass().getSimpleName(); }
    }

    static class RussianGrades extends GradeSystem {
        public String getGrade(double s) {
            // TODO: >=90→"5", >=75→"4", >=60→"3", >=50→"2", else→"1"
            return "";
        }
    }

    static class LetterGrades extends GradeSystem {
        public String getGrade(double s) {
            // TODO: >=90→"A", >=80→"B", >=70→"C", >=60→"D", else→"F"
            return "";
        }
    }

    static class PassFail extends GradeSystem {
        private double threshold;
        PassFail(double threshold) { this.threshold = threshold; }
        public String getGrade(double s) {
            return s >= threshold ? "Зачёт" : "Незачёт";
        }
    }

    public static void main(String[] args) {
        double[] scores = {45, 62, 75, 90, 100};
        GradeSystem[] systems = {new RussianGrades(), new LetterGrades(), new PassFail(60)};

        System.out.printf("%-6s", "Балл");
        for (GradeSystem gs : systems) System.out.printf("%-14s", gs.name());
        System.out.println();

        for (double score : scores) {
            System.out.printf("%-6.0f", score);
            for (GradeSystem gs : systems) System.out.printf("%-14s", gs.getGrade(score));
            System.out.println();
        }
    }
}`
        },

        /* ── BANK INHERITANCE TASKS ── */
        {
          id: 'oop_inherit_bank1', title: '🏦 Сберегательный счёт (наследование)', difficulty: 'easy',
          description: `<p>Расширьте базовый <code>BankAccount</code> классом <code>SavingsAccount</code> (сберегательный счёт).</p>
<h3>Задание:</h3>
<ul>
  <li><code>SavingsAccount</code> наследует <code>BankAccount</code></li>
  <li>Добавьте поле <code>interestRate</code> (% в год)</li>
  <li>Метод <code>addInterest()</code> — начисляет проценты: <code>balance += balance * interestRate / 100</code></li>
  <li>Переопределите <code>toString()</code> — используйте <code>super.toString()</code></li>
</ul>
<div class="tip">Поле <code>balance</code> в BankAccount объявлено <code>protected</code> — доступно в подклассах напрямую.</div>`,
          tests: [
            { description: 'Вывод содержит "Сберегательный"', check: 'contains', value: 'Сберегательный' },
            { description: '10% от 1000 = 1100.0', check: 'contains', value: '1100' },
            { description: 'Нет ошибок', check: 'noError', value: '' }
          ],
          hints: ['class SavingsAccount extends BankAccount {', 'super(owner, balance); // в конструкторе', 'addInterest: balance += balance * interestRate / 100;'],
          startCode: `public class Main {
    static class BankAccount {
        protected String owner;
        protected double balance;

        BankAccount(String owner, double balance) {
            this.owner = owner; this.balance = balance;
        }
        void deposit(double a) { if (a > 0) balance += a; }
        boolean withdraw(double a) {
            if (a > 0 && balance >= a) { balance -= a; return true; } return false;
        }
        double getBalance() { return balance; }
        public String toString() { return String.format("BankAccount[%s: %.2f руб.]", owner, balance); }
    }

    // TODO: класс SavingsAccount extends BankAccount
    // Поля: interestRate (double)
    // Конструктор: SavingsAccount(String owner, double balance, double interestRate)
    // Метод: void addInterest() — начислить % на баланс
    // toString(): "Сберегательный[Иван: 1100.00 руб., ставка: 10.0%]"

    public static void main(String[] args) {
        // Раскомментируйте после реализации:
        // SavingsAccount sa = new SavingsAccount("Иван", 1000.0, 10.0);
        // System.out.println(sa);
        // sa.addInterest();
        // System.out.println(sa.getBalance()); // 1100.0
        // System.out.println(sa);
    }
}`
        },
        {
          id: 'oop_inherit_bank2', title: '🏦 Иерархия счетов: Savings + Credit', difficulty: 'medium',
          description: `<p>Создайте иерархию банковских счетов:</p>
<ul>
  <li><strong>BankAccount</strong> — базовый (owner, balance, deposit/withdraw)</li>
  <li><strong>SavingsAccount</strong> — сберегательный, метод <code>addInterest(double rate%)</code></li>
  <li><strong>CreditAccount</strong> — кредитный, баланс может уходить в минус до <code>-creditLimit</code></li>
</ul>
<h3>Задание:</h3>
<ul>
  <li>В <code>CreditAccount</code> переопределите <code>withdraw</code>: разрешайте если <code>balance - amount &gt;= -creditLimit</code></li>
  <li>Метод <code>debt()</code> — возвращает долг (0 если баланс положительный)</li>
  <li>Полиморфизм: массив <code>BankAccount[]</code> — одинаково вызываем withdraw для всех</li>
</ul>`,
          hints: ['class CreditAccount extends BankAccount { private double creditLimit; }', '@Override boolean withdraw(double a) { if (balance - a >= -creditLimit) { balance -= a; return true; } return false; }', 'double debt() { return balance < 0 ? -balance : 0; }'],
          startCode: `public class Main {
    static class BankAccount {
        protected String owner;
        protected double balance;
        BankAccount(String o, double b) { owner=o; balance=b; }
        void deposit(double a) { if (a>0) balance+=a; }
        boolean withdraw(double a) {
            if (a>0 && balance>=a) { balance-=a; return true; } return false;
        }
        double getBalance() { return balance; }
        public String toString() { return owner + ": " + balance + " руб."; }
    }

    static class SavingsAccount extends BankAccount {
        SavingsAccount(String o, double b) { super(o, b); }
        void addInterest(double rate) {
            // TODO: balance += balance * rate / 100
        }
        public String toString() { return "Сберег. " + super.toString(); }
    }

    static class CreditAccount extends BankAccount {
        private double creditLimit;
        CreditAccount(String o, double b, double limit) {
            super(o, b);
            // TODO: creditLimit = limit
        }
        @Override
        boolean withdraw(double amount) {
            // TODO: разрешить уход в минус до -creditLimit
            return false;
        }
        double debt() {
            // TODO: если баланс < 0, вернуть |balance|, иначе 0
            return 0;
        }
        public String toString() { return "Кредит. " + super.toString() + " | долг: " + debt(); }
    }

    public static void main(String[] args) {
        SavingsAccount sa = new SavingsAccount("Иван", 5000);
        sa.addInterest(10);    // +500
        System.out.println(sa); // Сберег. Иван: 5500.0 руб.

        CreditAccount ca = new CreditAccount("Мария", 1000, 10000);
        System.out.println(ca.withdraw(8000)); // true  (уходит в минус)
        System.out.println(ca.withdraw(4000)); // false (превысит лимит)
        System.out.println(ca); // Кредит. Мария: -7000.0 руб. | долг: 7000.0
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 3 — Интерфейсы
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch3',
      title: 'Интерфейсы',
      lecture: `<h2>Интерфейсы в Java</h2>

<p>Интерфейс — это <strong>контракт</strong>: он описывает, что умеет объект, но не как.
Один класс может реализовать сколько угодно интерфейсов.</p>

<div class="note"><strong>interface vs abstract class:</strong>
интерфейс — только контракт (что делать), abstract class — частичная реализация (как делать частично).
Используйте интерфейс когда несвязанные классы должны разделять поведение.</div>

<h3>Объявление интерфейса</h3>
<pre><code>public interface Printable {
    void print();                   // public abstract по умолчанию

    default String format() {       // Java 8+: метод с реализацией
        return "[" + toString() + "]";
    }

    static Printable empty() {      // статический фабричный метод
        return () -> System.out.println("&lt;пусто&gt;");
    }
}

public interface Saveable {
    boolean save(String path);
    default boolean saveToTemp() { return save("/tmp/"); }
}

// Класс реализует оба интерфейса
public class Report implements Printable, Saveable {
    private String content;

    @Override public void print() { System.out.println(content); }
    @Override public boolean save(String path) { /* ... */ return true; }
}</code></pre>

<h3>Встроенные интерфейсы Java</h3>
<table>
<tr><th>Интерфейс</th><th>Метод</th><th>Назначение</th></tr>
<tr><td><code>Comparable&lt;T&gt;</code></td><td><code>compareTo(T)</code></td><td>Естественный порядок (Arrays.sort)</td></tr>
<tr><td><code>Comparator&lt;T&gt;</code></td><td><code>compare(T,T)</code></td><td>Внешний компаратор</td></tr>
<tr><td><code>Iterable&lt;T&gt;</code></td><td><code>iterator()</code></td><td>Поддержка for-each</td></tr>
<tr><td><code>Runnable</code></td><td><code>run()</code></td><td>Задача для потока</td></tr>
<tr><td><code>AutoCloseable</code></td><td><code>close()</code></td><td>try-with-resources</td></tr>
</table>

<h3>Comparable — сортировка объектов</h3>
<pre><code>public class Student implements Comparable&lt;Student&gt; {
    private String name;
    private double gpa;

    @Override
    public int compareTo(Student other) {
        // отрицательное → this меньше other
        // 0            → равны
        // положительное → this больше other
        return Double.compare(other.gpa, this.gpa); // по убыванию GPA
    }
}

Student[] students = { new Student("Боб",3.2), new Student("Аня",4.0) };
Arrays.sort(students); // вызывает compareTo автоматически</code></pre>

<h3>Функциональный интерфейс и лямбда</h3>
<pre><code>@FunctionalInterface
public interface Validator&lt;T&gt; {
    boolean validate(T value);   // ровно один абстрактный метод
}

// Реализация через лямбда-выражение
Validator&lt;String&gt; notEmpty = s -&gt; !s.isEmpty();
Validator&lt;Integer&gt; positive = n -&gt; n &gt; 0;

System.out.println(notEmpty.validate("Java")); // true
System.out.println(positive.validate(-1));      // false</code></pre>

<div class="tip"><strong>Когда использовать интерфейс:</strong> несвязанные классы должны разделять поведение (Printable, Saveable). <strong>Когда abstract class:</strong> общее состояние и частичная реализация нужны иерархии родственных классов.</div>`,

      tasks: [
        {
          id: 'oop_t9', title: 'Интерфейс Describable', difficulty: 'easy',
          description: '<p>Создайте интерфейс <code>Describable</code> с методом <code>describe()</code>. Реализуйте его в <code>Car(brand, year)</code> и <code>Book(title, author)</code>. Выведите описание обоих объектов через массив <code>Describable[]</code>.</p>',
          hints: ['interface Describable { void describe(); }', 'class Car implements Describable { ... }'],
          startCode: `public class Main {
    interface Describable {
        void describe();
    }

    static class Car implements Describable {
        String brand; int year;
        Car(String brand, int year) { this.brand=brand; this.year=year; }
        public void describe() { System.out.println("Авто: " + brand + ", год: " + year); }
    }

    static class Book implements Describable {
        String title, author;
        Book(String t, String a) { title=t; author=a; }
        public void describe() {
            // TODO: выведите "Книга: <title>, автор: <author>"
        }
    }

    public static void main(String[] args) {
        Describable[] items = { new Car("Toyota", 2022), new Book("Clean Code", "Martin") };
        for (Describable d : items) d.describe();
    }
}`
        },
        {
          id: 'oop_t9b', title: 'Интерфейс Resizable', difficulty: 'easy',
          description: '<p>Создайте интерфейс <code>Resizable</code> с методами <code>resize(double factor)</code> и <code>getSize()</code>. Реализуйте в <code>Square</code> и <code>CircleShape</code>. После <code>resize(2.0)</code> размер удваивается.</p>',
          hints: ['void resize(double factor); double getSize();', 'side *= factor; или radius *= factor;'],
          startCode: `public class Main {
    interface Resizable {
        void resize(double factor);
        double getSize();
    }

    static class Square implements Resizable {
        private double side;
        Square(double side) { this.side = side; }
        public void resize(double factor) { side *= factor; }
        public double getSize() { return side; }
        public String toString() { return "Square(" + side + ")"; }
    }

    static class CircleShape implements Resizable {
        private double radius;
        CircleShape(double radius) { this.radius = radius; }
        public void resize(double factor) { /* TODO */ }
        public double getSize() { return radius; }
        public String toString() { return "Circle(r=" + radius + ")"; }
    }

    public static void main(String[] args) {
        Resizable[] items = { new Square(4), new CircleShape(5) };
        for (Resizable r : items) {
            System.out.println("До: " + r);
            r.resize(2.0);
            System.out.println("После: " + r);
        }
    }
}`
        },
        {
          id: 'oop_t10', title: 'Comparable — сортировка Product', difficulty: 'medium',
          description: '<p>Создайте класс <code>Product(name, price)</code>, реализующий <code>Comparable&lt;Product&gt;</code> (сортировка по цене по возрастанию). Используйте <code>Arrays.sort()</code>. Дополнительно: найдите самый дешёвый и самый дорогой товар.</p>',
          hints: ['return Double.compare(this.price, other.price);', 'Arrays.sort(products);'],
          startCode: `import java.util.Arrays;

public class Main {
    static class Product implements Comparable<Product> {
        String name;
        double price;
        Product(String name, double price) { this.name=name; this.price=price; }

        @Override
        public int compareTo(Product other) {
            // TODO: сравните по цене (Double.compare)
            return 0;
        }

        public String toString() { return name + "=" + price; }
    }

    public static void main(String[] args) {
        Product[] products = {
            new Product("Чайник", 2999),
            new Product("Телефон", 45000),
            new Product("Книга", 599),
            new Product("Ноутбук", 89000)
        };
        Arrays.sort(products);
        System.out.println(Arrays.toString(products));
        System.out.println("Самый дешёвый: " + products[0]);
        System.out.println("Самый дорогой: " + products[products.length - 1]);
    }
}`
        },
        {
          id: 'oop_t10b', title: 'default методы интерфейса', difficulty: 'medium',
          description: '<p>Создайте интерфейс <code>Logger</code> с методом <code>log(String msg)</code> и <strong>default</strong> методами <code>logInfo(String)</code>, <code>logError(String)</code>. Реализуйте <code>ConsoleLogger</code> и <code>PrefixLogger(prefix)</code> переопределив <code>log()</code>.</p>',
          hints: ['default void logInfo(String msg) { log("[INFO] " + msg); }', 'default void logError(String msg) { log("[ERROR] " + msg); }'],
          startCode: `public class Main {
    interface Logger {
        void log(String message);

        default void logInfo(String msg)  { log("[INFO]  " + msg); }
        default void logError(String msg) { log("[ERROR] " + msg); }
    }

    static class ConsoleLogger implements Logger {
        public void log(String message) {
            System.out.println(message);
        }
    }

    static class PrefixLogger implements Logger {
        private String prefix;
        PrefixLogger(String prefix) { this.prefix = prefix; }
        public void log(String message) {
            // TODO: выведите prefix + ": " + message
        }
    }

    public static void main(String[] args) {
        Logger console = new ConsoleLogger();
        console.logInfo("Запуск программы");
        console.logError("Что-то пошло не так");

        Logger prefix = new PrefixLogger("MyApp");
        prefix.logInfo("Соединение установлено");
        prefix.logError("Таймаут запроса");
    }
}`
        },
        {
          id: 'oop_t11', title: 'Стратегия платежа', difficulty: 'hard',
          description: '<p>Создайте интерфейс <code>PaymentStrategy</code> с методом <code>pay(double amount)</code>. Реализуйте <code>CreditCard(number)</code>, <code>Cash</code>, <code>Crypto(wallet)</code>. Класс <code>ShoppingCart</code> хранит стратегию и вызывает <code>checkout(total)</code>.</p>',
          hints: ['class ShoppingCart { private PaymentStrategy strategy; void setStrategy(...) }', 'cart.checkout(500) вызывает strategy.pay(500)'],
          startCode: `public class Main {
    interface PaymentStrategy {
        void pay(double amount);
        default String name() { return getClass().getSimpleName(); }
    }

    static class CreditCard implements PaymentStrategy {
        private String number;
        CreditCard(String number) { this.number = number; }
        public void pay(double amount) {
            System.out.printf("Оплата картой *%s: %.2f руб.%n", number.substring(number.length()-4), amount);
        }
    }

    static class Cash implements PaymentStrategy {
        public void pay(double amount) {
            System.out.printf("Оплата наличными: %.2f руб.%n", amount);
        }
    }

    static class Crypto implements PaymentStrategy {
        private String wallet;
        Crypto(String wallet) { this.wallet = wallet; }
        public void pay(double amount) {
            // TODO: выведите "Оплата крипто (wallet): amount руб."
        }
    }

    static class ShoppingCart {
        private PaymentStrategy strategy;
        void setStrategy(PaymentStrategy s) { this.strategy = s; }
        void checkout(double amount) {
            System.out.println("Способ оплаты: " + strategy.name());
            strategy.pay(amount);
        }
    }

    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.setStrategy(new CreditCard("1234567890123456"));
        cart.checkout(1500.00);

        cart.setStrategy(new Cash());
        cart.checkout(250.00);

        cart.setStrategy(new Crypto("0xABCD1234"));
        cart.checkout(999.99);
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 4 — Исключения
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch4',
      title: 'Исключения',
      lecture: `<h2>Исключения (Exceptions)</h2>

<p>Исключение — это объект, описывающий ошибочную ситуацию. Когда Java встречает проблему,
она <strong>бросает</strong> (throw) исключение. Если его не <strong>поймать</strong> (catch) — программа завершится с ошибкой.</p>

<h3>Иерархия исключений</h3>
<pre><code>Throwable
├── Error           (OutOfMemoryError, StackOverflowError — не обрабатываем)
└── Exception
    ├── IOException         (checked — ОБЯЗАТЕЛЬНО обрабатывать)
    ├── SQLException        (checked)
    └── RuntimeException    (unchecked — необязательно обрабатывать)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── ClassCastException
        ├── NumberFormatException
        └── IllegalArgumentException</code></pre>

<div class="note"><strong>Checked vs Unchecked:</strong>
<strong>Checked</strong> (IOException, SQLException) — компилятор требует либо <code>try-catch</code>, либо <code>throws</code> в сигнатуре метода.
<strong>Unchecked</strong> (RuntimeException и наследники) — обрабатывать необязательно, возникают при ошибках программиста.</div>

<h3>try-catch-finally</h3>
<pre><code>try {
    int result = 10 / 0;           // выбросит ArithmeticException
    String s = null;
    s.length();                    // NullPointerException — не достигнем
} catch (ArithmeticException e) {
    System.out.println("Деление на ноль: " + e.getMessage());
} catch (NullPointerException e) {
    System.out.println("Null указатель: " + e.getMessage());
} catch (Exception e) {            // общий обработчик — ПОСЛЕДНИМ
    System.out.println("Другая ошибка: " + e.getClass().getSimpleName());
} finally {
    System.out.println("Выполняется ВСЕГДА — освобождение ресурсов");
}

// Multi-catch (Java 7+):
try { ... }
catch (IOException | SQLException e) { handle(e); }</code></pre>

<h3>Создание собственного исключения</h3>
<pre><code>// Unchecked — extends RuntimeException
public class InsufficientFundsException extends RuntimeException {
    private final double deficit;  // сколько не хватает

    public InsufficientFundsException(double deficit) {
        super("Недостаточно средств: не хватает " + deficit + " руб.");
        this.deficit = deficit;
    }

    public double getDeficit() { return deficit; }
}

// Использование:
public void withdraw(double amount) {
    if (amount > balance) {
        throw new InsufficientFundsException(amount - balance);
    }
    balance -= amount;
}

// Обработка:
try {
    account.withdraw(5000);
} catch (InsufficientFundsException e) {
    System.out.println(e.getMessage());
    System.out.println("Не хватает: " + e.getDeficit());
}</code></pre>

<h3>try-with-resources</h3>
<pre><code>// AutoCloseable ресурсы закрываются автоматически
try (FileReader fr = new FileReader("file.txt");
     BufferedReader br = new BufferedReader(fr)) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} // br.close() и fr.close() вызовутся автоматически, даже если было исключение</code></pre>

<h3>throw vs throws</h3>
<pre><code>// throw — бросаем исключение в коде
throw new IllegalArgumentException("Отрицательный возраст: " + age);

// throws — объявляем в сигнатуре метода (обязательно для checked)
public void readFile(String path) throws IOException {
    // ...
}</code></pre>

<div class="tip"><strong>Правила обработки исключений:</strong><br>
1. Создавайте специфичные исключения (InsufficientFundsException), а не общие (Exception)<br>
2. Не "глотайте" исключения: пустой catch { } — признак плохого кода<br>
3. Логируйте исключения или пробрасывайте их дальше<br>
4. finally используйте только для освобождения ресурсов (лучше try-with-resources)</div>
<div class="warning"><strong>Никогда:</strong> <code>catch (Exception e) { }</code> — это скрывает ошибки!</div>`,

      tasks: [
        {
          id: 'oop_t12', title: 'Деление с обработкой', difficulty: 'easy',
          description: '<p>Напишите метод <code>safeDivide(int a, int b)</code>. Если <code>b == 0</code>, поймайте <code>ArithmeticException</code> и выведите сообщение об ошибке. Проверьте несколько случаев.</p>',
          hints: ['try { return a / b; } catch (ArithmeticException e) { ... }'],
          startCode: `public class Main {
    static void safeDivide(int a, int b) {
        try {
            int result = a / b;
            System.out.println(a + " / " + b + " = " + result);
        } catch (ArithmeticException e) {
            // TODO: выведите "Ошибка: " + e.getMessage()
        }
    }

    public static void main(String[] args) {
        safeDivide(10, 2);  // 10 / 2 = 5
        safeDivide(7,  0);  // Ошибка: / by zero
        safeDivide(15, 3);  // 15 / 3 = 5
        safeDivide(0,  0);  // Ошибка
    }
}`
        },
        {
          id: 'oop_t12b', title: 'Безопасный парсинг', difficulty: 'easy',
          description: '<p>Напишите метод <code>parseIntSafe(String s)</code>, который парсит строку в число. При ошибке парсинга (NumberFormatException) — возвращает -1. Проверьте на "123", "abc", "456", "12.5".</p>',
          hints: ['try { return Integer.parseInt(s); } catch (NumberFormatException e) { return -1; }'],
          startCode: `public class Main {
    static int parseIntSafe(String s) {
        // TODO: Integer.parseInt(s), при NumberFormatException вернуть -1
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(parseIntSafe("123"));  // 123
        System.out.println(parseIntSafe("abc"));  // -1
        System.out.println(parseIntSafe("456"));  // 456
        System.out.println(parseIntSafe("12.5")); // -1
        System.out.println(parseIntSafe(""));     // -1
    }
}`
        },
        {
          id: 'oop_t12c', title: 'Валидация массива', difficulty: 'easy',
          description: '<p>Напишите метод <code>getElement(int[] arr, int index)</code>. При выходе за границы — поймайте <code>ArrayIndexOutOfBoundsException</code> и верните -999. При null массиве — <code>NullPointerException</code> поймайте и выведите сообщение.</p>',
          hints: ['catch (ArrayIndexOutOfBoundsException e) { return -999; }', 'catch (NullPointerException e) { System.out.println("Массив null"); return -999; }'],
          startCode: `public class Main {
    static int getElement(int[] arr, int index) {
        try {
            return arr[index];
        } catch (ArrayIndexOutOfBoundsException e) {
            // TODO: верните -999
            return 0;
        } catch (NullPointerException e) {
            // TODO: выведите "Массив не инициализирован", верните -999
            return 0;
        }
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        System.out.println(getElement(arr, 2));   // 30
        System.out.println(getElement(arr, 10));  // -999
        System.out.println(getElement(null, 0));  // Массив не инициализирован / -999
    }
}`
        },
        {
          id: 'oop_t13', title: 'Своё исключение AgeException', difficulty: 'medium',
          description: '<p>Создайте исключение <code>AgeException</code>. Метод <code>setAge(int age)</code> бросает его, если возраст < 0 или > 150. Поля: <code>invalidAge</code> (какое значение было передано). Обработайте в <code>main</code>.</p>',
          hints: ['class AgeException extends RuntimeException { private int invalidAge; ... }', 'if (age < 0 || age > 150) throw new AgeException(age);'],
          startCode: `public class Main {
    static class AgeException extends RuntimeException {
        private int invalidAge;

        AgeException(int age) {
            super("Некорректный возраст: " + age + " (допустимо 0-150)");
            this.invalidAge = age;
        }

        int getInvalidAge() { return invalidAge; }
    }

    static void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new AgeException(age);
        }
        System.out.println("Возраст установлен: " + age);
    }

    public static void main(String[] args) {
        int[] testAges = {25, -5, 200, 0, 150, 151};
        for (int age : testAges) {
            try {
                setAge(age);
            } catch (AgeException e) {
                System.out.println("Ошибка: " + e.getMessage());
            }
        }
    }
}`
        },
        {
          id: 'oop_t13b', title: 'Цепочка исключений', difficulty: 'medium',
          description: '<p>Создайте метод <code>loadConfig(String file)</code>. При ошибке чтения (имитируйте: если file пустой — бросайте RuntimeException) — оберните её в новое <code>ConfigException</code> с помощью <code>initCause()</code> или конструктора. В main распечатайте и причину (getCause()).</p>',
          hints: ['throw new ConfigException("Ошибка загрузки", originalException);', 'class ConfigException extends RuntimeException { ConfigException(String msg, Throwable cause) { super(msg, cause); } }'],
          startCode: `public class Main {
    static class ConfigException extends RuntimeException {
        ConfigException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static void loadConfig(String file) {
        try {
            if (file == null || file.isBlank()) {
                throw new RuntimeException("Имя файла не может быть пустым");
            }
            System.out.println("Конфиг загружен: " + file);
        } catch (RuntimeException e) {
            // TODO: оберните e в ConfigException и бросьте
            throw new ConfigException("Не удалось загрузить конфиг", e);
        }
    }

    public static void main(String[] args) {
        try {
            loadConfig("app.properties");  // успех
            loadConfig("");               // ошибка
        } catch (ConfigException e) {
            System.out.println("Ошибка: " + e.getMessage());
            System.out.println("Причина: " + e.getCause().getMessage());
        }
    }
}`
        },
        {
          id: 'oop_t14', title: 'Банковские исключения', difficulty: 'hard',
          description: '<p>Создайте иерархию исключений для банка: <code>BankException</code> (базовое), <code>InsufficientFundsException(deficit)</code>, <code>AccountFrozenException</code>. Класс <code>BankAccount</code> с полем <code>frozen</code>. При попытке снять деньги с замороженного счёта — <code>AccountFrozenException</code>. При нехватке средств — <code>InsufficientFundsException</code>.</p>',
          hints: ['class InsufficientFundsException extends BankException { private double deficit; ... }', 'if (frozen) throw new AccountFrozenException();', 'if (amount > balance) throw new InsufficientFundsException(amount - balance);'],
          startCode: `public class Main {
    static class BankException extends RuntimeException {
        BankException(String msg) { super(msg); }
    }

    static class InsufficientFundsException extends BankException {
        private double deficit;
        InsufficientFundsException(double deficit) {
            super("Не хватает средств: " + deficit + " руб.");
            this.deficit = deficit;
        }
        double getDeficit() { return deficit; }
    }

    static class AccountFrozenException extends BankException {
        AccountFrozenException() { super("Счёт заморожен"); }
    }

    static class BankAccount {
        private double balance;
        private boolean frozen;

        BankAccount(double balance) { this.balance = balance; }
        void freeze() { this.frozen = true; }

        void withdraw(double amount) {
            // TODO: если frozen — AccountFrozenException
            // TODO: если amount > balance — InsufficientFundsException
            balance -= amount;
        }

        double getBalance() { return balance; }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);

        try { acc.withdraw(1500); } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage() + " | Дефицит: " + e.getDeficit());
        }

        try { acc.withdraw(500); System.out.println("Снято 500. Остаток: " + acc.getBalance()); }
        catch (BankException e) { System.out.println(e.getMessage()); }

        acc.freeze();
        try { acc.withdraw(100); } catch (AccountFrozenException e) {
            System.out.println(e.getMessage());
        }
    }
}`
        },

        /* ── BANK EXCEPTION TASK ── */
        {
          id: 'oop_exc_bank1', title: '🏦 Исключения в банковском сервисе', difficulty: 'medium',
          description: `<p>Создайте набор исключений для банковской системы и используйте их в сервисе.</p>
<h3>Задание:</h3>
<ul>
  <li><code>InsufficientFundsException</code> — нехватка средств (хранит недостающую сумму)</li>
  <li><code>InvalidAmountException</code> — неверная сумма (отрицательная или 0)</li>
  <li><code>AccountNotFoundException</code> — счёт не найден</li>
  <li>Класс <code>BankService</code> с методами <code>deposit</code> и <code>withdraw</code>, бросающими нужные исключения</li>
  <li>В main — поймайте каждое исключение отдельным catch</li>
</ul>`,
          tests: [
            { description: 'Выводится сообщение о нехватке средств', check: 'contains', value: 'недостаточно' },
            { description: 'Выводится сообщение о неверной сумме', check: 'contains', value: 'неверная сумма' },
            { description: 'Нет необработанных исключений', check: 'noError', value: '' }
          ],
          hints: ['class InsufficientFundsException extends Exception { private double shortfall; }', 'throw new InsufficientFundsException("Недостаточно средств: не хватает " + shortfall, shortfall);', 'catch (InsufficientFundsException | InvalidAmountException e)'],
          startCode: `public class Main {

    // TODO: class InsufficientFundsException extends Exception
    // Конструктор принимает сообщение и double shortfall (недостача)
    // Метод getShortfall() возвращает shortfall

    // TODO: class InvalidAmountException extends Exception

    // TODO: class AccountNotFoundException extends Exception

    static class BankAccount {
        private String id;
        private double balance;

        BankAccount(String id, double balance) { this.id = id; this.balance = balance; }

        void deposit(double amount) throws Exception {
            // TODO: бросить InvalidAmountException если amount <= 0
            balance += amount;
        }

        void withdraw(double amount) throws Exception {
            // TODO: бросить InvalidAmountException если amount <= 0
            // TODO: бросить InsufficientFundsException если не хватает средств
            balance -= amount;
        }

        double getBalance() { return balance; }
        public String toString() { return id + ": " + balance + " руб."; }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("ACC-001", 1000.0);

        // Попытка снять больше, чем есть
        try {
            acc.withdraw(5000.0);
        } catch (Exception e) {
            System.out.println("Ошибка: " + e.getMessage()); // недостаточно средств
        }

        // Попытка внести отрицательную сумму
        try {
            acc.deposit(-100.0);
        } catch (Exception e) {
            System.out.println("Ошибка: " + e.getMessage()); // неверная сумма
        }

        System.out.println(acc); // ACC-001: 1000.0 руб.
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 5 — Generics
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch5',
      title: 'Generics (Обобщения)',
      lecture: `<h2>Generics — обобщённое программирование</h2>

<p>Generics позволяют писать классы и методы, работающие с <strong>любым типом данных</strong>,
обеспечивая <strong>безопасность типов</strong> на этапе компиляции.</p>

<div class="note">Без Generics нужен явный каст и возможна <code>ClassCastException</code> в runtime.
С Generics ошибки типов выявляются при компиляции.</div>

<h3>Зачем нужны Generics?</h3>
<pre><code>// БЕЗ generics (опасно):
List list = new ArrayList();
list.add("Hello");
list.add(42);              // можно добавить что угодно!
String s = (String) list.get(1); // ClassCastException в runtime!

// С generics (безопасно):
List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("Hello");
// list.add(42);           // ОШИБКА КОМПИЛЯЦИИ — не пройдёт
String s = list.get(0);   // без каста, безопасно</code></pre>

<h3>Обобщённый класс</h3>
<pre><code>public class Pair&lt;A, B&gt; {      // A и B — параметры типа
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first  = first;
        this.second = second;
    }

    public A getFirst()  { return first; }
    public B getSecond() { return second; }
    public Pair&lt;B, A&gt; swap() { return new Pair&lt;&gt;(second, first); }

    @Override
    public String toString() { return "(" + first + ", " + second + ")"; }
}

// Использование:
Pair&lt;String, Integer&gt; p = new Pair&lt;&gt;("Alice", 25);
Pair&lt;Integer, String&gt; swapped = p.swap(); // (25, Alice)</code></pre>

<h3>Обобщённый метод</h3>
<pre><code>// &lt;T extends Comparable&lt;T&gt;&gt; — T должен поддерживать compareTo
public static &lt;T extends Comparable&lt;T&gt;&gt; T max(T a, T b) {
    return a.compareTo(b) &gt;= 0 ? a : b;
}

System.out.println(max(3, 7));             // 7  (Integer)
System.out.println(max("apple","banana")); // banana (String)</code></pre>

<h3>Ограничения типов (Bounds)</h3>
<pre><code>// T extends Number — принимает Integer, Double, Long...
public static &lt;T extends Number&gt; double sum(List&lt;T&gt; list) {
    double total = 0;
    for (T item : list) total += item.doubleValue();
    return total;
}

// Wildcard ? — неизвестный тип
public static void printAll(List&lt;?&gt; list) {
    for (Object o : list) System.out.println(o);
}

// ? extends Animal — Animal и любой его подкласс (для чтения)
// ? super Dog      — Dog и любой его суперкласс (для записи)</code></pre>

<h3>Стирание типов (Type Erasure)</h3>
<pre><code>// В runtime тип стирается: List&lt;String&gt; → просто List
// Поэтому НЕЛЬЗЯ:
// T obj = new T();           // ошибка — тип стёрт
// T[] arr = new T[10];       // ошибка
// if (obj instanceof List&lt;String&gt;) // ошибка</code></pre>

<table>
<tr><th>Соглашение</th><th>Используется для</th></tr>
<tr><td><code>T</code></td><td>Type — общий тип</td></tr>
<tr><td><code>E</code></td><td>Element — элемент коллекции</td></tr>
<tr><td><code>K, V</code></td><td>Key, Value — ключ и значение (Map)</td></tr>
<tr><td><code>N</code></td><td>Number — числовой тип</td></tr>
<tr><td><code>R</code></td><td>Result — тип результата</td></tr>
</table>

<div class="tip">Generics — мощный инструмент для создания переиспользуемых структур данных и алгоритмов. Изучите <code>java.util.function</code> — там все стандартные функциональные интерфейсы с Generics.</div>`,

      tasks: [
        {
          id: 'oop_t15', title: 'Обобщённый Box', difficulty: 'easy',
          description: '<p>Создайте класс <code>Box&lt;T&gt;</code> который хранит одно значение. Методы: <code>put(T)</code>, <code>get()</code>, <code>isEmpty()</code>. Используйте с String и Integer.</p>',
          hints: ['class Box<T> { private T value; ... }', 'isEmpty(): value == null'],
          startCode: `public class Main {
    static class Box<T> {
        private T value;

        void put(T value)  { this.value = value; }
        T get()            { return value; }
        boolean isEmpty()  { return value == null; }
        public String toString() { return "Box[" + value + "]"; }
    }

    public static void main(String[] args) {
        Box<String> sBox = new Box<>();
        System.out.println(sBox.isEmpty()); // true
        sBox.put("Java");
        System.out.println(sBox.get());     // Java
        System.out.println(sBox.isEmpty()); // false

        Box<Integer> iBox = new Box<>();
        iBox.put(42);
        System.out.println(iBox.get() * 2); // 84
        System.out.println(iBox);           // Box[42]
    }
}`
        },
        {
          id: 'oop_t16', title: 'Пара Pair<A,B>', difficulty: 'easy',
          description: '<p>Реализуйте класс <code>Pair&lt;A, B&gt;</code> с двумя полями разных типов. Метод <code>swap()</code> возвращает новую пару с переставленными значениями. Метод <code>mapFirst(T newFirst)</code> возвращает новую пару с изменённым первым элементом.</p>',
          hints: ['swap() возвращает new Pair<>(second, first)', 'mapFirst(T v) возвращает new Pair<>(v, second)'],
          startCode: `public class Main {
    static class Pair<A, B> {
        private final A first;
        private final B second;

        Pair(A first, B second) { this.first=first; this.second=second; }
        A getFirst()  { return first; }
        B getSecond() { return second; }

        Pair<B, A> swap() {
            // TODO: верните новую пару с переставленными значениями
            return null;
        }

        <C> Pair<C, B> mapFirst(C newFirst) {
            // TODO: новая пара с newFirst и this.second
            return null;
        }

        public String toString() { return "(" + first + ", " + second + ")"; }
    }

    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("Alice", 25);
        System.out.println(p);           // (Alice, 25)
        System.out.println(p.swap());    // (25, Alice)
        System.out.println(p.mapFirst("Bob")); // (Bob, 25)
    }
}`
        },
        {
          id: 'oop_t17', title: 'Обобщённый Stack', difficulty: 'medium',
          description: '<p>Создайте обобщённый класс <code>Stack&lt;T&gt;</code> на основе ArrayList. Методы: <code>push(T)</code>, <code>pop()</code>, <code>peek()</code>, <code>size()</code>, <code>isEmpty()</code>. Протестируйте с String и Integer.</p>',
          hints: ['private List<T> data = new ArrayList<>();', 'pop(): data.remove(data.size() - 1)'],
          startCode: `import java.util.*;
public class Main {
    static class Stack<T> {
        private List<T> data = new ArrayList<>();

        void push(T item) { data.add(item); }

        T pop() {
            if (isEmpty()) throw new RuntimeException("Стек пуст");
            return data.remove(data.size() - 1);
        }

        T peek() {
            if (isEmpty()) throw new RuntimeException("Стек пуст");
            return data.get(data.size() - 1);
        }

        int size()      { return data.size(); }
        boolean isEmpty() { return data.isEmpty(); }

        public String toString() { return data.toString(); }
    }

    public static void main(String[] args) {
        Stack<String> ss = new Stack<>();
        ss.push("first"); ss.push("second"); ss.push("third");
        System.out.println(ss.peek()); // third
        System.out.println(ss.pop());  // third
        System.out.println(ss.size()); // 2

        Stack<Integer> si = new Stack<>();
        for (int i = 1; i <= 5; i++) si.push(i * 10);
        System.out.print("Pop order: ");
        while (!si.isEmpty()) System.out.print(si.pop() + " ");
        // 50 40 30 20 10
    }
}`
        },
        {
          id: 'oop_t17b', title: 'Обобщённый Repository', difficulty: 'medium',
          description: '<p>Создайте класс <code>Repository&lt;T&gt;</code> — хранилище объектов с методами: <code>add(T)</code>, <code>findById(int)</code> (по индексу), <code>getAll()</code>, <code>remove(int)</code>, <code>count()</code>. Используйте с классом <code>Product</code>.</p>',
          hints: ['private List<T> items = new ArrayList<>();', 'findById(i) возвращает items.get(i)'],
          startCode: `import java.util.*;
public class Main {
    static class Repository<T> {
        private List<T> items = new ArrayList<>();

        void add(T item)           { items.add(item); }
        T    findById(int id)      { return items.get(id); }
        List<T> getAll()           { return Collections.unmodifiableList(items); }
        T    remove(int id)        { return items.remove(id); }
        int  count()               { return items.size(); }

        public String toString()   { return items.toString(); }
    }

    static class Product {
        String name; double price;
        Product(String n, double p) { name=n; price=p; }
        public String toString() { return name + "($" + price + ")"; }
    }

    public static void main(String[] args) {
        Repository<Product> repo = new Repository<>();
        repo.add(new Product("Apple", 1.5));
        repo.add(new Product("Banana", 0.8));
        repo.add(new Product("Cherry", 3.2));

        System.out.println("Всего: " + repo.count());  // 3
        System.out.println("ID 1: "  + repo.findById(1)); // Banana($0.8)
        System.out.println(repo.getAll());
        repo.remove(1);
        System.out.println("После удаления: " + repo);
    }
}`
        },
        {
          id: 'oop_t18', title: 'Обобщённые алгоритмы', difficulty: 'hard',
          description: '<p>Напишите статические методы: <code>max(T[] arr)</code>, <code>min(T[] arr)</code>, <code>filter(T[] arr, Predicate test)</code> где T extends Comparable. Протестируйте с Integer[] и String[].</p>',
          hints: ['<T extends Comparable<T>> T max(T[] arr)', 'filter: результат - новый список где test.test(item) == true', 'Используйте java.util.function.Predicate<T>'],
          startCode: `import java.util.*;
import java.util.function.Predicate;

public class Main {

    static <T extends Comparable<T>> T max(T[] arr) {
        if (arr == null || arr.length == 0) throw new IllegalArgumentException("Массив пуст");
        T result = arr[0];
        for (T item : arr) if (item.compareTo(result) > 0) result = item;
        return result;
    }

    static <T extends Comparable<T>> T min(T[] arr) {
        // TODO: аналогично max, но ищем минимум
        return null;
    }

    static <T> List<T> filter(T[] arr, Predicate<T> test) {
        // TODO: верните список элементов, для которых test.test(item) == true
        return null;
    }

    public static void main(String[] args) {
        Integer[] nums = {3, 1, 4, 1, 5, 9, 2, 6, 5};
        System.out.println("Max: " + max(nums));  // 9
        System.out.println("Min: " + min(nums));  // 1

        String[] words = {"banana", "apple", "cherry", "date"};
        System.out.println("Max word: " + max(words));  // date
        System.out.println("Min word: " + min(words));  // apple

        List<Integer> evens = filter(nums, n -> n % 2 == 0);
        System.out.println("Чётные: " + evens); // [4, 2, 6]

        List<String> longWords = filter(words, w -> w.length() > 4);
        System.out.println("Длинные: " + longWords); // [banana, apple, cherry]
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 6 — Геттеры, сеттеры и инкапсуляция (синтаксис)
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch6',
      title: 'Геттеры, сеттеры и инкапсуляция — запоминаем синтаксис',
      lecture: `<h2>Геттеры и сеттеры — полный синтаксис</h2>

<p>Поля класса всегда <code>private</code>. Доступ снаружи — только через методы <code>getXxx()</code> и <code>setXxx()</code>.</p>

<h3>Полный шаблон класса с геттерами/сеттерами</h3>
<pre><code>public class Person {
    // ── Поля — всегда private ──────────────────────────────
    private String  name;
    private int     age;
    private String  email;
    private boolean active;   // boolean: isActive(), не getActive()

    // ── Конструктор ────────────────────────────────────────
    public Person(String name, int age, String email) {
        this.name   = name;
        this.age    = age;
        this.email  = email;
        this.active = true;
    }

    // ── Геттеры (get + ИмяПоля с большой буквы) ───────────
    public String  getName()   { return name; }
    public int     getAge()    { return age; }
    public String  getEmail()  { return email; }
    public boolean isActive()  { return active; }  // boolean → is...

    // ── Сеттеры (set + ИмяПоля с большой буквы) ───────────
    public void setName(String name)   { this.name = name; }
    public void setAge(int age) {
        if (age >= 0 && age <= 150) this.age = age;  // валидация!
    }
    public void setEmail(String email) { this.email = email; }
    public void setActive(boolean active) { this.active = active; }

    // ── toString ────────────────────────────────────────────
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age +
               ", email='" + email + "', active=" + active + "}";
    }
}

// Использование:
Person p = new Person("Alice", 25, "alice@mail.com");
System.out.println(p.getName());     // Alice
p.setAge(26);
p.setAge(-5);                        // игнорируется (валидация)
System.out.println(p.getAge());      // 26
System.out.println(p.isActive());    // true</code></pre>

<h3>Поля "только для чтения" (immutable после создания)</h3>
<pre><code>public class Point {
    private final double x;  // final → нельзя изменить
    private final double y;

    public Point(double x, double y) { this.x = x; this.y = y; }

    // Только геттеры — сеттеров нет
    public double getX() { return x; }
    public double getY() { return y; }

    // Вместо сеттера — возвращаем новый объект (immutable-стиль)
    public Point withX(double newX) { return new Point(newX, this.y); }
    public Point withY(double newY) { return new Point(this.x, newY); }
}</code></pre>

<h3>Naming conventions (обязательные правила)</h3>
<pre><code>Тип поля → геттер             → сеттер
String  name    → getName()   → setName(String name)
int     age     → getAge()    → setAge(int age)
double  salary  → getSalary() → setSalary(double salary)
boolean active  → isActive()  → setActive(boolean active)
boolean hasData → hasData()   → setHasData(boolean h)  // ИЛИ isHasData
List    items   → getItems()  → setItems(List items)</code></pre>`,
      tasks: [
        {
          id: 'oop_gs_t1', title: 'Синтаксис геттеров и сеттеров', difficulty: 'easy',
          description: '<p>Напишите класс <code>Car</code> с полями: <code>brand</code> (String), <code>speed</code> (int), <code>electric</code> (boolean). Добавьте геттеры для всех полей и сеттер для speed (только если >= 0). Создайте объект и выведите все поля.</p>',
          hints: ['boolean electric → isElectric()', 'Сеттер: if (speed >= 0) this.speed = speed;'],
          startCode: `public class Main {
    static class Car {
        private String  brand;
        private int     speed;
        private boolean electric;

        Car(String brand, int speed, boolean electric) {
            this.brand    = brand;
            this.speed    = speed;
            this.electric = electric;
        }

        // TODO: геттер getBrand()
        // TODO: геттер getSpeed()
        // TODO: геттер isElectric()
        // TODO: сеттер setSpeed(int speed) — только если >= 0

        @Override
        public String toString() {
            return "Car{brand=" + brand + ", speed=" + speed + ", electric=" + electric + "}";
        }
    }

    public static void main(String[] args) {
        Car c = new Car("Tesla", 0, true);
        c.setSpeed(120);
        System.out.println(c.getBrand());    // Tesla
        System.out.println(c.getSpeed());    // 120
        System.out.println(c.isElectric());  // true
        c.setSpeed(-10); // игнорируется
        System.out.println(c.getSpeed());    // 120
        System.out.println(c);
    }
}`
        },
        {
          id: 'oop_gs_t2', title: 'Полный POJO класс', difficulty: 'easy',
          description: '<p>Создайте POJO-класс <code>Employee</code>: поля <code>id</code> (int, readonly), <code>name</code> (String), <code>salary</code> (double, >= 0), <code>department</code> (String), <code>fullTime</code> (boolean). Геттеры — для всех. Сеттеры — для name, salary, department, fullTime.</p>',
          hints: ['id — только геттер (нет сеттера)', 'isFullTime() для boolean'],
          startCode: `public class Main {
    static class Employee {
        private int     id;       // readonly — только геттер
        private String  name;
        private double  salary;
        private String  department;
        private boolean fullTime;

        Employee(int id, String name, double salary, String department, boolean fullTime) {
            this.id         = id;
            this.name       = name;
            this.salary     = salary;
            this.department = department;
            this.fullTime   = fullTime;
        }

        // TODO: геттер getId()
        // TODO: геттер getName()    сеттер setName(String)
        // TODO: геттер getSalary()  сеттер setSalary(double) — проверка >= 0
        // TODO: геттер getDepartment()  сеттер setDepartment(String)
        // TODO: геттер isFullTime() сеттер setFullTime(boolean)

        @Override public String toString() {
            return "Employee{id=" + id + ", name=" + name + ", salary=" + salary
                 + ", dept=" + department + ", fullTime=" + fullTime + "}";
        }
    }

    public static void main(String[] args) {
        Employee e = new Employee(1, "Alice", 75000, "IT", true);
        System.out.println(e.getId());          // 1
        e.setName("Alicia");
        e.setSalary(80000);
        e.setSalary(-1000);                     // игнорируется
        e.setDepartment("Engineering");
        e.setFullTime(false);
        System.out.println(e);
    }
}`
        },
        {
          id: 'oop_gs_t3', title: 'Валидация в сеттерах', difficulty: 'easy',
          description: '<p>Класс <code>Temperature</code>: поле <code>value</code> (double) и <code>unit</code> ("C","F","K"). Сеттер setUnit() принимает только допустимые значения, setValueCelsius() не разрешает < -273.15. Геттеры также конвертируют: getCelsius(), getFahrenheit(), getKelvin().</p>',
          hints: ['Храните всегда в Цельсиях', 'F = C * 9/5 + 32', 'K = C + 273.15'],
          startCode: `public class Main {
    static class Temperature {
        private double celsius; // всегда храним в Цельсиях

        Temperature(double celsius) {
            this.celsius = Math.max(-273.15, celsius);
        }

        // TODO: getCelsius() — вернуть celsius
        // TODO: getFahrenheit() — celsius * 9/5 + 32
        // TODO: getKelvin() — celsius + 273.15
        // TODO: setCelsius(double v) — не меньше -273.15

        @Override public String toString() {
            return String.format("%.2f°C = %.2f°F = %.2fK",
                celsius, celsius*9/5+32, celsius+273.15);
        }
    }

    public static void main(String[] args) {
        Temperature t = new Temperature(100);
        System.out.println(t);                              // 100°C = 212°F = 373.15K
        System.out.printf("%.2f°F%n", t.getFahrenheit());  // 212.00°F
        System.out.printf("%.2fK%n",  t.getKelvin());      // 373.15K
        t.setCelsius(-300);   // игнорируется (< абс. нуля)
        System.out.printf("%.2f°C%n", t.getCelsius());     // -273.15
    }
}`
        },
        {
          id: 'oop_gs_t4', title: 'Immutable класс', difficulty: 'medium',
          description: '<p>Создайте immutable класс <code>Money</code>: поля <code>amount</code> (long, в копейках), <code>currency</code> (String). Нет сеттеров. Методы <code>add(Money)</code> и <code>subtract(Money)</code> возвращают новый объект Money. Метод <code>toString()</code> выводит "10.00 RUB".</p>',
          hints: ['return new Money(this.amount + other.amount, currency)', 'amount/100 + "." + amount%100'],
          startCode: `public class Main {
    static final class Money {
        private final long   amount;   // в копейках: 1000 = 10.00 руб
        private final String currency;

        Money(long amount, String currency) {
            if (amount < 0) throw new IllegalArgumentException("Сумма не может быть отрицательной");
            this.amount   = amount;
            this.currency = currency;
        }

        long   getAmount()   { return amount; }
        String getCurrency() { return currency; }

        // TODO: add(Money other) → new Money(...)
        // TODO: subtract(Money other) → new Money(...) — проверьте на отрицательность

        @Override public String toString() {
            return String.format("%d.%02d %s", amount/100, amount%100, currency);
        }
    }

    public static void main(String[] args) {
        Money price    = new Money(9900, "RUB");  // 99.00
        Money discount = new Money(1500, "RUB");  // 15.00
        System.out.println("Цена: "    + price);                  // 99.00 RUB
        System.out.println("Итого: "   + price.subtract(discount)); // 84.00 RUB
        System.out.println("Сумма: "   + price.add(discount));      // 114.00 RUB
    }
}`
        },
        {
          id: 'oop_gs_t5', title: 'Builder паттерн', difficulty: 'medium',
          description: '<p>Реализуйте Builder для класса <code>User</code>: обязательные поля — id, name; необязательные — email, phone, age. Каждый метод Builder возвращает <code>this</code>. Метод <code>build()</code> создаёт User.</p>',
          hints: ['static class Builder { private String name; ... }', 'Builder email(String e) { this.email=e; return this; }'],
          startCode: `public class Main {
    static class User {
        private final int    id;
        private final String name;
        private final String email;
        private final String phone;
        private final int    age;

        private User(Builder b) {
            this.id    = b.id;
            this.name  = b.name;
            this.email = b.email;
            this.phone = b.phone;
            this.age   = b.age;
        }

        // Геттеры
        public int    getId()    { return id; }
        public String getName()  { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public int    getAge()   { return age; }

        @Override public String toString() {
            return "User{id=" + id + ", name=" + name
                + ", email=" + email + ", phone=" + phone + ", age=" + age + "}";
        }

        // TODO: static class Builder с полями id, name, email, phone, age
        //       конструктор Builder(int id, String name)  — обязательные
        //       методы: email(), phone(), age() — возвращают this
        //       метод: build() — возвращает new User(this)
        static class Builder {
            private int    id;
            private String name;
            private String email = "";
            private String phone = "";
            private int    age   = 0;

            Builder(int id, String name) { this.id=id; this.name=name; }

            Builder email(String e) { this.email = e; return this; }
            // TODO: phone(String p) — вернуть this
            // TODO: age(int a) — вернуть this
            // TODO: build() — вернуть new User(this)
        }
    }

    public static void main(String[] args) {
        User u = new User.Builder(1, "Alice")
            .email("alice@mail.com")
            .phone("+7999111")
            .age(25)
            .build();
        System.out.println(u);
        System.out.println(u.getEmail()); // alice@mail.com
    }
}`
        }
      ]
    },

    /* ═══════════════════════════════════════════════════════
       CHAPTER 7 — Multi-file: ООП в стиле IDE
    ═══════════════════════════════════════════════════════ */
    {
      id: 'oop_ch7',
      title: 'Multi-file: ООП в стиле настоящего IDE',
      lecture: `<h2>ООП в нескольких файлах — как в настоящем проекте</h2>

<p>В реальном проекте каждый класс живёт в отдельном файле. Задачи этой главы
имитируют работу в IDE: вы видите несколько вкладок (<code>Animal.java</code>,
<code>Dog.java</code>, <code>Main.java</code>) и переключаетесь между ними.</p>

<h3>Правило "один класс — один файл"</h3>
<pre><code>// Animal.java
public class Animal { ... }

// Dog.java
public class Dog extends Animal { ... }

// Main.java
public class Main {
    public static void main(String[] args) {
        Animal d = new Dog("Бобик", 3);
        d.speak();
    }
}</code></pre>

<h3>Схема иерархии классов</h3>
<pre><code>        ┌───────────────┐
        │    Animal     │ abstract
        │  name, age    │
        │  speak()      │ abstract
        └───────┬───────┘
           ┌────┴────┐
    ┌──────┴──┐  ┌───┴──────┐
    │   Dog   │  │   Cat    │
    │ breed   │  │ isIndoor │
    │ speak() │  │ speak()  │
    └─────────┘  └──────────┘</code></pre>

<h3>Паттерны в нескольких файлах</h3>
<pre><code>// Интерфейс Drawable.java
public interface Drawable {
    void draw();
    default String getDescription() { return "Drawable object"; }
}

// Shape.java — абстрактный класс
public abstract class Shape implements Drawable {
    protected String color;
    public Shape(String color) { this.color = color; }
    public abstract double area();
}

// Circle.java
public class Circle extends Shape {
    private double radius;
    public Circle(String color, double radius) {
        super(color); this.radius = radius;
    }
    public double area()  { return Math.PI * radius * radius; }
    public void   draw()  { System.out.println("Circle r=" + radius); }
}

// Main.java
public class Main {
    public static void main(String[] args) {
        Shape s = new Circle("red", 5.0);
        System.out.printf("Area: %.2f%n", s.area());
        s.draw();
    }
}</code></pre>`,
      tasks: [
        {
          id: 'oop_mf_t1',
          title: 'Иерархия Animal',
          difficulty: 'medium',
          description: '<p>Завершите иерархию классов: <code>Animal</code> (абстрактный) → <code>Dog</code>, <code>Cat</code>. Добавьте геттеры, абстрактный метод <code>speak()</code> и переопределите его в подклассах. Запустите из Main.java.</p>',
          multiFile: true,
          files: [
            {
              name: 'Animal.java',
              code: `public abstract class Animal {
    private String name;
    private int    age;

    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    // TODO: геттер getName()
    // TODO: геттер getAge()

    // TODO: абстрактный метод speak()

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{name=" + name + ", age=" + age + "}";
    }
}`
            },
            {
              name: 'Dog.java',
              code: `public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);
        this.breed = breed;
    }

    // TODO: геттер getBreed()

    @Override
    public void speak() {
        // TODO: вывести "Гав! Я " + getName() + " (" + breed + ")"
    }
}`
            },
            {
              name: 'Cat.java',
              code: `public class Cat extends Animal {
    private boolean isIndoor;

    public Cat(String name, int age, boolean isIndoor) {
        super(name, age);
        this.isIndoor = isIndoor;
    }

    public boolean isIndoor() { return isIndoor; }

    @Override
    public void speak() {
        // TODO: вывести "Мяу! Я " + getName() + (isIndoor ? " (домашняя)" : " (уличная)")
    }
}`
            },
            {
              name: 'Main.java',
              code: `public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog("Бобик", 3, "Лабрадор");
        Animal cat = new Cat("Мурка", 5, true);

        dog.speak();   // Гав! Я Бобик (Лабрадор)
        cat.speak();   // Мяу! Я Мурка (домашняя)

        System.out.println(dog);  // Dog{name=Бобик, age=3}
        System.out.println(cat);  // Cat{name=Мурка, age=5}
        System.out.println(((Dog)dog).getBreed()); // Лабрадор
    }
}`
            }
          ]
        },
        {
          id: 'oop_mf_t2',
          title: 'Фигуры: Shape, Circle, Rectangle',
          difficulty: 'medium',
          description: '<p>Реализуйте иерархию фигур: интерфейс <code>Drawable</code>, абстрактный класс <code>Shape</code> (color, abstract area()), <code>Circle</code> и <code>Rectangle</code>. Полиморфный вывод из Main.</p>',
          multiFile: true,
          files: [
            {
              name: 'Drawable.java',
              code: `public interface Drawable {
    void draw();
    default String getDescription() {
        return "Drawable: " + getClass().getSimpleName();
    }
}`
            },
            {
              name: 'Shape.java',
              code: `public abstract class Shape implements Drawable {
    private String color;

    public Shape(String color) {
        this.color = color;
    }

    public String getColor() { return color; }

    // TODO: абстрактный метод area() — возвращает double
    // TODO: абстрактный метод perimeter() — возвращает double

    @Override
    public String toString() {
        return String.format("%s[color=%s, area=%.2f]",
            getClass().getSimpleName(), color, area());
    }
}`
            },
            {
              name: 'Circle.java',
              code: `public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    public double getRadius() { return radius; }

    @Override
    public double area()      { return Math.PI * radius * radius; }

    @Override
    public double perimeter() {
        // TODO: 2 * Math.PI * radius
        return 0;
    }

    @Override
    public void draw() {
        // TODO: вывести "O [radius=" + radius + ", color=" + getColor() + "]"
    }
}`
            },
            {
              name: 'Rectangle.java',
              code: `public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width  = width;
        this.height = height;
    }

    @Override
    public double area()      { return width * height; }

    @Override
    public double perimeter() { return 2 * (width + height); }

    @Override
    public void draw() {
        // TODO: вывести "[ ] [" + width + "x" + height + ", color=" + getColor() + "]"
    }
}`
            },
            {
              name: 'Main.java',
              code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<Shape> shapes = Arrays.asList(
            new Circle("red",    5.0),
            new Rectangle("blue", 4.0, 6.0),
            new Circle("green",  3.0)
        );

        for (Shape s : shapes) {
            s.draw();
            System.out.printf("  area=%.2f  perimeter=%.2f%n",
                s.area(), s.perimeter());
        }

        // Найти фигуру с максимальной площадью
        Shape largest = shapes.stream()
            .max(Comparator.comparingDouble(Shape::area))
            .orElseThrow();
        System.out.println("Наибольшая: " + largest);
    }
}`
            }
          ]
        },
        {
          id: 'oop_mf_t3',
          title: 'Банковская система',
          difficulty: 'hard',
          description: '<p>Полноценная банковская система в нескольких файлах: <code>Account</code> (абстрактный), <code>SavingsAccount</code> (с процентами), <code>CheckingAccount</code> (с овердрафтом), <code>Bank</code> (управляет счетами).</p>',
          multiFile: true,
          files: [
            {
              name: 'Account.java',
              code: `public abstract class Account {
    private final String id;
    private final String owner;
    protected double balance;

    public Account(String id, String owner, double initialBalance) {
        this.id      = id;
        this.owner   = owner;
        this.balance = initialBalance;
    }

    public String getId()      { return id; }
    public String getOwner()   { return owner; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    // TODO: абстрактный метод withdraw(double amount) — возвращает boolean
    // TODO: абстрактный метод getType() — возвращает String

    @Override
    public String toString() {
        return String.format("%s[id=%s, owner=%s, balance=%.2f]",
            getType(), id, owner, balance);
    }
}`
            },
            {
              name: 'SavingsAccount.java',
              code: `public class SavingsAccount extends Account {
    private double interestRate; // годовая ставка, напр. 0.05 = 5%

    public SavingsAccount(String id, String owner, double balance, double rate) {
        super(id, owner, balance);
        this.interestRate = rate;
    }

    @Override
    public boolean withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;  // нельзя уйти в минус
    }

    // TODO: метод addInterest() — начисляет проценты: balance += balance * interestRate
    // TODO: геттер getInterestRate()

    @Override
    public String getType() { return "SavingsAccount"; }
}`
            },
            {
              name: 'CheckingAccount.java',
              code: `public class CheckingAccount extends Account {
    private double overdraftLimit; // лимит овердрафта (например, 1000)

    public CheckingAccount(String id, String owner, double balance, double overdraft) {
        super(id, owner, balance);
        this.overdraftLimit = overdraft;
    }

    @Override
    public boolean withdraw(double amount) {
        // TODO: снять можно если balance - amount >= -overdraftLimit
        return false;
    }

    // TODO: геттер getOverdraftLimit()

    @Override
    public String getType() { return "CheckingAccount"; }
}`
            },
            {
              name: 'Bank.java',
              code: `import java.util.*;
public class Bank {
    private String name;
    private List<Account> accounts = new ArrayList<>();

    public Bank(String name) { this.name = name; }

    public void addAccount(Account acc) { accounts.add(acc); }

    public Account findById(String id) {
        return accounts.stream()
            .filter(a -> a.getId().equals(id))
            .findFirst().orElse(null);
    }

    public double totalAssets() {
        return accounts.stream().mapToDouble(Account::getBalance).sum();
    }

    public void printAll() {
        System.out.println("=== " + name + " ===");
        accounts.forEach(System.out::println);
        System.out.printf("Итого активов: %.2f%n", totalAssets());
    }
}`
            },
            {
              name: 'Main.java',
              code: `public class Main {
    public static void main(String[] args) {
        Bank bank = new Bank("MyBank");

        SavingsAccount sa = new SavingsAccount("S1", "Alice", 10000, 0.05);
        CheckingAccount ca = new CheckingAccount("C1", "Bob", 500, 1000);

        bank.addAccount(sa);
        bank.addAccount(ca);
        bank.printAll();

        System.out.println("\n--- Операции ---");
        System.out.println("Снять 200 с Alice: " + sa.withdraw(200));
        System.out.println("Снять 15000 с Alice: " + sa.withdraw(15000));  // false
        System.out.println("Снять 1200 с Bob (овердрафт): " + ca.withdraw(1200));  // true если лимит 1000

        sa.addInterest();
        System.out.println("После начисления %: " + sa);

        System.out.println();
        bank.printAll();
    }
}`
            }
          ]
        },
        {
          id: 'oop_mf_t4',
          title: 'Магазин: Product, Cart, Order',
          difficulty: 'hard',
          description: '<p>Система интернет-магазина: <code>Product</code> (с геттерами/сеттерами), <code>Cart</code> (корзина), <code>Order</code> (заказ со статусом). Полный цикл покупки.</p>',
          multiFile: true,
          files: [
            {
              name: 'Product.java',
              code: `public class Product {
    private final int    id;
    private String name;
    private double price;
    private int    stock; // наличие

    public Product(int id, String name, double price, int stock) {
        this.id    = id;
        this.name  = name;
        this.price = price;
        this.stock = stock;
    }

    // TODO: геттеры getId(), getName(), getPrice(), getStock()
    // TODO: сеттеры setName(String), setPrice(double >= 0), setStock(int >= 0)

    public boolean isAvailable(int qty) { return stock >= qty; }

    public void decreaseStock(int qty) {
        if (qty > 0 && stock >= qty) stock -= qty;
    }

    @Override
    public String toString() {
        return String.format("Product{id=%d, name=%s, price=%.2f, stock=%d}",
            id, name, price, stock);
    }
}`
            },
            {
              name: 'Cart.java',
              code: `import java.util.*;
public class Cart {
    private Map<Product, Integer> items = new LinkedHashMap<>();

    public void add(Product p, int qty) {
        if (!p.isAvailable(qty)) {
            System.out.println("Нет в наличии: " + p.getName());
            return;
        }
        items.merge(p, qty, Integer::sum);
    }

    public void remove(Product p) { items.remove(p); }

    public double getTotal() {
        return items.entrySet().stream()
            .mapToDouble(e -> e.getKey().getPrice() * e.getValue())
            .sum();
    }

    public Map<Product, Integer> getItems() { return Collections.unmodifiableMap(items); }

    public void clear() { items.clear(); }

    public void print() {
        System.out.println("Корзина:");
        items.forEach((p, qty) ->
            System.out.printf("  %-15s x%d = %.2f%n", p.getName(), qty, p.getPrice()*qty));
        System.out.printf("Итого: %.2f%n", getTotal());
    }
}`
            },
            {
              name: 'Order.java',
              code: `import java.util.*;
public class Order {
    public enum Status { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }

    private static int nextId = 1;
    private final int  id;
    private final Map<Product, Integer> items;
    private final double total;
    private Status status;

    public Order(Cart cart) {
        this.id     = nextId++;
        this.items  = new LinkedHashMap<>(cart.getItems());
        this.total  = cart.getTotal();
        this.status = Status.PENDING;
        // Уменьшаем склад
        items.forEach(Product::decreaseStock);
    }

    // TODO: геттеры getId(), getTotal(), getStatus()
    // TODO: метод setStatus(Status s) — менять статус можно только вперёд (PENDING→CONFIRMED→SHIPPED→...)

    public void confirm()  { if (status==Status.PENDING)   status = Status.CONFIRMED; }
    public void ship()     { if (status==Status.CONFIRMED) status = Status.SHIPPED; }
    public void deliver()  { if (status==Status.SHIPPED)   status = Status.DELIVERED; }
    public void cancel()   { if (status==Status.PENDING)   status = Status.CANCELLED; }

    @Override
    public String toString() {
        return String.format("Order#%d [status=%s, total=%.2f]", id, status, total);
    }
}`
            },
            {
              name: 'Main.java',
              code: `public class Main {
    public static void main(String[] args) {
        // Создаём товары
        Product p1 = new Product(1, "Ноутбук",    89999.0, 5);
        Product p2 = new Product(2, "Мышь",          999.0, 20);
        Product p3 = new Product(3, "Клавиатура",  2499.0, 10);

        System.out.println("Склад:");
        System.out.println(p1);
        System.out.println(p2);

        // Добавляем в корзину
        Cart cart = new Cart();
        cart.add(p1, 1);
        cart.add(p2, 2);
        cart.add(p3, 1);
        cart.print();

        // Оформляем заказ
        Order order = new Order(cart);
        System.out.println("\nЗаказ: " + order);
        order.confirm();
        System.out.println("После confirm: " + order);
        order.ship();
        System.out.println("После ship:    " + order);
        order.deliver();
        System.out.println("После deliver: " + order);

        // Проверяем изменение склада
        System.out.println("\nСклад после заказа:");
        System.out.println(p1); // stock уменьшился на 1
        System.out.println(p2); // stock уменьшился на 2
    }
}`
            }
          ]
        }
      ]
    }
  ]
});
