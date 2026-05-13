'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'algorithms',
  title: 'Алгоритмы и структуры данных',
  icon: '⚙️',
  description: 'Поиск, сортировки, стек, очередь, деревья, графы, сложность',
  color: '#ef4444',
  chapters: [
    {
      id: 'alg_ch1',
      title: 'Сложность алгоритмов (Big O)',
      lecture: `<h2>Нотация Big O — оценка сложности</h2>
<p>Big O описывает, как растёт время выполнения (или память) алгоритма при увеличении объёма данных n.</p>

<h3>Основные классы сложности</h3>
<table>
<tr><th>Нотация</th><th>Название</th><th>n=10</th><th>n=100</th><th>n=1000</th><th>Пример</th></tr>
<tr><td><code>O(1)</code></td><td>Константная</td><td>1</td><td>1</td><td>1</td><td>arr[i], HashMap.get()</td></tr>
<tr><td><code>O(log n)</code></td><td>Логарифмическая</td><td>3</td><td>7</td><td>10</td><td>Бинарный поиск</td></tr>
<tr><td><code>O(n)</code></td><td>Линейная</td><td>10</td><td>100</td><td>1000</td><td>for-цикл, линейный поиск</td></tr>
<tr><td><code>O(n log n)</code></td><td>Линейно-лог.</td><td>33</td><td>664</td><td>9966</td><td>Merge Sort, Quick Sort</td></tr>
<tr><td><code>O(n²)</code></td><td>Квадратичная</td><td>100</td><td>10 000</td><td>1 000 000</td><td>Пузырьковая сортировка</td></tr>
<tr><td><code>O(2ⁿ)</code></td><td>Экспоненциальная</td><td>1024</td><td>10³⁰</td><td>∞</td><td>Наивный Фибоначчи</td></tr>
</table>

<h3>Примеры кода с оценкой</h3>
<pre><code>// O(1) — не зависит от n
int first = arr[0];
map.get("key");

// O(n) — один проход
int sum = 0;
for (int x : arr) sum += x;

// O(n²) — вложенные циклы
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        System.out.println(arr[i] + " " + arr[j]);

// O(log n) — делим пополам каждый раз
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = (lo + hi) / 2;
    // ...
}

// Константы и слагаемые опускаем:
// O(2n) = O(n)
// O(n² + n) = O(n²)
// O(100) = O(1)</code></pre>

<div class="tip">✅ <strong>Правило 80/20:</strong> для n = 10⁶: O(n log n) ≈ 20 млн операций — ок. O(n²) = 10¹² — слишком медленно!</div>`,
      tasks: [
        { id:'alg_t0a', title:'O(1) — доступ по индексу', difficulty:'easy',
          description:'<p>Напишите метод <code>getLast(int[] arr)</code>, который возвращает последний элемент массива за O(1). Вызовите для массива из 1000 элементов.</p>',
          hints:['return arr[arr.length - 1]; — одна операция, O(1)'],
          startCode:`public class Main {
    static int getLast(int[] arr) {
        // O(1) — одна операция
        return 0;
    }

    public static void main(String[] args) {
        int[] arr = new int[1000];
        for (int i = 0; i < arr.length; i++) arr[i] = i + 1;

        System.out.println(getLast(arr)); // 1000 — мгновенно!
        System.out.println("O(1) — не зависит от размера массива");
    }
}`},
        { id:'alg_t0b', title:'Подсчёт операций', difficulty:'easy',
          description:'<p>Подсчитайте количество итераций цикла для трёх алгоритмов при n=16:<br>1) Линейный (i от 0 до n)<br>2) Логарифмический (i = 1, i *= 2, пока i ≤ n)<br>3) Квадратичный (два вложенных цикла до n)</p>',
          hints:['Линейный: 16 итераций','Логарифмический: 1,2,4,8,16 → 5 итераций','Квадратичный: 16*16 = 256'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int n = 16;

        // O(n) — линейный
        int linear = 0;
        for (int i = 0; i < n; i++) linear++;
        System.out.println("O(n): " + linear + " итераций");

        // O(log n) — логарифмический
        int logN = 0;
        for (int i = 1; i <= n; i *= 2) logN++;
        System.out.println("O(log n): " + logN + " итераций");

        // O(n²) — квадратичный
        int quadratic = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) quadratic++;
        System.out.println("O(n²): " + quadratic + " итераций");
    }
}`}
      ]
    },
    {
      id: 'alg_ch2',
      title: 'Линейный и бинарный поиск',
      lecture: `<h2>Алгоритмы поиска</h2>

<h3>Линейный поиск — O(n)</h3>
<p>Самый простой алгоритм: просматриваем элементы по одному. Работает на несортированных массивах.</p>
<pre><code>// Найти индекс элемента (или -1)
static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1; // не найден
}

// Лучший случай: O(1) — элемент первый
// Худший случай: O(n) — элемент последний или не найден
// Среднее: O(n/2) = O(n)</code></pre>

<h3>Бинарный поиск — O(log n)</h3>
<p>Работает только на <strong>отсортированном</strong> массиве. Каждый раз делит область поиска пополам.</p>
<pre><code>static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // без переполнения!

        if (arr[mid] == target) return mid;      // нашли
        else if (arr[mid] < target) lo = mid + 1; // искать в правой половине
        else hi = mid - 1;                         // искать в левой половине
    }
    return -1; // не найден
}

// Пример для arr = [1, 3, 5, 7, 9, 11, 13], target = 7:
// lo=0, hi=6, mid=3 → arr[3]=7 ✓ → return 3 (за 1 шаг!)</code></pre>

<div class="note">📌 Для 1 000 000 элементов: линейный делает до 1 000 000 сравнений, бинарный — не более 20!</div>

<h3>Arrays.binarySearch (встроенный)</h3>
<pre><code>import java.util.Arrays;
int[] arr = {1, 3, 5, 7, 9};
int idx = Arrays.binarySearch(arr, 7);  // 3
// Если не найден — возвращает отрицательное число</code></pre>`,
      tasks: [
        { id:'alg_t1a', title:'Линейный поиск числа', difficulty:'easy',
          description:'<p>Реализуйте линейный поиск: найдите индекс числа <code>9</code> в массиве <code>{5, 3, 8, 1, 9, 2, 7}</code>. Если не найдено — верните -1.</p>',
          hints:['for (int i=0; i<arr.length; i++) if (arr[i]==target) return i;'],
          startCode:`public class Main {
    static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            // проверьте arr[i] == target
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 9, 2, 7};
        System.out.println(linearSearch(arr, 9)); // 4
        System.out.println(linearSearch(arr, 6)); // -1
    }
}`},
        { id:'alg_t1b', title:'Поиск максимума', difficulty:'easy',
          description:'<p>Найдите максимальный элемент в массиве — это тоже O(n) поиск. Верните его значение и индекс.</p>',
          hints:['int maxIdx = 0;','for (int i=1; i<arr.length; i++) if (arr[i]>arr[maxIdx]) maxIdx=i;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {3, 7, 1, 9, 4, 6, 2, 8, 5};
        int maxIdx = 0;
        for (int i = 1; i < arr.length; i++) {
            // обновите maxIdx если нашли большее
        }
        System.out.println("Максимум: " + arr[maxIdx] + " (индекс " + maxIdx + ")");
    }
}`},
        { id:'alg_t1c', title:'Поиск всех вхождений', difficulty:'easy',
          description:'<p>Найдите все индексы числа <code>3</code> в массиве <code>{1, 3, 5, 3, 7, 3, 9}</code>. Выведите все индексы.</p>',
          hints:['Не выходить из цикла после нахождения — продолжать перебор','if (arr[i] == target) System.out.print(i + " ");'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 3, 7, 3, 9};
        int target = 3;
        System.out.print("Индексы числа " + target + ": ");
        for (int i = 0; i < arr.length; i++) {
            // выведите все индексы где arr[i] == target
        }
        System.out.println(); // 1 3 5
    }
}`},
        { id:'alg_t1d', title:'Линейный поиск строки', difficulty:'easy',
          description:'<p>Найдите имя "Charlie" в массиве имён. Верните его индекс или -1.</p>',
          hints:['names[i].equals(target) — для строк equals, не =='],
          startCode:`public class Main {
    static int findName(String[] names, String target) {
        // линейный поиск в массиве строк
        return -1;
    }

    public static void main(String[] args) {
        String[] names = {"Alice", "Bob", "Charlie", "Diana", "Eve"};
        System.out.println(findName(names, "Charlie")); // 2
        System.out.println(findName(names, "Frank"));   // -1
    }
}`},
        { id:'alg_t1e', title:'Бинарный поиск', difficulty:'easy',
          description:'<p>Реализуйте бинарный поиск числа <code>7</code> в <strong>отсортированном</strong> массиве <code>{1, 3, 5, 7, 9, 11, 13}</code>.</p>',
          hints:['lo=0, hi=arr.length-1','mid = lo + (hi-lo)/2','arr[mid]<target → lo=mid+1, иначе hi=mid-1'],
          startCode:`public class Main {
    static int binarySearch(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) return mid;
            // если arr[mid] < target — ищем в правой половине
            // иначе — в левой
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(binarySearch(arr, 7));  // 3
        System.out.println(binarySearch(arr, 6));  // -1
        System.out.println(binarySearch(arr, 1));  // 0
        System.out.println(binarySearch(arr, 13)); // 6
    }
}`},
        { id:'alg_t1f', title:'Сравнение скорости поиска', difficulty:'medium',
          description:'<p>Создайте отсортированный массив из 100 000 элементов. Найдите элемент <code>99999</code> обоими методами. Сравните количество итераций.</p>',
          hints:['Добавьте счётчик iterations++','Линейный: до 100 000 итераций','Бинарный: не более 17'],
          startCode:`public class Main {
    static int[] buildArray(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) arr[i] = i;
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = buildArray(100_000);
        int target = 99_999;

        // Линейный поиск с подсчётом итераций
        int linearIterations = 0;
        for (int i = 0; i < arr.length; i++) {
            linearIterations++;
            if (arr[i] == target) break;
        }

        // Бинарный поиск с подсчётом итераций
        int binaryIterations = 0;
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            binaryIterations++;
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) break;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }

        System.out.println("Линейный: " + linearIterations + " итераций");
        System.out.println("Бинарный: " + binaryIterations + " итераций");
    }
}`},
        { id:'alg_t1g', title:'Бинарный поиск первого вхождения', difficulty:'hard',
          description:'<p>В массиве с дубликатами найдите индекс <strong>первого</strong> вхождения числа 5: <code>{1, 3, 5, 5, 5, 7, 9}</code>. Стандартный бинарный поиск вернёт любое.</p>',
          hints:['Когда arr[mid]==target — сохраните результат и продолжите поиск влево: hi=mid-1'],
          startCode:`public class Main {
    static int firstOccurrence(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1, result = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) {
                result = mid;
                hi = mid - 1; // ищем ещё левее
            } else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 5, 5, 7, 9};
        System.out.println(firstOccurrence(arr, 5)); // 2
        System.out.println(firstOccurrence(arr, 1)); // 0
        System.out.println(firstOccurrence(arr, 9)); // 6
    }
}`}
      ]
    },
    {
      id: 'alg_ch3',
      title: 'Сортировки',
      lecture: `<h2>Алгоритмы сортировки</h2>
<p>Сортировка — упорядочивание элементов. Различаются по сложности, стабильности и использованию памяти.</p>

<h3>Пузырьковая сортировка — O(n²)</h3>
<pre><code>// Сравниваем соседей и меняем местами
void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }
}</code></pre>

<h3>Сортировка выбором — O(n²)</h3>
<pre><code>// Находим минимум в несортированной части, ставим в начало
void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < arr.length; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
    }
}</code></pre>

<h3>Сортировка вставками — O(n²), O(n) если почти отсортировано</h3>
<pre><code>void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}</code></pre>

<h3>Быстрая сортировка — O(n log n) среднее</h3>
<pre><code>void quickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (arr[j] <= pivot) { i++; int t=arr[i]; arr[i]=arr[j]; arr[j]=t; }
    int t=arr[i+1]; arr[i+1]=arr[hi]; arr[hi]=t;
    int p = i + 1;
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}</code></pre>

<h3>Merge Sort — O(n log n), стабильная</h3>
<pre><code>void mergeSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi); // слияние двух частей
}</code></pre>

<h3>Сравнение сортировок</h3>
<table>
<tr><th>Алгоритм</th><th>Лучшее</th><th>Среднее</th><th>Худшее</th><th>Память</th><th>Стабильная</th></tr>
<tr><td>Пузырёк</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✓</td></tr>
<tr><td>Выбор</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✗</td></tr>
<tr><td>Вставка</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✓</td></tr>
<tr><td>Быстрая</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>✗</td></tr>
<tr><td>Слияние</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>✓</td></tr>
</table>`,
      tasks: [
        { id:'alg_t2a', title:'Обмен двух элементов', difficulty:'easy',
          description:'<p>Напишите метод <code>swap(int[] arr, int i, int j)</code>, который меняет местами два элемента массива. Это основная операция для большинства сортировок.</p>',
          hints:['int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;'],
          startCode:`import java.util.Arrays;
public class Main {
    static void swap(int[] arr, int i, int j) {
        // поменяйте arr[i] и arr[j] местами
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        swap(arr, 0, 4);
        System.out.println(Arrays.toString(arr)); // [5, 2, 3, 4, 1]
        swap(arr, 1, 3);
        System.out.println(Arrays.toString(arr)); // [5, 4, 3, 2, 1]
    }
}`},
        { id:'alg_t2b', title:'Один проход пузырька', difficulty:'easy',
          description:'<p>Реализуйте <strong>один проход</strong> пузырьковой сортировки: сравниваем соседей и меняем, если arr[j] > arr[j+1]. Посмотрите, как за один проход "всплывает" максимум.</p>',
          hints:['for (int j=0; j<arr.length-1; j++) if(arr[j]>arr[j+1]) swap(...)'],
          startCode:`import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 9};
        System.out.println("До:    " + Arrays.toString(arr));

        // один проход пузырька
        for (int j = 0; j < arr.length - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // поменяйте местами
            }
        }
        System.out.println("После: " + Arrays.toString(arr));
        // 9 должно быть в конце после одного прохода
    }
}`},
        { id:'alg_t2c', title:'Полная пузырьковая сортировка', difficulty:'easy',
          description:'<p>Реализуйте полную пузырьковую сортировку массива <code>{64, 34, 25, 12, 22, 11, 90}</code>.</p>',
          hints:['for (int i=0; i<n-1; i++) — внешний цикл','for (int j=0; j<n-i-1; j++) — внутренний','i-й проход гарантирует что i-й с конца элемент на месте'],
          startCode:`import java.util.Arrays;
public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // поменяйте местами
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr)); // [11, 12, 22, 25, 34, 64, 90]
    }
}`},
        { id:'alg_t2d', title:'Сортировка выбором', difficulty:'easy',
          description:'<p>Реализуйте сортировку выбором: на каждом шаге найдите минимум в оставшейся части и поставьте на позицию i.</p>',
          hints:['for (int i=0; i<n-1; i++) { int minIdx=i; for(int j=i+1;j<n;j++) if(arr[j]<arr[minIdx]) minIdx=j; swap(arr,i,minIdx); }'],
          startCode:`import java.util.Arrays;
public class Main {
    static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIdx = i;
            // найдите индекс минимума в arr[i+1..n-1]
            // поменяйте arr[i] и arr[minIdx]
        }
    }

    public static void main(String[] args) {
        int[] arr = {29, 10, 14, 37, 13};
        selectionSort(arr);
        System.out.println(Arrays.toString(arr)); // [10, 13, 14, 29, 37]
    }
}`},
        { id:'alg_t2e', title:'Сортировка вставками', difficulty:'medium',
          description:'<p>Реализуйте сортировку вставками: берём элемент и вставляем его на правильное место в уже отсортированную часть.</p>',
          hints:['int key = arr[i]; int j = i-1;','while (j>=0 && arr[j]>key) { arr[j+1]=arr[j]; j--; }','arr[j+1] = key;'],
          startCode:`import java.util.Arrays;
public class Main {
    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            // сдвигайте элементы больше key вправо
            // вставьте key на правильное место
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 2, 4, 6, 1, 3};
        insertionSort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4, 5, 6]
    }
}`},
        { id:'alg_t2f', title:'Подсчёт сравнений', difficulty:'medium',
          description:'<p>Сравните количество сравнений пузырьковой сортировки и сортировки выбором для массива из 20 элементов. Добавьте счётчик <code>comparisons</code>.</p>',
          hints:['Глобальная переменная: static int comparisons = 0;','comparisons++ перед каждым if сравнения'],
          startCode:`import java.util.Arrays;
public class Main {
    static int comparisons;

    static void bubbleSort(int[] arr) {
        comparisons = 0;
        int n = arr.length;
        for (int i = 0; i < n-1; i++)
            for (int j = 0; j < n-i-1; j++) {
                comparisons++; // считаем
                if (arr[j] > arr[j+1]) { int t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; }
            }
    }

    static void selectionSort(int[] arr) {
        comparisons = 0;
        for (int i = 0; i < arr.length-1; i++) {
            int min = i;
            for (int j = i+1; j < arr.length; j++) {
                comparisons++;
                if (arr[j] < arr[min]) min = j;
            }
            int t=arr[i]; arr[i]=arr[min]; arr[min]=t;
        }
    }

    public static void main(String[] args) {
        int[] a1 = {20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1}; // худший случай
        int[] a2 = a1.clone();

        bubbleSort(a1);
        System.out.println("Пузырёк (n=20): " + comparisons + " сравнений");

        selectionSort(a2);
        System.out.println("Выбором (n=20): " + comparisons + " сравнений");
    }
}`},
        { id:'alg_t2g', title:'Merge Sort', difficulty:'hard',
          description:'<p>Реализуйте сортировку слиянием (Merge Sort) — O(n log n). Рекурсивно делите массив на половины, затем сливайте в порядке.</p>',
          hints:['mergeSort(arr, 0, arr.length-1)','mid = (lo+hi)/2','merge: используйте вспомогательный массив'],
          startCode:`import java.util.Arrays;
public class Main {
    static void mergeSort(int[] arr, int lo, int hi) {
        if (lo >= hi) return;
        int mid = (lo + hi) / 2;
        mergeSort(arr, lo, mid);
        mergeSort(arr, mid + 1, hi);
        merge(arr, lo, mid, hi);
    }

    static void merge(int[] arr, int lo, int mid, int hi) {
        int[] tmp = new int[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0;
        while (i <= mid && j <= hi) {
            // сравниваем arr[i] и arr[j], берём меньший
        }
        while (i <= mid)  tmp[k++] = arr[i++];
        while (j <= hi)   tmp[k++] = arr[j++];
        for (int m = 0; m < tmp.length; m++) arr[lo + m] = tmp[m];
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr)); // [3, 9, 10, 27, 38, 43, 82]
    }
}`}
      ]
    },
    {
      id: 'alg_ch4',
      title: 'Стек и Очередь',
      lecture: `<h2>Стек (Stack) и Очередь (Queue)</h2>

<h3>Стек — LIFO (Last In, First Out)</h3>
<p>Последний добавленный — первым извлекается. Как стопка тарелок.</p>
<pre><code>import java.util.Deque;
import java.util.ArrayDeque;

Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;();
stack.push(1);     // [1]
stack.push(2);     // [2, 1]
stack.push(3);     // [3, 2, 1]

System.out.println(stack.peek()); // 3 (смотрим вершину)
System.out.println(stack.pop());  // 3 (снимаем вершину) → [2, 1]
System.out.println(stack.pop());  // 2 → [1]
System.out.println(stack.isEmpty()); // false</code></pre>

<h3>Очередь — FIFO (First In, First Out)</h3>
<p>Первый добавленный — первым извлекается. Как очередь в магазине.</p>
<pre><code>import java.util.Queue;
import java.util.LinkedList;

Queue&lt;String&gt; queue = new LinkedList&lt;&gt;();
queue.offer("Первый");  // добавляем в конец
queue.offer("Второй");
queue.offer("Третий");

System.out.println(queue.peek());  // "Первый" (смотрим начало)
System.out.println(queue.poll());  // "Первый" (извлекаем из начала)
System.out.println(queue.poll());  // "Второй"</code></pre>

<h3>Применения</h3>
<ul>
<li><strong>Стек:</strong> история браузера, отмена (Ctrl+Z), вызовы функций, проверка скобок, обход в глубину (DFS)</li>
<li><strong>Очередь:</strong> очередь задач, обход в ширину (BFS), буфер принтера</li>
</ul>`,
      tasks: [
        { id:'alg_t3a', title:'Push и Pop', difficulty:'easy',
          description:'<p>Создайте стек, добавьте числа 1, 2, 3, 4, 5. Снимайте по одному и выводите. Что первым выведется?</p>',
          hints:['Deque<Integer> stack = new ArrayDeque<>();','stack.push(n)', 'stack.pop() — LIFO: последний вошёл, первый вышел'],
          startCode:`import java.util.Deque;
import java.util.ArrayDeque;
public class Main {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        // добавьте числа 1, 2, 3, 4, 5
        // снимайте и выводите все элементы
        // ожидается: 5 4 3 2 1
    }
}`},
        { id:'alg_t3b', title:'Очередь: обслуживание', difficulty:'easy',
          description:'<p>Добавьте 4 клиента в очередь: "Алиса", "Боб", "Чарли", "Диана". Обслужите их по одному (poll) и выведите порядок обслуживания.</p>',
          hints:['Queue<String> q = new LinkedList<>();','q.offer("Алиса"); ...','while (!q.isEmpty()) System.out.println(q.poll());'],
          startCode:`import java.util.Queue;
import java.util.LinkedList;
public class Main {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();
        // добавьте: Алиса, Боб, Чарли, Диана
        // обслуживайте по одному через poll()
    }
}`},
        { id:'alg_t3c', title:'Проверка скобок', difficulty:'easy',
          description:'<p>Используя стек, проверьте правильность скобок в строке. Правильно: <code>"(()[]{})"</code>, <code>"{[]}"</code>. Неправильно: <code>"([)]"</code>, <code>"((("</code>.</p>',
          hints:['Открывающие (, [, { — push','Закрывающие ), ], } — pop и проверь соответствие','В конце стек должен быть пуст'],
          startCode:`import java.util.Deque;
import java.util.ArrayDeque;
public class Main {
    static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c=='(' || c=='[' || c=='{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c==')' && top!='(') return false;
                if (c==']' && top!='[') return false;
                if (c=='}' && top!='{') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isValid("(()[]{})")); // true
        System.out.println(isValid("([)]"));     // false
        System.out.println(isValid("{[]}"));     // true
        System.out.println(isValid("((("));      // false
    }
}`},
        { id:'alg_t3d', title:'Стек минимумов', difficulty:'medium',
          description:'<p>Реализуйте стек с поддержкой метода <code>getMin()</code>, который за O(1) возвращает минимальный элемент. Используйте два стека.</p>',
          hints:['Второй стек хранит минимумы: при push если новый ≤ top минстека — тоже push в минстек','При pop — если снятый равен top минстека — тоже pop'],
          startCode:`import java.util.Deque;
import java.util.ArrayDeque;
public class Main {
    static class MinStack {
        Deque<Integer> main = new ArrayDeque<>();
        Deque<Integer> mins = new ArrayDeque<>();

        void push(int val) {
            main.push(val);
            if (mins.isEmpty() || val <= mins.peek()) mins.push(val);
        }

        int pop() {
            int val = main.pop();
            if (val == mins.peek()) mins.pop();
            return val;
        }

        int getMin() { return mins.peek(); }
    }

    public static void main(String[] args) {
        MinStack s = new MinStack();
        s.push(5); s.push(3); s.push(7); s.push(2); s.push(4);
        System.out.println("Min: " + s.getMin()); // 2
        s.pop();
        System.out.println("Min: " + s.getMin()); // 2
        s.pop();
        System.out.println("Min: " + s.getMin()); // 3
    }
}`}
      ]
    },
    {
      id: 'alg_ch5',
      title: 'Рекурсия и динамическое программирование',
      lecture: `<h2>Рекурсия</h2>
<p>Функция, которая вызывает саму себя. Обязательно нужен <strong>базовый случай</strong> — условие выхода.</p>

<pre><code>// Факториал рекурсивно
// factorial(5) → 5 * factorial(4)
//              → 5 * 4 * factorial(3)
//              → 5 * 4 * 3 * factorial(2)
//              → 5 * 4 * 3 * 2 * factorial(1)
//              → 5 * 4 * 3 * 2 * 1 = 120

long factorial(int n) {
    if (n <= 1) return 1;          // базовый случай
    return n * factorial(n - 1);   // рекурсивный случай
}</code></pre>

<h2>Динамическое программирование (DP)</h2>
<p>Разбиваем задачу на подзадачи, сохраняем результаты чтобы не вычислять повторно.</p>

<pre><code>// Фибоначчи наивный — O(2ⁿ), ОЧЕНЬ медленно
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2); // fib(40) = ~10⁸ вызовов!
}

// С мемоизацией — O(n)
int[] memo = new int[100];
int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n]; // уже вычислено!
    return memo[n] = fibMemo(n-1) + fibMemo(n-2);
}

// Снизу вверх (tabulation) — O(n), без рекурсии
int fibDP(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}</code></pre>`,
      tasks: [
        { id:'alg_t4a', title:'Рекурсивный факториал', difficulty:'easy',
          description:'<p>Реализуйте рекурсивный факториал. Обязательно определите базовый случай. Проверьте для n=0,1,5,10.</p>',
          hints:['if (n <= 1) return 1;','return n * factorial(n-1);'],
          startCode:`public class Main {
    static long factorial(int n) {
        // базовый случай + рекурсия
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));  // 1
        System.out.println(factorial(1));  // 1
        System.out.println(factorial(5));  // 120
        System.out.println(factorial(10)); // 3628800
    }
}`},
        { id:'alg_t4b', title:'Сумма цифр числа', difficulty:'easy',
          description:'<p>Напишите <strong>рекурсивный</strong> метод суммы цифр числа. Для 1234 → 1+2+3+4 = 10.</p>',
          hints:['Базовый случай: n < 10 → return n','Рекурсия: return n%10 + digitSum(n/10)'],
          startCode:`public class Main {
    static int digitSum(int n) {
        // базовый случай: одна цифра
        // рекурсия: последняя цифра + сумма остальных
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(digitSum(1234));  // 10
        System.out.println(digitSum(999));   // 27
        System.out.println(digitSum(7));     // 7
    }
}`},
        { id:'alg_t4c', title:'Фибоначчи с мемоизацией', difficulty:'medium',
          description:'<p>Реализуйте Фибоначчи с мемоизацией. Измерьте разницу во времени с наивной рекурсией для n=40.</p>',
          hints:['int[] memo = new int[100];','if (memo[n] != 0) return memo[n];','memo[n] = fibMemo(n-1) + fibMemo(n-2); return memo[n];'],
          startCode:`public class Main {
    static int[] memo = new int[100];

    static long fib(int n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2); // медленно!
    }

    static long fibMemo(int n) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];
        // вычислите и сохраните в memo[n]
        return 0;
    }

    public static void main(String[] args) {
        long t1 = System.currentTimeMillis();
        System.out.println("fib(40) = " + fib(40));
        System.out.println("Без мемо: " + (System.currentTimeMillis()-t1) + "мс");

        long t2 = System.currentTimeMillis();
        System.out.println("fibMemo(40) = " + fibMemo(40));
        System.out.println("С мемо: " + (System.currentTimeMillis()-t2) + "мс");
    }
}`},
        { id:'alg_t4d', title:'Задача о монетах (DP)', difficulty:'hard',
          description:'<p>Монеты {1, 5, 10, 25}. Найдите минимальное количество монет для суммы <code>41</code> (25+10+5+1 = 4 монеты).</p>',
          hints:['dp[0]=0, dp[i]=amount+1 (∞)','Для каждой суммы: dp[i] = min(dp[i], dp[i-coin]+1)'],
          startCode:`import java.util.Arrays;
public class Main {
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // "бесконечность"
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int coin : coins)
                if (coin <= i)
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1,5,10,25}, 41)); // 4 (25+10+5+1)
        System.out.println(coinChange(new int[]{1,5,10,25}, 36)); // 3 (25+10+1)
        System.out.println(coinChange(new int[]{2}, 3));          // -1
    }
}`}
      ]
    },
    {
      id: 'alg_ch6',
      title: 'HashMap и двухуказательная техника',
      lecture: `<h2>HashMap в алгоритмах</h2>
<p>HashMap — ключ-значение с O(1) для get/put. Незаменим для задач подсчёта, группировки, проверки уже виденных элементов.</p>

<pre><code>import java.util.HashMap;

// Подсчёт частоты символов — O(n)
String s = "abracadabra";
Map&lt;Character, Integer&gt; freq = new HashMap&lt;&gt;();
for (char c : s.toCharArray()) {
    freq.put(c, freq.getOrDefault(c, 0) + 1);
}
// {a=5, b=2, r=2, c=1, d=1}

// Проверка дубликатов — O(n) вместо O(n²)
Set&lt;Integer&gt; seen = new HashSet&lt;&gt;();
for (int x : arr) {
    if (seen.contains(x)) System.out.println("Дубликат: " + x);
    seen.add(x);
}</code></pre>

<h2>Два указателя (Two Pointers)</h2>
<pre><code>// Сумма двух чисел в отсортированном массиве
static int[] twoSum(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
        int sum = arr[lo] + arr[hi];
        if (sum == target) return new int[]{lo, hi};
        else if (sum < target) lo++;
        else hi--;
    }
    return new int[]{-1, -1};
}

// Разворот массива на месте
static void reverse(int[] arr) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
        int tmp = arr[lo]; arr[lo] = arr[hi]; arr[hi] = tmp;
        lo++; hi--;
    }
}</code></pre>`,
      tasks: [
        { id:'alg_t5a', title:'Подсчёт частоты', difficulty:'easy',
          description:'<p>Подсчитайте сколько раз встречается каждое число в массиве <code>{1,2,3,2,1,3,3,4}</code>. Выведите пары число→количество.</p>',
          hints:['HashMap<Integer,Integer> freq = new HashMap<>();','freq.getOrDefault(n, 0) + 1'],
          startCode:`import java.util.HashMap;
import java.util.Map;
public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 2, 1, 3, 3, 4};
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : arr) {
            // подсчитайте частоту каждого числа
        }
        freq.forEach((k, v) -> System.out.println(k + " → " + v));
    }
}`},
        { id:'alg_t5b', title:'Есть ли дубликаты', difficulty:'easy',
          description:'<p>Проверьте, есть ли дубликаты в массиве <code>{1, 2, 3, 4, 5, 3}</code>. O(n) через HashSet.</p>',
          hints:['HashSet<Integer> seen = new HashSet<>();','if (!seen.add(x)) — дубликат! (add возвращает false если уже есть)'],
          startCode:`import java.util.HashSet;
public class Main {
    static boolean hasDuplicates(int[] arr) {
        // используйте HashSet
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasDuplicates(new int[]{1,2,3,4,5,3})); // true
        System.out.println(hasDuplicates(new int[]{1,2,3,4,5}));   // false
    }
}`},
        { id:'alg_t5c', title:'Два указателя: палиндром', difficulty:'easy',
          description:'<p>Проверьте, является ли строка палиндромом, используя два указателя (left и right) без дополнительной памяти.</p>',
          hints:['int lo=0, hi=str.length()-1;','while (lo < hi) сравниваем charAt(lo) и charAt(hi)'],
          startCode:`public class Main {
    static boolean isPalindrome(String s) {
        int lo = 0, hi = s.length() - 1;
        while (lo < hi) {
            if (s.charAt(lo) != s.charAt(hi)) return false;
            lo++; hi--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar")); // true
        System.out.println(isPalindrome("hello"));   // false
        System.out.println(isPalindrome("abba"));    // true
        System.out.println(isPalindrome("a"));       // true
    }
}`},
        { id:'alg_t5d', title:'Анаграмма через HashMap', difficulty:'medium',
          description:'<p>Проверьте, являются ли строки <code>"listen"</code> и <code>"silent"</code> анаграммами через HashMap (подсчёт частоты символов).</p>',
          hints:['Для s1: freq[c]++; для s2: freq[c]--;','В конце все значения должны быть 0'],
          startCode:`import java.util.HashMap;
import java.util.Map;
public class Main {
    static boolean isAnagram(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        Map<Character, Integer> freq = new HashMap<>();
        // для s1 увеличиваем счётчик, для s2 уменьшаем
        // проверяем что все значения == 0
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
        System.out.println(isAnagram("hello", "world"));   // false
        System.out.println(isAnagram("anagram", "nagaram")); // true
    }
}`}
      ]
    },

    /* ═══════════ Ch7: Структуры данных ═══════════ */
    {
      id: 'alg_ch7',
      title: 'Структуры данных: деревья, кучи, связный список',
      lecture: `<h2>Связный список (LinkedList)</h2>
<pre><code>Singly Linked:   [1|→] → [2|→] → [3|→] → null
Doubly Linked:   null ← [1|→] ↔ [2|→] ↔ [3|→] → null

Операции:
  prepend(v):  новый узел → head                O(1)
  append(v):   добавить в конец                 O(n)
  delete(v):   найти и удалить                  O(n)
  search(v):   перебор                          O(n)

vs Array:
  Вставка/удаление в начале: O(1) vs O(n)
  Доступ по индексу:          O(n) vs O(1)</code></pre>

<h2>Бинарное дерево поиска (BST)</h2>
<pre><code>         8
        / \\
       3   10
      / \\    \\
     1   6    14
        / \\   /
       4   7 13

BST инвариант: левый < корень < правый
  insert(6):  8→3→6 ✓
  search(7):  8→3→6→7 ✓ (3 шага)
  inorder:    1,3,4,6,7,8,10,13,14 ← отсортировано!</code></pre>

<h2>Куча (Heap) — приоритетная очередь</h2>
<pre><code>Max-Heap: родитель >= детей
         90
        /  \\
       75   60
      / \\   / \\
     55 40 20  10

Min-Heap: родитель <= детей (PriorityQueue в Java — min-heap)

Операции:
  offer(v): добавить + sift-up       O(log n)
  poll():   извлечь min/max + sift-down  O(log n)
  peek():   посмотреть min/max           O(1)

Применение: Dijkstra, A*, k-й наименьший элемент, медиана потока</code></pre>

<pre><code>import java.util.PriorityQueue;
import java.util.Collections;

// Min-Heap (по умолчанию):
PriorityQueue&lt;Integer&gt; minH = new PriorityQueue&lt;&gt;();
minH.offer(5); minH.offer(1); minH.offer(3);
System.out.println(minH.poll()); // 1

// Max-Heap:
PriorityQueue&lt;Integer&gt; maxH = new PriorityQueue&lt;&gt;(Collections.reverseOrder());
maxH.offer(5); maxH.offer(1); maxH.offer(3);
System.out.println(maxH.poll()); // 5</code></pre>`,
      tasks: [
        { id:'alg_t6a', title:'Связный список: push/pop', difficulty:'easy',
          description:'<p>Реализуйте односвязный список с методами <code>prepend(v)</code> (вставить в начало), <code>append(v)</code> (в конец), <code>toArray()</code>.</p>',
          hints:['class Node { int val; Node next; }','head = new Node(v); new.next = head; head = new;'],
          startCode:`import java.util.*;
public class Main {
    static class MyLinkedList {
        static class Node { int val; Node next; Node(int v){val=v;} }
        Node head;

        void prepend(int v) {
            Node n = new Node(v);
            n.next = head;
            head = n;
        }

        void append(int v) {
            Node n = new Node(v);
            if (head == null) { head = n; return; }
            Node cur = head;
            while (cur.next != null) cur = cur.next;
            cur.next = n;
        }

        List<Integer> toList() {
            List<Integer> res = new ArrayList<>();
            for (Node cur = head; cur != null; cur = cur.next) res.add(cur.val);
            return res;
        }
    }

    public static void main(String[] args) {
        MyLinkedList list = new MyLinkedList();
        list.append(1); list.append(2); list.append(3);
        list.prepend(0);
        System.out.println(list.toList()); // [0, 1, 2, 3]
    }
}`},
        { id:'alg_t6b', title:'BST: вставка и поиск', difficulty:'medium',
          description:'<p>Реализуйте BST с методами <code>insert(v)</code> и <code>contains(v)</code>. Выполните inorder-обход (должен вернуть отсортированный список).</p>',
          hints:['if (v < node.val) → левый', 'inorder: left → root → right'],
          startCode:`import java.util.*;
public class Main {
    static class BST {
        int val; BST left, right;
        BST(int v) { val = v; }
    }
    static BST root;

    static void insert(int v) { root = ins(root, v); }
    static BST ins(BST n, int v) {
        if (n == null) return new BST(v);
        if (v < n.val) n.left  = ins(n.left,  v);
        else           n.right = ins(n.right, v);
        return n;
    }

    static boolean contains(BST n, int v) {
        if (n == null) return false;
        if (v == n.val) return true;
        return v < n.val ? contains(n.left, v) : contains(n.right, v);
    }

    static void inorder(BST n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out); out.add(n.val); inorder(n.right, out);
    }

    public static void main(String[] args) {
        for (int v : new int[]{8,3,10,1,6,14,4,7,13}) insert(v);
        List<Integer> sorted = new ArrayList<>();
        inorder(root, sorted);
        System.out.println("Inorder (sorted): " + sorted);
        System.out.println("contains(6): " + contains(root, 6));
        System.out.println("contains(5): " + contains(root, 5));
    }
}`},
        { id:'alg_t6c', title:'Min-Heap: k наименьших', difficulty:'medium',
          description:'<p>Найдите k=3 наименьших числа в массиве, используя Max-Heap размером k (классический алгоритм).</p>',
          hints:['Max-Heap размером k: если новый < heap.peek() → заменить','Collections.reverseOrder() для max-heap'],
          startCode:`import java.util.*;
public class Main {
    static List<Integer> kSmallest(int[] arr, int k) {
        // Max-Heap размером k: держим k наименьших
        PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());
        for (int v : arr) {
            maxH.offer(v);
            if (maxH.size() > k) maxH.poll(); // удалить максимум
        }
        List<Integer> res = new ArrayList<>(maxH);
        Collections.sort(res);
        return res;
    }

    public static void main(String[] args) {
        int[] arr = {7, 3, 1, 9, 5, 2, 8, 4, 6};
        System.out.println("3 наименьших: " + kSmallest(arr, 3)); // [1, 2, 3]
        System.out.println("5 наименьших: " + kSmallest(arr, 5)); // [1, 2, 3, 4, 5]
    }
}`},
        { id:'alg_t6d', title:'Куча: поток медиан', difficulty:'hard',
          description:'<p>Реализуйте структуру, которая поддерживает добавление чисел и запрос медианы за O(log n). Использует две кучи: max-heap для левой половины, min-heap для правой.</p>',
          hints:['maxH.size() == minH.size() → медиана = среднее двух вершин','maxH.size() == minH.size()+1 → медиана = maxH.peek()'],
          startCode:`import java.util.*;
public class Main {
    static PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder()); // левая половина
    static PriorityQueue<Integer> minH = new PriorityQueue<>(); // правая половина

    static void addNum(int num) {
        maxH.offer(num);
        // Балансировка: гарантируем maxH.peek() <= minH.peek()
        if (!minH.isEmpty() && maxH.peek() > minH.peek()) {
            minH.offer(maxH.poll());
        }
        // Балансировка размеров
        if (maxH.size() > minH.size() + 1) minH.offer(maxH.poll());
        if (minH.size() > maxH.size())     maxH.offer(minH.poll());
    }

    static double getMedian() {
        if (maxH.size() == minH.size())
            return (maxH.peek() + minH.peek()) / 2.0;
        return maxH.peek();
    }

    public static void main(String[] args) {
        for (int v : new int[]{5, 2, 4, 1, 6, 3}) {
            addNum(v);
            System.out.printf("Добавили %d → медиана = %.1f%n", v, getMedian());
        }
    }
}`}
      ]
    },

    /* ═══════════ Ch8: Графы ═══════════ */
    {
      id: 'alg_ch8',
      title: 'Алгоритмы на графах',
      lecture: `<h2>Графы</h2>
<p>Граф G = (V, E): вершины (Vertices) и рёбра (Edges).</p>

<h3>Представления графа</h3>
<pre><code>Граф:  1—2, 1—3, 2—4, 3—4, 4—5

Список смежности (предпочтительно):
  1: [2, 3]
  2: [1, 4]
  3: [1, 4]
  4: [2, 3, 5]
  5: [4]

Матрица смежности:
     1  2  3  4  5
  1 [0, 1, 1, 0, 0]
  2 [1, 0, 0, 1, 0]
  3 [1, 0, 0, 1, 0]
  4 [0, 1, 1, 0, 1]
  5 [0, 0, 0, 1, 0]</code></pre>

<h3>BFS — обход в ширину</h3>
<pre><code>BFS от вершины 1:
  Уровень 0: [1]
  Уровень 1: [2, 3]      ← соседи 1
  Уровень 2: [4]         ← соседи 2,3 (не посещённые)
  Уровень 3: [5]         ← соседи 4

Порядок посещения: 1, 2, 3, 4, 5
Гарантирует КРАТЧАЙШИЙ путь (невзвешенный граф)!

Реализация: Queue + visited Set
  Time: O(V+E), Space: O(V)</code></pre>

<h3>DFS — обход в глубину</h3>
<pre><code>DFS от вершины 1:
  1 → 2 → 4 → 3 → (уже посещена 1) → 5

Порядок: 1, 2, 4, 3, 5 (или иной — зависит от порядка соседей)
Реализация: рекурсия / Stack
Применение: топологическая сортировка, обнаружение циклов, компоненты связности

  Time: O(V+E), Space: O(V)</code></pre>

<h3>Алгоритм Дейкстры (кратчайший путь)</h3>
<pre><code>Взвешенный граф:
  1—2(4), 1—3(1), 3—2(2), 2—5(5), 3—4(3), 4—5(1)

Дейкстра от вершины 1:
  dist = [0, ∞, ∞, ∞, ∞, ∞]
  PriorityQueue: [(0,1)]
  Обрабатываем 1: dist[2]=4, dist[3]=1
  PQ: [(1,3),(4,2)]
  Обрабатываем 3(dist=1): dist[2]=min(4,1+2)=3, dist[4]=1+3=4
  PQ: [(3,2),(4,2),(4,4)]
  ...
  Итог: dist[5] = 5 (путь: 1→3→4→5)

  Time: O((V+E) log V) с PriorityQueue</code></pre>`,
      tasks: [
        { id:'alg_graph_t1', title:'BFS — кратчайший путь', difficulty:'medium',
          description:'<p>Реализуйте BFS для поиска кратчайшего пути (по числу рёбер) между вершинами 1 и 5 в невзвешенном графе.</p>',
          hints:['Queue + visited','Храните parent[] для восстановления пути'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Граф: список смежности (0-indexed: вершина i → список соседей)
        int n = 6;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i=0; i<n; i++) adj.add(new ArrayList<>());
        // Рёбра: 1-2, 1-3, 2-4, 3-4, 4-5
        int[][] edges = {{1,2},{1,3},{2,4},{3,4},{4,5}};
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }

        int start = 1, end = 5;
        int[] dist   = new int[n];   Arrays.fill(dist, -1);
        int[] parent = new int[n];   Arrays.fill(parent, -1);
        Queue<Integer> q = new LinkedList<>();
        dist[start] = 0; q.offer(start);

        while (!q.isEmpty()) {
            int v = q.poll();
            for (int u : adj.get(v)) {
                if (dist[u] == -1) {
                    dist[u] = dist[v] + 1;
                    parent[u] = v;
                    q.offer(u);
                }
            }
        }
        // Восстановить путь
        List<Integer> path = new ArrayList<>();
        for (int v = end; v != -1; v = parent[v]) path.add(0, v);
        System.out.println("Кратчайший путь " + start + "→" + end + ": " + path);
        System.out.println("Длина: " + dist[end] + " рёбер");
    }
}`},
        { id:'alg_graph_t2', title:'DFS — компоненты связности', difficulty:'medium',
          description:'<p>Найдите все компоненты связности в графе с помощью DFS. Выведите номер компоненты для каждой вершины.</p>',
          hints:['comp[] — номер компоненты для каждой вершины','Запускайте DFS от каждой непосещённой вершины'],
          startCode:`import java.util.*;
public class Main {
    static List<List<Integer>> adj;
    static int[] comp;

    static void dfs(int v, int c) {
        comp[v] = c;
        for (int u : adj.get(v))
            if (comp[u] == -1) dfs(u, c);
    }

    public static void main(String[] args) {
        int n = 7;
        adj = new ArrayList<>();
        for (int i=0; i<n; i++) adj.add(new ArrayList<>());
        // Два отдельных компонента: {1,2,3} и {4,5} и {6}
        for (int[] e : new int[][]{{1,2},{2,3},{4,5}}) {
            adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]);
        }
        comp = new int[n]; Arrays.fill(comp, -1);
        int numComp = 0;
        for (int v = 1; v < n; v++)
            if (comp[v] == -1) dfs(v, numComp++);

        System.out.println("Компоненты связности: " + numComp);
        for (int v = 1; v < n; v++)
            System.out.println("  Вершина " + v + " → компонента " + comp[v]);
    }
}`},
        { id:'alg_graph_t3', title:'Алгоритм Дейкстры', difficulty:'hard',
          description:'<p>Реализуйте алгоритм Дейкстры для нахождения кратчайших путей от вершины 0 до всех остальных.</p>',
          hints:['PriorityQueue<int[]> по расстоянию','if (newDist < dist[u]) → обновить'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        int n = 5;
        // adj: {to, weight}
        List<List<int[]>> adj = new ArrayList<>();
        for (int i=0; i<n; i++) adj.add(new ArrayList<>());
        // Граф: 0-1(4), 0-2(1), 2-1(2), 1-3(5), 2-3(3), 3-4(1)
        int[][] edges = {{0,1,4},{0,2,1},{2,1,2},{1,3,5},{2,3,3},{3,4,1}};
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1],e[2]});
            adj.get(e[1]).add(new int[]{e[0],e[2]});
        }

        int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(x->x[0]));
        pq.offer(new int[]{0, 0}); // {dist, vertex}

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], v = cur[1];
            if (d > dist[v]) continue;
            for (int[] e : adj.get(v)) {
                int newDist = dist[v] + e[1];
                if (newDist < dist[e[0]]) {
                    dist[e[0]] = newDist;
                    pq.offer(new int[]{newDist, e[0]});
                }
            }
        }
        System.out.println("Кратчайшие пути от вершины 0:");
        for (int i=0; i<n; i++)
            System.out.println("  0 → " + i + " : " + dist[i]);
    }
}`}
      ]
    },

    /* ═══════════ Ch9: Жадные алгоритмы ═══════════ */
    {
      id: 'alg_ch9',
      title: 'Жадные алгоритмы',
      lecture: `<h2>Жадные алгоритмы</h2>
<p>На каждом шаге выбираем <strong>локально оптимальное</strong> решение, надеясь получить глобальный оптимум. Работает не всегда, но для определённых задач — оптимально.</p>

<h3>Признаки задачи, подходящей для жадного подхода</h3>
<ul>
<li>Жадный выбор: локальный оптимум ведёт к глобальному</li>
<li>Оптимальная подструктура: оптимальное решение содержит оптимальные подрешения</li>
</ul>

<h3>Задача о монетах (жадный вариант)</h3>
<pre><code>Монеты: {1, 5, 10, 25}. Сдача: 41 центов.
Жадный: 25 → остаток 16 → 10 → 6 → 5 → 1 = 4 монеты
(Работает для "правильных" систем монет, НЕ для любых)</code></pre>

<h3>Задача о расписании (Activity Selection)</h3>
<pre><code>Мероприятия: (start, end)
  A: (1,4), B: (3,5), C: (0,6), D: (5,7), E: (3,8), F: (5,9), G: (6,10)

Жадная стратегия: выбирать мероприятие с наименьшим end-временем
  1. A(1,4): включаем, следующее start >= 4
  2. B(3,5): start=3<4, пропустить
  3. D(5,7): start=5>=4: включаем, следующее start >= 7
  4. G(6,10): start=6<7, пропустить
Ответ: {A, D} = 2 непересекающихся мероприятия ← оптимально!</code></pre>

<h3>Алгоритм Хаффмана (Huffman Coding)</h3>
<pre><code>Частоты символов: a=5, b=9, c=12, d=13, e=16, f=45
Жадная стратегия: объединять два узла с наименьшей частотой
  {a=5,b=9} → ab=14; {ab=14,c=12} → abc=26; ...
  Итоговое дерево даёт оптимальный бинарный код:
  f: 0, c: 100, d: 101, a: 1100, b: 1101, e: 111

Применение: ZIP, JPEG, MP3 (компрессия данных)</code></pre>`,
      tasks: [
        { id:'alg_greedy_t1', title:'Жадная сдача монет', difficulty:'easy',
          description:'<p>Реализуйте жадный алгоритм сдачи монет: для суммы 63 найдите минимальное количество монет из {25, 10, 5, 1}.</p>',
          hints:['Начинайте с самой большой монеты','count += amount/coin; amount %= coin;'],
          startCode:`public class Main {
    public static void main(String[] args) {
        int[] coins  = {25, 10, 5, 1}; // в порядке убывания!
        int   amount = 63;
        System.out.println("Сдача " + amount + " центов:");
        int total = 0;
        for (int coin : coins) {
            int count = amount / coin;
            if (count > 0) System.out.println("  " + coin + " x " + count);
            total  += count;
            amount %= coin;
        }
        System.out.println("Итого монет: " + total);
    }
}`},
        { id:'alg_greedy_t2', title:'Activity Selection Problem', difficulty:'medium',
          description:'<p>Выберите максимальное количество непересекающихся мероприятий. Жадная стратегия: выбирать мероприятие с наименьшим временем окончания.</p>',
          hints:['Отсортируйте по end-времени','selected.add если start >= lastEnd'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        // {name, start, end}
        String[][] activities = {
            {"A","1","4"},{"B","3","5"},{"C","0","6"},
            {"D","5","7"},{"E","3","8"},{"F","5","9"},{"G","6","10"}
        };
        // Сортируем по end-времени (жадный выбор)
        Arrays.sort(activities, Comparator.comparingInt(a -> Integer.parseInt(a[2])));

        List<String> selected = new ArrayList<>();
        int lastEnd = 0;
        for (String[] a : activities) {
            int start = Integer.parseInt(a[1]);
            int end   = Integer.parseInt(a[2]);
            if (start >= lastEnd) {
                selected.add(a[0] + "(" + a[1] + "," + a[2] + ")");
                lastEnd = end;
            }
        }
        System.out.println("Выбранные мероприятия (" + selected.size() + "): " + selected);
    }
}`},
        { id:'alg_greedy_t3', title:'Задача о рюкзаке (дробная)', difficulty:'hard',
          description:'<p>Дробная задача о рюкзаке: максимизируйте стоимость при вместимости 50. Жадный: берём предметы с наибольшим value/weight первыми, при необходимости берём часть.</p>',
          hints:['Сортировка по value/weight DESC','Берём полностью если capacity >= weight, иначе долю'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        // {weight, value}
        int[][] items = {{10,60},{20,100},{30,120}};
        int capacity = 50;

        // Сортируем по удельной стоимости (value/weight) убывая
        Arrays.sort(items, (a,b) ->
            Double.compare((double)b[1]/b[0], (double)a[1]/a[0]));

        double totalValue = 0;
        System.out.println("Рюкзак (вместимость=" + capacity + "):");
        for (int[] item : items) {
            int w=item[0], v=item[1];
            if (capacity >= w) {
                totalValue += v; capacity -= w;
                System.out.printf("  Взяли полностью: w=%d v=%d (v/w=%.1f)%n", w,v,(double)v/w);
            } else if (capacity > 0) {
                double frac = (double)capacity / w;
                totalValue += v * frac;
                System.out.printf("  Взяли %.0f%% (дробно): w=%d v=%.1f%n", frac*100, w, v*frac);
                capacity = 0;
            }
        }
        System.out.printf("Итоговая стоимость: %.1f%n", totalValue);
    }
}`}
      ]
    },

    /* ═══════════ Ch10: Алгоритмы на строках ═══════════ */
    {
      id: 'alg_ch10',
      title: 'Алгоритмы на строках',
      lecture: `<h2>Алгоритмы на строках</h2>

<h3>Поиск подстроки — наивный O(n·m)</h3>
<pre><code>для каждой позиции i в тексте:
  проверить совпадает ли text[i..i+m-1] с pattern</code></pre>

<h3>Алгоритм KMP (Кнута-Морриса-Пратта) — O(n+m)</h3>
<pre><code>Идея: при несовпадении не откатываться к началу!
  Prefix-function: для каждой позиции шаблона хранит длину
  наибольшего собственного суффикса = префиксу.

pattern = "ABABC"
prefix  = [0, 0, 1, 2, 0]

Текст: "ABABABABC", pattern: "ABABC"
  Сравниваем посимвольно, при несовпадении используем prefix[j-1]
  Не возвращаемся назад в тексте → O(n+m)</code></pre>

<h3>Хеширование строк (Rabin-Karp) — O(n+m)</h3>
<pre><code>hash(s) = s[0]*p^0 + s[1]*p^1 + ... + s[m-1]*p^(m-1) mod MOD
Скользящее окно: при сдвиге пересчитываем хеш за O(1)
→ Поиск за O(n+m) в среднем</code></pre>

<h3>Наибольшая общая подпоследовательность (LCS)</h3>
<pre><code>X = "ABCBDAB", Y = "BDCAB"
DP-таблица: dp[i][j] = LCS(X[0..i-1], Y[0..j-1])
  если X[i]==Y[j]: dp[i][j] = dp[i-1][j-1] + 1
  иначе:           dp[i][j] = max(dp[i-1][j], dp[i][j-1])
LCS = "BCAB" (длина 4)</code></pre>

<h3>Расстояние Левенштейна (Edit Distance)</h3>
<pre><code>Минимальное число операций (вставка, удаление, замена)
для превращения одной строки в другую.

"kitten" → "sitting": 3 операции
  kitten → sitten (замена k→s)
  sitten → sittin (замена e→i)
  sittin → sitting (вставка g)</code></pre>`,
      tasks: [
        { id:'alg_str_t1', title:'Наивный поиск подстроки', difficulty:'easy',
          description:'<p>Реализуйте наивный поиск: найдите все вхождения шаблона в тексте. Верните список индексов. O(n·m).</p>',
          hints:['for i in 0..n-m: проверьте text.substring(i, i+m).equals(pattern)'],
          startCode:`import java.util.*;
public class Main {
    static List<Integer> search(String text, String pattern) {
        List<Integer> result = new ArrayList<>();
        int n = text.length(), m = pattern.length();
        for (int i = 0; i <= n - m; i++) {
            if (text.substring(i, i + m).equals(pattern))
                result.add(i);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(search("ababababc", "aba")); // [0, 2, 4]
        System.out.println(search("aaaaaa",   "aa"));  // [0, 1, 2, 3, 4]
        System.out.println(search("hello",    "xyz")); // []
    }
}`},
        { id:'alg_str_t2', title:'Расстояние Левенштейна', difficulty:'medium',
          description:'<p>Реализуйте алгоритм вычисления расстояния редактирования (Edit Distance) между двумя строками с помощью DP.</p>',
          hints:['dp[i][j] — расстояние между s1[0..i] и s2[0..j]','dp[0][j]=j, dp[i][0]=i'],
          startCode:`public class Main {
    static int editDistance(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1))
                    dp[i][j] = dp[i-1][j-1];
                else
                    dp[i][j] = 1 + Math.min(dp[i-1][j-1],
                                   Math.min(dp[i-1][j], dp[i][j-1]));
            }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println(editDistance("kitten",  "sitting")); // 3
        System.out.println(editDistance("sunday",  "saturday")); // 3
        System.out.println(editDistance("",        "abc"));     // 3
        System.out.println(editDistance("abc",     "abc"));     // 0
    }
}`},
        { id:'alg_str_t3', title:'LCS — наибольшая общая подпоследовательность', difficulty:'hard',
          description:'<p>Найдите длину наибольшей общей подпоследовательности (LCS) строк "ABCBDAB" и "BDCAB". Выведите и саму подпоследовательность.</p>',
          hints:['dp[i][j]: если chars equal → dp[i-1][j-1]+1, иначе max(dp[i-1][j], dp[i][j-1])','Обратный ход для восстановления строки'],
          startCode:`public class Main {
    static String lcs(String x, String y) {
        int m = x.length(), n = y.length();
        int[][] dp = new int[m+1][n+1];
        for (int i=1; i<=m; i++)
            for (int j=1; j<=n; j++) {
                if (x.charAt(i-1) == y.charAt(j-1)) dp[i][j] = dp[i-1][j-1]+1;
                else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        // Восстановление LCS
        StringBuilder sb = new StringBuilder();
        int i=m, j=n;
        while (i>0 && j>0) {
            if (x.charAt(i-1) == y.charAt(j-1)) { sb.insert(0, x.charAt(i-1)); i--; j--; }
            else if (dp[i-1][j] > dp[i][j-1]) i--;
            else j--;
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        String x = "ABCBDAB", y = "BDCAB";
        String result = lcs(x, y);
        System.out.println("LCS(\"" + x + "\", \"" + y + "\") = \"" + result + "\"");
        System.out.println("Длина: " + result.length());
    }
}`}
      ]
    },

    /* ═══════════ Ch11: Числовые алгоритмы ═══════════ */
    {
      id: 'alg_ch11',
      title: 'Арифметика и числовые алгоритмы',
      lecture: `<h2>Числовые алгоритмы</h2>

<h3>НОД — алгоритм Евклида</h3>
<pre><code>gcd(a, b) = gcd(b, a mod b)     O(log min(a,b))
gcd(48, 18):
  gcd(18, 48%18=12)
  gcd(12, 18%12=6)
  gcd(6,  12%6=0)  → 6

НОК: lcm(a, b) = a * b / gcd(a, b)</code></pre>

<h3>Решето Эратосфена — все простые до N</h3>
<pre><code>N=30:
  [2,3,4,5,6,7,8,9,10,11,12,...30]
  Зачёркиваем кратные 2:  4,6,8,10,...
  Зачёркиваем кратные 3:  9,15,21,...
  Зачёркиваем кратные 5:  25,...
  Остаток: 2,3,5,7,11,13,17,19,23,29

Time: O(n log log n), Space: O(n)</code></pre>

<h3>Быстрое возведение в степень</h3>
<pre><code>pow(2, 10):
  Наивно: 2×2×2×...×2 = 10 умножений
  Быстро (Binary Exponentiation):
    10 = 1010₂ = 8+2
    2^10 = 2^8 × 2^2 = 256 × 4 = 1024  (4 умножения!)

  pow(a, n):
    if n == 0: return 1
    half = pow(a, n/2)
    if n % 2 == 0: return half * half
    else:          return half * half * a
  Time: O(log n)</code></pre>

<h3>Числа Фибоначчи за O(log n) через матрицы</h3>
<pre><code>|F(n+1)  F(n)  |   |1 1|^n
|F(n)    F(n-1)|  = |1 0|

Быстрое возведение матрицы в степень → F(n) за O(log n)</code></pre>`,
      tasks: [
        { id:'alg_num_t1', title:'НОД и НОК', difficulty:'easy',
          description:'<p>Реализуйте gcd(a,b) через алгоритм Евклида и lcm(a,b) через gcd. Проверьте для нескольких пар чисел.</p>',
          hints:['gcd(a,b): while b!=0 { t=b; b=a%b; a=t; } return a;','lcm = a/gcd*b (сначала делить, чтобы избежать переполнения)'],
          startCode:`public class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long t = b; b = a % b; a = t; }
        return a;
    }
    static long lcm(long a, long b) { return a / gcd(a, b) * b; }

    public static void main(String[] args) {
        System.out.println("gcd(48, 18) = " + gcd(48, 18));  // 6
        System.out.println("gcd(100, 75) = " + gcd(100, 75)); // 25
        System.out.println("lcm(4, 6) = "  + lcm(4, 6));     // 12
        System.out.println("lcm(12, 18) = " + lcm(12, 18));  // 36
    }
}`},
        { id:'alg_num_t2', title:'Решето Эратосфена', difficulty:'medium',
          description:'<p>Реализуйте решето Эратосфена. Выведите все простые числа до 50 и их количество.</p>',
          hints:['boolean[] sieve = new boolean[n+1]; Arrays.fill(sieve, true);','for i=2 to sqrt(n): if sieve[i]: mark i*i, i*(i+1),...'],
          startCode:`import java.util.*;
public class Main {
    static List<Integer> sieve(int n) {
        boolean[] isPrime = new boolean[n+1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; (long)i*i <= n; i++)
            if (isPrime[i])
                for (int j = i*i; j <= n; j += i)
                    isPrime[j] = false;
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++)
            if (isPrime[i]) primes.add(i);
        return primes;
    }

    public static void main(String[] args) {
        List<Integer> p = sieve(50);
        System.out.println("Простые до 50: " + p);
        System.out.println("Количество: " + p.size()); // 15
    }
}`},
        { id:'alg_num_t3', title:'Быстрое возведение в степень', difficulty:'medium',
          description:'<p>Реализуйте быстрое возведение в степень (Binary Exponentiation) за O(log n). Считайте количество умножений по сравнению с наивным.</p>',
          hints:['if (n%2==1) result *= base;','base *= base; n /= 2;'],
          startCode:`public class Main {
    static long fastPow(long base, long exp) {
        long result = 1;
        int ops = 0;
        while (exp > 0) {
            if (exp % 2 == 1) { result *= base; ops++; }
            base *= base; exp /= 2; ops++;
        }
        System.out.println("  fastPow умножений: " + ops);
        return result;
    }

    public static void main(String[] args) {
        System.out.println("2^10 = " + fastPow(2, 10));   // 1024
        System.out.println("3^20 = " + fastPow(3, 20));   // 3486784401
        System.out.println("Наивный 2^10 умножений: 10 vs быстрый: ~4");
    }
}`}
      ]
    },

    /* ═══════════ Ch12: Комбинаторика ═══════════ */
    {
      id: 'alg_ch12',
      title: 'Комбинаторные алгоритмы',
      lecture: `<h2>Комбинаторные алгоритмы</h2>

<h3>Перестановки — O(n!)</h3>
<pre><code>Перестановки {1,2,3}: 3! = 6
  [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]

Backtracking: для каждой позиции пробуем все unused элементы
  permute([1,2,3], []):
    fix 1 → permute([2,3], [1]) → fix 2 → ... [1,2,3], [1,3,2]
    fix 2 → permute([1,3], [2]) → ...
    fix 3 → permute([1,2], [3]) → ...</code></pre>

<h3>Подмножества (Power Set) — O(2ⁿ)</h3>
<pre><code>Подмножества {1,2,3}: 2³ = 8
  Bitmask i от 0 до 2^n-1: бит j = включить j-й элемент
  i=0 (000): {}
  i=1 (001): {1}
  i=2 (010): {2}
  i=3 (011): {1,2}
  i=4 (100): {3}
  i=5 (101): {1,3}
  i=6 (110): {2,3}
  i=7 (111): {1,2,3}</code></pre>

<h3>Биномиальные коэффициенты C(n,k)</h3>
<pre><code>C(n,k) = n! / (k! × (n-k)!)

Треугольник Паскаля:
     1
    1 1
   1 2 1
  1 3 3 1
 1 4 6 4 1
C(4,2) = 6  ← третий элемент 5-й строки

DP: C(n,k) = C(n-1,k-1) + C(n-1,k)
Время: O(n²), Память: O(n²)</code></pre>

<h3>N ферзей (backtracking)</h3>
<pre><code>На доске N×N расставить N ферзей так, чтобы ни один не бил другого.
Backtracking: пробуем каждую строку в столбце i,
  если не атакует уже расставленных → ставим и переходим к i+1
  если все i от 0 до N-1 расставлены → решение!</code></pre>`,
      tasks: [
        { id:'alg_comb_t1', title:'Генерация перестановок', difficulty:'medium',
          description:'<p>Сгенерируйте все перестановки массива {1,2,3} с помощью backtracking. Выведите каждую.</p>',
          hints:['swap(arr, i, j) + рекурсия + swap обратно','permute(arr, start): если start==n → print'],
          startCode:`import java.util.*;
public class Main {
    static void permute(int[] arr, int start, List<String> result) {
        if (start == arr.length) {
            result.add(Arrays.toString(arr));
            return;
        }
        for (int i = start; i < arr.length; i++) {
            // swap arr[start] и arr[i]
            int tmp = arr[start]; arr[start] = arr[i]; arr[i] = tmp;
            permute(arr, start + 1, result);
            // swap обратно
            tmp = arr[start]; arr[start] = arr[i]; arr[i] = tmp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        List<String> perms = new ArrayList<>();
        permute(arr, 0, perms);
        System.out.println("Перестановок: " + perms.size()); // 6
        perms.forEach(System.out::println);
    }
}`},
        { id:'alg_comb_t2', title:'Подмножества через битмаску', difficulty:'medium',
          description:'<p>Сгенерируйте все подмножества {A, B, C} используя битовые маски. 2³ = 8 подмножеств.</p>',
          hints:['for mask=0 to (1<<n)-1', 'if (mask & (1<<j)) != 0 → элемент j в подмножестве'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        char[] set = {'A', 'B', 'C'};
        int n = set.length;
        System.out.println("Все подмножества (2^" + n + " = " + (1<<n) + "):");
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Character> subset = new ArrayList<>();
            for (int j = 0; j < n; j++)
                if ((mask & (1 << j)) != 0)
                    subset.add(set[j]);
            System.out.printf("  mask=%s: %s%n",
                String.format("%3s", Integer.toBinaryString(mask)).replace(' ','0'),
                subset.isEmpty() ? "{}" : subset.toString());
        }
    }
}`},
        { id:'alg_comb_t3', title:'N ферзей', difficulty:'hard',
          description:'<p>Решите задачу 8 ферзей (N=8). Используйте backtracking. Выведите первое решение и общее количество решений.</p>',
          hints:['queens[col] = row — ферзь в столбце col стоит на строке row','Проверка: queens[i]==queens[j] или Math.abs разница'],
          startCode:`public class Main {
    static int N = 8, solutions = 0;
    static int[] queens = new int[8];

    static boolean isSafe(int col, int row) {
        for (int c = 0; c < col; c++) {
            if (queens[c] == row || Math.abs(queens[c] - row) == col - c)
                return false;
        }
        return true;
    }

    static void solve(int col) {
        if (col == N) { solutions++; if (solutions == 1) print(); return; }
        for (int row = 0; row < N; row++) {
            if (isSafe(col, row)) {
                queens[col] = row;
                solve(col + 1);
            }
        }
    }

    static void print() {
        System.out.println("Первое решение (8 ферзей):");
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++)
                System.out.print(queens[c] == r ? "Q " : ". ");
            System.out.println();
        }
    }

    public static void main(String[] args) {
        solve(0);
        System.out.println("Всего решений для N=" + N + ": " + solutions);
    }
}`}
      ]
    },

    /* ═══════════ Ch13: ДП продвинутое ═══════════ */
    {
      id: 'alg_ch13',
      title: 'Динамическое программирование — продвинутые задачи',
      lecture: `<h2>Динамическое программирование: паттерны</h2>

<h3>Задача о рюкзаке 0/1</h3>
<pre><code>N предметов, каждый с весом w[i] и стоимостью v[i].
Рюкзак вместимостью W. Максимизировать стоимость.

dp[i][j] = максимальная стоимость из первых i предметов при вместимости j
  dp[i][j] = dp[i-1][j]                              (не берём предмет i)
  dp[i][j] = max(dp[i][j], dp[i-1][j-w[i]] + v[i])  (берём, если j>=w[i])</code></pre>

<h3>Задача о подъёме по лестнице</h3>
<pre><code>N ступеней, за раз можно шагнуть на 1 или 2.
Способов добраться до ступени N:
  dp[0]=1, dp[1]=1, dp[i] = dp[i-1] + dp[i-2]
  = Числа Фибоначчи!</code></pre>

<h3>Матричное умножение (Оптимальная скобочная расстановка)</h3>
<pre><code>A(2×3) × B(3×4) × C(4×5):
  (A×B)×C = 2·3·4 + 2·4·5 = 24 + 40 = 64 умножений
  A×(B×C) = 3·4·5 + 2·3·5 = 60 + 30 = 90 умножений
DP находит оптимальную расстановку скобок.</code></pre>

<h3>Наибольшая возрастающая подпоследовательность (LIS)</h3>
<pre><code>arr = [10, 9, 2, 5, 3, 7, 101, 18]
LIS  = [2,  3, 7, 101]  (длина 4)

dp[i] = длина LIS, заканчивающейся на arr[i]
  dp[0]=1
  для i: dp[i] = max(dp[j]+1) для всех j<i где arr[j]<arr[i]
Time: O(n²), O(n log n) с бинарным поиском</code></pre>`,
      tasks: [
        { id:'alg_dp_t1', title:'Рюкзак 0/1', difficulty:'hard',
          description:'<p>Реализуйте задачу о рюкзаке 0/1 с помощью DP. Найдите максимальную стоимость при вместимости W=10.</p>',
          hints:['dp[j] = max(dp[j], dp[j-w]+v) для j от W до w'],
          startCode:`import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] weight = {2, 3, 4, 5};
        int[] value  = {3, 4, 5, 6};
        int   W      = 10;

        int[] dp = new int[W + 1]; // dp[j] = макс стоимость при вместимости j
        for (int i = 0; i < weight.length; i++) {
            // Идём с конца чтобы предмет не взять дважды (0/1)
            for (int j = W; j >= weight[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
            }
        }
        System.out.println("Максимальная стоимость: " + dp[W]);
        System.out.println("dp = " + Arrays.toString(dp));
    }
}`},
        { id:'alg_dp_t2', title:'Наибольшая возрастающая подпоследовательность', difficulty:'hard',
          description:'<p>Найдите длину и саму наибольшую возрастающую подпоследовательность (LIS) в массиве {10, 9, 2, 5, 3, 7, 101, 18}.</p>',
          hints:['dp[i] = 1 изначально','for i: for j<i: if arr[j]<arr[i] && dp[j]+1 > dp[i] → обновить'],
          startCode:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 9, 2, 5, 3, 7, 101, 18};
        int n = arr.length;
        int[] dp   = new int[n]; Arrays.fill(dp, 1);
        int[] prev = new int[n]; Arrays.fill(prev, -1);

        int maxLen = 1, maxIdx = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                    dp[i]   = dp[j] + 1;
                    prev[i] = j;
                }
            }
            if (dp[i] > maxLen) { maxLen = dp[i]; maxIdx = i; }
        }
        // Восстановить LIS
        List<Integer> lis = new ArrayList<>();
        for (int i = maxIdx; i != -1; i = prev[i]) lis.add(0, arr[i]);
        System.out.println("LIS длина: " + maxLen);
        System.out.println("LIS: " + lis);
    }
}`}
      ]
    }
  ]
});
