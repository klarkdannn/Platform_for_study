'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'functional',
  title: 'Функциональное программирование',
  icon: '🔗',
  description: 'Лямбды, Stream API, Optional, Method references',
  color: '#06b6d4',
  chapters: [
    {
      id: 'fn_ch1',
      title: 'Лямбды и функциональные интерфейсы',
      lecture: `<h2>Лямбда-выражения</h2>
<p>Лямбда — анонимная функция. Синтаксис: <code>(параметры) -> тело</code>. Введены в Java 8.</p>

<h3>Синтаксис лямбд</h3>
<pre><code>// Без параметров
Runnable r = () -> System.out.println("Привет!");

// Один параметр (скобки необязательны)
Consumer&lt;String&gt; print = s -> System.out.println(s);

// Несколько параметров
Comparator&lt;String&gt; comp = (a, b) -> a.length() - b.length();

// Блок кода (с return)
BinaryOperator&lt;Integer&gt; add = (x, y) -> {
    int sum = x + y;
    return sum;
};

// Было (анонимный класс):
Runnable old = new Runnable() {
    public void run() { System.out.println("old style"); }
};
// Стало:
Runnable modern = () -> System.out.println("modern");</code></pre>

<h3>Встроенные функциональные интерфейсы (java.util.function)</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#1e293b"><th style="padding:8px;border:1px solid #334155">Интерфейс</th><th style="padding:8px;border:1px solid #334155">Сигнатура</th><th style="padding:8px;border:1px solid #334155">Применение</th></tr>
<tr><td style="padding:6px;border:1px solid #334155">Function&lt;T, R&gt;</td><td style="padding:6px;border:1px solid #334155">T → R</td><td style="padding:6px;border:1px solid #334155">Преобразование</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">Predicate&lt;T&gt;</td><td style="padding:6px;border:1px solid #334155">T → boolean</td><td style="padding:6px;border:1px solid #334155">Условие, фильтр</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">Consumer&lt;T&gt;</td><td style="padding:6px;border:1px solid #334155">T → void</td><td style="padding:6px;border:1px solid #334155">Действие над значением</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">Supplier&lt;T&gt;</td><td style="padding:6px;border:1px solid #334155">() → T</td><td style="padding:6px;border:1px solid #334155">Поставщик значения</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">BiFunction&lt;T,U,R&gt;</td><td style="padding:6px;border:1px solid #334155">(T, U) → R</td><td style="padding:6px;border:1px solid #334155">Два аргумента</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">UnaryOperator&lt;T&gt;</td><td style="padding:6px;border:1px solid #334155">T → T</td><td style="padding:6px;border:1px solid #334155">Function где T=R</td></tr>
<tr><td style="padding:6px;border:1px solid #334155">BinaryOperator&lt;T&gt;</td><td style="padding:6px;border:1px solid #334155">(T,T) → T</td><td style="padding:6px;border:1px solid #334155">Два аргумента одного типа</td></tr>
</table>

<pre><code>import java.util.function.*;

// Function&lt;T, R&gt;
Function&lt;String, Integer&gt; strLen = s -> s.length();
System.out.println(strLen.apply("Java")); // 4

// Predicate&lt;T&gt;
Predicate&lt;Integer&gt; isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4)); // true
System.out.println(isEven.negate().test(4)); // false — отрицание

// Predicate комбинация
Predicate&lt;Integer&gt; positive = n -> n > 0;
Predicate&lt;Integer&gt; evenAndPos = isEven.and(positive); // оба условия
Predicate&lt;Integer&gt; evenOrPos  = isEven.or(positive);  // любое условие

// Consumer&lt;T&gt;
Consumer&lt;String&gt; printer = System.out::println;
printer.accept("Hello"); // выводит Hello

// Supplier&lt;T&gt;
Supplier&lt;String&gt; greeting = () -> "Привет, мир!";
System.out.println(greeting.get()); // Привет, мир!</code></pre>

<h3>Ссылки на методы (Method References)</h3>
<pre><code>// Статический метод:    ClassName::staticMethod
Function&lt;String, Integer&gt; parse = Integer::parseInt;

// Метод экземпляра:     ClassName::instanceMethod
Function&lt;String, String&gt; upper = String::toUpperCase;

// Метод конкретного объекта: instance::method
String prefix = "Java: ";
Function&lt;String, String&gt; addPrefix = prefix::concat;

// Конструктор:          ClassName::new
Supplier&lt;StringBuilder&gt; sbFactory = StringBuilder::new;</code></pre>

<h3>Цепочка функций</h3>
<pre><code>Function&lt;String, String&gt; trim  = String::trim;
Function&lt;String, String&gt; upper = String::toUpperCase;
Function&lt;String, Integer&gt; len  = String::length;

// andThen: trim → upper
Function&lt;String, String&gt; process = trim.andThen(upper);
System.out.println(process.apply("  hello  ")); // HELLO

// compose: сначала upper, потом trim (обратный порядок)
Function&lt;String, String&gt; reversed = trim.compose(upper);</code></pre>`,
      tasks: [
        {
          id: 'fn_t0', title: 'Runnable лямбда', difficulty: 'easy',
          description: '<p>Создайте <code>Runnable</code> через лямбду, которая выводит "Привет из лямбды!" Вызовите её через <code>run()</code>. Затем создайте второй Runnable через ссылку на метод.</p>',
          hints: ['Runnable r = () -> System.out.println("...");', 'r.run();'],
          startCode: `public class Main {
    static void hello() {
        System.out.println("Привет из ссылки на метод!");
    }

    public static void main(String[] args) {
        // создайте Runnable через лямбду
        Runnable r1 = // ваша лямбда

        // создайте Runnable через ссылку на метод hello()
        Runnable r2 = // Main::hello

        r1.run(); // Привет из лямбды!
        r2.run(); // Привет из ссылки на метод!
    }
}`
        },
        {
          id: 'fn_t1', title: 'Predicate', difficulty: 'easy',
          description: '<p>Создайте <code>Predicate&lt;String&gt;</code> который проверяет, что строка начинается с большой буквы. Создайте второй Predicate для проверки длины > 4. Скомбинируйте через <code>and()</code>.</p>',
          hints: ['s -> Character.isUpperCase(s.charAt(0))', 'predicate1.and(predicate2)'],
          startCode: `import java.util.function.Predicate;
public class Main {
    public static void main(String[] args) {
        Predicate<String> startsWithUpper = s -> Character.isUpperCase(s.charAt(0));
        Predicate<String> longerThan4    = s -> s.length() > 4;
        Predicate<String> combined       = startsWithUpper.and(longerThan4);

        System.out.println(startsWithUpper.test("Java"));   // true
        System.out.println(startsWithUpper.test("java"));   // false
        System.out.println(combined.test("Python"));        // true (P и длина 6)
        System.out.println(combined.test("Go"));            // false (G но длина 2)
        System.out.println(combined.test("angular"));       // false (a не заглавная)
    }
}`
        },
        {
          id: 'fn_t1b', title: 'Function и Consumer', difficulty: 'easy',
          description: '<p>Создайте <code>Function&lt;Integer, String&gt;</code> которая конвертирует число в строку вида "Число: 42". Создайте <code>Consumer&lt;String&gt;</code> который выводит строку заглавными буквами. Свяжите через <code>andThen()</code>.</p>',
          hints: ['Function<Integer, String> f = n -> "Число: " + n;', 'Consumer<String> c = s -> System.out.println(s.toUpperCase());'],
          startCode: `import java.util.function.*;
public class Main {
    public static void main(String[] args) {
        Function<Integer, String> toStr = n -> "Число: " + n;
        Consumer<String> printUpper = s -> System.out.println(s.toUpperCase());

        // Примените toStr к 42, результат передайте в printUpper
        // Используйте toStr.andThen(printUpper) или вызовите вручную
        printUpper.accept(toStr.apply(42));   // ЧИСЛО: 42
        printUpper.accept(toStr.apply(100));  // ЧИСЛО: 100

        // Создайте Supplier<Integer> который возвращает текущее время в мс
        Supplier<Long> timer = () -> System.currentTimeMillis();
        System.out.println("Время: " + timer.get());
    }
}`
        },
        {
          id: 'fn_t2', title: 'Function compose', difficulty: 'medium',
          description: '<p>Создайте три функции: <code>trim</code> (убирает пробелы), <code>toUpper</code> (в верхний регистр), <code>addBrackets</code> (добавляет скобки: [HELLO]). Скомпонуйте их через <code>andThen()</code> и примените к строке <code>"  hello world  "</code>.</p>',
          hints: ['Function<String,String> trim = String::trim;', 'trim.andThen(toUpper).andThen(addBrackets).apply(str)'],
          startCode: `import java.util.function.Function;
public class Main {
    public static void main(String[] args) {
        Function<String, String> trim        = String::trim;
        Function<String, String> toUpper     = String::toUpperCase;
        Function<String, String> addBrackets = s -> "[" + s + "]";

        // скомпонуйте все три через andThen
        Function<String, String> process = // ???

        System.out.println(process.apply("  hello world  ")); // [HELLO WORLD]
        System.out.println(process.apply("  java  "));        // [JAVA]
    }
}`
        },
        {
          id: 'fn_t3', title: 'Фильтрация через Predicate', difficulty: 'medium',
          description: '<p>Дан список чисел. Напишите метод <code>filter(List, Predicate)</code>, который возвращает новый список с элементами, удовлетворяющими предикату. Используйте без Stream API. Проверьте на чётных и числах > 5.</p>',
          hints: ['for (T item : list) if (predicate.test(item)) result.add(item);'],
          startCode: `import java.util.*;
import java.util.function.Predicate;
public class Main {
    static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
        List<T> result = new ArrayList<>();
        for (T item : list) {
            if (predicate.test(item)) result.add(item);
        }
        return result;
    }

    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1,2,3,4,5,6,7,8,9,10);

        List<Integer> evens   = filter(nums, n -> n % 2 == 0);
        List<Integer> bigNums = filter(nums, n -> n > 5);
        List<Integer> both    = filter(nums, n -> n % 2 == 0 && n > 5);

        System.out.println("Чётные: " + evens);   // [2, 4, 6, 8, 10]
        System.out.println("Больше 5: " + bigNums); // [6, 7, 8, 9, 10]
        System.out.println("Оба: " + both);          // [6, 8, 10]
    }
}`
        }
      ]
    },
    {
      id: 'fn_ch2',
      title: 'Stream API',
      lecture: `<h2>Stream API</h2>
<p>Stream — последовательность элементов с поддержкой последовательных и параллельных операций. Stream не хранит данные — только описывает обработку. Принцип: <strong>создание → промежуточные операции → терминальная операция</strong>.</p>

<div class="note">Stream ленивый (lazy): промежуточные операции не выполняются до вызова терминальной. Это позволяет оптимизировать обработку.</div>

<h3>Создание стримов</h3>
<pre><code>// Из коллекции
List&lt;String&gt; list = Arrays.asList("a", "b", "c");
Stream&lt;String&gt; s1 = list.stream();

// Из массива
int[] arr = {1, 2, 3};
IntStream s2 = Arrays.stream(arr);

// Stream.of()
Stream&lt;String&gt; s3 = Stream.of("x", "y", "z");

// Диапазон чисел
IntStream s4 = IntStream.range(1, 6);         // 1 2 3 4 5
IntStream s5 = IntStream.rangeClosed(1, 5);   // 1 2 3 4 5

// Бесконечный стрим
Stream&lt;Integer&gt; s6 = Stream.iterate(0, n -> n + 2).limit(5); // 0 2 4 6 8
Stream&lt;Double&gt;  s7 = Stream.generate(Math::random).limit(3);</code></pre>

<h3>Промежуточные операции (возвращают Stream)</h3>
<pre><code>list.stream()
    .filter(s -> s.length() > 3)       // фильтрация — оставить элементы
    .map(String::toUpperCase)            // преобразование — один в один
    .flatMap(s -> Stream.of(s, s+"!"))  // разворачивание — один в много
    .distinct()                          // убрать дубликаты
    .sorted()                            // сортировка
    .sorted(Comparator.reverseOrder())   // сортировка с компаратором
    .limit(5)                            // взять первые N
    .skip(2)                             // пропустить первые N
    .peek(System.out::println)           // посмотреть без изменения</code></pre>

<h3>Терминальные операции</h3>
<pre><code>// Сбор в коллекцию
List&lt;String&gt; result = stream.collect(Collectors.toList());
Set&lt;String&gt;  set    = stream.collect(Collectors.toSet());
String joined = stream.collect(Collectors.joining(", ", "[", "]"));

// Подсчёт и агрегация
long count = stream.count();
Optional&lt;Integer&gt; max = stream.max(Comparator.naturalOrder());
Optional&lt;Integer&gt; min = stream.min(Comparator.naturalOrder());
int sum = intStream.sum();
double avg = intStream.average().orElse(0);

// Проверки
boolean anyMatch = stream.anyMatch(s -> s.startsWith("A")); // хотя бы один
boolean allMatch = stream.allMatch(s -> s.length() > 0);     // все
boolean noneMatch = stream.noneMatch(s -> s.isEmpty());      // ни одного

// Нахождение элемента
Optional&lt;String&gt; first = stream.findFirst();
Optional&lt;String&gt; any   = stream.findAny();

// forEach (действие над каждым)
stream.forEach(System.out::println);

// reduce — сворачивание
int sum2 = IntStream.rangeClosed(1, 100).reduce(0, Integer::sum); // 5050</code></pre>

<h3>Collectors</h3>
<pre><code>// Группировка
Map&lt;Integer, List&lt;String&gt;&gt; byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));

// Группировка с трансформацией
Map&lt;Integer, Long&gt; countByLength = names.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));

// Разделение (partitioning)
Map&lt;Boolean, List&lt;Integer&gt;&gt; parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));

// toMap
Map&lt;String, Integer&gt; wordToLength = words.stream()
    .collect(Collectors.toMap(w -> w, String::length));</code></pre>`,
      tasks: [
        {
          id: 'fn_t3b', title: 'Первый Stream', difficulty: 'easy',
          description: '<p>Дан список чисел от 1 до 10. Используя Stream API: отфильтруйте числа больше 5, умножьте каждое на 2, выведите через forEach.</p>',
          hints: ['.filter(n -> n > 5)', '.map(n -> n * 2)', '.forEach(System.out::println)'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        numbers.stream()
            .filter(n -> n > 5)   // оставить > 5
            .map(n -> n * 2)      // умножить на 2
            .forEach(System.out::println); // вывести: 12, 14, 16, 18, 20
    }
}`
        },
        {
          id: 'fn_t4', title: 'Фильтр и список', difficulty: 'easy',
          description: '<p>Дан список имён. Отфильтруйте имена длиннее 4 букв, переведите в верхний регистр, соберите в новый List. Также подсчитайте количество имён длиной ровно 3 буквы.</p>',
          hints: ['.filter(s -> s.length() > 4)', '.map(String::toUpperCase)', '.collect(Collectors.toList())'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Al", "Bob", "Alice", "Charlie", "Eve", "Diana", "Tom");

        List<String> longNames = names.stream()
            .filter(s -> s.length() > 4)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println(longNames); // [ALICE, CHARLIE, DIANA]

        long count3 = names.stream()
            // подсчитайте имена длиной ровно 3 буквы
            .count();
        System.out.println("Имена длиной 3: " + count3); // 2 (Bob, Eve, Tom -> 3)
    }
}`
        },
        {
          id: 'fn_t5', title: 'Сумма через reduce', difficulty: 'easy',
          description: '<p>Вычислите: (1) сумму квадратов чётных чисел от 1 до 10; (2) произведение нечётных чисел от 1 до 7.</p>',
          hints: ['IntStream.rangeClosed(1, 10)', '.filter(n -> n % 2 == 0)', '.map(n -> n * n)', '.sum()', '.reduce(1, (a,b) -> a*b)'],
          startCode: `import java.util.stream.IntStream;
public class Main {
    public static void main(String[] args) {
        // Сумма квадратов чётных чисел 1..10
        int sumSquaresEven = IntStream.rangeClosed(1, 10)
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .sum();
        System.out.println("Сумма квадратов чётных: " + sumSquaresEven); // 220

        // Произведение нечётных 1..7
        int productOdd = IntStream.rangeClosed(1, 7)
            .filter(n -> n % 2 != 0)
            .reduce(1, (a, b) -> a * b);
        System.out.println("Произведение нечётных: " + productOdd); // 105 (1*3*5*7)
    }
}`
        },
        {
          id: 'fn_t6', title: 'Группировка по первой букве', difficulty: 'medium',
          description: '<p>Дан список слов. Сгруппируйте их по первой букве с помощью <code>Collectors.groupingBy()</code>. Выведите каждую группу. Также подсчитайте количество слов в каждой группе.</p>',
          hints: ['.collect(Collectors.groupingBy(s -> s.charAt(0)))', 'map.forEach((k, v) -> ...)'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList(
            "apple","ant","banana","bear","cherry","cat","dog","deer","elephant"
        );

        // Группировка по первой букве
        Map<Character, List<String>> grouped = words.stream()
            .collect(Collectors.groupingBy(s -> s.charAt(0)));
        grouped.forEach((k, v) -> System.out.println(k + ": " + v));

        System.out.println("---");

        // Подсчёт слов по первой букве
        Map<Character, Long> counts = words.stream()
            .collect(Collectors.groupingBy(s -> s.charAt(0), Collectors.counting()));
        counts.forEach((k, v) -> System.out.println(k + " -> " + v));
    }
}`
        },
        {
          id: 'fn_t6b', title: 'anyMatch, allMatch, findFirst', difficulty: 'medium',
          description: '<p>Дан список чисел. Проверьте: есть ли отрицательные; все ли числа меньше 100; найдите первое чётное. Используйте anyMatch, allMatch, findFirst.</p>',
          hints: ['.anyMatch(n -> n < 0)', '.allMatch(n -> n < 100)', '.filter(n -> n % 2 == 0).findFirst()'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(15, 3, 42, 7, -2, 88, 21, 4);

        boolean hasNegative = numbers.stream()
            .anyMatch(n -> n < 0);
        System.out.println("Есть отрицательные: " + hasNegative); // true

        boolean allLess100 = numbers.stream()
            .allMatch(n -> n < 100);
        System.out.println("Все < 100: " + allLess100); // true

        Optional<Integer> firstEven = numbers.stream()
            .filter(n -> n % 2 == 0)
            .findFirst();
        System.out.println("Первое чётное: " + firstEven.orElse(-1)); // 42
    }
}`
        },
        {
          id: 'fn_t7', title: 'Top-3 самых длинных слова', difficulty: 'hard',
          description: '<p>Дан список слов. Найдите 3 самых длинных уникальных слова (без дубликатов) в нижнем регистре, отсортированные по убыванию длины. Используйте полный pipeline Stream.</p>',
          hints: ['.distinct()', '.sorted(Comparator.comparingInt(String::length).reversed())', '.limit(3)'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList(
            "Java","programming","is","great","and","programming","wonderful","fun","beautiful","code"
        );
        List<String> top3 = words.stream()
            .map(String::toLowerCase)
            .distinct()
            .sorted(Comparator.comparingInt(String::length).reversed())
            .limit(3)
            .collect(Collectors.toList());
        System.out.println(top3); // [programming, beautiful, wonderful]
    }
}`
        },
        {
          id: 'fn_t7b', title: 'Статистика через Stream', difficulty: 'hard',
          description: '<p>Дан список оценок студентов (String "Имя:Оценка"). Используя Stream API: найдите среднюю оценку; имя студента с максимальной оценкой; количество студентов с оценкой >= 4.</p>',
          hints: ['split(":")','mapToInt','max(Comparator.comparingInt())'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> data = Arrays.asList(
            "Алиса:5", "Боб:3", "Вера:4", "Григорий:5", "Дарья:2", "Егор:4"
        );

        // Средняя оценка
        double avg = data.stream()
            .mapToInt(s -> Integer.parseInt(s.split(":")[1]))
            .average()
            .orElse(0);
        System.out.printf("Средняя оценка: %.2f%n", avg);

        // Имя с максимальной оценкой
        String topStudent = data.stream()
            .max(Comparator.comparingInt(s -> Integer.parseInt(s.split(":")[1])))
            .map(s -> s.split(":")[0])
            .orElse("Нет данных");
        System.out.println("Лучший студент: " + topStudent);

        // Количество с оценкой >= 4
        long excellentCount = data.stream()
            .filter(s -> Integer.parseInt(s.split(":")[1]) >= 4)
            .count();
        System.out.println("Отличников и хорошистов: " + excellentCount);
    }
}`
        }
      ]
    },
    {
      id: 'fn_ch3',
      title: 'Optional',
      lecture: `<h2>Optional</h2>
<p><code>Optional&lt;T&gt;</code> — контейнер, который может содержать значение или быть пустым. Помогает явно работать с отсутствующими значениями и избежать NullPointerException.</p>

<div class="note">Optional не замена всем null — используйте его для возвращаемых значений методов, особенно когда отсутствие значения — нормальная ситуация (поиск в базе, конфигурация).</div>

<h3>Создание Optional</h3>
<pre><code>Optional&lt;String&gt; opt1 = Optional.of("Hello");         // не может быть null!
Optional&lt;String&gt; opt2 = Optional.empty();              // пустой
Optional&lt;String&gt; opt3 = Optional.ofNullable(null);     // null → пустой
Optional&lt;String&gt; opt4 = Optional.ofNullable("World");  // непустой</code></pre>

<h3>Получение значения</h3>
<pre><code>opt1.get();                      // "Hello" — бросает NoSuchElementException если пусто!
opt1.orElse("Default");          // "Hello"
opt2.orElse("Default");          // "Default"
opt2.orElseGet(() -> compute()); // лениво вычисляет default
opt2.orElseThrow(() -> new RuntimeException("Нет значения"));

// Проверка
opt1.isPresent(); // true
opt2.isPresent(); // false
opt2.isEmpty();   // true (Java 11+)</code></pre>

<h3>Трансформация</h3>
<pre><code>// map — преобразование если присутствует
Optional&lt;Integer&gt; length = opt1.map(String::length); // Optional[5]

// flatMap — если функция возвращает Optional
Optional&lt;String&gt; upper = opt1.flatMap(s -> Optional.of(s.toUpperCase()));

// filter — оставить если условие выполнено
Optional&lt;String&gt; long5 = opt1.filter(s -> s.length() >= 5); // Optional[Hello]

// ifPresent — действие если присутствует
opt1.ifPresent(System.out::println); // Hello

// ifPresentOrElse (Java 9+)
opt2.ifPresentOrElse(
    v -> System.out.println("Есть: " + v),
    () -> System.out.println("Пусто")
);</code></pre>

<h3>Цепочка Optional — безопасный доступ</h3>
<pre><code>// Вместо:
if (user != null && user.getAddress() != null) {
    String city = user.getAddress().getCity();
}

// Пишем:
String city = Optional.ofNullable(user)
    .map(User::getAddress)
    .map(Address::getCity)
    .orElse("Город не указан");</code></pre>`,
      tasks: [
        {
          id: 'fn_t8', title: 'Optional orElse', difficulty: 'easy',
          description: '<p>Напишите метод <code>findUser(String name)</code>, который возвращает <code>Optional&lt;String&gt;</code>. Если имя "Admin" — возвращает Optional с "Администратор", если "Guest" — с "Гость", иначе — пустой Optional. В main() используйте orElse().</p>',
          hints: ['return name.equals("Admin") ? Optional.of("Администратор") : Optional.empty();', '.orElse("Неизвестный")'],
          startCode: `import java.util.Optional;
public class Main {
    static Optional<String> findUser(String name) {
        if (name.equals("Admin")) return Optional.of("Администратор");
        if (name.equals("Guest")) return Optional.of("Гость");
        return Optional.empty();
    }

    public static void main(String[] args) {
        System.out.println(findUser("Admin").orElse("Неизвестный"));  // Администратор
        System.out.println(findUser("Guest").orElse("Неизвестный"));  // Гость
        System.out.println(findUser("Bob").orElse("Неизвестный"));    // Неизвестный

        // Используйте ifPresent
        findUser("Admin").ifPresent(u -> System.out.println("Найден: " + u));
    }
}`
        },
        {
          id: 'fn_t8b', title: 'Optional map и filter', difficulty: 'easy',
          description: '<p>Дан <code>Optional&lt;String&gt;</code> с числом в виде строки. С помощью <code>map(Integer::parseInt)</code> преобразуйте в Optional&lt;Integer&gt;. Затем filter — оставьте только положительные. Получите результат с orElse(0).</p>',
          hints: ['opt.map(Integer::parseInt)', '.filter(n -> n > 0)', '.orElse(0)'],
          startCode: `import java.util.Optional;
public class Main {
    static int parsePositive(Optional<String> opt) {
        return opt
            .map(Integer::parseInt)
            .filter(n -> n > 0)
            .orElse(0);
    }

    public static void main(String[] args) {
        System.out.println(parsePositive(Optional.of("42")));    // 42
        System.out.println(parsePositive(Optional.of("-5")));    // 0 (отрицательное)
        System.out.println(parsePositive(Optional.empty()));     // 0 (пусто)
    }
}`
        },
        {
          id: 'fn_t9', title: 'Цепочка Optional', difficulty: 'medium',
          description: '<p>Дан объект User с полем Address, у которого есть поле city (может быть null). Безопасно достаньте city через цепочку Optional.map(). Если null на любом уровне — верните "Неизвестный город".</p>',
          hints: ['Optional.ofNullable(user).map(u -> u.address).map(a -> a.city).orElse("Неизвестный город")'],
          startCode: `import java.util.Optional;
public class Main {
    static class Address { String city; Address(String c){city=c;} }
    static class User    { Address address; String name;
        User(String n, Address a){name=n; address=a;} }

    static String getCity(User user) {
        return Optional.ofNullable(user)
            .map(u -> u.address)
            .map(a -> a.city)
            .orElse("Неизвестный город");
    }

    public static void main(String[] args) {
        System.out.println(getCity(new User("Alice", new Address("Москва")))); // Москва
        System.out.println(getCity(new User("Bob", null)));                    // Неизвестный город
        System.out.println(getCity(null));                                     // Неизвестный город
    }
}`
        },
        {
          id: 'fn_t9b', title: 'orElseThrow', difficulty: 'hard',
          description: '<p>Реализуйте поиск пользователя по id в списке. Если пользователь не найден — бросьте RuntimeException через <code>orElseThrow()</code>. Добавьте метод <code>findByName()</code> возвращающий Optional без выброса исключения.</p>',
          hints: ['stream.filter(...).findFirst()', '.orElseThrow(() -> new RuntimeException("User not found: " + id))'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    record User(int id, String name, int age) {}

    static List<User> users = Arrays.asList(
        new User(1, "Alice", 25),
        new User(2, "Bob", 30),
        new User(3, "Charlie", 22)
    );

    static User findById(int id) {
        return users.stream()
            .filter(u -> u.id() == id)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + id));
    }

    static Optional<User> findByName(String name) {
        return users.stream()
            .filter(u -> u.name().equalsIgnoreCase(name))
            .findFirst();
    }

    public static void main(String[] args) {
        System.out.println(findById(1));     // User[id=1, name=Alice, age=25]
        System.out.println(findByName("bob").map(User::name).orElse("Нет")); // Bob
        System.out.println(findByName("unknown").map(User::name).orElse("Нет")); // Нет

        try {
            findById(99); // исключение
        } catch (RuntimeException e) {
            System.out.println("Поймано: " + e.getMessage());
        }
    }
}`
        }
      ]
    },
    {
      id: 'fn_ch4',
      title: 'Collectors и практика',
      lecture: `<h2>Продвинутые Collectors и практика</h2>
<p>Collectors — богатый набор инструментов для сборки результатов стрима в разные структуры данных.</p>

<h3>Основные Collectors</h3>
<pre><code>import java.util.stream.Collectors;

List&lt;String&gt; names = Arrays.asList("Alice", "Bob", "Alice", "Charlie");

// Сбор в коллекции
List&lt;String&gt; toList  = names.stream().collect(Collectors.toList());
Set&lt;String&gt;  toSet   = names.stream().collect(Collectors.toSet());
List&lt;String&gt; unmod   = names.stream().collect(Collectors.toUnmodifiableList()); // Java 10+

// Объединение в строку
String joined = names.stream().collect(Collectors.joining(", ")); // "Alice, Bob, Alice, Charlie"
String pretty = names.stream().collect(Collectors.joining(", ", "[", "]")); // "[Alice, Bob, ...]"

// Подсчёт, сумма, среднее
Long count   = names.stream().collect(Collectors.counting());
Integer sum  = nums.stream().collect(Collectors.summingInt(n -> n));
Double avg   = nums.stream().collect(Collectors.averagingInt(n -> n));

// IntSummaryStatistics — всё сразу
IntSummaryStatistics stats = nums.stream()
    .collect(Collectors.summarizingInt(n -> n));
System.out.println(stats.getMin() + " " + stats.getMax() + " " + stats.getAverage());</code></pre>

<h3>groupingBy — группировка</h3>
<pre><code>// Простая группировка
Map&lt;String, List&lt;String&gt;&gt; byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// С downstream collector — считаем количество
Map&lt;String, Long&gt; countByDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

// Группировка и суммирование
Map&lt;String, Double&gt; avgSalaryByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingDouble(Employee::getSalary)
    ));</code></pre>

<h3>partitioningBy — разделение на две группы</h3>
<pre><code>Map&lt;Boolean, List&lt;Integer&gt;&gt; evenOdd = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {true=[2,4,6], false=[1,3,5]}</code></pre>

<h3>toMap — в Map</h3>
<pre><code>Map&lt;String, Integer&gt; wordLengths = words.stream()
    .collect(Collectors.toMap(
        w -> w,           // ключ
        String::length    // значение
    ));

// При дубликатах ключей — merge function
Map&lt;String, Integer&gt; withMerge = words.stream()
    .collect(Collectors.toMap(
        w -> w.toLowerCase(),
        w -> 1,
        (existing, newVal) -> existing + newVal // суммируем при дублях
    ));</code></pre>`,
      tasks: [
        {
          id: 'fn_t10', title: 'Joining', difficulty: 'easy',
          description: '<p>Дан список имён. Соберите их в строку через запятую с пробелом. Затем создайте строку в формате "Привет, [Alice, Bob, Charlie]!"</p>',
          hints: ['Collectors.joining(", ")', 'Collectors.joining(", ", "[", "]")'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Diana");

        String simple = names.stream()
            .collect(Collectors.joining(", "));
        System.out.println(simple); // Alice, Bob, Charlie, Diana

        String greeting = "Привет, " +
            names.stream().collect(Collectors.joining(", ", "[", "]")) + "!";
        System.out.println(greeting); // Привет, [Alice, Bob, Charlie, Diana]!
    }
}`
        },
        {
          id: 'fn_t11', title: 'groupingBy на практике', difficulty: 'medium',
          description: '<p>Дан список строк "Имя,Отдел,Зарплата". Сгруппируйте по отделу и посчитайте: количество сотрудников в каждом отделе и среднюю зарплату по отделам.</p>',
          hints: ['split(",")', 'groupingBy + counting()', 'groupingBy + averagingDouble(...)'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    record Employee(String name, String dept, double salary) {}

    public static void main(String[] args) {
        List<String> raw = Arrays.asList(
            "Alice,IT,80000", "Bob,HR,50000", "Charlie,IT,95000",
            "Diana,Sales,60000", "Eve,IT,75000", "Frank,HR,55000"
        );

        List<Employee> employees = raw.stream()
            .map(s -> { String[] p = s.split(",");
                return new Employee(p[0], p[1], Double.parseDouble(p[2])); })
            .collect(Collectors.toList());

        // Количество по отделам
        Map<String, Long> countByDept = employees.stream()
            .collect(Collectors.groupingBy(Employee::dept, Collectors.counting()));
        countByDept.forEach((d, c) -> System.out.println(d + ": " + c + " чел."));

        System.out.println("---");

        // Средняя зарплата по отделам
        Map<String, Double> avgSalary = employees.stream()
            .collect(Collectors.groupingBy(Employee::dept, Collectors.averagingDouble(Employee::salary)));
        avgSalary.forEach((d, s) -> System.out.printf("%s: %.0f руб.%n", d, s));
    }
}`
        },
        {
          id: 'fn_t12', title: 'Статистика текста', difficulty: 'hard',
          description: '<p>Дан текст. Используя Stream API найдите: топ-3 самых частых слова (без знаков препинания); количество уникальных слов; среднюю длину слова.</p>',
          hints: ['split("\\\\s+") и replace("[^a-zA-Zа-яА-Я]", "")', 'Collectors.groupingBy + counting', 'sorted по значению Map.Entry'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        String text = "Java is great and Java is fast. Java programming is fun and great!";

        String[] words = text.toLowerCase().split("\\s+");

        // Частота слов
        Map<String, Long> freq = Arrays.stream(words)
            .map(w -> w.replaceAll("[^a-zA-Zа-яА-Я]", ""))
            .filter(w -> !w.isEmpty())
            .collect(Collectors.groupingBy(w -> w, Collectors.counting()));

        // Топ-3 самых частых
        System.out.println("Топ-3 слова:");
        freq.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(3)
            .forEach(e -> System.out.println("  " + e.getKey() + ": " + e.getValue()));

        // Уникальные слова
        long unique = freq.size();
        System.out.println("Уникальных слов: " + unique);

        // Средняя длина слова
        double avgLen = freq.keySet().stream()
            .mapToInt(String::length)
            .average()
            .orElse(0);
        System.out.printf("Средняя длина: %.2f символов%n", avgLen);
    }
}`
        }
      ]
    }
  ]
});
