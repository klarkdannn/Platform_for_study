'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'collections',
  title: 'Коллекции',
  icon: '📦',
  description: 'List, Set, Map, Queue, Iterator',
  color: '#10b981',
  chapters: [
    {
      id: 'col_ch1',
      title: 'List и Set',
      lecture: `<h2>List и Set в Java</h2>
<p>Java Collections Framework предоставляет набор интерфейсов и классов для хранения и обработки групп объектов. Два фундаментальных интерфейса — <strong>List</strong> и <strong>Set</strong>.</p>

<h3>ArrayList</h3>
<p><code>ArrayList</code> — динамический массив, основная реализация <code>List</code>. Обеспечивает быстрый доступ по индексу O(1), но медленную вставку/удаление в середину O(n).</p>
<pre><code>import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List&lt;String&gt; list = new ArrayList&lt;&gt;();
        list.add("Яблоко");
        list.add("Банан");
        list.add("Вишня");
        list.add(1, "Абрикос"); // вставка по индексу

        System.out.println(list.get(0)); // Яблоко
        System.out.println(list.size()); // 4
        list.remove("Банан");
        System.out.println(list); // [Яблоко, Абрикос, Вишня]
    }
}</code></pre>

<h3>LinkedList</h3>
<p><code>LinkedList</code> — двусвязный список. Быстрая вставка/удаление O(1), медленный доступ по индексу O(n). Реализует и <code>List</code>, и <code>Deque</code>.</p>
<pre><code>import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList&lt;Integer&gt; ll = new LinkedList&lt;&gt;();
        ll.addFirst(1);
        ll.addLast(3);
        ll.add(1, 2);
        System.out.println(ll); // [1, 2, 3]
        System.out.println(ll.getFirst()); // 1
        System.out.println(ll.getLast());  // 3
        ll.removeFirst();
        System.out.println(ll); // [2, 3]
    }
}</code></pre>

<h3>HashSet</h3>
<p><code>HashSet</code> хранит уникальные элементы без гарантии порядка. Работает на основе хэш-таблицы, операции за O(1).</p>
<pre><code>import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        Set&lt;String&gt; set = new HashSet&lt;&gt;();
        set.add("Java");
        set.add("Python");
        set.add("Java"); // дубликат — не добавится
        System.out.println(set.size()); // 2
        System.out.println(set.contains("Java")); // true
    }
}</code></pre>

<h3>TreeSet</h3>
<p><code>TreeSet</code> хранит элементы в отсортированном порядке (Red-Black Tree). Операции за O(log n).</p>
<pre><code>import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        TreeSet&lt;Integer&gt; ts = new TreeSet&lt;&gt;();
        ts.add(5);
        ts.add(1);
        ts.add(3);
        System.out.println(ts);        // [1, 3, 5]
        System.out.println(ts.first()); // 1
        System.out.println(ts.last());  // 5
        System.out.println(ts.headSet(3)); // [1]
        System.out.println(ts.tailSet(3)); // [3, 5]
    }
}</code></pre>

<h3>LinkedHashSet</h3>
<p><code>LinkedHashSet</code> сохраняет порядок добавления элементов, при этом гарантируя уникальность.</p>
<pre><code>import java.util.LinkedHashSet;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        LinkedHashSet&lt;String&gt; lhs = new LinkedHashSet&lt;&gt;();
        lhs.add("C");
        lhs.add("A");
        lhs.add("B");
        lhs.add("A"); // дубликат
        System.out.println(lhs); // [C, A, B] — порядок вставки сохранён
    }
}</code></pre>`,
      tasks: [
        {
          id: 'col_ch1_t1',
          difficulty: 'easy',
          title: 'Создание ArrayList',
          description: '<p>Создайте <code>ArrayList</code> из строк: "Москва", "Санкт-Петербург", "Казань". Выведите второй элемент.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте ArrayList и добавьте три города
        // Выведите второй элемент (индекс 1)
    }
}`,
          hints: ['Используйте new ArrayList<>()', 'Метод get(1) вернёт второй элемент']
        },
        {
          id: 'col_ch1_t2',
          difficulty: 'easy',
          title: 'Размер списка',
          description: '<p>Создайте <code>ArrayList</code> с числами 10, 20, 30, 40, 50. Выведите размер списка с помощью метода <code>size()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список и добавьте 5 чисел
        // Выведите его размер
    }
}`,
          hints: ['Используйте List<Integer>', 'Метод size() возвращает количество элементов']
        },
        {
          id: 'col_ch1_t3',
          difficulty: 'easy',
          title: 'Удаление элемента',
          description: '<p>Создайте список ["красный", "зелёный", "синий"]. Удалите элемент "зелёный" и выведите результирующий список.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список цветов
        // Удалите "зелёный"
        // Выведите список
    }
}`,
          hints: ['Метод remove(Object) удаляет по значению', 'System.out.println(list) покажет все элементы']
        },
        {
          id: 'col_ch1_t4',
          difficulty: 'easy',
          title: 'Проверка наличия элемента',
          description: '<p>Создайте <code>HashSet</code> с именами студентов. Проверьте, содержит ли набор имя "Иван". Выведите <code>true</code> или <code>false</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте HashSet с именами: "Алексей", "Иван", "Мария"
        // Проверьте наличие "Иван"
    }
}`,
          hints: ['Метод contains() проверяет наличие элемента', 'HashSet<String> для строк']
        },
        {
          id: 'col_ch1_t5',
          difficulty: 'easy',
          title: 'Уникальность в HashSet',
          description: '<p>Создайте <code>HashSet</code> и добавьте числа: 1, 2, 3, 2, 1. Выведите размер набора, чтобы убедиться в уникальности.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Добавьте числа с дубликатами
        // Выведите размер
    }
}`,
          hints: ['Set хранит только уникальные значения', 'size() должен вернуть 3']
        },
        {
          id: 'col_ch1_t6',
          difficulty: 'easy',
          title: 'Обход ArrayList',
          description: '<p>Создайте <code>ArrayList</code> из 5 фруктов и выведите каждый элемент с помощью цикла <code>for-each</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список фруктов
        // Обойдите с помощью for-each
    }
}`,
          hints: ['for (String fruit : list) { ... }', 'Добавьте любые 5 фруктов']
        },
        {
          id: 'col_ch1_t7',
          difficulty: 'easy',
          title: 'Вставка по индексу',
          description: '<p>Создайте список ["A", "B", "D"]. Вставьте "C" на третью позицию (индекс 2). Выведите результат.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список
        // Вставьте "C" по индексу 2
        // Выведите список
    }
}`,
          hints: ['list.add(2, "C") вставляет элемент по индексу', 'Результат должен быть [A, B, C, D]']
        },
        {
          id: 'col_ch1_t8',
          difficulty: 'easy',
          title: 'LinkedList как стек',
          description: '<p>Используйте <code>LinkedList</code> как стек: добавьте элементы "первый", "второй", "третий" через <code>push()</code>. Снимите верхний элемент через <code>pop()</code> и выведите его.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Используйте LinkedList как стек
        // push три элемента, pop один и выведите
    }
}`,
          hints: ['LinkedList реализует Deque', 'push() добавляет в начало, pop() удаляет из начала']
        },
        {
          id: 'col_ch1_t9',
          difficulty: 'easy',
          title: 'TreeSet — сортировка',
          description: '<p>Создайте <code>TreeSet</code> и добавьте числа в случайном порядке: 5, 2, 8, 1, 9. Выведите набор — он должен быть отсортирован.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте TreeSet и добавьте числа
        // Выведите набор
    }
}`,
          hints: ['TreeSet автоматически сортирует элементы', 'Результат: [1, 2, 5, 8, 9]']
        },
        {
          id: 'col_ch1_t10',
          difficulty: 'easy',
          title: 'LinkedHashSet — порядок вставки',
          description: '<p>Создайте <code>LinkedHashSet</code> и добавьте строки: "банан", "яблоко", "манго". Выведите набор — порядок должен совпасть с порядком вставки.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте LinkedHashSet
        // Добавьте три фрукта
        // Выведите
    }
}`,
          hints: ['LinkedHashSet сохраняет порядок добавления', 'Результат: [банан, яблоко, манго]']
        },
        {
          id: 'col_ch1_t11',
          difficulty: 'easy',
          title: 'Очистка списка',
          description: '<p>Создайте <code>ArrayList</code> с элементами, затем очистите его методом <code>clear()</code>. Выведите размер до и после очистки.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список с элементами
        // Выведите size()
        // Очистите clear()
        // Снова выведите size()
    }
}`,
          hints: ['clear() удаляет все элементы', 'После clear() size() должен вернуть 0']
        },
        {
          id: 'col_ch1_t12',
          difficulty: 'easy',
          title: 'Замена элемента',
          description: '<p>Создайте <code>ArrayList</code> ["кот", "пёс", "птица"]. Замените второй элемент на "хомяк" с помощью <code>set()</code>. Выведите список.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список животных
        // Замените элемент по индексу 1
        // Выведите результат
    }
}`,
          hints: ['list.set(1, "хомяк") заменяет элемент', 'Результат: [кот, хомяк, птица]']
        },
        {
          id: 'col_ch1_t13',
          difficulty: 'easy',
          title: 'Поиск индекса',
          description: '<p>Создайте список ["a", "b", "c", "b", "a"]. Найдите первое и последнее вхождение "b" с помощью <code>indexOf()</code> и <code>lastIndexOf()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список
        // Найдите indexOf("b") и lastIndexOf("b")
        // Выведите оба значения
    }
}`,
          hints: ['indexOf() — первое вхождение', 'lastIndexOf() — последнее вхождение']
        },
        {
          id: 'col_ch1_t14',
          difficulty: 'easy',
          title: 'Подсписок',
          description: '<p>Создайте <code>ArrayList</code> с числами от 1 до 10. Получите подсписок с индексов 2 по 5 (не включая 5) с помощью <code>subList()</code> и выведите его.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте список [1..10]
        // Получите subList(2, 5)
        // Выведите результат
    }
}`,
          hints: ['subList(fromIndex, toIndex) — fromIndex включительно, toIndex — нет', 'Результат: [3, 4, 5]']
        },
        {
          id: 'col_ch1_t15',
          difficulty: 'easy',
          title: 'Проверка пустоты',
          description: '<p>Создайте пустой <code>HashSet</code>. Выведите результат <code>isEmpty()</code>. Добавьте один элемент и снова выведите <code>isEmpty()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте пустой HashSet
        // isEmpty() до добавления
        // Добавьте элемент
        // isEmpty() после добавления
    }
}`,
          hints: ['isEmpty() возвращает true если набор пуст', 'После add() isEmpty() должен вернуть false']
        },
        {
          id: 'col_ch1_t16',
          difficulty: 'medium',
          title: 'Пересечение множеств',
          description: '<p>Создайте два <code>HashSet</code> с числами. Найдите их пересечение (общие элементы) с помощью метода <code>retainAll()</code>. Выведите результат.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Set A: {1, 2, 3, 4, 5}
        // Set B: {3, 4, 5, 6, 7}
        // Найдите пересечение
    }
}`,
          hints: ['retainAll() оставляет только общие элементы', 'Создайте копию одного множества перед retainAll']
        },
        {
          id: 'col_ch1_t17',
          difficulty: 'medium',
          title: 'Объединение множеств',
          description: '<p>Создайте два <code>HashSet</code>. Найдите их объединение с помощью <code>addAll()</code>. Выведите результат.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Set A: {"Java", "Python", "C++"}
        // Set B: {"Python", "Go", "Rust"}
        // Найдите объединение
    }
}`,
          hints: ['addAll() добавляет все элементы из другого набора', 'Дубликаты автоматически отфильтруются']
        },
        {
          id: 'col_ch1_t18',
          difficulty: 'medium',
          title: 'Разность множеств',
          description: '<p>Создайте два множества и найдите разность A \\ B (элементы, которые есть в A, но нет в B) с помощью <code>removeAll()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Set A: {1, 2, 3, 4, 5}
        // Set B: {3, 4, 5}
        // Найдите A \ B
    }
}`,
          hints: ['removeAll() удаляет все элементы, присутствующие в другом наборе', 'Результат: {1, 2}']
        },
        {
          id: 'col_ch1_t19',
          difficulty: 'medium',
          title: 'Сортировка ArrayList',
          description: '<p>Создайте <code>ArrayList</code> из строк в произвольном порядке. Отсортируйте его с помощью <code>Collections.sort()</code> и выведите.</p>',
          startCode: `import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        // Создайте список ["Банан", "Яблоко", "Абрикос", "Манго"]
        // Отсортируйте
        // Выведите
    }
}`,
          hints: ['Collections.sort(list) сортирует по естественному порядку', 'Для строк — это лексикографический порядок']
        },
        {
          id: 'col_ch1_t20',
          difficulty: 'medium',
          title: 'Удаление дубликатов из списка',
          description: '<p>Дан <code>ArrayList</code> с дубликатами. Удалите дубликаты, сохранив порядок элементов, используя <code>LinkedHashSet</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.List&lt;Integer&gt; list = new java.util.ArrayList&lt;&gt;(
            java.util.Arrays.asList(1, 2, 3, 2, 4, 1, 5)
        );
        // Удалите дубликаты сохраняя порядок
        // Выведите результат
    }
}`,
          hints: ['LinkedHashSet сохраняет порядок и убирает дубли', 'Создайте новый ArrayList из LinkedHashSet']
        },
        {
          id: 'col_ch1_t21',
          difficulty: 'medium',
          title: 'Частота элементов',
          description: '<p>Дан список слов. Подсчитайте, сколько раз встречается слово "java", используя <code>Collections.frequency()</code>.</p>',
          startCode: `import java.util.Arrays;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        java.util.List&lt;String&gt; words = Arrays.asList(
            "java", "python", "java", "c++", "java", "go"
        );
        // Подсчитайте частоту слова "java"
    }
}`,
          hints: ['Collections.frequency(list, element) возвращает количество вхождений', 'Результат должен быть 3']
        },
        {
          id: 'col_ch1_t22',
          difficulty: 'medium',
          title: 'Диапазон в TreeSet',
          description: '<p>Создайте <code>TreeSet</code> с числами от 1 до 20. Получите и выведите все элементы в диапазоне от 5 до 15 с помощью <code>subSet()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте TreeSet с числами 1..20
        // Используйте subSet(5, true, 15, true)
        // Выведите результат
    }
}`,
          hints: ['subSet(from, fromInclusive, to, toInclusive)', 'TreeSet.subSet возвращает NavigableSet']
        },
        {
          id: 'col_ch1_t23',
          difficulty: 'medium',
          title: 'Максимум и минимум',
          description: '<p>Создайте <code>ArrayList</code> с числами. Найдите максимальный и минимальный элемент с помощью <code>Collections.max()</code> и <code>Collections.min()</code>.</p>',
          startCode: `import java.util.Arrays;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        java.util.List&lt;Integer&gt; nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);
        // Найдите max и min
        // Выведите оба значения
    }
}`,
          hints: ['Collections.max(list) и Collections.min(list)', 'max = 9, min = 1']
        },
        {
          id: 'col_ch1_t24',
          difficulty: 'medium',
          title: 'Перемешивание списка',
          description: '<p>Создайте список из 10 чисел. Перемешайте его с помощью <code>Collections.shuffle()</code>. Выведите список до и после перемешивания.</p>',
          startCode: `import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        // Создайте список [1..10]
        // Выведите до shuffle
        // Перемешайте
        // Выведите после shuffle
    }
}`,
          hints: ['Collections.shuffle(list) перемешивает случайно', 'Используйте Arrays.asList или добавляйте вручную']
        },
        {
          id: 'col_ch1_t25',
          difficulty: 'medium',
          title: 'Копирование списка',
          description: '<p>Создайте <code>ArrayList</code> источник. Создайте копию с помощью конструктора копирования <code>new ArrayList&lt;&gt;(source)</code>. Измените копию и убедитесь, что оригинал не изменился.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте source список
        // Создайте копию через конструктор
        // Добавьте элемент в копию
        // Выведите оба списка
    }
}`,
          hints: ['new ArrayList<>(original) создаёт поверхностную копию', 'Изменение копии не затронет оригинал']
        },
        {
          id: 'col_ch1_t26',
          difficulty: 'hard',
          title: 'Реализация стека на ArrayList',
          description: '<p>Реализуйте класс <code>Stack&lt;T&gt;</code> на основе <code>ArrayList</code> с методами: <code>push(T)</code>, <code>pop()</code>, <code>peek()</code>, <code>isEmpty()</code>. Продемонстрируйте работу.</p>',
          startCode: `import java.util.ArrayList;

public class Main {
    static class Stack&lt;T&gt; {
        private ArrayList&lt;T&gt; data = new ArrayList&lt;&gt;();

        // Реализуйте методы push, pop, peek, isEmpty
    }

    public static void main(String[] args) {
        Stack&lt;Integer&gt; stack = new Stack&lt;&gt;();
        // Проверьте стек: push 1,2,3 потом pop и peek
    }
}`,
          hints: ['push() добавляет в конец списка', 'pop() удаляет и возвращает последний элемент', 'peek() возвращает последний без удаления']
        },
        {
          id: 'col_ch1_t27',
          difficulty: 'hard',
          title: 'Анаграммы через Set',
          description: '<p>Напишите метод <code>isAnagram(String s1, String s2)</code>, который проверяет, являются ли две строки анаграммами. Используйте сортировку символов или частотный анализ.</p>',
          startCode: `import java.util.Arrays;

public class Main {
    public static boolean isAnagram(String s1, String s2) {
        // Реализуйте проверку анаграммы
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
        System.out.println(isAnagram("hello", "world"));   // false
        System.out.println(isAnagram("race", "care"));     // true
    }
}`,
          hints: ['Отсортируйте массивы символов и сравните', 'char[] chars = s.toCharArray(); Arrays.sort(chars)']
        },
        {
          id: 'col_ch1_t28',
          difficulty: 'hard',
          title: 'LRU Cache с LinkedHashSet',
          description: '<p>Реализуйте упрощённый LRU-кэш фиксированного размера с помощью <code>LinkedHashSet</code>. При превышении ёмкости удаляйте самый давно использованный элемент.</p>',
          startCode: `import java.util.LinkedHashSet;
import java.util.Iterator;

public class Main {
    static class LRUCache {
        private final int capacity;
        private final LinkedHashSet&lt;Integer&gt; cache;

        public LRUCache(int capacity) {
            this.capacity = capacity;
            this.cache = new LinkedHashSet&lt;&gt;();
        }

        public void access(int key) {
            // Реализуйте логику LRU
        }

        public void print() {
            System.out.println(cache);
        }
    }

    public static void main(String[] args) {
        LRUCache lru = new LRUCache(3);
        lru.access(1); lru.access(2); lru.access(3);
        lru.print(); // [1, 2, 3]
        lru.access(4);
        lru.print(); // [2, 3, 4] — 1 вытеснен
        lru.access(2);
        lru.print(); // [3, 4, 2] — 2 перемещён в конец
    }
}`,
          hints: ['При доступе к существующему — удалите и добавьте снова (перемещение в конец)', 'При превышении capacity — удалите первый элемент через Iterator']
        },
        {
          id: 'col_ch1_t29',
          difficulty: 'hard',
          title: 'Группировка слов по длине',
          description: '<p>Дан список слов. Сгруппируйте их по длине в <code>TreeMap&lt;Integer, List&lt;String&gt;&gt;</code> (ключ — длина, значение — список слов). Выведите результат в порядке возрастания длины.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;String&gt; words = Arrays.asList(
            "кот", "дом", "слон", "кит", "муха", "жираф", "лев"
        );
        // Сгруппируйте по длине
        // Выведите TreeMap
    }
}`,
          hints: ['TreeMap автоматически сортирует по ключу', 'map.computeIfAbsent(key, k -> new ArrayList<>()).add(word)']
        },
        {
          id: 'col_ch1_t30',
          difficulty: 'hard',
          title: 'Топ-K элементов',
          description: '<p>Дан список оценок студентов. Найдите топ-3 наибольших уникальных оценки, используя <code>TreeSet</code> в обратном порядке. Выведите результат.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;Integer&gt; scores = Arrays.asList(85, 92, 78, 92, 95, 88, 78, 95, 70);
        // Найдите топ-3 уникальных оценки
        // Используйте TreeSet с обратным порядком
    }
}`,
          hints: ['new TreeSet<>(Collections.reverseOrder()) — обратная сортировка', 'Добавьте все оценки, затем возьмите первые 3']
        }
      ]
    },
    {
      id: 'col_ch2',
      title: 'Map и Queue',
      lecture: `<h2>Map и Queue в Java</h2>
<p>Интерфейс <strong>Map</strong> хранит пары ключ-значение. Интерфейс <strong>Queue</strong> реализует очередь — структуру FIFO (первым пришёл — первым вышел).</p>

<h3>HashMap</h3>
<p><code>HashMap</code> — наиболее популярная реализация <code>Map</code>. Работает на основе хэш-таблицы, порядок элементов не гарантирован. Операции O(1) в среднем.</p>
<pre><code>import java.util.HashMap;
import java.util.Map;

public class HashMapDemo {
    public static void main(String[] args) {
        Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
        map.put("Alice", 90);
        map.put("Bob", 85);
        map.put("Charlie", 92);

        System.out.println(map.get("Bob"));        // 85
        System.out.println(map.containsKey("Alice")); // true
        map.put("Alice", 95); // обновление значения
        System.out.println(map.get("Alice")); // 95

        for (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}</code></pre>

<h3>TreeMap</h3>
<p><code>TreeMap</code> хранит записи в отсортированном по ключу порядке (Red-Black Tree). Операции O(log n).</p>
<pre><code>import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        TreeMap&lt;String, Integer&gt; tm = new TreeMap&lt;&gt;();
        tm.put("Banana", 2);
        tm.put("Apple", 5);
        tm.put("Cherry", 1);

        System.out.println(tm);             // {Apple=5, Banana=2, Cherry=1}
        System.out.println(tm.firstKey());  // Apple
        System.out.println(tm.lastKey());   // Cherry
        System.out.println(tm.headMap("Cherry")); // {Apple=5, Banana=2}
    }
}</code></pre>

<h3>PriorityQueue</h3>
<p><code>PriorityQueue</code> — очередь с приоритетом. По умолчанию элементы извлекаются в порядке возрастания (min-heap).</p>
<pre><code>import java.util.PriorityQueue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;();
        pq.offer(5);
        pq.offer(1);
        pq.offer(3);

        System.out.println(pq.peek()); // 1 — минимальный элемент
        System.out.println(pq.poll()); // 1 — извлечение
        System.out.println(pq.poll()); // 3
        System.out.println(pq.poll()); // 5
    }
}</code></pre>

<h3>ArrayDeque</h3>
<p><code>ArrayDeque</code> — двусторонняя очередь (deque). Может использоваться и как стек, и как очередь. Быстрее <code>LinkedList</code> в большинстве случаев.</p>
<pre><code>import java.util.ArrayDeque;
import java.util.Deque;

public class ArrayDequeDemo {
    public static void main(String[] args) {
        Deque&lt;String&gt; deque = new ArrayDeque&lt;&gt;();
        deque.addFirst("Середина");
        deque.addFirst("Первый");
        deque.addLast("Последний");

        System.out.println(deque); // [Первый, Середина, Последний]
        System.out.println(deque.peekFirst()); // Первый
        System.out.println(deque.peekLast());  // Последний
        deque.pollFirst();
        System.out.println(deque); // [Середина, Последний]
    }
}</code></pre>

<h3>EnumMap</h3>
<p><code>EnumMap</code> — высокопроизводительная <code>Map</code> для перечислений. Ключи — значения enum, хранятся в порядке их объявления.</p>
<pre><code>import java.util.EnumMap;

public class EnumMapDemo {
    enum Day { MON, TUE, WED, THU, FRI }

    public static void main(String[] args) {
        EnumMap&lt;Day, String&gt; schedule = new EnumMap&lt;&gt;(Day.class);
        schedule.put(Day.MON, "Совещание");
        schedule.put(Day.WED, "Код-ревью");
        schedule.put(Day.FRI, "Демо");
        System.out.println(schedule);
        // {MON=Совещание, WED=Код-ревью, FRI=Демо}
    }
}</code></pre>`,
      tasks: [
        {
          id: 'col_ch2_t1',
          difficulty: 'easy',
          title: 'Базовые операции HashMap',
          description: '<p>Создайте <code>HashMap&lt;String, Integer&gt;</code> для хранения возрастов: "Алексей" → 25, "Мария" → 30, "Игорь" → 22. Выведите возраст Марии.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте HashMap с тремя записями
        // Выведите значение для ключа "Мария"
    }
}`,
          hints: ['map.put(key, value) добавляет запись', 'map.get(key) возвращает значение']
        },
        {
          id: 'col_ch2_t2',
          difficulty: 'easy',
          title: 'Проверка ключа',
          description: '<p>Создайте <code>HashMap</code> и проверьте наличие ключа с помощью <code>containsKey()</code>. Также проверьте наличие значения с помощью <code>containsValue()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, Integer&gt; map = new java.util.HashMap&lt;&gt;();
        map.put("one", 1);
        map.put("two", 2);
        map.put("three", 3);
        // Проверьте containsKey("two")
        // Проверьте containsValue(5)
    }
}`,
          hints: ['containsKey() проверяет наличие ключа', 'containsValue() проверяет наличие значения']
        },
        {
          id: 'col_ch2_t3',
          difficulty: 'easy',
          title: 'Обход Map',
          description: '<p>Создайте <code>HashMap</code> и обойдите все записи с помощью <code>entrySet()</code>. Выведите каждый ключ и значение в формате "ключ -> значение".</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, String&gt; capitals = new java.util.HashMap&lt;&gt;();
        capitals.put("Россия", "Москва");
        capitals.put("Франция", "Париж");
        capitals.put("Германия", "Берлин");
        // Обойдите через entrySet()
    }
}`,
          hints: ['for (Map.Entry<K,V> e : map.entrySet())', 'e.getKey() и e.getValue()']
        },
        {
          id: 'col_ch2_t4',
          difficulty: 'easy',
          title: 'PriorityQueue — минимальный элемент',
          description: '<p>Создайте <code>PriorityQueue&lt;Integer&gt;</code>, добавьте числа: 8, 3, 5, 1, 9. Извлеките и выведите все элементы через <code>poll()</code> — они должны выйти в порядке возрастания.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        // Создайте PriorityQueue
        // Добавьте 5 чисел
        // Выведите все через poll()
    }
}`,
          hints: ['PriorityQueue по умолчанию — min-heap', 'Цикл while(!pq.isEmpty()) { pq.poll() }']
        },
        {
          id: 'col_ch2_t5',
          difficulty: 'easy',
          title: 'ArrayDeque как очередь',
          description: '<p>Используйте <code>ArrayDeque</code> как обычную очередь FIFO: добавьте элементы с помощью <code>offer()</code> и извлекайте с помощью <code>poll()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Deque&lt;String&gt; queue = new java.util.ArrayDeque&lt;&gt;();
        // Добавьте "первый", "второй", "третий" через offer()
        // Извлеките и выведите все через poll()
    }
}`,
          hints: ['offer() добавляет в конец', 'poll() извлекает из начала']
        },
        {
          id: 'col_ch2_t6',
          difficulty: 'easy',
          title: 'Значение по умолчанию',
          description: '<p>Используйте метод <code>getOrDefault()</code> для получения значения по ключу. Если ключ отсутствует, верните значение по умолчанию "Неизвестно".</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, String&gt; map = new java.util.HashMap&lt;&gt;();
        map.put("кот", "cat");
        map.put("дом", "house");
        // Получите перевод "кот" и "птица" через getOrDefault
    }
}`,
          hints: ['map.getOrDefault(key, defaultValue)', '"птица" отсутствует — вернёт "Неизвестно"']
        },
        {
          id: 'col_ch2_t7',
          difficulty: 'easy',
          title: 'Удаление из Map',
          description: '<p>Создайте <code>HashMap</code> с 4 записями. Удалите одну запись по ключу с помощью <code>remove()</code>. Выведите карту до и после удаления.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;Integer, String&gt; map = new java.util.HashMap&lt;&gt;();
        map.put(1, "один");
        map.put(2, "два");
        map.put(3, "три");
        map.put(4, "четыре");
        // Выведите карту
        // Удалите ключ 2
        // Выведите снова
    }
}`,
          hints: ['map.remove(key) удаляет запись по ключу', 'Размер уменьшится на 1']
        },
        {
          id: 'col_ch2_t8',
          difficulty: 'easy',
          title: 'Размер очереди',
          description: '<p>Создайте <code>PriorityQueue</code>, добавьте 5 элементов. Выведите размер, затем извлеките 2 элемента и снова выведите размер.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.PriorityQueue&lt;Integer&gt; pq = new java.util.PriorityQueue&lt;&gt;();
        // Добавьте 5 элементов
        // Выведите size()
        // Два раза poll()
        // Выведите size() снова
    }
}`,
          hints: ['size() возвращает текущее количество элементов', 'После 2 poll() размер должен быть 3']
        },
        {
          id: 'col_ch2_t9',
          difficulty: 'easy',
          title: 'Ключи и значения Map',
          description: '<p>Создайте <code>HashMap</code>. Выведите отдельно все ключи через <code>keySet()</code> и все значения через <code>values()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, Integer&gt; scores = new java.util.HashMap&lt;&gt;();
        scores.put("Алексей", 88);
        scores.put("Борис", 74);
        scores.put("Вера", 95);
        // Выведите keySet()
        // Выведите values()
    }
}`,
          hints: ['map.keySet() возвращает Set ключей', 'map.values() возвращает Collection значений']
        },
        {
          id: 'col_ch2_t10',
          difficulty: 'easy',
          title: 'EnumMap — расписание',
          description: '<p>Создайте перечисление <code>Day</code> с днями недели. Используйте <code>EnumMap</code> для хранения задач на каждый день. Выведите расписание.</p>',
          startCode: `import java.util.EnumMap;

public class Main {
    enum Day { ПОНЕДЕЛЬНИК, СРЕДА, ПЯТНИЦА }

    public static void main(String[] args) {
        EnumMap&lt;Day, String&gt; tasks = new EnumMap&lt;&gt;(Day.class);
        // Добавьте задачу для каждого дня
        // Выведите расписание
    }
}`,
          hints: ['EnumMap<Day, String> tasks = new EnumMap<>(Day.class)', 'Ключи хранятся в порядке объявления enum']
        },
        {
          id: 'col_ch2_t11',
          difficulty: 'easy',
          title: 'TreeMap — первый и последний',
          description: '<p>Создайте <code>TreeMap&lt;Integer, String&gt;</code> и добавьте 5 записей. Получите и выведите первый и последний ключ с помощью <code>firstKey()</code> и <code>lastKey()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.TreeMap&lt;Integer, String&gt; tm = new java.util.TreeMap&lt;&gt;();
        tm.put(5, "пять");
        tm.put(1, "один");
        tm.put(3, "три");
        tm.put(8, "восемь");
        tm.put(2, "два");
        // Выведите firstKey() и lastKey()
    }
}`,
          hints: ['TreeMap автоматически сортирует по ключу', 'firstKey() = 1, lastKey() = 8']
        },
        {
          id: 'col_ch2_t12',
          difficulty: 'easy',
          title: 'putIfAbsent',
          description: '<p>Используйте метод <code>putIfAbsent()</code>, чтобы добавить значение только если ключ отсутствует. Выведите карту после нескольких вызовов.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, Integer&gt; map = new java.util.HashMap&lt;&gt;();
        map.put("a", 1);
        map.putIfAbsent("a", 100); // не изменит
        map.putIfAbsent("b", 2);   // добавит
        // Выведите карту
    }
}`,
          hints: ['putIfAbsent добавляет только если ключ не существует', 'Значение "a" останется 1']
        },
        {
          id: 'col_ch2_t13',
          difficulty: 'easy',
          title: 'ArrayDeque как стек',
          description: '<p>Используйте <code>ArrayDeque</code> как стек LIFO: добавляйте через <code>push()</code>, извлекайте через <code>pop()</code>. Добавьте 3 элемента и извлеките их.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Deque&lt;String&gt; stack = new java.util.ArrayDeque&lt;&gt;();
        // push "первый", "второй", "третий"
        // pop и выведите все
    }
}`,
          hints: ['push() добавляет в начало', 'pop() извлекает из начала (LIFO)']
        },
        {
          id: 'col_ch2_t14',
          difficulty: 'easy',
          title: 'Подсчёт с merge',
          description: '<p>Используйте метод <code>merge()</code> для подсчёта слов в списке. Создайте <code>HashMap&lt;String, Integer&gt;</code> счётчик.</p>',
          startCode: `import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        String[] words = {"java", "python", "java", "go", "python", "java"};
        Map&lt;String, Integer&gt; counter = new HashMap&lt;&gt;();
        // Используйте merge для подсчёта
        System.out.println(counter);
    }
}`,
          hints: ['map.merge(key, 1, Integer::sum)', 'Результат: {java=3, python=2, go=1}']
        },
        {
          id: 'col_ch2_t15',
          difficulty: 'easy',
          title: 'PriorityQueue максимум',
          description: '<p>Создайте <code>PriorityQueue</code> с обратным компаратором (max-heap). Добавьте числа и извлеките их — они должны выйти в порядке убывания.</p>',
          startCode: `import java.util.Collections;
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue&lt;Integer&gt; maxHeap =
            new PriorityQueue&lt;&gt;(Collections.reverseOrder());
        maxHeap.offer(3);
        maxHeap.offer(1);
        maxHeap.offer(5);
        maxHeap.offer(2);
        // Выведите все через poll()
    }
}`,
          hints: ['Collections.reverseOrder() делает из min-heap max-heap', 'Числа выйдут: 5, 3, 2, 1']
        },
        {
          id: 'col_ch2_t16',
          difficulty: 'medium',
          title: 'Частота слов в тексте',
          description: '<p>Разбейте предложение на слова и подсчитайте частоту каждого слова в <code>HashMap</code>. Выведите слова и их количество.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        String text = "кот дом кот птица дом кот";
        // Разбейте на слова: text.split(" ")
        // Подсчитайте частоту в HashMap
        // Выведите результат
    }
}`,
          hints: ['split(" ") разбивает строку по пробелу', 'getOrDefault(word, 0) + 1 для подсчёта']
        },
        {
          id: 'col_ch2_t17',
          difficulty: 'medium',
          title: 'Инвертирование Map',
          description: '<p>Создайте <code>HashMap&lt;String, Integer&gt;</code>. Инвертируйте его в <code>HashMap&lt;Integer, String&gt;</code> (поменяйте ключи и значения местами). Выведите оба.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, Integer&gt; original = new java.util.HashMap&lt;&gt;();
        original.put("один", 1);
        original.put("два", 2);
        original.put("три", 3);
        // Создайте инвертированную копию
    }
}`,
          hints: ['Переберите entrySet()', 'inverted.put(entry.getValue(), entry.getKey())']
        },
        {
          id: 'col_ch2_t18',
          difficulty: 'medium',
          title: 'Очередь задач с приоритетом',
          description: '<p>Создайте класс <code>Task</code> с полями <code>name</code> и <code>priority</code>. Используйте <code>PriorityQueue</code> с компаратором по приоритету. Добавьте 5 задач и извлеките их в порядке приоритета.</p>',
          startCode: `import java.util.PriorityQueue;
import java.util.Comparator;

public class Main {
    static class Task {
        String name;
        int priority;
        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }
        public String toString() { return name + "(" + priority + ")"; }
    }

    public static void main(String[] args) {
        PriorityQueue&lt;Task&gt; queue = new PriorityQueue&lt;&gt;(
            Comparator.comparingInt(t -&gt; t.priority)
        );
        // Добавьте 5 задач с разными приоритетами
        // Извлеките и выведите все
    }
}`,
          hints: ['Задача с меньшим priority выйдет первой (min-heap)', 'Используйте reverseOrder для max-heap']
        },
        {
          id: 'col_ch2_t19',
          difficulty: 'medium',
          title: 'computeIfAbsent для группировки',
          description: '<p>Используйте <code>computeIfAbsent()</code> для группировки студентов по первой букве имени в <code>HashMap&lt;Character, List&lt;String&gt;&gt;</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;String&gt; students = Arrays.asList(
            "Алексей", "Анна", "Борис", "Виктор", "Алина", "Борис"
        );
        Map&lt;Character, List&lt;String&gt;&gt; groups = new HashMap&lt;&gt;();
        // Сгруппируйте по первой букве
        // Выведите результат
    }
}`,
          hints: ['s.charAt(0) — первый символ', 'computeIfAbsent(key, k -> new ArrayList<>()).add(value)']
        },
        {
          id: 'col_ch2_t20',
          difficulty: 'medium',
          title: 'Скользящее окно с Deque',
          description: '<p>Дан массив чисел и размер окна k. Найдите максимум в каждом скользящем окне с помощью <code>ArrayDeque</code> (монотонная очередь).</p>',
          startCode: `import java.util.*;

public class Main {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        // Реализуйте поиск максимума в скользящем окне
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int[] result = maxSlidingWindow(nums, 3);
        System.out.println(Arrays.toString(result));
        // Ожидается: [3, 3, 5, 5, 6, 7]
    }
}`,
          hints: ['Deque хранит индексы элементов', 'Удаляйте из начала если индекс вышел за окно']
        },
        {
          id: 'col_ch2_t21',
          difficulty: 'medium',
          title: 'TreeMap — ближайшие ключи',
          description: '<p>Используйте методы <code>floorKey()</code> и <code>ceilingKey()</code> в <code>TreeMap</code> для поиска ближайших ключей к заданному числу.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.TreeMap&lt;Integer, String&gt; tm = new java.util.TreeMap&lt;&gt;();
        tm.put(10, "десять");
        tm.put(20, "двадцать");
        tm.put(30, "тридцать");
        tm.put(40, "сорок");
        // Найдите floorKey(25) — ближайший снизу
        // Найдите ceilingKey(25) — ближайший сверху
    }
}`,
          hints: ['floorKey(k) — наибольший ключ <= k', 'ceilingKey(k) — наименьший ключ >= k']
        },
        {
          id: 'col_ch2_t22',
          difficulty: 'medium',
          title: 'Топ-N частых слов',
          description: '<p>Дан список слов. Найдите 3 наиболее часто встречающихся слова, используя <code>HashMap</code> и <code>PriorityQueue</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] words = {"java", "python", "java", "go", "java",
                          "python", "c++", "go", "python", "java"};
        // Подсчитайте частоту в HashMap
        // Найдите топ-3 через PriorityQueue
    }
}`,
          hints: ['Сначала подсчитайте частоты в Map', 'Используйте PriorityQueue с компаратором по значению Map']
        },
        {
          id: 'col_ch2_t23',
          difficulty: 'medium',
          title: 'Палиндром с Deque',
          description: '<p>Используйте <code>ArrayDeque</code> для проверки, является ли строка палиндромом. Добавьте все символы в двустороннюю очередь и сравнивайте с обоих концов.</p>',
          startCode: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static boolean isPalindrome(String s) {
        Deque&lt;Character&gt; deque = new ArrayDeque&lt;&gt;();
        // Добавьте все символы строки в deque
        // Сравнивайте с обоих концов
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("level")); // true
        System.out.println(isPalindrome("hello")); // false
        System.out.println(isPalindrome("radar")); // true
    }
}`,
          hints: ['pollFirst() и pollLast() снимают элементы с обоих концов', 'Если символы не совпадают — не палиндром']
        },
        {
          id: 'col_ch2_t24',
          difficulty: 'medium',
          title: 'Map слияние',
          description: '<p>Создайте два <code>HashMap</code> и объедините их в один. При совпадении ключей суммируйте значения. Используйте метод <code>merge()</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map&lt;String, Integer&gt; map1 = new HashMap&lt;&gt;();
        map1.put("a", 1); map1.put("b", 2); map1.put("c", 3);

        Map&lt;String, Integer&gt; map2 = new HashMap&lt;&gt;();
        map2.put("b", 10); map2.put("c", 20); map2.put("d", 4);

        // Объедините map1 и map2, суммируя значения при совпадении ключей
    }
}`,
          hints: ['map2.forEach((k, v) -> map1.merge(k, v, Integer::sum))', 'Результат: {a=1, b=12, c=23, d=4}']
        },
        {
          id: 'col_ch2_t25',
          difficulty: 'medium',
          title: 'Кэш с LinkedHashMap',
          description: '<p>Реализуйте простой кэш с вытеснением самых старых записей, используя <code>LinkedHashMap</code> с параметром <code>accessOrder=false</code> и переопределив <code>removeEldestEntry()</code>.</p>',
          startCode: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        int capacity = 3;
        Map&lt;Integer, String&gt; cache = new LinkedHashMap&lt;Integer, String&gt;(
            capacity, 0.75f, false
        ) {
            protected boolean removeEldestEntry(Map.Entry&lt;Integer, String&gt; eldest) {
                return size() &gt; capacity;
            }
        };

        cache.put(1, "один");
        cache.put(2, "два");
        cache.put(3, "три");
        System.out.println(cache); // {1=один, 2=два, 3=три}
        cache.put(4, "четыре");
        System.out.println(cache); // {2=два, 3=три, 4=четыре}
    }
}`,
          hints: ['removeEldestEntry возвращает true — удаляет старейшую запись', 'При size() > capacity удаляется первая запись']
        },
        {
          id: 'col_ch2_t26',
          difficulty: 'hard',
          title: 'Топологическая сортировка',
          description: '<p>Реализуйте топологическую сортировку с помощью <code>HashMap</code> (список смежности) и <code>ArrayDeque</code> (очередь). Используйте алгоритм Кана.</p>',
          startCode: `import java.util.*;

public class Main {
    public static List&lt;Integer&gt; topoSort(int n, int[][] edges) {
        Map&lt;Integer, List&lt;Integer&gt;&gt; graph = new HashMap&lt;&gt;();
        int[] inDegree = new int[n];

        for (int i = 0; i &lt; n; i++) graph.put(i, new ArrayList&lt;&gt;());

        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
            inDegree[edge[1]]++;
        }

        Deque&lt;Integer&gt; queue = new ArrayDeque&lt;&gt;();
        for (int i = 0; i &lt; n; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        List&lt;Integer&gt; result = new ArrayList&lt;&gt;();
        // Завершите алгоритм Кана
        return result;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1},{0,2},{1,3},{2,3}};
        System.out.println(topoSort(4, edges)); // [0, 1, 2, 3] или [0, 2, 1, 3]
    }
}`,
          hints: ['Извлекайте из очереди, добавляйте в result', 'Уменьшайте inDegree соседей, если стало 0 — добавьте в очередь']
        },
        {
          id: 'col_ch2_t27',
          difficulty: 'hard',
          title: 'Алгоритм Дейкстры',
          description: '<p>Реализуйте алгоритм Дейкстры для поиска кратчайшего пути, используя <code>PriorityQueue</code> и <code>HashMap</code> для графа.</p>',
          startCode: `import java.util.*;

public class Main {
    public static int[] dijkstra(int n, int[][] edges, int src) {
        Map&lt;Integer, List&lt;int[]&gt;&gt; graph = new HashMap&lt;&gt;();
        for (int i = 0; i &lt; n; i++) graph.put(i, new ArrayList&lt;&gt;());
        for (int[] e : edges) {
            graph.get(e[0]).add(new int[]{e[1], e[2]});
            graph.get(e[1]).add(new int[]{e[0], e[2]});
        }

        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;(Comparator.comparingInt(a -&gt; a[1]));
        pq.offer(new int[]{src, 0});

        // Завершите алгоритм Дейкстры
        return dist;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1,4},{0,2,1},{2,1,2},{1,3,1}};
        System.out.println(Arrays.toString(dijkstra(4, edges, 0)));
        // Ожидается: [0, 3, 1, 4]
    }
}`,
          hints: ['Извлекайте вершину с минимальным расстоянием из PQ', 'Релаксация: if (dist[u] + w < dist[v]) обновите dist[v]']
        },
        {
          id: 'col_ch2_t28',
          difficulty: 'hard',
          title: 'Многоуровневый кэш',
          description: '<p>Реализуйте двухуровневый кэш: первый уровень — <code>HashMap</code> (быстрый, ограниченный), второй — <code>TreeMap</code> (медленный, неограниченный). При промахе L1 ищите в L2 и перемещайте запись в L1.</p>',
          startCode: `import java.util.*;

public class Main {
    static class TwoLevelCache {
        private final int l1Capacity;
        private final Map&lt;Integer, String&gt; l1 = new LinkedHashMap&lt;&gt;();
        private final TreeMap&lt;Integer, String&gt; l2 = new TreeMap&lt;&gt;();

        public TwoLevelCache(int l1Capacity) {
            this.l1Capacity = l1Capacity;
        }

        public void put(int key, String value) {
            l2.put(key, value);
        }

        public String get(int key) {
            // Ищите в L1, если нет — в L2
            // При попадании в L2 переместите в L1
            return null;
        }
    }

    public static void main(String[] args) {
        TwoLevelCache cache = new TwoLevelCache(2);
        cache.put(1, "один"); cache.put(2, "два"); cache.put(3, "три");
        System.out.println(cache.get(1)); // один (из L2)
        System.out.println(cache.get(1)); // один (из L1)
    }
}`,
          hints: ['При промахе L1 вызовите l2.get(key)', 'При переполнении L1 удаляйте первый элемент']
        },
        {
          id: 'col_ch2_t29',
          difficulty: 'hard',
          title: 'Частотная сортировка',
          description: '<p>Дан массив чисел. Отсортируйте его по частоте появления (по убыванию). При одинаковой частоте — по убыванию значения. Используйте <code>HashMap</code> и кастомный компаратор.</p>',
          startCode: `import java.util.*;

public class Main {
    public static int[] frequencySort(int[] nums) {
        Map&lt;Integer, Integer&gt; freq = new HashMap&lt;&gt;();
        // Подсчитайте частоты

        // Преобразуйте в Integer[]
        Integer[] arr = new Integer[nums.length];
        for (int i = 0; i &lt; nums.length; i++) arr[i] = nums[i];

        // Отсортируйте с кастомным компаратором
        // Верните результат
        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(frequencySort(new int[]{1,1,2,2,2,3})));
        // Ожидается: [3, 1, 1, 2, 2, 2] — 3 редкий, 2 частый
    }
}`,
          hints: ['Компаратор: сначала по freq возрастанию, при равенстве — по значению убыванию', 'Arrays.sort(arr, comparator)']
        },
        {
          id: 'col_ch2_t30',
          difficulty: 'hard',
          title: 'Ближайшая сумма в BST',
          description: '<p>Используя <code>TreeMap</code>, найдите в наборе чисел пару с наименьшей разницей между их суммой и целевым значением target. Верните эту пару.</p>',
          startCode: `import java.util.*;

public class Main {
    public static int[] closestPair(int[] nums, int target) {
        TreeMap&lt;Integer, Integer&gt; map = new TreeMap&lt;&gt;();
        int[] result = new int[2];
        int minDiff = Integer.MAX_VALUE;

        for (int num : nums) {
            // Для каждого числа ищем дополнение в TreeMap
            // floorKey и ceilingKey помогут найти ближайшее
            map.put(num, num);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(closestPair(new int[]{1,3,5,7,9}, 8)));
        // Ожидается пара с суммой ближайшей к 8: [1,7] или [3,5]
    }
}`,
          hints: ['Для каждого num вычислите need = target - num', 'floorKey(need) и ceilingKey(need) дадут ближайшие кандидаты']
        }
      ]
    },
    {
      id: 'col_ch3',
      title: 'Итераторы и Comparator',
      lecture: `<h2>Итераторы и Comparator в Java</h2>
<p>Итераторы позволяют обходить коллекции без привязки к конкретному типу. Интерфейсы <strong>Comparable</strong> и <strong>Comparator</strong> обеспечивают гибкую сортировку.</p>

<h3>Iterator</h3>
<p>Интерфейс <code>Iterator&lt;E&gt;</code> предоставляет методы <code>hasNext()</code>, <code>next()</code> и <code>remove()</code>.</p>
<pre><code>import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
    public static void main(String[] args) {
        List&lt;String&gt; list = new ArrayList&lt;&gt;();
        list.add("Alpha"); list.add("Beta"); list.add("Gamma");

        Iterator&lt;String&gt; it = list.iterator();
        while (it.hasNext()) {
            String s = it.next();
            if (s.equals("Beta")) {
                it.remove(); // безопасное удаление во время итерации
            }
        }
        System.out.println(list); // [Alpha, Gamma]
    }
}</code></pre>

<h3>ListIterator</h3>
<p><code>ListIterator</code> расширяет <code>Iterator</code>: позволяет двигаться в обоих направлениях и изменять элементы.</p>
<pre><code>import java.util.ArrayList;
import java.util.ListIterator;

public class ListIteratorDemo {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();
        list.add(1); list.add(2); list.add(3);

        ListIterator&lt;Integer&gt; lit = list.listIterator();
        while (lit.hasNext()) {
            int val = lit.next();
            lit.set(val * 2); // заменяем каждый элемент
        }
        System.out.println(list); // [2, 4, 6]

        // Обход назад
        while (lit.hasPrevious()) {
            System.out.print(lit.previous() + " "); // 6 4 2
        }
    }
}</code></pre>

<h3>Comparable</h3>
<p>Интерфейс <code>Comparable&lt;T&gt;</code> определяет естественный порядок класса через метод <code>compareTo()</code>.</p>
<pre><code>public class Student implements Comparable&lt;Student&gt; {
    String name;
    int grade;

    Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.grade, other.grade);
    }

    @Override
    public String toString() { return name + "(" + grade + ")"; }
}

// Использование:
// Collections.sort(students); // сортировка по grade
</code></pre>

<h3>Comparator.comparing</h3>
<p><code>Comparator</code> позволяет задать произвольный порядок без изменения класса. Метод <code>Comparator.comparing()</code> — удобный фабричный метод.</p>
<pre><code>import java.util.*;

public class ComparatorDemo {
    record Person(String name, int age) {}

    public static void main(String[] args) {
        List&lt;Person&gt; people = new ArrayList&lt;&gt;();
        people.add(new Person("Алексей", 30));
        people.add(new Person("Мария", 25));
        people.add(new Person("Игорь", 35));

        // Сортировка по возрасту
        people.sort(Comparator.comparingInt(Person::age));
        System.out.println(people);

        // Сортировка по имени в обратном порядке
        people.sort(Comparator.comparing(Person::name).reversed());
        System.out.println(people);

        // Цепочка компараторов
        people.sort(Comparator.comparingInt(Person::age)
                              .thenComparing(Person::name));
    }
}</code></pre>`,
      tasks: [
        {
          id: 'col_ch3_t1',
          difficulty: 'easy',
          title: 'Базовый Iterator',
          description: '<p>Создайте <code>ArrayList</code> из 5 чисел. Получите итератор через <code>iterator()</code> и обойдите список, выводя каждый элемент.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.List&lt;Integer&gt; list = new java.util.ArrayList&lt;&gt;();
        list.add(10); list.add(20); list.add(30); list.add(40); list.add(50);
        // Получите iterator()
        // Обойдите через hasNext() и next()
    }
}`,
          hints: ['Iterator<Integer> it = list.iterator()', 'while (it.hasNext()) { System.out.println(it.next()); }']
        },
        {
          id: 'col_ch3_t2',
          difficulty: 'easy',
          title: 'Удаление через Iterator',
          description: '<p>Создайте список целых чисел. Используя итератор, удалите все чётные числа из списка (безопасное удаление через <code>it.remove()</code>).</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.List&lt;Integer&gt; list = new java.util.ArrayList&lt;&gt;(
            java.util.Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        );
        // Удалите все чётные числа через Iterator
        System.out.println(list);
    }
}`,
          hints: ['Проверяйте num % 2 == 0', 'it.remove() безопаснее, чем list.remove() во время итерации']
        },
        {
          id: 'col_ch3_t3',
          difficulty: 'easy',
          title: 'ListIterator — обход назад',
          description: '<p>Создайте <code>ArrayList</code> из букв ["A", "B", "C", "D", "E"]. Пройдите список до конца и выведите его в обратном порядке через <code>ListIterator</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.ArrayList&lt;String&gt; list = new java.util.ArrayList&lt;&gt;(
            java.util.Arrays.asList("A", "B", "C", "D", "E")
        );
        // Переместите ListIterator на конец
        // Пройдите в обратном порядке через hasPrevious() и previous()
    }
}`,
          hints: ['listIterator(list.size()) ставит курсор в конец', 'hasPrevious() и previous() для обратного обхода']
        },
        {
          id: 'col_ch3_t4',
          difficulty: 'easy',
          title: 'Comparable — сортировка студентов',
          description: '<p>Реализуйте класс <code>Student</code> с полями <code>name</code> и <code>gpa</code> (double). Реализуйте <code>Comparable&lt;Student&gt;</code> для сортировки по GPA по убыванию. Отсортируйте список.</p>',
          startCode: `import java.util.*;

public class Main {
    static class Student implements Comparable&lt;Student&gt; {
        String name;
        double gpa;
        Student(String name, double gpa) {
            this.name = name; this.gpa = gpa;
        }
        public String toString() { return name + ":" + gpa; }

        @Override
        public int compareTo(Student other) {
            // Реализуйте сортировку по GPA по убыванию
            return 0;
        }
    }

    public static void main(String[] args) {
        List&lt;Student&gt; students = new ArrayList&lt;&gt;(Arrays.asList(
            new Student("Алексей", 3.5),
            new Student("Мария", 3.9),
            new Student("Игорь", 3.2)
        ));
        Collections.sort(students);
        System.out.println(students);
    }
}`,
          hints: ['Double.compare(other.gpa, this.gpa) — для убывания', 'Возвращайте отрицательное — этот идёт раньше']
        },
        {
          id: 'col_ch3_t5',
          difficulty: 'easy',
          title: 'Comparator по имени',
          description: '<p>Создайте список строк — имён людей. Отсортируйте список по длине имени с помощью <code>Comparator.comparingInt(String::length)</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;String&gt; names = new ArrayList&lt;&gt;(
            Arrays.asList("Александр", "Лев", "Дмитрий", "Ян", "Сергей")
        );
        // Отсортируйте по длине имени
        System.out.println(names);
    }
}`,
          hints: ['names.sort(Comparator.comparingInt(String::length))', 'Или Collections.sort(names, ...)']
        },
        {
          id: 'col_ch3_t6',
          difficulty: 'easy',
          title: 'Reversed Comparator',
          description: '<p>Создайте список чисел и отсортируйте их в обратном (убывающем) порядке, используя <code>Comparator.reverseOrder()</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;Integer&gt; nums = new ArrayList&lt;&gt;(
            Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6)
        );
        // Отсортируйте в порядке убывания
        System.out.println(nums);
    }
}`,
          hints: ['Comparator.reverseOrder() — обратный порядок', 'nums.sort(Comparator.reverseOrder())']
        },
        {
          id: 'col_ch3_t7',
          difficulty: 'easy',
          title: 'Iterator для Set',
          description: '<p>Создайте <code>HashSet</code> из 5 строк. Получите итератор и выведите все элементы.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Set&lt;String&gt; set = new java.util.HashSet&lt;&gt;();
        set.add("Java"); set.add("Kotlin"); set.add("Scala");
        set.add("Groovy"); set.add("Clojure");
        // Получите iterator() и обойдите Set
    }
}`,
          hints: ['Iterator<String> it = set.iterator()', 'Порядок не гарантирован в HashSet']
        },
        {
          id: 'col_ch3_t8',
          difficulty: 'easy',
          title: 'ListIterator — замена элементов',
          description: '<p>Создайте список строк. Используя <code>ListIterator</code>, преобразуйте все строки в верхний регистр с помощью <code>lit.set()</code>.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.List&lt;String&gt; list = new java.util.ArrayList&lt;&gt;(
            java.util.Arrays.asList("hello", "world", "java")
        );
        // Используйте ListIterator для замены на верхний регистр
        System.out.println(list);
    }
}`,
          hints: ['lit.set(s.toUpperCase()) заменяет текущий элемент', 'Вызывайте set() после next()']
        },
        {
          id: 'col_ch3_t9',
          difficulty: 'easy',
          title: 'thenComparing',
          description: '<p>Создайте класс <code>Product</code> с полями <code>category</code> и <code>price</code>. Отсортируйте список по категории, затем по цене с помощью <code>Comparator.comparing().thenComparingDouble()</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    record Product(String category, double price) {}

    public static void main(String[] args) {
        List&lt;Product&gt; products = new ArrayList&lt;&gt;(Arrays.asList(
            new Product("Еда", 50.0),
            new Product("Техника", 1000.0),
            new Product("Еда", 30.0),
            new Product("Техника", 500.0),
            new Product("Одежда", 200.0)
        ));
        // Отсортируйте по category, затем по price
        products.forEach(System.out::println);
    }
}`,
          hints: ['Comparator.comparing(Product::category).thenComparingDouble(Product::price)', 'products.sort(comparator)']
        },
        {
          id: 'col_ch3_t10',
          difficulty: 'easy',
          title: 'Итератор для Map',
          description: '<p>Создайте <code>HashMap</code>. Получите итератор для <code>entrySet()</code> и обойдите все записи, выводя каждую пару ключ-значение.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.Map&lt;String, Integer&gt; map = new java.util.HashMap&lt;&gt;();
        map.put("один", 1); map.put("два", 2); map.put("три", 3);
        // Получите iterator для entrySet()
        // Обойдите и выведите все записи
    }
}`,
          hints: ['Iterator<Map.Entry<K,V>> it = map.entrySet().iterator()', 'entry.getKey() и entry.getValue()']
        },
        {
          id: 'col_ch3_t11',
          difficulty: 'easy',
          title: 'Comparable — точки на плоскости',
          description: '<p>Реализуйте класс <code>Point</code> с координатами <code>x</code> и <code>y</code>. Реализуйте <code>Comparable</code> для сортировки сначала по x, затем по y.</p>',
          startCode: `import java.util.*;

public class Main {
    static class Point implements Comparable&lt;Point&gt; {
        int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }
        public String toString() { return "(" + x + "," + y + ")"; }

        @Override
        public int compareTo(Point other) {
            // Сначала по x, затем по y
            return 0;
        }
    }

    public static void main(String[] args) {
        List&lt;Point&gt; points = new ArrayList&lt;&gt;(Arrays.asList(
            new Point(3, 1), new Point(1, 5), new Point(1, 2), new Point(2, 3)
        ));
        Collections.sort(points);
        System.out.println(points);
    }
}`,
          hints: ['Сначала сравните x: Integer.compare(this.x, other.x)', 'Если x равны — сравните y']
        },
        {
          id: 'col_ch3_t12',
          difficulty: 'easy',
          title: 'nullsFirst и nullsLast',
          description: '<p>Создайте список строк с несколькими <code>null</code> значениями. Отсортируйте список, помещая <code>null</code> в начало с помощью <code>Comparator.nullsFirst()</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;String&gt; list = new ArrayList&lt;&gt;(
            Arrays.asList("банан", null, "яблоко", null, "манго")
        );
        // Отсортируйте с nullsFirst(naturalOrder())
        System.out.println(list);
    }
}`,
          hints: ['Comparator.nullsFirst(Comparator.naturalOrder())', 'null элементы окажутся в начале']
        },
        {
          id: 'col_ch3_t13',
          difficulty: 'easy',
          title: 'Удаление при условии — removeIf',
          description: '<p>Создайте <code>ArrayList</code> чисел. Используйте метод <code>removeIf()</code> для удаления всех чисел, меньших 5. Выведите результат.</p>',
          startCode: `public class Main {
    public static void main(String[] args) {
        java.util.List&lt;Integer&gt; list = new java.util.ArrayList&lt;&gt;(
            java.util.Arrays.asList(1, 7, 3, 9, 2, 8, 4, 6, 5)
        );
        // Используйте removeIf для удаления < 5
        System.out.println(list);
    }
}`,
          hints: ['list.removeIf(n -> n < 5)', 'removeIf использует итератор внутри — безопасно']
        },
        {
          id: 'col_ch3_t14',
          difficulty: 'easy',
          title: 'Итерируемый класс',
          description: '<p>Реализуйте класс <code>Range</code>, который реализует <code>Iterable&lt;Integer&gt;</code> и позволяет итерировать числа от start до end включительно.</p>',
          startCode: `public class Main {
    static class Range implements Iterable&lt;Integer&gt; {
        private final int start;
        private final int end;

        Range(int start, int end) {
            this.start = start;
            this.end = end;
        }

        @Override
        public java.util.Iterator&lt;Integer&gt; iterator() {
            // Реализуйте анонимный Iterator
            return null;
        }
    }

    public static void main(String[] args) {
        for (int n : new Range(1, 5)) {
            System.out.print(n + " "); // 1 2 3 4 5
        }
    }
}`,
          hints: ['Создайте анонимный класс, реализующий Iterator<Integer>', 'hasNext() — current <= end, next() — current++']
        },
        {
          id: 'col_ch3_t15',
          difficulty: 'easy',
          title: 'Comparator для TreeSet',
          description: '<p>Создайте <code>TreeSet</code> строк с кастомным компаратором, который сортирует строки по длине (от короткой к длинной). Добавьте несколько слов и выведите набор.</p>',
          startCode: `import java.util.TreeSet;
import java.util.Comparator;

public class Main {
    public static void main(String[] args) {
        TreeSet&lt;String&gt; ts = new TreeSet&lt;&gt;(
            Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder())
        );
        ts.add("кот"); ts.add("слон"); ts.add("лев"); ts.add("жираф"); ts.add("ай");
        System.out.println(ts);
    }
}`,
          hints: ['thenComparing(naturalOrder()) нужен, чтобы одинаковые по длине строки не считались равными', 'Без thenComparing строки одной длины перезапишут друг друга']
        },
        {
          id: 'col_ch3_t16',
          difficulty: 'medium',
          title: 'Конкурентная модификация',
          description: '<p>Объясните и продемонстрируйте разницу между безопасным удалением через <code>Iterator.remove()</code> и небезопасным через <code>list.remove()</code> во время итерации. Реализуйте оба варианта.</p>',
          startCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List&lt;Integer&gt; list1 = new ArrayList&lt;&gt;(Arrays.asList(1,2,3,4,5,6));
        List&lt;Integer&gt; list2 = new ArrayList&lt;&gt;(Arrays.asList(1,2,3,4,5,6));

        // Безопасный способ: Iterator.remove()
        Iterator&lt;Integer&gt; it = list1.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) it.remove();
        }
        System.out.println("Безопасный: " + list1);

        // Небезопасный: вызовет ConcurrentModificationException
        try {
            for (Integer n : list2) {
                if (n % 2 == 0) list2.remove(n);
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("Исключение: " + e.getClass().getSimpleName());
        }
    }
}`,
          hints: ['Iterator.remove() безопасен', 'Удаление через list.remove() во время for-each вызывает ConcurrentModificationException']
        },
        {
          id: 'col_ch3_t17',
          difficulty: 'medium',
          title: 'Многокритериальная сортировка',
          description: '<p>Создайте класс <code>Employee</code> с полями <code>department</code>, <code>salary</code>, <code>name</code>. Отсортируйте список по отделу (ascending), затем по зарплате (descending), затем по имени (ascending).</p>',
          startCode: `import java.util.*;

public class Main {
    record Employee(String department, double salary, String name) {}

    public static void main(String[] args) {
        List&lt;Employee&gt; employees = new ArrayList&lt;&gt;(Arrays.asList(
            new Employee("IT", 80000, "Алексей"),
            new Employee("HR", 60000, "Мария"),
            new Employee("IT", 90000, "Борис"),
            new Employee("HR", 60000, "Анна"),
            new Employee("IT", 80000, "Виктор")
        ));
        // Сортировка: department ASC, salary DESC, name ASC
        employees.forEach(System.out::println);
    }
}`,
          hints: ['Comparator.comparing(Employee::department)', '.thenComparingDouble(Employee::salary).reversed() не то же самое — используйте явный Comparator', 'Правильно: .thenComparing(Comparator.comparingDouble(Employee::salary).reversed())']
        },
        {
          id: 'col_ch3_t18',
          difficulty: 'medium',
          title: 'Custom Iterable — FibonacciSequence',
          description: '<p>Реализуйте класс <code>FibonacciSequence</code>, который реализует <code>Iterable&lt;Long&gt;</code> и генерирует числа Фибоначчи. Конструктор принимает количество чисел.</p>',
          startCode: `public class Main {
    static class FibonacciSequence implements Iterable&lt;Long&gt; {
        private final int count;

        FibonacciSequence(int count) {
            this.count = count;
        }

        @Override
        public java.util.Iterator&lt;Long&gt; iterator() {
            // Реализуйте Iterator для последовательности Фибоначчи
            return null;
        }
    }

    public static void main(String[] args) {
        for (long n : new FibonacciSequence(10)) {
            System.out.print(n + " ");
            // Ожидается: 0 1 1 2 3 5 8 13 21 34
        }
    }
}`,
          hints: ['Храните prev, curr и count в анонимном классе', 'next() возвращает curr, потом сдвигает: prev=curr, curr=prev+curr']
        },
        {
          id: 'col_ch3_t19',
          difficulty: 'medium',
          title: 'Компаратор из строки',
          description: '<p>Напишите метод, который принимает строку ("name", "age", "salary") и возвращает соответствующий <code>Comparator&lt;Employee&gt;</code>. Реализуйте через <code>switch</code> выражение.</p>',
          startCode: `import java.util.*;

public class Main {
    record Employee(String name, int age, double salary) {}

    public static Comparator&lt;Employee&gt; getComparator(String field) {
        return switch (field) {
            // Реализуйте возврат компаратора по имени поля
            default -&gt; throw new IllegalArgumentException("Неизвестное поле: " + field);
        };
    }

    public static void main(String[] args) {
        List&lt;Employee&gt; list = new ArrayList&lt;&gt;(Arrays.asList(
            new Employee("Борис", 30, 70000),
            new Employee("Алексей", 25, 90000),
            new Employee("Мария", 35, 60000)
        ));
        list.sort(getComparator("age"));
        list.forEach(System.out::println);
    }
}`,
          hints: ['case "name" -> Comparator.comparing(Employee::name)', 'case "age" -> Comparator.comparingInt(Employee::age)']
        },
        {
          id: 'col_ch3_t20',
          difficulty: 'medium',
          title: 'Слияние двух отсортированных итераторов',
          description: '<p>Реализуйте метод, который принимает два итератора отсортированных чисел и возвращает итератор, выдающий числа в общем отсортированном порядке (алгоритм слияния).</p>',
          startCode: `import java.util.*;

public class Main {
    public static Iterator&lt;Integer&gt; merge(Iterator&lt;Integer&gt; a, Iterator&lt;Integer&gt; b) {
        return new Iterator&lt;Integer&gt;() {
            Integer nextA = a.hasNext() ? a.next() : null;
            Integer nextB = b.hasNext() ? b.next() : null;

            public boolean hasNext() {
                return nextA != null || nextB != null;
            }

            public Integer next() {
                // Реализуйте логику выбора меньшего элемента
                return null;
            }
        };
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; l1 = Arrays.asList(1, 3, 5, 7);
        List&lt;Integer&gt; l2 = Arrays.asList(2, 4, 6, 8);
        Iterator&lt;Integer&gt; merged = merge(l1.iterator(), l2.iterator());
        while (merged.hasNext()) System.out.print(merged.next() + " ");
        // Ожидается: 1 2 3 4 5 6 7 8
    }
}`,
          hints: ['Сравните nextA и nextB, верните меньший', 'После возврата продвиньте соответствующий итератор']
        },
        {
          id: 'col_ch3_t21',
          difficulty: 'medium',
          title: 'Stable sort — стабильная сортировка',
          description: '<p>Докажите, что <code>Collections.sort()</code> в Java стабилен. Создайте список объектов с одинаковым ключом сортировки и убедитесь, что их исходный порядок сохраняется.</p>',
          startCode: `import java.util.*;

public class Main {
    record Item(int key, String label) {
        public String toString() { return key + ":" + label; }
    }

    public static void main(String[] args) {
        List&lt;Item&gt; items = new ArrayList&lt;&gt;(Arrays.asList(
            new Item(2, "первый"),
            new Item(1, "второй"),
            new Item(2, "третий"),
            new Item(1, "четвёртый"),
            new Item(2, "пятый")
        ));
        // Отсортируйте только по key
        // Проверьте, что при key=1 порядок "второй", "четвёртый"
        // и при key=2 порядок "первый", "третий", "пятый" сохранился
        items.sort(Comparator.comparingInt(Item::key));
        items.forEach(System.out::println);
    }
}`,
          hints: ['Java sort гарантированно стабилен', 'Элементы с одинаковым ключом сохраняют исходный относительный порядок']
        },
        {
          id: 'col_ch3_t22',
          difficulty: 'medium',
          title: 'Итератор с фильтром',
          description: '<p>Реализуйте класс <code>FilterIterator&lt;T&gt;</code>, который оборачивает другой итератор и возвращает только элементы, удовлетворяющие заданному предикату.</p>',
          startCode: `import java.util.*;
import java.util.function.Predicate;

public class Main {
    static class FilterIterator&lt;T&gt; implements Iterator&lt;T&gt; {
        private final Iterator&lt;T&gt; source;
        private final Predicate&lt;T&gt; predicate;
        private T next;
        private boolean hasNext;

        FilterIterator(Iterator&lt;T&gt; source, Predicate&lt;T&gt; predicate) {
            this.source = source;
            this.predicate = predicate;
            advance();
        }

        private void advance() {
            // Найдите следующий подходящий элемент
        }

        public boolean hasNext() { return hasNext; }

        public T next() {
            T result = next;
            advance();
            return result;
        }
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        Iterator&lt;Integer&gt; evenIt = new FilterIterator&lt;&gt;(nums.iterator(), n -&gt; n % 2 == 0);
        while (evenIt.hasNext()) System.out.print(evenIt.next() + " ");
        // Ожидается: 2 4 6 8 10
    }
}`,
          hints: ['advance() ищет следующий подходящий элемент в source', 'Устанавливает next и hasNext']
        },
        {
          id: 'col_ch3_t23',
          difficulty: 'medium',
          title: 'Компаратор с null-safe сравнением',
          description: '<p>Реализуйте <code>Comparator</code> для класса <code>Person</code>, который корректно обрабатывает <code>null</code> значения поля <code>lastName</code>. Null должны идти последними.</p>',
          startCode: `import java.util.*;

public class Main {
    record Person(String firstName, String lastName) {}

    public static void main(String[] args) {
        List&lt;Person&gt; people = new ArrayList&lt;&gt;(Arrays.asList(
            new Person("Алексей", "Иванов"),
            new Person("Мария", null),
            new Person("Игорь", "Петров"),
            new Person("Анна", null),
            new Person("Борис", "Сидоров")
        ));
        // Отсортируйте по lastName, null — последними
        people.forEach(System.out::println);
    }
}`,
          hints: ['Comparator.comparing(Person::lastName, Comparator.nullsLast(Comparator.naturalOrder()))', 'nullsLast переносит null в конец']
        },
        {
          id: 'col_ch3_t24',
          difficulty: 'medium',
          title: 'Сортировка версий',
          description: '<p>Реализуйте компаратор для версий в формате "X.Y.Z" (например "1.10.2"). Строковое сравнение не подойдёт — нужно сравнивать числовые компоненты.</p>',
          startCode: `import java.util.*;

public class Main {
    public static Comparator&lt;String&gt; versionComparator() {
        return (v1, v2) -&gt; {
            String[] parts1 = v1.split("\\\\.");
            String[] parts2 = v2.split("\\\\.");
            // Сравните числовые компоненты
            return 0;
        };
    }

    public static void main(String[] args) {
        List&lt;String&gt; versions = new ArrayList&lt;&gt;(
            Arrays.asList("1.10.2", "1.9.0", "2.0.0", "1.10.1", "0.9.9")
        );
        versions.sort(versionComparator());
        System.out.println(versions);
        // Ожидается: [0.9.9, 1.9.0, 1.10.1, 1.10.2, 2.0.0]
    }
}`,
          hints: ['Сравните каждую часть через Integer.parseInt()', 'Если части не равны — вернуть разницу, иначе перейти к следующей']
        },
        {
          id: 'col_ch3_t25',
          difficulty: 'medium',
          title: 'Iterator с трансформацией',
          description: '<p>Реализуйте класс <code>MapIterator&lt;T, R&gt;</code>, который оборачивает итератор и применяет функцию преобразования к каждому элементу (аналог Stream.map).</p>',
          startCode: `import java.util.*;
import java.util.function.Function;

public class Main {
    static class MapIterator&lt;T, R&gt; implements Iterator&lt;R&gt; {
        private final Iterator&lt;T&gt; source;
        private final Function&lt;T, R&gt; mapper;

        MapIterator(Iterator&lt;T&gt; source, Function&lt;T, R&gt; mapper) {
            this.source = source;
            this.mapper = mapper;
        }

        public boolean hasNext() { return source.hasNext(); }

        public R next() {
            // Примените mapper к следующему элементу
            return null;
        }
    }

    public static void main(String[] args) {
        List&lt;String&gt; words = Arrays.asList("hello", "world", "java");
        Iterator&lt;Integer&gt; lengths = new MapIterator&lt;&gt;(words.iterator(), String::length);
        while (lengths.hasNext()) System.out.print(lengths.next() + " ");
        // Ожидается: 5 5 4
    }
}`,
          hints: ['next() вызывает mapper.apply(source.next())', 'hasNext() делегируется source.hasNext()']
        },
        {
          id: 'col_ch3_t26',
          difficulty: 'hard',
          title: 'Внешняя сортировка слиянием',
          description: '<p>Реализуйте внешнюю сортировку для большого набора данных: разбейте список на чанки, отсортируйте каждый, затем слейте через очередь итераторов с использованием <code>PriorityQueue</code>.</p>',
          startCode: `import java.util.*;

public class Main {
    public static List&lt;Integer&gt; externalSort(List&lt;Integer&gt; data, int chunkSize) {
        List&lt;List&lt;Integer&gt;&gt; chunks = new ArrayList&lt;&gt;();

        // 1. Разбейте на чанки и отсортируйте каждый
        for (int i = 0; i &lt; data.size(); i += chunkSize) {
            List&lt;Integer&gt; chunk = new ArrayList&lt;&gt;(
                data.subList(i, Math.min(i + chunkSize, data.size()))
            );
            Collections.sort(chunk);
            chunks.add(chunk);
        }

        // 2. Слейте через PriorityQueue итераторов
        // PQ хранит [значение, индекс_чанка, итератор]
        PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;(Comparator.comparingInt(a -&gt; a[0]));
        List&lt;Iterator&lt;Integer&gt;&gt; iterators = new ArrayList&lt;&gt;();

        // Инициализируйте PQ первыми элементами каждого чанка
        // Слейте все чанки в результат
        return new ArrayList&lt;&gt;();
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; data = Arrays.asList(5,3,8,1,9,2,7,4,6,0);
        System.out.println(externalSort(data, 3));
        // Ожидается: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}`,
          hints: ['PQ хранит [значение, индекс_итератора]', 'После извлечения из PQ продвиньте соответствующий итератор']
        },
        {
          id: 'col_ch3_t27',
          difficulty: 'hard',
          title: 'Компаратор для топологического порядка',
          description: '<p>Реализуйте компаратор, который сортирует задачи с учётом зависимостей (задача A должна идти раньше, если B зависит от A). Используйте топологическую сортировку как основу.</p>',
          startCode: `import java.util.*;

public class Main {
    public static List&lt;String&gt; sortWithDependencies(
        List&lt;String&gt; tasks, Map&lt;String, Set&lt;String&gt;&gt; deps) {

        Map&lt;String, Integer&gt; inDegree = new HashMap&lt;&gt;();
        for (String t : tasks) inDegree.put(t, 0);

        for (String task : deps.keySet()) {
            for (String dep : deps.get(task)) {
                inDegree.merge(task, 1, Integer::sum);
            }
        }

        Queue&lt;String&gt; queue = new ArrayDeque&lt;&gt;();
        for (String t : tasks) {
            if (inDegree.get(t) == 0) queue.offer(t);
        }

        List&lt;String&gt; result = new ArrayList&lt;&gt;();
        // Завершите алгоритм
        return result;
    }

    public static void main(String[] args) {
        List&lt;String&gt; tasks = Arrays.asList("Тест", "Разработка", "Дизайн", "Деплой");
        Map&lt;String, Set&lt;String&gt;&gt; deps = new HashMap&lt;&gt;();
        deps.put("Тест", Set.of("Разработка"));
        deps.put("Разработка", Set.of("Дизайн"));
        deps.put("Деплой", Set.of("Тест"));
        System.out.println(sortWithDependencies(tasks, deps));
    }
}`,
          hints: ['После обработки задачи уменьшайте inDegree её зависимых', 'Нужно построить обратный граф: если B зависит от A, A -> B']
        },
        {
          id: 'col_ch3_t28',
          difficulty: 'hard',
          title: 'Skip Iterator',
          description: '<p>Реализуйте <code>SkipIterator</code>, который пропускает каждый n-й элемент из исходного итератора. Например, при n=2 выдаёт элементы с индексами 0, 2, 4, 6...</p>',
          startCode: `import java.util.*;

public class Main {
    static class SkipIterator&lt;T&gt; implements Iterator&lt;T&gt; {
        private final Iterator&lt;T&gt; source;
        private final int skipEvery;
        private T nextItem;
        private boolean hasNext;

        SkipIterator(Iterator&lt;T&gt; source, int skipEvery) {
            this.source = source;
            this.skipEvery = skipEvery;
            // Инициализируйте
        }

        // Реализуйте hasNext() и next()
        public boolean hasNext() { return false; }
        public T next() { return null; }
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; nums = Arrays.asList(0,1,2,3,4,5,6,7,8,9);
        // Пропустить каждый 2-й (индексы 1, 3, 5, 7, 9)
        Iterator&lt;Integer&gt; it = new SkipIterator&lt;&gt;(nums.iterator(), 2);
        while (it.hasNext()) System.out.print(it.next() + " ");
        // Ожидается: 0 2 4 6 8
    }
}`,
          hints: ['Храните счётчик позиции', 'В advance() пропускайте элементы, когда позиция % skipEvery == skipEvery-1']
        },
        {
          id: 'col_ch3_t29',
          difficulty: 'hard',
          title: 'Компаратор для IP-адресов',
          description: '<p>Реализуйте компаратор для сортировки IPv4-адресов в числовом порядке. Адрес "10.20.30.40" должен быть меньше "10.20.30.41".</p>',
          startCode: `import java.util.*;

public class Main {
    public static Comparator&lt;String&gt; ipComparator() {
        return (ip1, ip2) -&gt; {
            // Разбейте по точке, сравните каждый октет числово
            return 0;
        };
    }

    public static void main(String[] args) {
        List&lt;String&gt; ips = new ArrayList&lt;&gt;(Arrays.asList(
            "192.168.1.100",
            "10.0.0.1",
            "192.168.1.1",
            "172.16.0.1",
            "10.0.0.255"
        ));
        ips.sort(ipComparator());
        ips.forEach(System.out::println);
    }
}`,
          hints: ['split("\\\\.") разбивает по точке (точка — спецсимвол в regex)', 'Сравнивайте Integer.parseInt(parts1[i]) с Integer.parseInt(parts2[i])']
        },
        {
          id: 'col_ch3_t30',
          difficulty: 'hard',
          title: 'Lazy Iterator — генерация на лету',
          description: '<p>Реализуйте ленивый итератор <code>InfiniteRange</code>, генерирующий числа начиная с заданного значения без ограничений. Реализуйте метод <code>take(n)</code> для получения первых n элементов.</p>',
          startCode: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    static class InfiniteRange implements Iterable&lt;Long&gt; {
        private final long start;

        InfiniteRange(long start) { this.start = start; }

        @Override
        public Iterator&lt;Long&gt; iterator() {
            return new Iterator&lt;Long&gt;() {
                long current = start;
                public boolean hasNext() { return true; }
                public Long next() { return current++; }
            };
        }

        public List&lt;Long&gt; take(int n) {
            // Возьмите первые n элементов из итератора
            return new ArrayList&lt;&gt;();
        }
    }

    public static void main(String[] args) {
        InfiniteRange range = new InfiniteRange(5);
        System.out.println(range.take(10));
        // Ожидается: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

        // Четные числа начиная с 0
        Iterator&lt;Long&gt; it = new InfiniteRange(0).iterator();
        List&lt;Long&gt; evens = new ArrayList&lt;&gt;();
        while (evens.size() &lt; 5) {
            long n = it.next();
            if (n % 2 == 0) evens.add(n);
        }
        System.out.println(evens); // [0, 2, 4, 6, 8]
    }
}`,
          hints: ['take(n) создаёт новый итератор и собирает n элементов', 'hasNext() всегда возвращает true — бесконечный итератор']
        }
      ]
    }
  ]
});
