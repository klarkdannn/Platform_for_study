'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'java_basics',
  title: 'Базовый синтаксис Java',
  icon: '☕',
  description: 'Переменные, типы, операторы, условия, циклы, массивы, строки',
  color: '#f59e0b',
  chapters: [
    {
      id: 'jb_ch1',
      title: 'Переменные и типы данных',
      lecture: `<h2>Переменные и типы данных</h2>
<p>Java — строго типизированный язык. Каждая переменная имеет тип, который известен на этапе компиляции. Это позволяет обнаруживать ошибки до запуска программы.</p>

<h3>Примитивные типы — 8 штук</h3>
<table>
<tr><th>Тип</th><th>Размер</th><th>Мин</th><th>Макс</th><th>Пример</th></tr>
<tr><td><code>byte</code></td><td>1 байт</td><td>-128</td><td>127</td><td><code>byte b = 100;</code></td></tr>
<tr><td><code>short</code></td><td>2 байта</td><td>-32 768</td><td>32 767</td><td><code>short s = 30000;</code></td></tr>
<tr><td><code>int</code></td><td>4 байта</td><td>-2 147 483 648</td><td>2 147 483 647</td><td><code>int i = 1_000_000;</code></td></tr>
<tr><td><code>long</code></td><td>8 байт</td><td>-9.2×10¹⁸</td><td>9.2×10¹⁸</td><td><code>long l = 100L;</code></td></tr>
<tr><td><code>float</code></td><td>4 байта</td><td colspan="2">~7 значимых цифр</td><td><code>float f = 3.14f;</code></td></tr>
<tr><td><code>double</code></td><td>8 байт</td><td colspan="2">~15 значимых цифр</td><td><code>double d = 3.14159;</code></td></tr>
<tr><td><code>boolean</code></td><td>1 бит</td><td colspan="2">true / false</td><td><code>boolean ok = true;</code></td></tr>
<tr><td><code>char</code></td><td>2 байта</td><td>0</td><td>65 535</td><td><code>char c = 'A';</code></td></tr>
</table>

<div class="note">💡 <strong>Совет:</strong> По умолчанию используйте <code>int</code> для целых и <code>double</code> для дробных. <code>long</code> — когда число не вмещается в int. <code>float</code> — почти никогда, так как double точнее.</div>

<h3>Объявление переменных</h3>
<pre><code>// Формат: тип имя = значение;
int age = 25;
double salary = 75_000.50;   // _ улучшает читаемость
long population = 8_000_000_000L;  // суффикс L обязателен!
float temperature = 36.6f;          // суффикс f обязателен!
boolean isJavaFun = true;
char grade = 'A';

// Несколько переменных одного типа
int x = 10, y = 20, z = 30;

// Объявление без инициализации (нужно присвоить до использования)
int count;
count = 5; // присвоение позже</code></pre>

<h3>var — вывод типа (Java 10+)</h3>
<pre><code>var count = 42;           // int — компилятор видит тип сам
var price = 99.99;        // double
var name = "Java";        // String
var list = new java.util.ArrayList&lt;String&gt;();  // тип из правой части

// var только для локальных переменных!
// Нельзя: var без инициализации — компилятор не знает тип</code></pre>

<h3>String — строка (не примитив!)</h3>
<pre><code>String s1 = "Hello";
String s2 = "World";
String s3 = s1 + ", " + s2 + "!";  // конкатенация через +
System.out.println(s3);  // Hello, World!

// Строка с числом
int age = 25;
String info = "Мне " + age + " лет";  // "Мне 25 лет"</code></pre>

<h3>Приведение типов (casting)</h3>
<pre><code>// Расширяющее — автоматически, без потери данных
byte b = 42;
int i = b;      // byte → int
long l = i;     // int → long
double d = l;   // long → double

// Сужающее — явно, возможна потеря данных!
double pi = 3.14159;
int intPi = (int) pi;    // 3 — дробная часть отброшена
byte b2 = (byte) 200;   // -56 — переполнение!

// Строка ↔ число
int n = Integer.parseInt("42");
double x = Double.parseDouble("3.14");
String str = String.valueOf(42);  // или "" + 42</code></pre>

<h3>Константы</h3>
<pre><code>// final — нельзя изменить после присвоения
final double PI = 3.14159265358979;
final int MAX_SIZE = 100;
// PI = 4; // ОШИБКА компиляции!

// Стандартные константы
System.out.println(Integer.MAX_VALUE);   // 2147483647
System.out.println(Integer.MIN_VALUE);   // -2147483648
System.out.println(Double.MAX_VALUE);    // 1.7976931348623157E308
System.out.println(Double.POSITIVE_INFINITY); // Infinity</code></pre>

<h3>Арифметические операторы</h3>
<pre><code>int a = 17, b = 5;
System.out.println(a + b);   // 22 — сложение
System.out.println(a - b);   // 12 — вычитание
System.out.println(a * b);   // 85 — умножение
System.out.println(a / b);   // 3  — целочисленное деление (!)
System.out.println(a % b);   // 2  — остаток от деления

// Деление дробных
double x = 17.0 / 5;   // 3.4 (хотя бы одно double!)
double y = (double) 17 / 5;  // тоже 3.4

// Инкремент / декремент
int c = 10;
c++;   // 11 (постфикс: сначала использует, потом прибавляет)
++c;   // 12 (префикс: сначала прибавляет, потом использует)
c--;   // 11

// Составные операторы
c += 5;  // c = c + 5
c *= 2;  // c = c * 2
c /= 3;  // c = c / 3
c %= 4;  // c = c % 4</code></pre>

<div class="warning">⚠️ <strong>Частая ошибка:</strong> деление двух int даёт int! <code>7 / 2 = 3</code>, а не 3.5. Для дробного результата хотя бы одно число должно быть double: <code>7.0 / 2 = 3.5</code>.</div>

<h3>Вывод на экран</h3>
<pre><code>System.out.println("Hello");       // с переносом строки
System.out.print("Hello ");        // без переноса
System.out.printf("%.2f%n", 3.14159); // форматированный вывод → 3.14

// Форматы printf:
// %d — целое число
// %f — число с плавающей точкой
// %.2f — 2 знака после запятой
// %s — строка
// %n — перенос строки (лучше \n на разных ОС)
// %b — boolean
// %c — char</code></pre>`,
      tasks: [
        { id:'jb_t1', title:'Привет, мир!', difficulty:'easy',
          description:'<p>Напишите программу, которая выводит в консоль строку <code>Hello, World!</code></p>',
          hints:['System.out.println("Hello, World!");'],
          startCode:`public class Main {
    public static void main(String[] args) {
        // напишите код здесь
    }
}`},
        { id:'jb_t2', title:'Ваше имя и возраст', difficulty:'easy',
          description:'<p>Создайте переменные <code>name</code> (String) и <code>age</code> (int). Присвойте им своё имя и возраст. Выведите: <code>Меня зовут Иван, мне 20 лет.</code></p>',
          hints:['String name = "Иван";','System.out.println("Меня зовут " + name + ", мне " + age + " лет.");'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String name = "Иван";
        int age = 20;
        // выведите строку
    }
}`},
        { id:'jb_t3', title:'Сумма двух чисел', difficulty:'easy',
          description:'<p>Объявите переменные <code>a = 15</code> и <code>b = 27</code>. Вычислите и выведите их сумму.</p>',
          hints:['int sum = a + b;','System.out.println(sum);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 27;
        // вычислите и выведите сумму
    }
}`},
        { id:'jb_t4', title:'Площадь прямоугольника', difficulty:'easy',
          description:'<p>Дан прямоугольник: ширина 8, высота 5. Вычислите площадь и выведите: <code>Площадь: 40</code></p>',
          hints:['int area = width * height;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int width = 8;
        int height = 5;
        // вычислите площадь
    }
}`},
        { id:'jb_t5', title:'Обмен переменных', difficulty:'easy',
          description:'<p>Даны <code>a = 10</code>, <code>b = 20</code>. Обменяйте их значения через временную переменную <code>temp</code>. Выведите оба значения после обмена.</p>',
          hints:['int temp = a;','a = b;','b = temp;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        // обменяйте через temp
        System.out.println("a = " + a); // должно быть 20
        System.out.println("b = " + b); // должно быть 10
    }
}`},
        { id:'jb_t6', title:'Типы данных: вывод размеров', difficulty:'easy',
          description:'<p>Выведите максимальные значения всех целочисленных типов: <code>Byte.MAX_VALUE</code>, <code>Short.MAX_VALUE</code>, <code>Integer.MAX_VALUE</code>, <code>Long.MAX_VALUE</code>. Перед каждым значением выводите имя типа.</p>',
          hints:['System.out.println("byte max: " + Byte.MAX_VALUE);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        // выведите MAX_VALUE для byte, short, int, long
    }
}`},
        { id:'jb_t7', title:'Целочисленное деление', difficulty:'easy',
          description:'<p>Вычислите и выведите: частное и остаток от деления 17 на 5. Формат вывода: <code>17 / 5 = 3, остаток 2</code></p>',
          hints:['int quotient = a / b;','int remainder = a % b;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        // вычислите частное и остаток
    }
}`},
        { id:'jb_t8', title:'Конвертация температуры', difficulty:'easy',
          description:'<p>Переведите 100°C в Фаренгейты. Формула: <code>F = C * 9.0 / 5 + 32</code>. Выведите результат с 1 знаком после запятой через <code>printf</code>.</p>',
          hints:['double f = celsius * 9.0 / 5 + 32;','System.out.printf("%.1f°F%n", f);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        double celsius = 100;
        // вычислите и выведите fahrenheit
    }
}`},
        { id:'jb_t9', title:'Приведение типов', difficulty:'medium',
          description:'<p>Продемонстрируйте приведение типов:<br>1) double → int (потеря дробной части)<br>2) int → byte (переполнение при числе 200)<br>3) Строку "42" → int<br>Выведите все результаты.</p>',
          hints:['(int) 3.99 → 3','(byte) 200 → -56','Integer.parseInt("42") → 42'],
          startCode:`public class Main {
    public static void main(String[] args) {
        double d = 3.99;
        // 1) приведите к int

        int n = 200;
        // 2) приведите к byte (будет переполнение)

        String s = "42";
        // 3) приведите к int
    }
}`},
        { id:'jb_t10', title:'Форматированный вывод', difficulty:'medium',
          description:'<p>Выведите "таблицу товаров" с помощью <code>printf</code>:<br><pre>Товар              Цена    Кол-во\nЯблоки            45.50       10\nБананы            30.00        5</pre>Используйте выравнивание: %-20s, %8.2f, %8d</p>',
          hints:['System.out.printf("%-20s %8.2f %8d%n", name, price, qty);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        System.out.printf("%-20s %8s %8s%n", "Товар", "Цена", "Кол-во");
        // добавьте строки для яблок и бананов
    }
}`},
        { id:'jb_t11', title:'Переполнение int', difficulty:'hard',
          description:'<p>Что будет при <code>Integer.MAX_VALUE + 1</code>? Напишите программу которая:<br>1) Показывает результат переполнения int<br>2) Исправляет через long<br>3) Показывает разницу</p>',
          hints:['int: 2147483647 + 1 = -2147483648 (переполнение)','long l = (long)Integer.MAX_VALUE + 1;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int maxInt = Integer.MAX_VALUE;
        System.out.println("int MAX: " + maxInt);
        System.out.println("int MAX + 1: " + (maxInt + 1)); // переполнение!

        // исправьте через long
        long fixedResult = // ?
        System.out.println("long result: " + fixedResult);
    }
}`}
      ]
    },
    {
      id: 'jb_ch2',
      title: 'Условия и switch',
      lecture: `<h2>Условные операторы</h2>
<p>Условные операторы позволяют программе принимать решения в зависимости от значений переменных.</p>

<h3>if / else if / else</h3>
<pre><code>int score = 85;

if (score >= 90) {
    System.out.println("Отлично — A");
} else if (score >= 80) {
    System.out.println("Хорошо — B");
} else if (score >= 70) {
    System.out.println("Удовлетворительно — C");
} else if (score >= 60) {
    System.out.println("Слабо — D");
} else {
    System.out.println("Неудовлетворительно — F");
}</code></pre>

<h3>Операторы сравнения</h3>
<pre><code>int a = 5, b = 10;
a == b   // false — равно
a != b   // true  — не равно
a &lt; b    // true  — меньше
a &gt; b    // false — больше
a &lt;= b   // true  — меньше или равно
a &gt;= b   // false — больше или равно</code></pre>

<h3>Логические операторы</h3>
<pre><code>boolean x = true, y = false;
x && y   // false — И (оба true)
x || y   // true  — ИЛИ (хотя бы одно true)
!x       // false — НЕ (инверсия)

// Пример: число в диапазоне от 1 до 100
int n = 42;
if (n >= 1 && n <= 100) {
    System.out.println("В диапазоне");
}

// Пример: выходной день
int day = 6; // 6=суббота, 7=воскресенье
if (day == 6 || day == 7) {
    System.out.println("Выходной!");
}</code></pre>

<h3>Тернарный оператор</h3>
<pre><code>// условие ? значение_если_true : значение_если_false
int age = 20;
String status = age >= 18 ? "Взрослый" : "Несовершеннолетний";
System.out.println(status); // Взрослый

// Вложенный тернарный (не злоупотреблять!)
int n = 5;
String sign = n > 0 ? "положительное" : n < 0 ? "отрицательное" : "ноль";</code></pre>

<h3>switch — классический</h3>
<pre><code>int day = 3;
switch (day) {
    case 1: System.out.println("Понедельник"); break;
    case 2: System.out.println("Вторник");     break;
    case 3: System.out.println("Среда");       break;
    case 4: System.out.println("Четверг");     break;
    case 5: System.out.println("Пятница");     break;
    case 6: System.out.println("Суббота");     break;
    case 7: System.out.println("Воскресенье"); break;
    default: System.out.println("Нет такого дня");
}
// Без break — "провал" (fall-through) в следующий case!</code></pre>

<h3>switch expression (Java 14+) — современный способ</h3>
<pre><code>String dayName = switch (day) {
    case 1 -> "Понедельник";
    case 2 -> "Вторник";
    case 3 -> "Среда";
    case 4 -> "Четверг";
    case 5 -> "Пятница";
    case 6, 7 -> "Выходной";   // несколько значений
    default -> throw new IllegalArgumentException("Нет дня: " + day);
};

// switch с несколькими строками в блоке
int numLetters = switch (dayName) {
    case "Понедельник", "Среда" -> {
        System.out.println("Длинное название");
        yield 10; // возврат значения из блока
    }
    default -> dayName.length();
};</code></pre>

<div class="tip">✅ <strong>Когда что использовать:</strong><br>
• <code>if-else</code> — любые условия, диапазоны, сложная логика<br>
• <code>switch</code> — конкретные значения одной переменной (enum, int, String)</div>`,
      tasks: [
        { id:'jb_t12', title:'Максимум из двух', difficulty:'easy',
          description:'<p>Даны <code>a = 42</code> и <code>b = 17</code>. Выведите большее из них без использования <code>Math.max()</code>.</p>',
          hints:['if (a > b) System.out.println(a); else System.out.println(b);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 42, b = 17;
        // выведите большее
    }
}`},
        { id:'jb_t13', title:'Положительное, отрицательное или ноль', difficulty:'easy',
          description:'<p>Для числа <code>-7</code> выведите: <code>отрицательное</code>, <code>положительное</code> или <code>ноль</code>.</p>',
          hints:['Три условия: > 0, < 0, == 0'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int num = -7;
        // определите знак числа
    }
}`},
        { id:'jb_t14', title:'Чётное или нечётное', difficulty:'easy',
          description:'<p>Определите, является ли число <code>13</code> чётным или нечётным. Используйте оператор <code>%</code>.</p>',
          hints:['if (n % 2 == 0) "чётное" else "нечётное"'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int n = 13;
        // выведите "чётное" или "нечётное"
    }
}`},
        { id:'jb_t15', title:'Оценка по баллам', difficulty:'easy',
          description:'<p>По баллу (<code>score = 78</code>) выведите оценку: 90+ → "A", 80+ → "B", 70+ → "C", 60+ → "D", иначе → "F".</p>',
          hints:['if (score >= 90) ... else if (score >= 80) ...'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int score = 78;
        // определите оценку
    }
}`},
        { id:'jb_t16', title:'День недели через switch', difficulty:'easy',
          description:'<p>По номеру дня (1–7) выведите его русское название. Для <code>day = 4</code> должно вывестись <code>Четверг</code>.</p>',
          hints:['switch (day) { case 1: ... break; ... }'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int day = 4;
        // используйте switch
    }
}`},
        { id:'jb_t17', title:'Максимум из трёх', difficulty:'easy',
          description:'<p>Найдите наибольшее из трёх чисел: <code>a=5, b=12, c=8</code>. Используйте условные операторы.</p>',
          hints:['if (a >= b && a >= c) max = a;','else if (b >= a && b >= c) max = b;','else max = c;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 5, b = 12, c = 8;
        int max;
        // найдите максимум из трёх
        System.out.println("Максимум: " + max);
    }
}`},
        { id:'jb_t18', title:'Чётность через тернарный оператор', difficulty:'easy',
          description:'<p>Используйте <strong>тернарный оператор</strong> для определения чётности числа <code>n = 42</code>. В одну строку.</p>',
          hints:['String result = (n % 2 == 0) ? "чётное" : "нечётное";'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int n = 42;
        String result = // тернарный оператор
        System.out.println(n + " — " + result);
    }
}`},
        { id:'jb_t19', title:'Время суток', difficulty:'medium',
          description:'<p>По часу (<code>hour = 14</code>) выведите время суток: 0–5 → "Ночь", 6–11 → "Утро", 12–17 → "День", 18–23 → "Вечер".</p>',
          hints:['if (hour >= 0 && hour <= 5)','Можно через switch с диапазонами через if'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int hour = 14;
        // определите время суток
    }
}`},
        { id:'jb_t20', title:'Калькулятор', difficulty:'medium',
          description:'<p>Реализуйте калькулятор: <code>a=15, b=4, op="/"</code>. Операции: +, -, *, /. Обработайте деление на ноль. Используйте switch.</p>',
          hints:['switch (op) { case "+": ... }','case "/": if(b != 0) ... else System.out.println("Ошибка: деление на 0");'],
          startCode:`public class Main {
    public static void main(String[] args) {
        double a = 15, b = 4;
        String op = "/";
        // реализуйте через switch
    }
}`},
        { id:'jb_t21', title:'Год дракона', difficulty:'medium',
          description:'<p>По китайскому календарю — цикл 12 лет. Год Дракона: 2012, 2024, 2036... Остаток от деления на 12 = 8. Определите, является ли <code>year = 2024</code> годом Дракона.</p>',
          hints:['year % 12 == 8'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int year = 2024;
        // проверьте: year % 12 == 8
    }
}`},
        { id:'jb_t22', title:'Рейтинг кино', difficulty:'medium',
          description:'<p>Рейтинг от 0.0 до 10.0. Категории: 9.0+ → "Шедевр", 7.0+ → "Отличный фильм", 5.0+ → "Хороший", 3.0+ → "Посредственный", ниже → "Плохой". Для <code>rating = 7.8</code>.</p>',
          hints:['if (rating >= 9.0) else if (rating >= 7.0) ...'],
          startCode:`public class Main {
    public static void main(String[] args) {
        double rating = 7.8;
        // выведите категорию
    }
}`},
        { id:'jb_t23', title:'Високосный год', difficulty:'hard',
          description:'<p>Год високосный если:<br>• делится на 4 И не делится на 100<br>• ИЛИ делится на 400<br>Проверьте: 2000, 1900, 2024, 2100.</p>',
          hints:['(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)'],
          startCode:`public class Main {
    static boolean isLeapYear(int year) {
        // реализуйте логику
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isLeapYear(2000)); // true
        System.out.println(isLeapYear(1900)); // false
        System.out.println(isLeapYear(2024)); // true
        System.out.println(isLeapYear(2100)); // false
    }
}`}
      ]
    },
    {
      id: 'jb_ch3',
      title: 'Циклы',
      lecture: `<h2>Циклы в Java</h2>
<p>Цикл — повторное выполнение блока кода. В Java 4 вида циклов.</p>

<h3>for — когда известно количество итераций</h3>
<pre><code>// Синтаксис: for (инициализация; условие; шаг)
for (int i = 0; i < 5; i++) {
    System.out.println("i = " + i);
}
// Выведет: i = 0, i = 1, i = 2, i = 3, i = 4

// Обратный счёт
for (int i = 10; i >= 1; i--) {
    System.out.print(i + " ");
}
// 10 9 8 7 6 5 4 3 2 1

// Шаг 2
for (int i = 0; i <= 10; i += 2) {
    System.out.print(i + " ");
}
// 0 2 4 6 8 10</code></pre>

<h3>while — пока условие истинно</h3>
<pre><code>// Используйте когда не знаете заранее сколько итераций
int n = 1;
while (n <= 1000) {
    System.out.print(n + " ");
    n *= 2;   // 1 2 4 8 16 32 64 128 256 512
}

// Ввод с клавиатуры до корректного значения
// (в задачах используем фиксированное значение)
int value = -1;
while (value < 0) {
    value = 5; // имитация ввода
}
System.out.println(value); // 5</code></pre>

<h3>do-while — выполняется хотя бы раз</h3>
<pre><code>// Тело выполняется ПЕРЕД проверкой условия
int count = 0;
do {
    System.out.println("Итерация " + count);
    count++;
} while (count < 3);
// Итерация 0, Итерация 1, Итерация 2

// Даже если условие ложно изначально — тело выполнится раз:
do {
    System.out.println("Выполнится один раз");
} while (false);</code></pre>

<h3>for-each — перебор коллекций</h3>
<pre><code>int[] numbers = {10, 20, 30, 40, 50};
for (int n : numbers) {
    System.out.print(n + " ");
}
// 10 20 30 40 50

String[] fruits = {"Яблоко", "Банан", "Вишня"};
for (String fruit : fruits) {
    System.out.println(fruit);
}</code></pre>

<h3>break и continue</h3>
<pre><code>// break — немедленный выход из цикла
for (int i = 0; i < 10; i++) {
    if (i == 5) break;
    System.out.print(i + " ");
}
// 0 1 2 3 4

// continue — пропустить текущую итерацию
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;
    System.out.print(i + " ");
}
// 1 3 5 7 9

// Вложенные циклы
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i * j + "\t");
    }
    System.out.println();
}</code></pre>

<div class="tip">✅ <strong>Когда какой цикл:</strong><br>
• <code>for</code> — знаем количество итераций<br>
• <code>while</code> — условие проверяем до итерации<br>
• <code>do-while</code> — нужно хотя бы одно выполнение<br>
• <code>for-each</code> — перебор массива или коллекции</div>`,
      tasks: [
        { id:'jb_t24', title:'Числа от 1 до 10', difficulty:'easy',
          description:'<p>Выведите числа от 1 до 10, каждое на новой строке.</p>',
          hints:['for (int i = 1; i <= 10; i++)'],
          startCode:`public class Main {
    public static void main(String[] args) {
        // выведите числа от 1 до 10
    }
}`},
        { id:'jb_t25', title:'Числа от 10 до 1', difficulty:'easy',
          description:'<p>Выведите числа от 10 до 1 в обратном порядке, через пробел.</p>',
          hints:['for (int i = 10; i >= 1; i--)'],
          startCode:`public class Main {
    public static void main(String[] args) {
        // 10 9 8 7 6 5 4 3 2 1
    }
}`},
        { id:'jb_t26', title:'Чётные числа', difficulty:'easy',
          description:'<p>Выведите все чётные числа от 2 до 20.</p>',
          hints:['for (int i = 2; i <= 20; i += 2) или i % 2 == 0'],
          startCode:`public class Main {
    public static void main(String[] args) {
        // выведите чётные числа от 2 до 20
    }
}`},
        { id:'jb_t27', title:'Таблица умножения числа', difficulty:'easy',
          description:'<p>Выведите таблицу умножения числа <code>7</code> от 7×1 до 7×10. Формат: <code>7 x 1 = 7</code></p>',
          hints:['for (int i = 1; i <= 10; i++) System.out.println("7 x " + i + " = " + 7*i);'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int n = 7;
        // выведите таблицу умножения
    }
}`},
        { id:'jb_t28', title:'Сумма от 1 до 100', difficulty:'easy',
          description:'<p>Вычислите сумму чисел от 1 до 100 и выведите результат (должно получиться 5050).</p>',
          hints:['int sum = 0; for (int i = 1; i <= 100; i++) sum += i;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int sum = 0;
        // вычислите сумму
        System.out.println(sum); // 5050
    }
}`},
        { id:'jb_t29', title:'Произведение цифр числа', difficulty:'easy',
          description:'<p>Вычислите произведение: 1×2×3×4×5 (5! = 120). Используйте цикл for.</p>',
          hints:['int product = 1;','for (int i = 1; i <= 5; i++) product *= i;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int product = 1;
        // вычислите 1*2*3*4*5
        System.out.println(product); // 120
    }
}`},
        { id:'jb_t30', title:'Сумма нечётных до N', difficulty:'easy',
          description:'<p>Вычислите сумму нечётных чисел от 1 до <code>N = 20</code> (1+3+5+7+...+19 = 100).</p>',
          hints:['if (i % 2 != 0) sum += i; или for (int i = 1; i <= N; i += 2)'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int N = 20;
        int sum = 0;
        // вычислите сумму нечётных
        System.out.println(sum); // 100
    }
}`},
        { id:'jb_t31', title:'Факториал', difficulty:'medium',
          description:'<p>Вычислите <code>n! = 1 × 2 × 3 × … × n</code> для <code>n = 10</code>. Используйте тип <code>long</code>.</p>',
          hints:['long result = 1;','for (int i = 2; i <= n; i++) result *= i;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int n = 10;
        long result = 1;
        // вычислите факториал
        System.out.println(n + "! = " + result); // 3628800
    }
}`},
        { id:'jb_t32', title:'Числа Фибоначчи', difficulty:'medium',
          description:'<p>Выведите первые 15 чисел Фибоначчи: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...</p>',
          hints:['int a = 0, b = 1;','int c = a + b; a = b; b = c;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 0; i < 15; i++) {
            System.out.print(a + " ");
            // вычислите следующее число
        }
    }
}`},
        { id:'jb_t33', title:'Треугольник из звёздочек', difficulty:'medium',
          description:'<p>Выведите правый треугольник высотой 5:<br><code>*</code><br><code>**</code><br><code>***</code><br><code>****</code><br><code>*****</code></p>',
          hints:['Внешний цикл — строки (i от 1 до rows)','Внутренний — печатает i звёздочек'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int rows = 5;
        for (int i = 1; i <= rows; i++) {
            // выведите i звёздочек
        }
    }
}`},
        { id:'jb_t34', title:'Степень числа', difficulty:'medium',
          description:'<p>Вычислите <code>base^exp</code> без использования <code>Math.pow()</code>. Для <code>base=2, exp=10</code> должно получиться 1024.</p>',
          hints:['result = 1;','for (int i = 0; i < exp; i++) result *= base;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int base = 2, exp = 10;
        long result = 1;
        // вычислите base^exp через цикл
        System.out.println(result); // 1024
    }
}`},
        { id:'jb_t35', title:'Простые числа', difficulty:'hard',
          description:'<p>Выведите все простые числа от 2 до 50. Простое — делится только на 1 и на себя.</p>',
          hints:['Для каждого n проверьте делители от 2 до sqrt(n)','(int)Math.sqrt(n) — корень','boolean isPrime = true; for (int d=2; d<=Math.sqrt(n); d++) if (n%d==0) { isPrime=false; break; }'],
          startCode:`public class Main {
    public static void main(String[] args) {
        for (int n = 2; n <= 50; n++) {
            boolean isPrime = true;
            // проверьте, простое ли n
            if (isPrime) System.out.print(n + " ");
        }
    }
}`}
      ]
    },
    {
      id: 'jb_ch4',
      title: 'Массивы',
      lecture: `<h2>Массивы (Arrays)</h2>
<p>Массив — структура данных фиксированного размера, хранящая элементы <strong>одного типа</strong> подряд в памяти. После создания размер изменить нельзя.</p>

<h3>Создание массива</h3>
<pre><code>// Способ 1: сначала создать, потом заполнить
int[] numbers = new int[5];  // 5 нулей: [0, 0, 0, 0, 0]
numbers[0] = 10;
numbers[1] = 20;
numbers[4] = 50;

// Способ 2: инициализатор (литерал)
int[] primes = {2, 3, 5, 7, 11, 13};
String[] days = {"Пн", "Вт", "Ср", "Чт", "Пт"};
double[] temps = new double[]{-5.2, 0.0, 7.8, 15.3};

// Доступ к элементам (индексация с 0!)
System.out.println(primes[0]);           // 2
System.out.println(primes[primes.length - 1]); // 13 — последний

// Длина массива
System.out.println(primes.length);  // 6 (свойство, не метод!)</code></pre>

<div class="warning">⚠️ <strong>ArrayIndexOutOfBoundsException</strong> — обращение к несуществующему индексу! Индексы: 0 до length-1. Обращение к arr[-1] или arr[arr.length] — ошибка!</div>

<h3>Перебор массива</h3>
<pre><code>int[] arr = {5, 10, 15, 20, 25};

// for с индексом (когда нужен индекс)
for (int i = 0; i < arr.length; i++) {
    System.out.println(i + ": " + arr[i]);
}

// for-each (когда индекс не нужен)
for (int n : arr) {
    System.out.print(n + " ");
}

// Обратный перебор
for (int i = arr.length - 1; i >= 0; i--) {
    System.out.print(arr[i] + " ");
}</code></pre>

<h3>Класс Arrays — утилиты</h3>
<pre><code>import java.util.Arrays;

int[] arr = {5, 2, 8, 1, 9, 3};

Arrays.sort(arr);                          // сортировка по возрастанию
System.out.println(Arrays.toString(arr));  // [1, 2, 3, 5, 8, 9]

int idx = Arrays.binarySearch(arr, 5);     // 3 (поиск, массив должен быть sorted!)
Arrays.fill(arr, 0);                       // заполнить нулями
int[] copy = Arrays.copyOf(arr, 3);        // скопировать первые 3 элемента
int[] range = Arrays.copyOfRange(arr, 1, 4); // элементы [1..3]
boolean eq = Arrays.equals(arr, copy);     // сравнить два массива</code></pre>

<h3>Двумерные массивы</h3>
<pre><code>// Матрица 3×3
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(matrix[1][2]); // 6 (строка 1, столбец 2)
System.out.println(matrix.length);    // 3 (строк)
System.out.println(matrix[0].length); // 3 (столбцов)

// Перебор двумерного массива
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.printf("%3d", matrix[i][j]);
    }
    System.out.println();
}</code></pre>`,
      tasks: [
        { id:'jb_t36', title:'Сумма элементов', difficulty:'easy',
          description:'<p>Дан массив <code>{10, 20, 30, 40, 50}</code>. Вычислите и выведите сумму всех элементов.</p>',
          hints:['int sum = 0; for (int x : arr) sum += x;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;
        // вычислите сумму
        System.out.println(sum); // 150
    }
}`},
        { id:'jb_t37', title:'Максимум в массиве', difficulty:'easy',
          description:'<p>Найдите максимальный элемент в массиве <code>{3, 7, 1, 9, 4, 6, 2}</code>.</p>',
          hints:['int max = arr[0];','for (int x : arr) if (x > max) max = x;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {3, 7, 1, 9, 4, 6, 2};
        int max = arr[0];
        // найдите максимум
        System.out.println("Максимум: " + max); // 9
    }
}`},
        { id:'jb_t38', title:'Минимум в массиве', difficulty:'easy',
          description:'<p>Найдите минимальный элемент в массиве <code>{15, 3, 27, 8, 42, 1, 19}</code>.</p>',
          hints:['int min = arr[0];','for (int x : arr) if (x < min) min = x;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {15, 3, 27, 8, 42, 1, 19};
        // найдите минимум
    }
}`},
        { id:'jb_t39', title:'Разворот массива', difficulty:'easy',
          description:'<p>Выведите элементы массива <code>{1, 2, 3, 4, 5}</code> в обратном порядке: <code>5 4 3 2 1</code>.</p>',
          hints:['for (int i = arr.length - 1; i >= 0; i--)'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // выведите в обратном порядке
    }
}`},
        { id:'jb_t40', title:'Среднее значение', difficulty:'easy',
          description:'<p>Вычислите среднее арифметическое массива <code>{4, 8, 15, 16, 23, 42}</code>.</p>',
          hints:['double avg = (double) sum / arr.length;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {4, 8, 15, 16, 23, 42};
        // вычислите среднее
    }
}`},
        { id:'jb_t41', title:'Поиск элемента', difficulty:'easy',
          description:'<p>Найдите индекс числа <code>42</code> в массиве <code>{5, 17, 42, 8, 99, 3}</code>. Если не найдено — выведите -1.</p>',
          hints:['for (int i = 0; i < arr.length; i++) if (arr[i] == target) { idx = i; break; }'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {5, 17, 42, 8, 99, 3};
        int target = 42;
        int idx = -1;
        // найдите индекс target
        System.out.println("Индекс: " + idx); // 2
    }
}`},
        { id:'jb_t42', title:'Сортировка Arrays.sort', difficulty:'easy',
          description:'<p>Отсортируйте массив <code>{64, 34, 25, 12, 22, 11, 90}</code> с помощью <code>Arrays.sort()</code> и выведите.</p>',
          hints:['import java.util.Arrays;','Arrays.sort(arr);','System.out.println(Arrays.toString(arr));'],
          startCode:`import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        // отсортируйте и выведите
    }
}`},
        { id:'jb_t43', title:'Сортировка пузырьком', difficulty:'medium',
          description:'<p>Реализуйте сортировку пузырьком вручную (без Arrays.sort). Массив: <code>{64, 34, 25, 12, 22, 11, 90}</code>.</p>',
          hints:['Два вложенных цикла','if (arr[j] > arr[j+1]) — меняем местами через temp'],
          startCode:`import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                // если arr[j] > arr[j+1] — поменяйте местами
            }
        }
        System.out.println(Arrays.toString(arr));
    }
}`},
        { id:'jb_t44', title:'Подсчёт чётных', difficulty:'medium',
          description:'<p>Подсчитайте количество чётных и нечётных чисел в массиве <code>{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}</code>.</p>',
          hints:['if (arr[i] % 2 == 0) evenCount++; else oddCount++;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        int even = 0, odd = 0;
        // подсчитайте
        System.out.println("Чётных: " + even + ", нечётных: " + odd);
    }
}`},
        { id:'jb_t45', title:'Разворот массива на месте', difficulty:'medium',
          description:'<p>Разверните массив <code>{1, 2, 3, 4, 5}</code> "на месте" (без создания нового массива). Используйте два указателя.</p>',
          hints:['int left = 0, right = arr.length - 1;','while (left < right) { поменять arr[left] и arr[right]; left++; right--; }'],
          startCode:`import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // разверните на месте (два указателя)
        System.out.println(Arrays.toString(arr)); // [5, 4, 3, 2, 1]
    }
}`},
        { id:'jb_t46', title:'Сумма главной диагонали', difficulty:'hard',
          description:'<p>Вычислите сумму элементов главной диагонали матрицы 3×3 (arr[0][0], arr[1][1], arr[2][2]).</p>',
          hints:['for (int i = 0; i < n; i++) sum += matrix[i][i];'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        int sum = 0;
        // вычислите сумму главной диагонали
        System.out.println("Сумма диагонали: " + sum); // 15
    }
}`}
      ]
    },
    {
      id: 'jb_ch5',
      title: 'Строки',
      lecture: `<h2>Строки (String)</h2>
<p>String — неизменяемый (immutable) объект в Java. При "изменении" строки создаётся новый объект.</p>

<h3>Создание строк</h3>
<pre><code>String s1 = "Hello";                    // литерал (попадает в String Pool)
String s2 = new String("Hello");        // явное создание объекта
String s3 = "";                         // пустая строка
String s4 = null;                       // ссылка не указывает на строку

// == vs equals
String a = "java";
String b = "java";
System.out.println(a == b);       // true (один объект в пуле)
String c = new String("java");
System.out.println(a == c);       // false (разные объекты в памяти!)
System.out.println(a.equals(c));  // true (содержимое одинаково)
// Правило: всегда используйте .equals() для сравнения строк!</code></pre>

<h3>Основные методы String</h3>
<pre><code>String s = "Hello, World!";

// Длина и доступ к символам
s.length()          // 13
s.charAt(0)         // 'H'
s.charAt(7)         // 'W'

// Поиск
s.indexOf('o')      // 4 (первое вхождение)
s.lastIndexOf('o')  // 8 (последнее)
s.indexOf("World")  // 7
s.contains("World") // true
s.startsWith("Hello") // true
s.endsWith("!")     // true

// Извлечение
s.substring(7)      // "World!"
s.substring(7, 12)  // "World"

// Преобразование
s.toLowerCase()     // "hello, world!"
s.toUpperCase()     // "HELLO, WORLD!"
s.trim()            // убрать пробелы с краёв
s.strip()           // как trim, но учитывает Unicode (Java 11+)
s.replace('l', 'r') // "Herro, Worrd!"
s.replace("World", "Java") // "Hello, Java!"

// Проверка
s.isEmpty()         // false (length == 0)
s.isBlank()         // false (только пробелы, Java 11+)

// Разбивка и сборка
String[] words = s.split(", ");  // ["Hello", "World!"]
String joined = String.join(", ", "a", "b", "c"); // "a, b, c"</code></pre>

<h3>StringBuilder — изменяемая строка</h3>
<pre><code>// Используйте когда нужно много конкатенаций
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(", ");
sb.append("World");
sb.insert(5, "!!!");      // "Hello!!!, World"
sb.delete(5, 8);          // "Hello, World"
sb.reverse();             // "dlroW ,olleH"
System.out.println(sb.toString());

// Неправильно в цикле (создаёт много объектов):
String result = "";
for (int i = 0; i < 100; i++) result += i;  // медленно!

// Правильно:
StringBuilder sb2 = new StringBuilder();
for (int i = 0; i < 100; i++) sb2.append(i);
String result2 = sb2.toString();</code></pre>

<h3>Преобразование строка ↔ число</h3>
<pre><code>// Строка → число
int n = Integer.parseInt("42");
double d = Double.parseDouble("3.14");
long l = Long.parseLong("9999999999");

// Число → строка
String s1 = String.valueOf(42);
String s2 = Integer.toString(42);
String s3 = "" + 42;  // конкатенация с пустой строкой

// Форматирование
String formatted = String.format("Цена: %.2f руб.", 1234.5678);
// "Цена: 1234.57 руб."</code></pre>`,
      tasks: [
        { id:'jb_t47', title:'Длина строки', difficulty:'easy',
          description:'<p>Выведите длину строки <code>"Java Programming"</code>.</p>',
          hints:['str.length()'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Java Programming";
        // выведите длину
    }
}`},
        { id:'jb_t48', title:'Перевод в верхний регистр', difficulty:'easy',
          description:'<p>Переведите строку <code>"hello world"</code> в верхний регистр и выведите.</p>',
          hints:['str.toUpperCase()'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "hello world";
        // выведите в верхнем регистре
    }
}`},
        { id:'jb_t49', title:'Первый символ строки', difficulty:'easy',
          description:'<p>Выведите первый и последний символ строки <code>"Java"</code>.</p>',
          hints:['str.charAt(0)','str.charAt(str.length() - 1)'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Java";
        // выведите первый и последний символы
    }
}`},
        { id:'jb_t50', title:'Разворот строки', difficulty:'easy',
          description:'<p>Разверните строку <code>"Hello"</code> → <code>"olleH"</code>.</p>',
          hints:['new StringBuilder(str).reverse().toString()'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Hello";
        // разверните строку
    }
}`},
        { id:'jb_t51', title:'Содержит ли подстроку', difficulty:'easy',
          description:'<p>Проверьте, содержит ли строка <code>"Java is amazing"</code> слово <code>"amazing"</code>. Выведите <code>true</code> или <code>false</code>.</p>',
          hints:['str.contains("amazing")'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Java is amazing";
        String search = "amazing";
        // проверьте наличие подстроки
    }
}`},
        { id:'jb_t52', title:'Подсчёт гласных', difficulty:'medium',
          description:'<p>Подсчитайте количество гласных букв (a, e, i, o, u) в строке <code>"Hello World"</code> без учёта регистра.</p>',
          hints:['str.toLowerCase()','"aeiou".indexOf(c) != -1'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Hello World";
        int count = 0;
        for (char c : str.toLowerCase().toCharArray()) {
            // проверьте является ли c гласной
        }
        System.out.println("Гласных: " + count); // 3
    }
}`},
        { id:'jb_t53', title:'Палиндром', difficulty:'medium',
          description:'<p>Проверьте, является ли строка <code>"racecar"</code> палиндромом (одинаково читается с обеих сторон). Выведите true/false.</p>',
          hints:['Сравните с реверсом: str.equals(new StringBuilder(str).reverse().toString())'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "racecar";
        // проверьте палиндром
    }
}`},
        { id:'jb_t54', title:'Замена пробелов', difficulty:'medium',
          description:'<p>Замените все пробелы в строке <code>"Hello World Java"</code> на символ подчёркивания <code>_</code>.</p>',
          hints:['str.replace(" ", "_")'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String str = "Hello World Java";
        // замените пробелы на _
    }
}`},
        { id:'jb_t55', title:'Счётчик слов', difficulty:'hard',
          description:'<p>Подсчитайте количество слов в строке <code>"Java is a great programming language"</code> и выведите каждое слово с его порядковым номером.</p>',
          hints:['str.split("\\\\s+") — разбить по пробелам','words.length — количество слов'],
          startCode:`public class Main {
    public static void main(String[] args) {
        String sentence = "Java is a great programming language";
        String[] words = sentence.split("\\s+");
        // выведите количество слов
        // выведите каждое слово с номером: "1. Java"
    }
}`}
      ]
    },
    {
      id: 'jb_ch6',
      title: 'Методы (функции)',
      lecture: `<h2>Методы в Java</h2>
<p>Метод — именованный блок кода, который выполняет конкретную задачу и может быть вызван многократно.</p>

<h3>Объявление метода</h3>
<pre><code>// модификатор возврат имя(параметры) { тело }
public static int add(int a, int b) {
    return a + b;
}

// Метод без возвращаемого значения
public static void greet(String name) {
    System.out.println("Привет, " + name + "!");
    // нет return (или просто return;)
}

// Вызов
int sum = add(5, 3);       // 8
greet("Java");              // Привет, Java!</code></pre>

<h3>Перегрузка методов (overloading)</h3>
<pre><code>// Одно имя — разные параметры
static int max(int a, int b) { return a > b ? a : b; }
static double max(double a, double b) { return a > b ? a : b; }
static int max(int a, int b, int c) { return max(max(a, b), c); }

System.out.println(max(5, 3));           // 5
System.out.println(max(3.14, 2.71));     // 3.14
System.out.println(max(5, 3, 9));        // 9</code></pre>

<h3>Varargs — переменное число аргументов</h3>
<pre><code>static int sum(int... numbers) {  // ... — varargs
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}

System.out.println(sum(1, 2, 3));        // 6
System.out.println(sum(1, 2, 3, 4, 5)); // 15
System.out.println(sum());               // 0</code></pre>

<h3>Рекурсия — метод вызывает сам себя</h3>
<pre><code>static long factorial(int n) {
    if (n <= 1) return 1;           // базовый случай!
    return n * factorial(n - 1);    // рекурсивный вызов
}

// factorial(5) = 5 * factorial(4)
//              = 5 * 4 * factorial(3)
//              = 5 * 4 * 3 * factorial(2)
//              = 5 * 4 * 3 * 2 * factorial(1)
//              = 5 * 4 * 3 * 2 * 1 = 120</code></pre>

<div class="warning">⚠️ <strong>Рекурсия без базового случая → StackOverflowError!</strong> Всегда должно быть условие выхода.</div>`,
      tasks: [
        { id:'jb_t56', title:'Метод приветствия', difficulty:'easy',
          description:'<p>Напишите метод <code>greet(String name)</code>, который выводит <code>Привет, [name]!</code>. Вызовите его для трёх разных имён.</p>',
          hints:['static void greet(String name) { System.out.println("Привет, " + name + "!"); }'],
          startCode:`public class Main {
    static void greet(String name) {
        // реализуйте
    }

    public static void main(String[] args) {
        greet("Alice");
        greet("Bob");
        greet("Java");
    }
}`},
        { id:'jb_t57', title:'Метод суммы', difficulty:'easy',
          description:'<p>Напишите метод <code>sum(int a, int b)</code>, возвращающий сумму двух чисел. Вызовите и выведите результат.</p>',
          hints:['static int sum(int a, int b) { return a + b; }'],
          startCode:`public class Main {
    static int sum(int a, int b) {
        // реализуйте
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(sum(10, 20)); // 30
        System.out.println(sum(7, 8));   // 15
    }
}`},
        { id:'jb_t58', title:'Метод максимума', difficulty:'easy',
          description:'<p>Напишите метод <code>max(int a, int b, int c)</code>, возвращающий наибольшее из трёх чисел.</p>',
          hints:['if (a >= b && a >= c) return a;'],
          startCode:`public class Main {
    static int max(int a, int b, int c) {
        // реализуйте
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(max(3, 7, 5));  // 7
        System.out.println(max(10, 2, 8)); // 10
    }
}`},
        { id:'jb_t59', title:'Метод степени', difficulty:'medium',
          description:'<p>Напишите метод <code>power(int base, int exp)</code>, возвращающий base^exp (без Math.pow). Перегрузите для double.</p>',
          hints:['long result = 1; for (int i=0; i<exp; i++) result *= base;'],
          startCode:`public class Main {
    static long power(int base, int exp) {
        // реализуйте через цикл
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(power(2, 10)); // 1024
        System.out.println(power(3, 5));  // 243
        System.out.println(power(5, 0));  // 1
    }
}`},
        { id:'jb_t60', title:'Рекурсивный факториал', difficulty:'medium',
          description:'<p>Реализуйте <strong>рекурсивный</strong> метод вычисления факториала. Проверьте для n = 0, 1, 5, 10.</p>',
          hints:['if (n <= 1) return 1;','return n * factorial(n - 1);'],
          startCode:`public class Main {
    static long factorial(int n) {
        // рекурсивная реализация
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));  // 1
        System.out.println(factorial(1));  // 1
        System.out.println(factorial(5));  // 120
        System.out.println(factorial(10)); // 3628800
    }
}`}
      ]
    }
  ]
});
