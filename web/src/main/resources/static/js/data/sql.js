'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'sql',
  title: 'SQL и базы данных',
  icon: '🗄️',
  description: 'SELECT, JOIN, агрегатные функции, индексы, транзакции, MVCC, оптимизация',
  color: '#0ea5e9',
  chapters: [

    /* ═══════════ Ch1: Введение ═══════════ */
    {
      id: 'sql_ch0',
      title: 'Введение в базы данных',
      lecture: `<h2>Что такое базы данных?</h2>
<p><strong>База данных (БД)</strong> — организованная коллекция данных, хранимая и управляемая СУБД.</p>
<p><strong>СУБД</strong> (система управления базами данных) — программное обеспечение для создания, хранения и управления БД. Примеры: PostgreSQL, MySQL, Oracle, SQLite, MS SQL Server.</p>

<h3>Реляционная модель</h3>
<p>Данные хранятся в <strong>таблицах</strong> (отношениях). Каждая таблица — строки (записи) и столбцы (атрибуты).</p>
<pre><code>Таблица employees:
┌────┬───────────┬────────┬──────────────┐
│ id │   name    │ salary │  department  │
├────┼───────────┼────────┼──────────────┤
│  1 │  Alice    │  75000 │  IT          │
│  2 │  Bob      │  45000 │  HR          │
│  3 │  Charlie  │  90000 │  IT          │
└────┴───────────┴────────┴──────────────┘</code></pre>

<h3>Ключевые понятия</h3>
<ul>
<li><strong>Первичный ключ (PRIMARY KEY)</strong> — уникально идентифицирует каждую строку (обычно id)</li>
<li><strong>Внешний ключ (FOREIGN KEY)</strong> — ссылка на первичный ключ другой таблицы</li>
<li><strong>Схема</strong> — структура БД: таблицы, типы данных, ограничения</li>
<li><strong>Запрос (query)</strong> — инструкция на SQL для получения или изменения данных</li>
</ul>

<h3>SQL — язык запросов</h3>
<p>SQL (Structured Query Language) — декларативный язык. Вы описываете <em>что</em> хотите получить, а не <em>как</em>.</p>
<pre><code>-- Получить всех сотрудников из IT с зарплатой > 60000
SELECT name, salary
FROM   employees
WHERE  department = 'IT'
  AND  salary > 60000
ORDER BY salary DESC;</code></pre>

<h3>Типы данных PostgreSQL</h3>
<table>
<tr><th>Категория</th><th>Типы</th><th>Пример</th></tr>
<tr><td>Числа</td><td>INTEGER, BIGINT, DECIMAL(p,s), NUMERIC, FLOAT</td><td>42, 3.14</td></tr>
<tr><td>Строки</td><td>VARCHAR(n), TEXT, CHAR(n)</td><td>'Alice'</td></tr>
<tr><td>Дата/время</td><td>DATE, TIME, TIMESTAMP, INTERVAL</td><td>'2024-01-15'</td></tr>
<tr><td>Булев</td><td>BOOLEAN</td><td>TRUE / FALSE</td></tr>
<tr><td>UUID</td><td>UUID</td><td>'a0ee-bc99-...'</td></tr>
<tr><td>JSON</td><td>JSON, JSONB</td><td>{"key": "val"}</td></tr>
</table>`,
      tasks: [
        {
          id: 'sql_intro_t1', title: 'Симуляция таблицы', difficulty: 'easy',
          description: '<p>Смоделируйте таблицу <code>employees</code> в виде массива строк. Выведите "шапку" таблицы и все записи в форматированном виде.</p>',
          hints: ['String.format("%-5d %-12s %8.0f  %s", ...)', 'Выведите заголовок отдельно'],
          startCode: `public class Main {
    public static void main(String[] args) {
        // Таблица employees: id, name, salary, department
        int[]    ids  = {1, 2, 3, 4, 5};
        String[] name = {"Alice","Bob","Charlie","Diana","Eve"};
        double[] sal  = {75000, 45000, 90000, 55000, 65000};
        String[] dept = {"IT","HR","IT","Sales","IT"};

        // Выведите заголовок и все строки таблицы
        System.out.println("id    name          salary  department");
        System.out.println("----  ------------  ------  ----------");
        for (int i = 0; i < ids.length; i++) {
            System.out.printf("%-5d %-12s %8.0f  %s%n",
                ids[i], name[i], sal[i], dept[i]);
        }
    }
}`
        },
        {
          id: 'sql_intro_t2', title: 'Первичный и внешний ключ', difficulty: 'easy',
          description: '<p>Смоделируйте две связанные таблицы: <code>departments</code> (id, name) и <code>employees</code> (id, name, dept_id). Проверьте ссылочную целостность: выведите сотрудников, у которых dept_id не существует в таблице departments.</p>',
          hints: ['Set<Integer> validDeptIds — множество корректных id', 'Если !validDeptIds.contains(deptId) — нарушение'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Таблица departments (id, name)
        int[]    deptId   = {10, 20, 30};
        String[] deptName = {"IT", "HR", "Sales"};

        // Таблица employees (id, name, dept_id)
        int[]    empId    = {1, 2, 3, 4};
        String[] empName  = {"Alice", "Bob", "Charlie", "Diana"};
        int[]    empDept  = {10, 20, 99, 30}; // 99 — несуществующий отдел!

        // Соберите множество корректных dept_id
        Set<Integer> validDeptIds = new HashSet<>();
        for (int id : deptId) validDeptIds.add(id);

        // Найдите нарушения ссылочной целостности
        System.out.println("Нарушения FOREIGN KEY:");
        for (int i = 0; i < empId.length; i++) {
            if (!validDeptIds.contains(empDept[i])) {
                System.out.println("  Сотрудник " + empName[i] +
                    " ссылается на несуществующий dept_id=" + empDept[i]);
            }
        }
    }
}`
        }
      ]
    },

    /* ═══════════ Ch2: SELECT ═══════════ */
    {
      id: 'sql_ch1',
      title: 'SELECT — основы выборки данных',
      lecture: `<h2>SELECT — основной оператор выборки</h2>
<h3>Порядок выполнения SELECT</h3>
<pre><code>SELECT   столбцы / выражения          -- 6. выбрать столбцы
FROM     таблица                       -- 1. из какой таблицы
WHERE    условие                       -- 2. фильтр строк
GROUP BY столбцы                       -- 3. группировка
HAVING   условие_на_группу             -- 4. фильтр групп
ORDER BY столбцы [ASC|DESC]            -- 5. сортировка
LIMIT    n  OFFSET  m;                 -- 7. пагинация</code></pre>

<h3>Базовые примеры</h3>
<pre><code>-- Все столбцы (избегайте SELECT * в продакшне — лишние данные)
SELECT * FROM employees;

-- Конкретные столбцы
SELECT first_name, last_name, salary FROM employees;

-- Вычисляемые поля
SELECT first_name,
       salary * 12           AS annual_salary,
       salary * 0.13         AS tax,
       salary - salary*0.13  AS net_salary
FROM employees;

-- Псевдоним таблицы
SELECT e.first_name, e.salary
FROM employees AS e;  -- или просто: FROM employees e</code></pre>

<h3>DISTINCT — уникальные значения</h3>
<pre><code>SELECT DISTINCT department FROM employees;
-- Если комбинация:
SELECT DISTINCT department, position FROM employees;</code></pre>

<h3>LIMIT, OFFSET — пагинация</h3>
<pre><code>-- Первые 10 записей
SELECT * FROM employees LIMIT 10;

-- Страница 3 (по 10 записей на страницу): пропустить первые 20
SELECT * FROM employees
ORDER BY id
LIMIT 10 OFFSET 20;

-- TOP (MS SQL Server / старый синтаксис)
SELECT TOP 5 * FROM employees;</code></pre>

<h3>NULL — особый тип</h3>
<pre><code>-- NULL — отсутствие значения. Сравнение: IS NULL / IS NOT NULL
SELECT * FROM employees WHERE manager_id IS NULL;    -- без менеджера
SELECT * FROM employees WHERE email IS NOT NULL;      -- с email

-- NULL в выражениях: любое арифметическое с NULL = NULL
SELECT 5 + NULL;  -- NULL
-- COALESCE возвращает первое не-NULL значение
SELECT COALESCE(bonus, 0) AS bonus FROM employees;</code></pre>`,
      tasks: [
        {
          id: 'sql_t1', title: 'Фильтрация сотрудников', difficulty: 'easy',
          description: '<p>Из массива сотрудников <code>"Имя,Зарплата,Отдел"</code> выведите всех из отдела "IT" с зарплатой > 60000 (имитация WHERE).</p>',
          hints: ['split(",") — разбить строку', 'Integer.parseInt(parts[1]) для зарплаты'],
          startCode: `public class Main {
    public static void main(String[] args) {
        String[] employees = {
            "Alice,75000,IT","Bob,45000,HR","Charlie,90000,IT",
            "Diana,55000,Sales","Eve,65000,IT","Frank,40000,HR"
        };
        // SELECT * FROM employees WHERE department='IT' AND salary>60000
        System.out.println("Имя        Зарплата  Отдел");
        for (String emp : employees) {
            String[] p = emp.split(",");
            String name = p[0]; int sal = Integer.parseInt(p[1]); String dept = p[2];
            if (dept.equals("IT") && sal > 60000) {
                System.out.printf("%-10s %8d  %s%n", name, sal, dept);
            }
        }
    }
}`
        },
        {
          id: 'sql_t1b', title: 'SELECT с вычисляемыми полями', difficulty: 'easy',
          description: '<p>Для каждого сотрудника вычислите: годовую зарплату (×12), налог (13%) и зарплату на руки. Выведите как вычисляемые столбцы (аналог SELECT salary*12 AS annual).</p>',
          hints: ['annual = salary * 12', 'net = salary * (1 - 0.13)'],
          startCode: `public class Main {
    public static void main(String[] args) {
        String[] data = {"Alice,75000","Bob,45000","Charlie,90000"};
        System.out.printf("%-10s %10s %10s %10s%n","Имя","Годовая","Налог","На руки");
        System.out.println("-".repeat(44));
        for (String row : data) {
            String[] p    = row.split(",");
            String   name = p[0];
            double   sal  = Double.parseDouble(p[1]);
            // вычислите annual, tax, net
            double annual = sal * 12;
            double tax    = sal * 0.13;
            double net    = sal - tax;
            System.out.printf("%-10s %10.0f %10.0f %10.0f%n", name, annual, tax, net);
        }
    }
}`
        },
        {
          id: 'sql_t2', title: 'SELECT DISTINCT', difficulty: 'easy',
          description: '<p>Из списка выведите уникальные отделы (SELECT DISTINCT department). Используйте LinkedHashSet для сохранения порядка первого появления.</p>',
          hints: ['LinkedHashSet<String> сохраняет порядок вставки'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] employees = {
            "Alice,IT","Bob,HR","Charlie,IT","Diana,Sales","Eve,IT","Frank,HR"
        };
        // SELECT DISTINCT department FROM employees
        Set<String> departments = new LinkedHashSet<>();
        for (String emp : employees) {
            departments.add(emp.split(",")[1]);
        }
        System.out.println("Уникальные отделы:");
        departments.forEach(System.out::println);
    }
}`
        },
        {
          id: 'sql_t3', title: 'LIMIT и OFFSET (пагинация)', difficulty: 'medium',
          description: '<p>Реализуйте пагинацию: отсортируйте сотрудников по зарплате DESC и выведите страницу (pageNum=2, pageSize=2). Формула offset = (page-1)*pageSize.</p>',
          hints: ['offset = (pageNum - 1) * pageSize', 'Arrays.sort с компаратором по зарплате'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] emp = {
            "Alice,75000","Bob,45000","Charlie,90000",
            "Diana,55000","Eve,65000","Frank,40000"
        };
        int pageNum = 2, pageSize = 2;
        // Сортировка по зарплате DESC
        Arrays.sort(emp, (a, b) ->
            Integer.parseInt(b.split(",")[1]) - Integer.parseInt(a.split(",")[1]));

        int offset = (pageNum - 1) * pageSize;
        System.out.println("Страница " + pageNum + " (LIMIT " + pageSize + " OFFSET " + offset + "):");
        for (int i = offset; i < Math.min(offset + pageSize, emp.length); i++) {
            System.out.println("  " + emp[i]);
        }
    }
}`
        }
      ]
    },

    /* ═══════════ Ch3: Фильтрация ═══════════ */
    {
      id: 'sql_ch1b',
      title: 'Фильтрация и сортировка',
      lecture: `<h2>WHERE — фильтрация строк</h2>

<h3>Операторы сравнения</h3>
<pre><code>WHERE salary = 50000      -- равно
WHERE salary != 50000     -- не равно (или <>)
WHERE salary > 50000      -- больше
WHERE salary >= 50000     -- больше или равно
WHERE salary < 50000
WHERE salary <= 50000</code></pre>

<h3>Логические операторы</h3>
<pre><code>-- AND — оба условия должны быть true
WHERE department = 'IT' AND salary > 60000

-- OR — хотя бы одно условие
WHERE department = 'IT' OR department = 'HR'

-- NOT — инвертирует условие
WHERE NOT department = 'Sales'

-- Приоритет: NOT > AND > OR
-- Всегда используйте скобки для ясности:
WHERE (department = 'IT' OR department = 'HR')
  AND salary > 50000</code></pre>

<h3>LIKE — поиск по шаблону</h3>
<pre><code>WHERE name LIKE 'A%'       -- начинается с A
WHERE name LIKE '%son'     -- заканчивается на son
WHERE name LIKE '%ali%'    -- содержит ali (регистрозависимо)
WHERE name ILIKE '%ali%'   -- PostgreSQL: без учёта регистра
WHERE phone LIKE '7_________'  -- 7 + ровно 9 символов
-- % — любое количество символов (включая 0)
-- _ — ровно один символ</code></pre>

<h3>IN — список значений</h3>
<pre><code>WHERE department IN ('IT', 'HR', 'Sales')
-- Эквивалентно: WHERE dep='IT' OR dep='HR' OR dep='Sales'

WHERE id NOT IN (1, 2, 3)

-- IN с подзапросом:
WHERE dept_id IN (SELECT id FROM departments WHERE budget > 100000)</code></pre>

<h3>BETWEEN — диапазон</h3>
<pre><code>WHERE salary BETWEEN 40000 AND 80000
-- Включает оба конца: salary >= 40000 AND salary <= 80000

WHERE hire_date BETWEEN '2020-01-01' AND '2022-12-31'
WHERE salary NOT BETWEEN 40000 AND 80000</code></pre>

<h3>ORDER BY — сортировка</h3>
<pre><code>ORDER BY salary DESC              -- по убыванию
ORDER BY department ASC, salary DESC  -- сначала по отделу, потом по зарплате
ORDER BY 2 DESC                   -- по 2-му столбцу (нежелательно)
ORDER BY salary DESC NULLS LAST   -- NULL в конце (PostgreSQL)</code></pre>`,
      tasks: [
        {
          id: 'sql_f_t1', title: 'LIKE паттерны', difficulty: 'easy',
          description: '<p>Найдите всех сотрудников, чьё имя начинается на "A" (аналог LIKE "A%") И содержит букву "i" (LIKE "%i%").</p>',
          hints: ['name.startsWith("A")', 'name.contains("i")'],
          startCode: `public class Main {
    public static void main(String[] args) {
        String[] names = {"Alice","Bob","Anna","Charlie","Alicia","David","Abigail"};
        // WHERE name LIKE 'A%' AND name LIKE '%i%'
        System.out.println("Имена на A с буквой i:");
        for (String n : names) {
            if (n.startsWith("A") && n.contains("i")) {
                System.out.println("  " + n);
            }
        }
    }
}`
        },
        {
          id: 'sql_f_t2', title: 'IN и BETWEEN', difficulty: 'easy',
          description: '<p>Выведите сотрудников, у которых отдел входит в список {"IT","Sales"} (IN) И зарплата в диапазоне 50000–80000 (BETWEEN).</p>',
          hints: ['dept.equals("IT") || dept.equals("Sales")', 'sal >= 50000 && sal <= 80000'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[][] emp = {
            {"Alice","75000","IT"},{"Bob","45000","HR"},
            {"Charlie","90000","IT"},{"Diana","55000","Sales"},
            {"Eve","65000","Sales"},{"Frank","40000","HR"}
        };
        // WHERE department IN ('IT','Sales') AND salary BETWEEN 50000 AND 80000
        Set<String> depts = new HashSet<>(Arrays.asList("IT","Sales"));
        for (String[] e : emp) {
            int sal = Integer.parseInt(e[1]);
            if (depts.contains(e[2]) && sal >= 50000 && sal <= 80000) {
                System.out.printf("%-10s %6d  %s%n", e[0], sal, e[2]);
            }
        }
    }
}`
        },
        {
          id: 'sql_f_t3', title: 'ORDER BY нескольких полей', difficulty: 'medium',
          description: '<p>Отсортируйте сотрудников: сначала по отделу (ASC), затем по зарплате (DESC). Выведите первых 3.</p>',
          hints: ['Comparator.comparing(dept).thenComparing(sal DESC)', 'Arrays.sort с составным компаратором'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[][] emp = {
            {"Alice","75000","IT"},{"Bob","45000","HR"},
            {"Charlie","90000","IT"},{"Diana","55000","Sales"},
            {"Eve","65000","IT"},{"Frank","40000","HR"}
        };
        // ORDER BY department ASC, salary DESC  LIMIT 3
        Arrays.sort(emp, (a, b) -> {
            int cmp = a[2].compareTo(b[2]); // department ASC
            if (cmp != 0) return cmp;
            return Integer.parseInt(b[1]) - Integer.parseInt(a[1]); // salary DESC
        });
        System.out.println("department | name       | salary");
        for (int i = 0; i < 3; i++) {
            System.out.printf("%-10s   %-10s  %s%n", emp[i][2], emp[i][0], emp[i][1]);
        }
    }
}`
        }
      ]
    },

    /* ═══════════ Ch4: Агрегация ═══════════ */
    {
      id: 'sql_ch3',
      title: 'Агрегация и GROUP BY',
      lecture: `<h2>Агрегатные функции</h2>
<pre><code>SELECT COUNT(*)          -- количество всех строк
       COUNT(salary)      -- количество НЕ-NULL значений
       COUNT(DISTINCT department)   -- уникальные значения
       SUM(salary)        -- сумма
       AVG(salary)        -- среднее
       MIN(salary)        -- минимум
       MAX(salary)        -- максимум
FROM employees;</code></pre>

<h3>GROUP BY — группировка</h3>
<pre><code>-- Количество сотрудников и средняя зарплата по отделам
SELECT   department,
         COUNT(*)        AS emp_count,
         AVG(salary)     AS avg_salary,
         SUM(salary)     AS total_payroll,
         MAX(salary)     AS top_salary
FROM     employees
GROUP BY department
ORDER BY avg_salary DESC;</code></pre>

<h3>HAVING — фильтр после группировки</h3>
<pre><code>-- Отделы, где средняя зарплата > 60000
SELECT   department, AVG(salary) AS avg_sal
FROM     employees
GROUP BY department
HAVING   AVG(salary) > 60000;

-- WHERE vs HAVING:
-- WHERE  — фильтрует строки ДО группировки
-- HAVING — фильтрует группы ПОСЛЕ GROUP BY

SELECT department, COUNT(*) AS cnt
FROM   employees
WHERE  hire_date > '2020-01-01'   -- убираем до GROUP BY
GROUP BY department
HAVING COUNT(*) >= 3;             -- фильтруем группы</code></pre>

<h3>ROLLUP и CUBE (PostgreSQL)</h3>
<pre><code>-- ROLLUP: итоги по иерархии
SELECT department, position, SUM(salary)
FROM employees
GROUP BY ROLLUP(department, position);
-- Добавляет строки с промежуточными итогами (NULL = итог)

-- CUBE: все возможные комбинации
SELECT department, position, SUM(salary)
FROM employees
GROUP BY CUBE(department, position);</code></pre>`,
      tasks: [
        {
          id: 'sql_t6', title: 'COUNT и SUM', difficulty: 'easy',
          description: '<p>Из списка транзакций посчитайте: количество, сумму доходов, сумму расходов, максимальную операцию.</p>',
          hints: ['if (type.equals("income")) incomeSum += amount'],
          startCode: `public class Main {
    public static void main(String[] args) {
        String[] tx = {
            "1,1000,income","2,500,expense","3,2000,income",
            "4,300,expense","5,1500,income","6,800,expense"
        };
        int count = 0;
        double incomeSum = 0, expenseSum = 0, maxTx = 0;
        for (String t : tx) {
            String[] p = t.split(",");
            double amount = Double.parseDouble(p[1]);
            count++;
            maxTx = Math.max(maxTx, amount);
            if (p[2].equals("income"))  incomeSum  += amount;
            else                        expenseSum += amount;
        }
        System.out.println("COUNT: " + count);
        System.out.println("SUM income:  " + incomeSum);
        System.out.println("SUM expense: " + expenseSum);
        System.out.println("MAX: " + maxTx);
    }
}`
        },
        {
          id: 'sql_t7', title: 'GROUP BY + HAVING', difficulty: 'medium',
          description: '<p>Сгруппируйте продукты по категории: COUNT, AVG price. Выведите только категории, где AVG price > 100 (аналог HAVING).</p>',
          hints: ['Map<String, List<Double>> groups', 'groups.computeIfAbsent(cat, k -> new ArrayList<>()).add(price)'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] products = {
            "iPhone,Electronics,999","Laptop,Electronics,1299",
            "Shirt,Clothing,29","Pants,Clothing,59",
            "Tablet,Electronics,499","Jacket,Clothing,149","Pen,Office,5"
        };
        Map<String, List<Double>> groups = new HashMap<>();
        for (String p : products) {
            String[] parts = p.split(",");
            groups.computeIfAbsent(parts[1], k -> new ArrayList<>())
                  .add(Double.parseDouble(parts[2]));
        }
        // HAVING avg_price > 100
        System.out.println("Категория      COUNT    AVG");
        groups.forEach((cat, prices) -> {
            double avg = prices.stream().mapToDouble(x->x).average().orElse(0);
            if (avg > 100) {
                System.out.printf("%-15s %5d  %.2f%n", cat, prices.size(), avg);
            }
        });
    }
}`
        },
        {
          id: 'sql_t7b', title: 'ROLLUP — итоговые строки', difficulty: 'hard',
          description: '<p>Симулируйте GROUP BY ROLLUP: выведите количество сотрудников по (отдел, должность), потом итог по отделу, потом общий итог.</p>',
          hints: ['TreeMap для упорядочивания', 'После вывода групп добавьте строку с итогом по отделу'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[][] emp = {
            {"Alice","IT","Dev"},{"Bob","IT","Dev"},{"Charlie","IT","Lead"},
            {"Diana","HR","Manager"},{"Eve","HR","Analyst"},{"Frank","Sales","Manager"}
        };
        // GROUP BY ROLLUP(department, position)
        Map<String, Map<String, Integer>> rollup = new TreeMap<>();
        for (String[] e : emp) {
            rollup.computeIfAbsent(e[1], k -> new TreeMap<>())
                  .merge(e[2], 1, Integer::sum);
        }
        int grandTotal = 0;
        for (var dEntry : rollup.entrySet()) {
            int deptTotal = 0;
            for (var pEntry : dEntry.getValue().entrySet()) {
                System.out.printf("  %-8s  %-10s  %d%n",
                    dEntry.getKey(), pEntry.getKey(), pEntry.getValue());
                deptTotal += pEntry.getValue();
            }
            System.out.printf("  %-8s  %-10s  %d  ← итог по отделу%n",
                dEntry.getKey(), "NULL", deptTotal);
            grandTotal += deptTotal;
        }
        System.out.printf("  %-8s  %-10s  %d  ← общий итог%n", "NULL","NULL",grandTotal);
    }
}`
        }
      ]
    },

    /* ═══════════ Ch5: JOIN ═══════════ */
    {
      id: 'sql_ch2',
      title: 'JOIN — основные соединения',
      lecture: `<h2>JOIN — объединение таблиц</h2>
<p>JOIN соединяет строки из двух таблиц по условию. Основа реляционной модели.</p>

<h3>Типы JOIN — визуализация</h3>
<pre><code>Employees:     Departments:
id | dept_id    id | name
1  |  10        10 | IT
2  |  20        20 | HR
3  |  99        30 | Sales  (сотрудника нет)
(dept_id=99 — нет такого отдела)

INNER JOIN — только совпадающие:
  Emp 1 → IT, Emp 2 → HR  (Emp 3 и Sales выпадают)

LEFT JOIN — все из левой таблицы:
  Emp 1 → IT, Emp 2 → HR, Emp 3 → NULL

RIGHT JOIN — все из правой:
  Emp 1 → IT, Emp 2 → HR, NULL → Sales

FULL OUTER JOIN — все из обеих:
  Emp 1 → IT, Emp 2 → HR, Emp 3 → NULL, NULL → Sales</code></pre>

<h3>Синтаксис</h3>
<pre><code>-- INNER JOIN
SELECT e.name, d.dept_name
FROM   employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN
SELECT e.name, COALESCE(d.dept_name, 'Без отдела') AS dept
FROM   employees e
LEFT  JOIN departments d ON e.dept_id = d.id;

-- FULL OUTER JOIN
SELECT e.name, d.dept_name
FROM   employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;

-- Несколько JOIN
SELECT e.name, d.dept_name, p.project_name
FROM   employees e
JOIN   departments d ON e.dept_id     = d.id
JOIN   projects    p ON e.project_id  = p.id;</code></pre>

<h3>Псевдонимы и квалификация</h3>
<pre><code>-- При одинаковых именах столбцов — квалификатор обязателен
SELECT e.id, e.name, d.id AS dept_id, d.name AS dept_name
FROM   employees e
JOIN   departments d ON e.dept_id = d.id;</code></pre>`,
      tasks: [
        {
          id: 'sql_t4', title: 'INNER JOIN в Java', difficulty: 'medium',
          description: '<p>Смоделируйте INNER JOIN: выведите имя сотрудника и название его отдела, только если отдел существует.</p>',
          hints: ['HashMap<String,String> deptMap — ключ deptId', 'deptMap.containsKey(deptId) — проверка'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] employees   = {"1,Alice,10","2,Bob,20","3,Charlie,99","4,Diana,30"};
        String[] departments = {"10,IT","20,HR","30,Sales"};

        Map<String,String> deptMap = new HashMap<>();
        for (String d : departments) {
            String[] p = d.split(",");
            deptMap.put(p[0], p[1]);
        }
        // INNER JOIN — только строки с совпадением
        System.out.println("Имя        Отдел");
        for (String e : employees) {
            String[] p = e.split(",");
            if (deptMap.containsKey(p[2])) {
                System.out.printf("%-10s %s%n", p[1], deptMap.get(p[2]));
            }
        }
    }
}`
        },
        {
          id: 'sql_t5', title: 'LEFT JOIN — сотрудники без отдела', difficulty: 'medium',
          description: '<p>LEFT JOIN: выведите ВСЕХ сотрудников. Если отдел не найден — выведите "Без отдела".</p>',
          hints: ['deptMap.getOrDefault(deptId, "Без отдела")'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] employees   = {"1,Alice,10","2,Bob,20","3,Charlie,99","4,Diana,10"};
        String[] departments = {"10,IT","20,HR"};

        Map<String,String> deptMap = new HashMap<>();
        for (String d : departments) {
            String[] p = d.split(","); deptMap.put(p[0], p[1]);
        }
        // LEFT JOIN — все сотрудники
        System.out.println("Имя        Отдел");
        for (String e : employees) {
            String[] p = e.split(",");
            String dept = deptMap.getOrDefault(p[2], "Без отдела");
            System.out.printf("%-10s %s%n", p[1], dept);
        }
    }
}`
        },
        {
          id: 'sql_t5b', title: 'FULL OUTER JOIN', difficulty: 'hard',
          description: '<p>Смоделируйте FULL OUTER JOIN: покажите все пары, включая сотрудников без отдела и отделы без сотрудников.</p>',
          hints: ['Сначала выведите LEFT JOIN', 'Потом найдите отделы без сотрудников (dept_id не встречается у сотрудников)'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] employees   = {"1,Alice,10","2,Bob,20","3,Charlie,99"};
        String[] departments = {"10,IT","20,HR","30,Sales"};

        Map<String,String> deptMap  = new HashMap<>();
        Set<String>        usedDept = new HashSet<>();
        for (String d : departments) {
            String[] p = d.split(","); deptMap.put(p[0], p[1]);
        }
        System.out.println("Сотрудник     Отдел");
        // LEFT side: все сотрудники
        for (String e : employees) {
            String[] p = e.split(",");
            String dept = deptMap.getOrDefault(p[2], "NULL");
            System.out.printf("%-13s %s%n", p[1], dept);
            if (deptMap.containsKey(p[2])) usedDept.add(p[2]);
        }
        // RIGHT side: отделы без сотрудников
        for (String d : departments) {
            String[] p = d.split(",");
            if (!usedDept.contains(p[0])) {
                System.out.printf("%-13s %s%n", "NULL", p[1]);
            }
        }
    }
}`
        }
      ]
    },

    /* ═══════════ Ch6: Углублённые JOIN ═══════════ */
    {
      id: 'sql_ch6',
      title: 'Углублённые JOIN и операции над множествами',
      lecture: `<h2>Углублённые JOIN</h2>

<h3>CROSS JOIN — декартово произведение</h3>
<pre><code>-- Каждая строка таблицы A × каждая строка таблицы B
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c;
-- Результат: S-Red, S-Blue, M-Red, M-Blue, L-Red, L-Blue...
-- Используется для генерации всех комбинаций</code></pre>

<h3>SELF JOIN — соединение с собой</h3>
<pre><code>-- Найти менеджеров: employees ссылается на себя через manager_id
SELECT e.name AS employee, m.name AS manager
FROM   employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Пары сотрудников в одном отделе
SELECT a.name, b.name
FROM   employees a
JOIN   employees b ON a.dept_id = b.dept_id AND a.id < b.id;</code></pre>

<h3>SEMI JOIN — WHERE EXISTS</h3>
<pre><code>-- Сотрудники, у которых есть хотя бы один проект
SELECT e.name
FROM   employees e
WHERE  EXISTS (
    SELECT 1
    FROM   projects p
    WHERE  p.employee_id = e.id
);
-- Не дублирует строки (в отличие от JOIN)</code></pre>

<h3>ANTI JOIN — LEFT JOIN ... WHERE IS NULL</h3>
<pre><code>-- Сотрудники БЕЗ проектов
SELECT e.name
FROM   employees e
LEFT JOIN projects p ON p.employee_id = e.id
WHERE  p.id IS NULL;
-- Альтернатива: WHERE NOT EXISTS (...)</code></pre>

<h3>Операции над множествами</h3>
<pre><code>-- UNION — объединение (без дубликатов)
SELECT name FROM employees_2022
UNION
SELECT name FROM employees_2023;

-- UNION ALL — с дубликатами (быстрее)
SELECT ... UNION ALL SELECT ...;

-- INTERSECT — пересечение (только в обоих)
SELECT name FROM employees_2022
INTERSECT
SELECT name FROM employees_2023;

-- EXCEPT / MINUS — разность (есть в первом, нет во втором)
SELECT name FROM employees_2022
EXCEPT
SELECT name FROM employees_2023;
-- Правило: все запросы должны иметь одинаковое число столбцов</code></pre>`,
      tasks: [
        {
          id: 'sql_ch6_t1', title: 'CROSS JOIN — все комбинации', difficulty: 'easy',
          description: '<p>Симулируйте CROSS JOIN: выведите все комбинации размеров {S, M, L} и цветов {Red, Blue, Green}.</p>',
          hints: ['Два вложенных цикла: for size, for color'],
          startCode: `public class Main {
    public static void main(String[] args) {
        String[] sizes  = {"S", "M", "L"};
        String[] colors = {"Red", "Blue", "Green"};
        // CROSS JOIN — 3*3 = 9 комбинаций
        System.out.println("Size | Color");
        for (String s : sizes)
            for (String c : colors)
                System.out.println("  " + s + "  | " + c);
        System.out.println("Всего: " + sizes.length * colors.length + " строк");
    }
}`
        },
        {
          id: 'sql_ch6_t2', title: 'SELF JOIN — иерархия менеджеров', difficulty: 'medium',
          description: '<p>Смоделируйте SELF JOIN: выведите пары сотрудник–менеджер. Данные: id,name,manager_id (NULL = директор).</p>',
          hints: ['Map<Integer,String> idToName', 'manager_id = -1 означает нет менеджера'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // id, name, manager_id (-1 = директор)
        int[]    id    = {1, 2, 3, 4, 5};
        String[] name  = {"CEO","Alice","Bob","Charlie","Diana"};
        int[]    mgr   = {-1,   1,     1,    2,        2};

        Map<Integer,String> idToName = new HashMap<>();
        for (int i = 0; i < id.length; i++) idToName.put(id[i], name[i]);

        // SELECT e.name AS employee, m.name AS manager
        System.out.printf("%-10s %-10s%n", "Сотрудник","Менеджер");
        for (int i = 0; i < id.length; i++) {
            String mgrName = mgr[i] == -1 ? "—" : idToName.get(mgr[i]);
            System.out.printf("%-10s %-10s%n", name[i], mgrName);
        }
    }
}`
        },
        {
          id: 'sql_ch6_t3', title: 'INTERSECT и EXCEPT', difficulty: 'medium',
          description: '<p>Даны два списка имён (сотрудники 2022 и 2023). Найдите: 1) работавших в оба года (INTERSECT), 2) ушедших (в 2022, но не в 2023 — EXCEPT).</p>',
          hints: ['retainAll — пересечение', 'removeAll — разность'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Set<String> y2022 = new HashSet<>(Arrays.asList(
            "Alice","Bob","Charlie","Diana","Eve"));
        Set<String> y2023 = new HashSet<>(Arrays.asList(
            "Alice","Charlie","Frank","Grace","Eve"));

        // INTERSECT — работали оба года
        Set<String> intersect = new HashSet<>(y2022);
        intersect.retainAll(y2023);
        System.out.println("INTERSECT (оба года): " + new TreeSet<>(intersect));

        // EXCEPT — ушли (были в 2022, нет в 2023)
        Set<String> except = new HashSet<>(y2022);
        except.removeAll(y2023);
        System.out.println("EXCEPT (ушли в 2023): " + new TreeSet<>(except));

        // UNION ALL — все вместе с дубликатами
        List<String> unionAll = new ArrayList<>(y2022);
        unionAll.addAll(y2023);
        System.out.println("UNION ALL размер: " + unionAll.size());
    }
}`
        }
      ]
    },

    /* ═══════════ Ch7: DDL, DML, DQL, DCL, TCL ═══════════ */
    {
      id: 'sql_ch7',
      title: 'Классификация команд SQL (DDL, DML, DQL, DCL, TCL)',
      lecture: `<h2>Классификация команд SQL</h2>

<h3>DDL — Data Definition Language (определение структуры)</h3>
<pre><code>-- CREATE — создание объекта
CREATE TABLE employees (
    id         SERIAL        PRIMARY KEY,
    first_name VARCHAR(50)   NOT NULL,
    last_name  VARCHAR(50)   NOT NULL,
    email      VARCHAR(100)  UNIQUE,
    salary     DECIMAL(10,2) DEFAULT 0,
    dept_id    INTEGER       REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emp_dept ON employees(dept_id);
CREATE VIEW  senior_emp   AS SELECT * FROM employees WHERE salary > 80000;

-- ALTER — изменение структуры
ALTER TABLE employees ADD    COLUMN phone   VARCHAR(20);
ALTER TABLE employees DROP   COLUMN phone;
ALTER TABLE employees RENAME COLUMN salary TO monthly_salary;
ALTER TABLE employees ALTER  COLUMN salary TYPE NUMERIC(12,2);
ALTER TABLE employees ADD    CONSTRAINT chk_salary CHECK (salary >= 0);

-- DROP — удаление
DROP TABLE   employees;            -- удалить таблицу и данные
DROP TABLE   IF EXISTS employees;  -- без ошибки если нет

-- TRUNCATE — очистить данные (быстрее DELETE)
TRUNCATE TABLE employees;
TRUNCATE TABLE employees RESTART IDENTITY CASCADE;</code></pre>

<h3>DML — Data Manipulation Language (работа с данными)</h3>
<pre><code>-- INSERT
INSERT INTO employees(first_name, last_name, salary)
VALUES ('Alice', 'Smith', 75000);

-- INSERT нескольких строк
INSERT INTO employees(first_name, salary) VALUES
    ('Bob',     45000),
    ('Charlie', 90000);

-- INSERT из другой таблицы
INSERT INTO archive_emp SELECT * FROM employees WHERE hire_date < '2020-01-01';

-- UPDATE
UPDATE employees SET salary = salary * 1.1 WHERE department = 'IT';
UPDATE employees SET salary = 80000, email = 'new@mail.com' WHERE id = 1;

-- DELETE
DELETE FROM employees WHERE id = 5;
DELETE FROM employees WHERE salary < 30000;

-- MERGE (UPSERT — PostgreSQL 15+ / ON CONFLICT)
INSERT INTO employees(id, name, salary)
VALUES (1, 'Alice', 75000)
ON CONFLICT (id)
DO UPDATE SET salary = EXCLUDED.salary;</code></pre>

<h3>DCL — Data Control Language (права доступа)</h3>
<pre><code>GRANT  SELECT, INSERT ON employees TO alice;
GRANT  ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
REVOKE DELETE         ON employees FROM alice;
-- Роли
CREATE ROLE analyst;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst;
GRANT analyst TO alice;</code></pre>

<h3>TCL — Transaction Control Language (транзакции)</h3>
<pre><code>BEGIN;                         -- начало транзакции
SAVEPOINT sp1;                 -- точка сохранения
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;                        -- зафиксировать

-- При ошибке:
ROLLBACK;                      -- откатить всё
ROLLBACK TO SAVEPOINT sp1;     -- откатить до точки</code></pre>`,
      tasks: [
        {
          id: 'sql_ch7_t1', title: 'DDL: написание CREATE TABLE', difficulty: 'easy',
          description: '<p>Напишите Java-код, который "генерирует" и выводит DDL-скрипт CREATE TABLE для таблицы <code>products</code>: id (PK), name (VARCHAR 100, NOT NULL), price (DECIMAL, DEFAULT 0), category (VARCHAR 50), created_at (TIMESTAMP).</p>',
          hints: ['String.join("\\n", ...) или StringBuilder', 'Добавьте отступы для читаемости'],
          startCode: `public class Main {
    public static void main(String[] args) {
        // Сгенерируйте и выведите DDL скрипт
        String ddl = "CREATE TABLE products (\\n"
            + "    id          SERIAL        PRIMARY KEY,\\n"
            // TODO: добавьте остальные столбцы
            + ");";
        System.out.println(ddl);
    }
}`
        },
        {
          id: 'sql_ch7_t2', title: 'DML: INSERT / UPDATE / DELETE', difficulty: 'medium',
          description: '<p>Смоделируйте DML-операции на ArrayList: INSERT (добавить), UPDATE (изменить), DELETE (удалить). Выведите состояние "таблицы" после каждой операции.</p>',
          hints: ['ArrayList<String[]>', 'removeIf — аналог DELETE WHERE'],
          startCode: `import java.util.*;
public class Main {
    static List<String[]> table = new ArrayList<>();
    static int nextId = 1;

    static void insert(String name, double price) {
        table.add(new String[]{ String.valueOf(nextId++), name, String.valueOf(price) });
    }

    static void update(int id, double newPrice) {
        for (String[] row : table)
            if (row[0].equals(String.valueOf(id))) row[2] = String.valueOf(newPrice);
    }

    static void delete(int id) {
        table.removeIf(row -> row[0].equals(String.valueOf(id)));
    }

    static void print() {
        System.out.println("id | name        | price");
        for (String[] r : table)
            System.out.printf("%-3s  %-12s  %s%n", r[0], r[1], r[2]);
        System.out.println();
    }

    public static void main(String[] args) {
        insert("Apple",   1.5);
        insert("Banana",  0.5);
        insert("Cherry",  3.0);
        print();

        update(2, 0.75); // UPDATE WHERE id=2
        print();

        delete(1);       // DELETE WHERE id=1
        print();
    }
}`
        },
        {
          id: 'sql_ch7_t3', title: 'MERGE / UPSERT', difficulty: 'hard',
          description: '<p>Смоделируйте UPSERT (ON CONFLICT DO UPDATE): если запись с таким id уже есть — обновить, иначе вставить.</p>',
          hints: ['Map<Integer, String[]> как хранилище', 'map.put() всегда перезаписывает — проверьте containsKey'],
          startCode: `import java.util.*;
public class Main {
    static Map<Integer, String[]> db = new LinkedHashMap<>();

    static void upsert(int id, String name, double salary) {
        if (db.containsKey(id)) {
            // UPDATE
            db.get(id)[1] = name;
            db.get(id)[2] = String.valueOf(salary);
            System.out.println("UPDATE id=" + id);
        } else {
            // INSERT
            db.put(id, new String[]{ String.valueOf(id), name, String.valueOf(salary) });
            System.out.println("INSERT id=" + id);
        }
    }

    static void print() {
        System.out.println("id  name       salary");
        db.values().forEach(r -> System.out.printf("%-4s %-10s %s%n", r[0],r[1],r[2]));
        System.out.println();
    }

    public static void main(String[] args) {
        upsert(1, "Alice", 75000);
        upsert(2, "Bob",   45000);
        upsert(1, "Alice", 80000); // UPDATE: зарплата выросла
        upsert(3, "Carol", 60000);
        print();
    }
}`
        }
      ]
    },

    /* ═══════════ Ch8: Индексы ═══════════ */
    {
      id: 'sql_ch8',
      title: 'Индексы: типы, устройство, практика',
      lecture: `<h2>Индексы в базах данных</h2>
<p>Индекс — дополнительная структура данных, ускоряющая поиск. Как оглавление книги.</p>

<h3>B-Tree индекс (основной тип в PostgreSQL)</h3>
<pre><code>         [50]
        /    \\
    [20,35]  [70,90]
    / | \\     / | \\
  10 25 40  60 80 95

Поиск значения 80:
  50 → правый → 70,90 → между → 80 ✓
  Высота дерева ≈ log₂(N) → O(log N)</code></pre>

<pre><code>-- Создание индексов
CREATE INDEX idx_emp_salary   ON employees(salary);        -- B-Tree по умолч.
CREATE INDEX idx_emp_dept_sal ON employees(dept_id, salary); -- составной
CREATE UNIQUE INDEX idx_email ON employees(email);          -- уникальный
CREATE INDEX idx_high_sal     ON employees(salary)
    WHERE salary > 100000;                                   -- частичный
CREATE INDEX idx_lower_name   ON employees(LOWER(name));     -- expression
-- Покрывающий (include — PostgreSQL 11+): хранит доп. столбцы в индексе
CREATE INDEX idx_cov ON employees(dept_id) INCLUDE (salary, name);</code></pre>

<h3>Типы индексов PostgreSQL</h3>
<table>
<tr><th>Тип</th><th>Применение</th><th>Операторы</th></tr>
<tr><td>B-Tree</td><td>Числа, строки, даты (сравнение)</td><td>=, <, >, BETWEEN, LIKE 'abc%'</td></tr>
<tr><td>Hash</td><td>Только точное равенство</td><td>=</td></tr>
<tr><td>GIN</td><td>Массивы, JSONB, full-text search</td><td>@>, ?</td></tr>
<tr><td>GiST</td><td>Геометрия, IP-адреса, full-text</td><td>&&, @>, <-></td></tr>
<tr><td>BRIN</td><td>Очень большие таблицы с физическим порядком</td><td>=, BETWEEN</td></tr>
</table>

<h3>EXPLAIN ANALYZE — чтение плана</h3>
<pre><code>EXPLAIN ANALYZE
SELECT * FROM employees WHERE salary > 80000;

-- Вывод:
-- Seq Scan on employees  (cost=0..20 rows=5 width=64) (actual rows=3)
--   Filter: (salary > 80000)
-- После добавления индекса:
-- Index Scan using idx_emp_salary (cost=0..8 rows=5)

Типы сканирований:
  Seq Scan          — полный перебор таблицы  O(N)
  Index Scan        — поиск по индексу        O(log N)
  Index Only Scan   — только из индекса (без обращения к таблице)
  Bitmap Index Scan — несколько условий, потом Bitmap Heap Scan</code></pre>

<h3>Когда индекс НЕ используется</h3>
<pre><code>-- Функция на колонке (нет expression index):
WHERE LOWER(name) = 'alice'   -- не использует idx на name

-- Ведущий % в LIKE:
WHERE name LIKE '%son'        -- Seq Scan (нет с начала)

-- Маленькие таблицы (планировщик выбирает Seq Scan)

-- Низкая селективность (мало уникальных значений):
WHERE is_active = TRUE  -- если 95% строк active — Seq Scan быстрее</code></pre>`,
      tasks: [
        {
          id: 'sql_ch8_t1', title: 'Бинарное дерево как B-Tree', difficulty: 'medium',
          description: '<p>Смоделируйте работу B-Tree индекса через бинарное дерево поиска. Вставьте 7 значений зарплат и найдите записи с salary > 60000. Считайте количество сравнений.</p>',
          hints: ['Класс BST Node с left/right', 'При поиске > X идём вправо'],
          startCode: `public class Main {
    static class Node {
        int val;
        Node left, right;
        Node(int v) { val = v; }
    }

    static Node root;
    static int comparisons = 0;

    static void insert(int v) {
        root = insertRec(root, v);
    }
    static Node insertRec(Node n, int v) {
        if (n == null) return new Node(v);
        if (v < n.val) n.left  = insertRec(n.left,  v);
        else           n.right = insertRec(n.right, v);
        return n;
    }

    static void findGreaterThan(Node n, int threshold) {
        if (n == null) return;
        comparisons++;
        if (n.val > threshold) {
            findGreaterThan(n.left, threshold); // могут быть в левом
            System.out.println("  Найдено: " + n.val);
        }
        findGreaterThan(n.right, threshold); // правое всегда больше
    }

    public static void main(String[] args) {
        int[] salaries = {75000, 45000, 90000, 55000, 65000, 40000, 80000};
        for (int s : salaries) insert(s);

        System.out.println("Записи с salary > 60000:");
        findGreaterThan(root, 60000);
        System.out.println("Сравнений: " + comparisons + " (без индекса: " + salaries.length + ")");
    }
}`
        },
        {
          id: 'sql_ch8_t2', title: 'Составной индекс и порядок полей', difficulty: 'hard',
          description: '<p>Смоделируйте составной индекс (dept_id, salary): быстрый поиск WHERE dept_id=10 AND salary>60000. Покажите что индекс (dept_id, salary) быстрее чем (salary, dept_id) для этого запроса.</p>',
          hints: ['Сначала фильтруйте по dept_id (точное =), потом по salary', 'Считайте кол-во операций'],
          startCode: `import java.util.*;
public class Main {
    record Emp(int id, String name, int dept, int salary) {}

    public static void main(String[] args) {
        List<Emp> emps = Arrays.asList(
            new Emp(1,"Alice",10,75000), new Emp(2,"Bob",20,45000),
            new Emp(3,"Charlie",10,90000), new Emp(4,"Diana",10,55000),
            new Emp(5,"Eve",20,65000), new Emp(6,"Frank",10,80000)
        );

        // Симуляция: индекс на (dept_id, salary) — группируем по dept
        Map<Integer, List<Emp>> indexByDept = new TreeMap<>();
        for (Emp e : emps)
            indexByDept.computeIfAbsent(e.dept(), k -> new ArrayList<>()).add(e);
        // Сортируем по salary внутри группы
        indexByDept.values().forEach(list ->
            list.sort(Comparator.comparingInt(Emp::salary)));

        int ops = 0;
        System.out.println("WHERE dept_id=10 AND salary>60000:");
        List<Emp> deptGroup = indexByDept.getOrDefault(10, List.of());
        for (Emp e : deptGroup) {
            ops++;
            if (e.salary() > 60000) System.out.println("  " + e.name());
        }
        System.out.println("Операций (с индексом): " + ops + "/" + emps.size());
    }
}`
        }
      ]
    },

    /* ═══════════ Ch9: Нормализация ═══════════ */
    {
      id: 'sql_ch9',
      title: 'Нормализация и проектирование',
      lecture: `<h2>Нормализация баз данных</h2>
<p>Нормализация — процесс разделения таблиц для устранения избыточности и аномалий.</p>

<h3>1НФ — первая нормальная форма</h3>
<pre><code>-- НАРУШЕНИЕ 1НФ: многозначный атрибут в одной ячейке
employees:
id | name  | phones
1  | Alice | "111,222,333"    ← нельзя!

-- 1НФ: атомарные значения, каждый столбец — одно значение
emp_phones:
emp_id | phone
1      | 111
1      | 222
1      | 333</code></pre>

<h3>2НФ — вторая нормальная форма (для составных PK)</h3>
<pre><code>-- НАРУШЕНИЕ 2НФ: неполная функциональная зависимость
order_items:
order_id | product_id | quantity | product_name  ← product_name зависит только от product_id!
                                                    не от всего (order_id, product_id)

-- 2НФ: убираем частичную зависимость
order_items: (order_id, product_id, quantity)
products:    (product_id, product_name, price)</code></pre>

<h3>3НФ — третья нормальная форма</h3>
<pre><code>-- НАРУШЕНИЕ 3НФ: транзитивная зависимость
employees:
id | name | dept_id | dept_name  ← dept_name зависит от dept_id, не от id напрямую

-- 3НФ: убираем транзитивную зависимость
employees:   (id, name, dept_id)
departments: (dept_id, dept_name)</code></pre>

<h3>НФБК (Бойса-Кодда)</h3>
<pre><code>-- Строже 3НФ: каждая нетривиальная функциональная зависимость
-- должна иметь суперключ в левой части.
-- Применяется когда несколько перекрывающихся кандидатных ключей.</code></pre>

<h3>Денормализация</h3>
<pre><code>-- Когда нормализация вредит производительности:
-- OLAP / аналитика: денормализованные "плоские" таблицы быстрее
-- Star schema: fact_sales + dimension tables (dim_date, dim_product, dim_store)

fact_sales:
  sale_id, date_id, product_id, store_id, quantity, total_amount

-- Вместо JOIN каждый раз — предрасчитанные данные в одной таблице</code></pre>

<h3>OLTP vs OLAP</h3>
<table>
<tr><th>Характеристика</th><th>OLTP</th><th>OLAP</th></tr>
<tr><td>Цель</td><td>Транзакции (INSERT/UPDATE)</td><td>Аналитика (SELECT агрегаты)</td></tr>
<tr><td>Схема</td><td>Нормализованная (3НФ)</td><td>Денормализованная (звезда/снежинка)</td></tr>
<tr><td>Запросы</td><td>Короткие, точечные</td><td>Сложные, аналитические</td></tr>
<tr><td>Примеры</td><td>PostgreSQL, MySQL</td><td>Redshift, BigQuery, ClickHouse</td></tr>
</table>`,
      tasks: [
        {
          id: 'sql_ch9_t1', title: 'Обнаружение нарушений 1НФ', difficulty: 'easy',
          description: '<p>Найдите строки, нарушающие 1НФ: поле "phones" содержит несколько значений через запятую. Выведите нормализованные строки (одна запись = один телефон).</p>',
          hints: ['Разбейте phones.split(",") и создайте отдельную запись для каждого'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Ненормализованная таблица (нарушение 1НФ)
        String[][] denorm = {
            {"1", "Alice", "111,222,333"},
            {"2", "Bob",   "444"},
            {"3", "Carol", "555,666"}
        };
        // Нормализация: одна строка = один телефон
        System.out.println("emp_id | emp_name | phone");
        System.out.println("-------|----------|------");
        for (String[] row : denorm) {
            for (String phone : row[2].split(",")) {
                System.out.printf("%-7s  %-9s  %s%n", row[0], row[1], phone.trim());
            }
        }
    }
}`
        },
        {
          id: 'sql_ch9_t2', title: 'Нормализация до 3НФ', difficulty: 'medium',
          description: '<p>Денормализованная таблица содержит транзитивную зависимость (нарушение 3НФ). Разделите её на две: employees и departments. Восстановите данные через JOIN.</p>',
          hints: ['Соберите уникальные отделы', 'Замените dept_name на dept_id'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Нарушение 3НФ: dept_name зависит от dept_id, не от emp_id
        String[][] denorm = {
            {"1","Alice","10","IT","100000"},
            {"2","Bob",  "20","HR","50000"},
            {"3","Carol","10","IT","90000"},
            {"4","Diana","30","Sales","70000"}
        };
        // Нормализация: создайте departments и employees
        Map<String,String> departments = new LinkedHashMap<>(); // deptId -> deptName
        List<String[]>     employees   = new ArrayList<>();
        for (String[] r : denorm) {
            departments.put(r[2], r[3]);
            employees.add(new String[]{ r[0], r[1], r[2], r[4] }); // без dept_name
        }
        System.out.println("=== departments ===");
        departments.forEach((id,name) ->
            System.out.printf("  id=%-3s  name=%s%n", id, name));
        System.out.println("=== employees (без транзитивной зависимости) ===");
        employees.forEach(r ->
            System.out.printf("  id=%-3s  name=%-7s dept_id=%-3s salary=%s%n",
                r[0],r[1],r[2],r[3]));
    }
}`
        }
      ]
    },

    /* ═══════════ Ch10: Транзакции ═══════════ */
    {
      id: 'sql_ch4',
      title: 'Транзакции, ACID и уровни изоляции',
      lecture: `<h2>Транзакции и ACID</h2>
<p>Транзакция — набор операций, выполняемых как единое целое.</p>

<h3>ACID</h3>
<ul>
<li><strong>A</strong>tomicity (атомарность) — всё или ничего</li>
<li><strong>C</strong>onsistency (согласованность) — БД переходит из одного корректного состояния в другое</li>
<li><strong>I</strong>solation (изолированность) — транзакции не мешают друг другу</li>
<li><strong>D</strong>urability (долговечность) — зафиксированные изменения не теряются</li>
</ul>

<h3>Аномалии (проблемы без изоляции)</h3>
<pre><code>┌────────────────────────────┬──────────────────────────────────────┐
│ Аномалия                   │ Описание                             │
├────────────────────────────┼──────────────────────────────────────┤
│ Dirty Read                 │ Чтение незафиксированных данных      │
│ Non-repeatable Read        │ Повторное чтение той же строки даёт  │
│                            │ другой результат (строка изменилась) │
│ Phantom Read               │ Повторный SELECT возвращает новые    │
│                            │ строки (другая транзакция их вставила)│
│ Serialization Anomaly      │ Результат отличается от serial       │
│                            │ выполнения транзакций                │
│ Lost Update                │ Две транзакции читают, обе пишут —   │
│                            │ одна перезаписывает другую           │
└────────────────────────────┴──────────────────────────────────────┘</code></pre>

<h3>Уровни изоляции</h3>
<pre><code>┌─────────────────────┬───────┬────────┬─────────┬──────────────┐
│ Уровень             │ Dirty │ Non-rep│ Phantom │ Serial Anom. │
├─────────────────────┼───────┼────────┼─────────┼──────────────┤
│ READ UNCOMMITTED    │   ✓   │   ✓    │    ✓    │      ✓       │
│ READ COMMITTED      │   ✗   │   ✓    │    ✓    │      ✓       │
│ REPEATABLE READ     │   ✗   │   ✗    │    ✓*   │      ✓       │
│ SERIALIZABLE        │   ✗   │   ✗    │    ✗    │      ✗       │
└─────────────────────┴───────┴────────┴─────────┴──────────────┘
* PostgreSQL RR использует MVCC — фантомных чтений тоже нет!
Дефолт PostgreSQL: READ COMMITTED</code></pre>

<h3>Установка уровня</h3>
<pre><code>BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- ... операции ...
COMMIT;

-- Глобально:
SET default_transaction_isolation = 'serializable';</code></pre>

<h3>Lost Update и защита</h3>
<pre><code>-- Потерянное обновление:
T1: SELECT balance=1000; T2: SELECT balance=1000;
T1: UPDATE SET balance=900; T2: UPDATE SET balance=800; ← перезаписал!

-- Защита 1: SELECT FOR UPDATE (пессимистичная блокировка)
BEGIN;
SELECT balance FROM accounts WHERE id=1 FOR UPDATE; -- заблокировать строку
UPDATE accounts SET balance = balance - 100 WHERE id=1;
COMMIT;

-- Защита 2: оптимистичная блокировка (версии)
UPDATE accounts SET balance = 900, version = version + 1
WHERE id = 1 AND version = 5; -- если version изменился → 0 строк → retry</code></pre>`,
      tasks: [
        {
          id: 'sql_t8', title: 'Перевод средств (ACID)', difficulty: 'medium',
          description: '<p>Симулируйте банковский перевод. Если денег недостаточно — ROLLBACK. Иначе — COMMIT. Реализуйте атомарность.</p>',
          hints: ['if (fromBalance < amount) { ROLLBACK; return; }'],
          startCode: `import java.util.*;
public class Main {
    static Map<String,Double> accounts = new HashMap<>();

    static void transfer(String from, String to, double amount) {
        System.out.println("BEGIN;");
        double fromBal = accounts.getOrDefault(from, 0.0);
        if (fromBal < amount) {
            System.out.println("ROLLBACK; // недостаточно средств");
            return;
        }
        accounts.put(from, fromBal - amount);
        accounts.put(to, accounts.getOrDefault(to, 0.0) + amount);
        System.out.println("COMMIT;");
    }

    public static void main(String[] args) {
        accounts.put("Alice", 1000.0);
        accounts.put("Bob",    500.0);

        transfer("Alice", "Bob", 300);    // COMMIT
        System.out.println(accounts);
        transfer("Bob",  "Alice", 1000);  // ROLLBACK
        System.out.println(accounts);
    }
}`
        },
        {
          id: 'sql_t8b', title: 'Оптимистичная блокировка (версии)', difficulty: 'hard',
          description: '<p>Смоделируйте оптимистичную блокировку: запись имеет поле version. UPDATE выполняется только если version не изменился. Если изменился — вывести "CONFLICT — retry".</p>',
          hints: ['if (currentVersion == expectedVersion) → обновить и version++', 'Иначе → CONFLICT'],
          startCode: `import java.util.*;
public class Main {
    static Map<Integer, int[]> db = new HashMap<>();
    // db: id -> [balance, version]

    static boolean updateBalance(int id, int delta, int expectedVersion) {
        int[] row = db.get(id);
        if (row == null) return false;
        if (row[1] != expectedVersion) {
            System.out.println("CONFLICT: version изменилась (" + row[1] + " != " + expectedVersion + ") — retry");
            return false;
        }
        row[0] += delta;
        row[1]++;
        System.out.println("OK: balance=" + row[0] + " version=" + row[1]);
        return true;
    }

    public static void main(String[] args) {
        db.put(1, new int[]{1000, 1}); // balance=1000, version=1

        // T1 читает версию 1 и обновляет — успех
        updateBalance(1, -100, 1); // ожидаем v=1

        // T2 тоже читала версию 1, но теперь версия уже 2 — конфликт
        updateBalance(1, -200, 1); // ожидаем v=1, но сейчас v=2 → CONFLICT

        // Retry с актуальной версией
        updateBalance(1, -200, 2); // теперь ок
    }
}`
        }
      ]
    },

    /* ═══════════ Ch11: MVCC ═══════════ */
    {
      id: 'sql_ch11',
      title: 'MVCC и VACUUM',
      lecture: `<h2>MVCC — Multiversion Concurrency Control</h2>
<p>PostgreSQL не блокирует читателей при записи и наоборот. Вместо этого хранит несколько версий каждой строки.</p>

<h3>Системные столбцы каждой строки</h3>
<pre><code>SELECT xmin, xmax, ctid, * FROM employees LIMIT 3;
-- xmin = transaction ID, создавший строку
-- xmax = transaction ID, удаливший/обновивший строку (0 = актуальная)
-- ctid  = физическое расположение (страница, смещение): '(0,1)'

┌──────┬──────┬───────┬────┬───────┐
│ xmin │ xmax │  ctid │ id │  name │
├──────┼──────┼───────┼────┼───────┤
│  100 │    0 │ (0,1) │  1 │ Alice │ ← актуальная версия
│  101 │  105 │ (0,2) │  2 │ Bob   │ ← мёртвая (удалена txn 105)
│  103 │    0 │ (0,3) │  3 │ Carol │ ← актуальная
└──────┴──────┴───────┴────┴───────┘</code></pre>

<h3>Как работает UPDATE</h3>
<pre><code>-- UPDATE не изменяет строку на месте!
-- Создаёт НОВУЮ версию строки + помечает старую как удалённую
BEGIN; -- txn_id = 200
UPDATE employees SET salary = 80000 WHERE id = 1;
COMMIT;

-- После UPDATE:
xmin=100, xmax=200, ctid=(0,1) → Alice, 75000  (мёртвая версия)
xmin=200, xmax=0,   ctid=(0,4) → Alice, 80000  (актуальная)

-- Результат: "мёртвые строки" (dead tuples) занимают место</code></pre>

<h3>VACUUM — сборка мусора</h3>
<pre><code>-- Стандартный VACUUM: помечает место для переиспользования
VACUUM employees;
VACUUM (VERBOSE) employees;  -- с подробным выводом

-- VACUUM FULL: физически удаляет мёртвые строки, перезаписывает таблицу
-- ВНИМАНИЕ: блокирует таблицу на весь период!
VACUUM FULL employees;

-- FREEZE: сбрасывает старые xmin → предотвращает Transaction ID Wraparound
VACUUM FREEZE employees;

-- Autovacuum: автоматически запускается в фоне
-- Параметры в postgresql.conf:
-- autovacuum_vacuum_threshold = 50   (строк для старта)
-- autovacuum_vacuum_scale_factor = 0.2  (20% таблицы)</code></pre>

<h3>Transaction ID Wraparound</h3>
<pre><code>-- Transaction ID — 32-битное число (≈ 4 млрд значений)
-- Когда счётчик переполнится → все старые транзакции выглядят "будущими"
-- → PostgreSQL ОСТАНОВИТ все операции, кроме VACUUM FREEZE

-- Мониторинг:
SELECT datname, age(datfrozenxid) AS txn_age
FROM   pg_database
ORDER BY txn_age DESC;
-- Если txn_age > 1.5 млрд — нужен срочный VACUUM FREEZE!</code></pre>`,
      tasks: [
        {
          id: 'sql_ch11_t1', title: 'Симуляция мёртвых строк', difficulty: 'medium',
          description: '<p>Смоделируйте MVCC: при UPDATE создавайте новую версию строки (новый объект) и помечайте старую как "dead". Считайте live и dead строки.</p>',
          hints: ['Список версий для каждой строки', 'Поле isDead = true для старых версий'],
          startCode: `import java.util.*;
public class Main {
    record Row(int xmin, int xmax, String name, int salary, boolean dead) {
        public String toString() {
            return String.format("xmin=%-4d xmax=%-4d %-8s %6d %s",
                xmin, xmax, name, salary, dead ? "DEAD" : "live");
        }
    }

    static List<Row> heap = new ArrayList<>();
    static int txn = 100;

    static void insert(String name, int salary) {
        heap.add(new Row(txn++, 0, name, salary, false));
    }

    static void update(String name, int newSalary) {
        int currentTxn = txn++;
        for (int i = 0; i < heap.size(); i++) {
            Row r = heap.get(i);
            if (r.name().equals(name) && !r.dead()) {
                heap.set(i, new Row(r.xmin(), currentTxn, r.name(), r.salary(), true)); // mark dead
                heap.add(new Row(currentTxn, 0, name, newSalary, false)); // new version
                return;
            }
        }
    }

    public static void main(String[] args) {
        insert("Alice", 75000);
        insert("Bob",   45000);
        System.out.println("--- После INSERT ---");
        heap.forEach(System.out::println);

        update("Alice", 80000);
        System.out.println("\n--- После UPDATE Alice ---");
        heap.forEach(System.out::println);

        long live = heap.stream().filter(r -> !r.dead()).count();
        long dead = heap.stream().filter(Row::dead).count();
        System.out.println("\nLive: " + live + ", Dead: " + dead + " (VACUUM очистит dead)");
    }
}`
        }
      ]
    },

    /* ═══════════ Ch12: Продвинутый SQL ═══════════ */
    {
      id: 'sql_ch12',
      title: 'Продвинутые возможности SQL',
      lecture: `<h2>Оконные функции</h2>
<p>Вычисляют значение для каждой строки <strong>с учётом соседних строк</strong>, не сворачивая результат.</p>

<pre><code>SELECT name, department, salary,
       ROW_NUMBER()   OVER (PARTITION BY department ORDER BY salary DESC) AS rn,
       RANK()         OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
       DENSE_RANK()   OVER (PARTITION BY department ORDER BY salary DESC) AS drnk,
       LAG(salary,1)  OVER (PARTITION BY department ORDER BY salary)      AS prev_sal,
       LEAD(salary,1) OVER (PARTITION BY department ORDER BY salary)      AS next_sal,
       SUM(salary)    OVER (PARTITION BY department)                      AS dept_total,
       AVG(salary)    OVER ()                                             AS global_avg
FROM   employees;

-- ROW_NUMBER: уникальный номер 1,2,3...
-- RANK:       с пропусками при равных (1,2,2,4)
-- DENSE_RANK: без пропусков (1,2,2,3)
-- LAG/LEAD:   доступ к предыдущей/следующей строке</code></pre>

<h3>Рекурсивные CTE (WITH RECURSIVE)</h3>
<pre><code>-- Обход иерархии (менеджер → подчинённые)
WITH RECURSIVE emp_tree AS (
    -- Базовый случай: корень иерархии
    SELECT id, name, manager_id, 0 AS depth
    FROM   employees
    WHERE  manager_id IS NULL

    UNION ALL

    -- Рекурсивный шаг: подчинённые
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM   employees e
    JOIN   emp_tree t ON e.manager_id = t.id
)
SELECT depth, name FROM emp_tree ORDER BY depth, name;

-- Числовые последовательности:
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 10
)
SELECT * FROM nums;</code></pre>

<h3>Материализованные представления</h3>
<pre><code>CREATE MATERIALIZED VIEW dept_stats AS
SELECT   department,
         COUNT(*)    AS emp_count,
         AVG(salary) AS avg_salary
FROM     employees
GROUP BY department;

-- Обновить (пересчитать):
REFRESH MATERIALIZED VIEW dept_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dept_stats; -- без блокировки чтения
-- Применение: тяжёлые агрегации, кеш, OLAP</code></pre>

<h3>JSON/JSONB</h3>
<pre><code>-- Создание
CREATE TABLE events (
    id   SERIAL,
    data JSONB
);
INSERT INTO events(data) VALUES ('{"type":"click","user":{"id":1,"name":"Alice"}}');

-- Операторы
SELECT data -> 'user'        AS user_obj   -- JSON объект
       data ->> 'type'       AS type_str,  -- строковое значение
       data #>> '{user,name}' AS user_name  -- по пути
FROM   events
WHERE  data @> '{"type":"click"}';         -- содержит
WHERE  data ? 'user';                      -- ключ существует

-- GIN индекс для JSONB:
CREATE INDEX idx_events_gin ON events USING gin(data);</code></pre>`,
      tasks: [
        {
          id: 'sql_ch12_t1', title: 'ROW_NUMBER и RANK', difficulty: 'medium',
          description: '<p>Реализуйте оконные функции ROW_NUMBER, RANK и DENSE_RANK для сотрудников, сгруппированных по отделу и отсортированных по зарплате DESC.</p>',
          hints: ['Сгруппируйте по dept, отсортируйте', 'RANK: при равных зарплатах одинаковый ранг, следующий пропущен'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    record Emp(String name, String dept, int salary) {}

    public static void main(String[] args) {
        List<Emp> emps = Arrays.asList(
            new Emp("Alice","IT",90000), new Emp("Bob","IT",75000),
            new Emp("Charlie","IT",75000), new Emp("Diana","HR",60000),
            new Emp("Eve","HR",60000), new Emp("Frank","HR",50000)
        );
        // Группируем по dept, сортируем по salary DESC
        Map<String, List<Emp>> byDept = emps.stream()
            .collect(Collectors.groupingBy(Emp::dept));

        System.out.printf("%-10s %-8s %8s  %5s %5s %10s%n",
            "Name","Dept","Salary","ROW#","RANK","DENSE_RANK");
        for (var entry : new TreeMap<>(byDept).entrySet()) {
            List<Emp> group = entry.getValue().stream()
                .sorted(Comparator.comparingInt(Emp::salary).reversed())
                .collect(Collectors.toList());
            int rank = 1, denseRank = 1;
            for (int i = 0; i < group.size(); i++) {
                Emp e = group.get(i);
                if (i > 0 && e.salary() < group.get(i-1).salary()) {
                    rank = i + 1;  // с пропуском
                    denseRank++;   // без пропуска
                }
                System.out.printf("%-10s %-8s %8d  %5d %5d %10d%n",
                    e.name(), e.dept(), e.salary(), i+1, rank, denseRank);
            }
        }
    }
}`
        },
        {
          id: 'sql_ch12_t2', title: 'Рекурсивный CTE — иерархия', difficulty: 'hard',
          description: '<p>Смоделируйте WITH RECURSIVE: обойдите иерархию сотрудников (CEO → менеджеры → сотрудники) рекурсивно. Выведите с глубиной и отступом.</p>',
          hints: ['BFS/DFS из корневого узла (manager_id = -1)', 'Отступ = "  " * depth'],
          startCode: `import java.util.*;
public class Main {
    record Emp(int id, String name, int managerId) {}

    public static void main(String[] args) {
        List<Emp> emps = Arrays.asList(
            new Emp(1,"CEO",      -1),
            new Emp(2,"Alice",     1),
            new Emp(3,"Bob",       1),
            new Emp(4,"Charlie",   2),
            new Emp(5,"Diana",     2),
            new Emp(6,"Eve",       3)
        );
        Map<Integer, List<Emp>> children = new HashMap<>();
        Emp root = null;
        for (Emp e : emps) {
            if (e.managerId() == -1) { root = e; continue; }
            children.computeIfAbsent(e.managerId(), k -> new ArrayList<>()).add(e);
        }
        // WITH RECURSIVE — DFS
        System.out.println("-- WITH RECURSIVE emp_tree");
        printTree(root, children, 0);
    }

    static void printTree(Emp node, Map<Integer,List<Emp>> children, int depth) {
        if (node == null) return;
        System.out.println("  ".repeat(depth) + node.name() + " (depth=" + depth + ")");
        for (Emp child : children.getOrDefault(node.id(), List.of()))
            printTree(child, children, depth + 1);
    }
}`
        }
      ]
    },

    /* ═══════════ Ch13: EXPLAIN ═══════════ */
    {
      id: 'sql_ch13',
      title: 'Оптимизация запросов и EXPLAIN',
      lecture: `<h2>EXPLAIN ANALYZE — анализ плана выполнения</h2>

<pre><code>EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT e.name, d.dept_name
FROM   employees e
JOIN   departments d ON e.dept_id = d.id
WHERE  e.salary > 50000;

-- Результат:
Hash Join  (cost=12..28 rows=150 width=64) (actual time=0.8..2.1 rows=148)
  Hash Cond: (e.dept_id = d.id)
  Buffers: shared hit=8
  -> Seq Scan on employees e  (cost=0..15 rows=200)
       Filter: (salary > 50000)
       Rows Removed by Filter: 52
  -> Hash  (cost=6..6 rows=10)
       -> Seq Scan on departments d  (cost=0..6 rows=10)</code></pre>

<h3>Типы сканирований</h3>
<pre><code>Seq Scan        — полный перебор (плохо для больших таблиц)
Index Scan      — использует индекс, читает из heap (случайный I/O)
Index Only Scan — данные прямо из индекса (нет heap access) — БЫСТРО
Bitmap Idx Scan — несколько условий: бит-маска → Bitmap Heap Scan

Когда Seq Scan быстрее Index Scan?
  - Таблица маленькая (< нескольких сотен строк)
  - Запрос читает > 10-15% строк (много random I/O > Seq Scan)
  - Нет статистики (после ANALYZE — планировщик лучше выбирает)</code></pre>

<h3>Join стратегии</h3>
<pre><code>Nested Loop  — O(N*M): хорош для малого N и индекса на M
Hash Join    — O(N+M): большие таблицы без сортировки, память!
Merge Join   — O(N log N): обе стороны отсортированы / индексированы</code></pre>

<h3>Влияние статистики и параметров</h3>
<pre><code>-- Обновить статистику (без этого планировщик ошибается):
ANALYZE employees;

-- pg_stats — статистика по столбцам:
SELECT n_distinct, correlation FROM pg_stats
WHERE tablename='employees' AND attname='dept_id';

-- Параметры планировщика:
SET work_mem = '256MB';           -- память на sort/hash
SET random_page_cost = 1.1;       -- SSD: меньше, чем для HDD (4.0)
SET enable_seqscan = OFF;         -- принудительно использовать индексы (для теста)</code></pre>`,
      tasks: [
        {
          id: 'sql_ch13_t1', title: 'Nested Loop vs Hash Join', difficulty: 'hard',
          description: '<p>Смоделируйте Nested Loop и Hash Join для соединения двух таблиц. Посчитайте количество операций и сравните.</p>',
          hints: ['Nested Loop: for each row in A → scan B', 'Hash Join: build hash of B → probe for each row in A'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] empDepts  = {10,20,10,30,20,10,30,20,10,20}; // 10 сотрудников
        int[] deptIds   = {10,20,30};                        // 3 отдела

        // Nested Loop Join: O(N*M)
        int nlOps = 0;
        for (int ed : empDepts)
            for (int did : deptIds) { nlOps++; if (ed == did) break; }
        System.out.println("Nested Loop операций: " + nlOps);

        // Hash Join: O(N+M) — сначала строим хеш из меньшей таблицы
        int hjOps = 0;
        Set<Integer> deptHash = new HashSet<>();
        for (int d : deptIds) { deptHash.add(d); hjOps++; } // build phase
        for (int ed : empDepts) { hjOps++; deptHash.contains(ed); }  // probe phase
        System.out.println("Hash Join операций:   " + hjOps);
        System.out.println("Hash Join быстрее в " +
            String.format("%.1f", (double)nlOps/hjOps) + " раза");
    }
}`
        }
      ]
    },

    /* ═══════════ Ch14: Блокировки ═══════════ */
    {
      id: 'sql_ch14',
      title: 'Блокировки и конкурентный доступ',
      lecture: `<h2>Блокировки в PostgreSQL</h2>

<h3>Уровни блокировок</h3>
<pre><code>Строковые блокировки (Row-Level):
  FOR SHARE          — несколько читателей, блокирует запись
  FOR UPDATE         — эксклюзивная, блокирует другие FOR UPDATE
  FOR NO KEY UPDATE  — не блокирует FOR SHARE
  FOR KEY SHARE      — только для ключей

Примеры:
  SELECT * FROM accounts WHERE id=1 FOR UPDATE;       -- заблокировать
  SELECT * FROM accounts WHERE id=1 FOR UPDATE NOWAIT; -- ошибка если занято
  SELECT * FROM accounts WHERE id=1 FOR UPDATE SKIP LOCKED; -- пропустить</code></pre>

<h3>Табличные блокировки (DDL)</h3>
<pre><code>-- Уровни (от слабого к сильному):
ACCESS SHARE           -- SELECT
ROW SHARE              -- SELECT FOR UPDATE
ROW EXCLUSIVE          -- INSERT/UPDATE/DELETE
SHARE UPDATE EXCLUSIVE -- VACUUM, CREATE INDEX CONCURRENTLY
SHARE                  -- CREATE INDEX (не CONCURRENTLY!)
SHARE ROW EXCLUSIVE    -- CREATE TRIGGER
EXCLUSIVE              -- REFRESH MATERIALIZED VIEW
ACCESS EXCLUSIVE       -- DDL: DROP/ALTER/TRUNCATE — блокирует всё!</code></pre>

<h3>Deadlock</h3>
<pre><code>-- T1: блокирует строку id=1, потом пытается заблокировать id=2
-- T2: блокирует строку id=2, потом пытается заблокировать id=1
-- → Deadlock! PostgreSQL обнаруживает и откатывает одну транзакцию.

-- Профилактика:
-- 1. Всегда блокировать строки в одном порядке (id по возрастанию)
-- 2. Держать транзакции короткими
-- 3. FOR UPDATE NOWAIT → поймать ошибку и повторить</code></pre>

<h3>Advisory Locks</h3>
<pre><code>-- Пользовательские блокировки (по числовому ключу):
SELECT pg_advisory_lock(12345);      -- захватить
-- ... критическая секция ...
SELECT pg_advisory_unlock(12345);    -- освободить

-- Неблокирующий захват:
SELECT pg_try_advisory_lock(12345);  -- вернёт false если занято
-- Применение: распределённые задания, cron без дублирования</code></pre>`,
      tasks: [
        {
          id: 'sql_ch14_t1', title: 'Симуляция Deadlock', difficulty: 'hard',
          description: '<p>Смоделируйте ситуацию deadlock: две транзакции захватывают ресурсы в разном порядке. Реализуйте обнаружение дедлока и откат одной из транзакций.</p>',
          hints: ['Два объекта локов', 'Если T1 держит lock1 и ждёт lock2, T2 держит lock2 и ждёт lock1 — дедлок'],
          startCode: `import java.util.*;
public class Main {
    static Map<Integer, String> locks = new HashMap<>(); // resource -> holder

    static boolean tryLock(int resource, String txn) {
        if (!locks.containsKey(resource)) {
            locks.put(resource, txn);
            System.out.println(txn + " заблокировал ресурс " + resource);
            return true;
        }
        System.out.println(txn + " ЖДЁТ ресурс " + resource
            + " (держит: " + locks.get(resource) + ")");
        return false;
    }

    public static void main(String[] args) {
        // T1: захватывает 1, потом хочет 2
        // T2: захватывает 2, потом хочет 1 → DEADLOCK
        tryLock(1, "T1");
        tryLock(2, "T2");
        System.out.println("--- T1 пытается захватить ресурс 2, T2 — ресурс 1 ---");
        boolean t1got2 = tryLock(2, "T1"); // ждёт
        boolean t2got1 = tryLock(1, "T2"); // ждёт
        if (!t1got2 && !t2got1) {
            System.out.println("DEADLOCK DETECTED!");
            System.out.println("Откатываем T2 (жертва)...");
            locks.remove(2); // освобождаем ресурс T2
            tryLock(2, "T1"); // T1 получает
        }
    }
}`
        }
      ]
    },

    /* ═══════════ Ch15: Масштабирование ═══════════ */
    {
      id: 'sql_ch15',
      title: 'Масштабирование и высокая доступность',
      lecture: `<h2>Партиционирование</h2>
<pre><code>-- Range partitioning: разбивка по диапазону
CREATE TABLE orders (
    id         BIGSERIAL,
    created_at TIMESTAMPTZ NOT NULL,
    amount     DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2023 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE orders_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Partition pruning: запрос ищет только в нужной партиции
SELECT * FROM orders WHERE created_at >= '2024-06-01';
-- → читает только orders_2024!

-- List partitioning: по списку значений
PARTITION BY LIST (country);
-- Hash partitioning: равномерное распределение
PARTITION BY HASH (user_id);</code></pre>

<h3>Репликация</h3>
<pre><code>Streaming Replication (физическая):
  Primary → WAL → Standby (read-only replica)
  Sync: COMMIT ждёт подтверждения от standby (надёжно, медленнее)
  Async: COMMIT не ждёт (быстро, возможна потеря данных при сбое)

Logical Replication:
  Репликация отдельных таблиц / изменений логического уровня
  Можно реплицировать в другую версию PostgreSQL</code></pre>

<h3>CAP теорема</h3>
<pre><code>Consistency    — все узлы видят одни данные
Availability   — система отвечает на запросы
Partition tol. — работает при разрыве сети

Выбор двух из трёх:
  CP: HBase, Zookeeper    — согласованность + разделение
  AP: Cassandra, CouchDB  — доступность + разделение
  CA: традиционные РСУБД  — согласованность + доступность (один узел)</code></pre>

<h3>Шардирование</h3>
<pre><code>-- Горизонтальное масштабирование: данные делятся по узлам
-- Consistent Hashing: hash(user_id) % N_shards → shard_number

-- Проблемы:
-- JOIN между шардами — дорого
-- Транзакции между шардами — 2PC (двухфазный коммит)
-- Hot shard — неравномерное распределение</code></pre>`,
      tasks: [
        {
          id: 'sql_ch15_t1', title: 'Partition Pruning', difficulty: 'medium',
          description: '<p>Смоделируйте партиционирование по году: разбейте заказы на партиции orders_2022, orders_2023, orders_2024. Реализуйте "partition pruning" — поиск только в нужной партиции.</p>',
          hints: ['Map<Integer, List<String>> partitions', 'Ключ = год из даты заказа'],
          startCode: `import java.util.*;
public class Main {
    static Map<Integer, List<String>> partitions = new TreeMap<>();

    static void insert(String order) {
        int year = Integer.parseInt(order.split(",")[1].substring(0, 4));
        partitions.computeIfAbsent(year, k -> new ArrayList<>()).add(order);
    }

    static List<String> queryYear(int year) {
        System.out.println("Partition pruning: читаем только партицию orders_" + year);
        return partitions.getOrDefault(year, Collections.emptyList());
    }

    public static void main(String[] args) {
        insert("1,2022-03-15,500"); insert("2,2022-11-20,300");
        insert("3,2023-01-05,800"); insert("4,2023-07-18,200");
        insert("5,2024-02-10,600"); insert("6,2024-09-25,900");

        System.out.println("Партиции: " + partitions.keySet());
        List<String> res = queryYear(2023);
        System.out.println("Заказы 2023: " + res);
        System.out.println("Просмотрено " + res.size() + " из " +
            partitions.values().stream().mapToInt(List::size).sum() + " строк");
    }
}`
        },
        {
          id: 'sql_ch15_t2', title: 'Consistent Hashing', difficulty: 'hard',
          description: '<p>Реализуйте consistent hashing для шардирования: распределите пользователей по 3 шардам. Покажите распределение.</p>',
          hints: ['hash = userId % numShards', 'Считайте количество записей на каждый шард'],
          startCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int numShards = 3;
        int[] userIds = new int[100];
        for (int i = 0; i < 100; i++) userIds[i] = i + 1;

        // Consistent hashing: shard = hash(userId) % numShards
        Map<Integer,Integer> shardCount = new TreeMap<>();
        Map<Integer,List<Integer>> shardData = new TreeMap<>();
        for (int uid : userIds) {
            int shard = Math.abs(Objects.hash(uid)) % numShards;
            shardCount.merge(shard, 1, Integer::sum);
            shardData.computeIfAbsent(shard, k -> new ArrayList<>()).add(uid);
        }
        System.out.println("Распределение по " + numShards + " шардам:");
        shardCount.forEach((shard, count) ->
            System.out.printf("  shard_%d: %3d записей (%.1f%%)%n",
                shard, count, 100.0 * count / userIds.length));
    }
}`
        }
      ]
    },

    /* ═══════════ Ch16: Администрирование ═══════════ */
    {
      id: 'sql_ch16',
      title: 'Администрирование и обслуживание',
      lecture: `<h2>Администрирование PostgreSQL</h2>

<h3>Бэкапы</h3>
<pre><code>-- pg_dump: логический бэкап
pg_dump -U postgres -d mydb -f backup.sql
pg_dump -U postgres -d mydb -Fc -f backup.dump   -- custom format (сжатие)
pg_dump -U postgres -d mydb -t employees -f emp.sql  -- только таблица

-- Восстановление
psql -U postgres -d mydb < backup.sql
pg_restore -U postgres -d mydb backup.dump

-- pg_basebackup: физический бэкап (PITR)
pg_basebackup -D /backup/base -Ft -z -P

-- PITR (Point-in-Time Recovery): восстановление до любого момента
-- Требует: pg_basebackup + WAL-архивирование
-- postgresql.conf:
archive_mode = on
archive_command = 'cp %p /wal_archive/%f'</code></pre>

<h3>Мониторинг</h3>
<pre><code>-- Самые медленные запросы:
SELECT query, calls, mean_exec_time, total_exec_time
FROM   pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Состояние таблиц:
SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_analyze
FROM   pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Активные запросы:
SELECT pid, query, state, query_start
FROM   pg_stat_activity
WHERE  state = 'active';

-- Размер таблиц:
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM   pg_tables
WHERE  schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;</code></pre>

<h3>Пулы соединений</h3>
<pre><code>PgBouncer:
  Режимы: Session (одно соединение на клиента)
          Transaction (соединение на транзакцию) — РЕКОМЕНДУЕТСЯ
          Statement   (соединение на запрос)

Pgpool-II: нагрузочная балансировка + failover

Правило: PostgreSQL эффективен при ~100-200 соединениях.
  При тысячах клиентов → PgBouncer + Transaction mode.</code></pre>

<h3>Flyway / Liquibase — миграции</h3>
<pre><code>-- Flyway: версионированные SQL-файлы
V1__create_employees.sql
V2__add_salary_index.sql
V3__rename_column.sql

-- Выполнение:
mvn flyway:migrate

-- Liquibase: XML/YAML changesets
-- Оба инструмента: атомарные миграции, история изменений</code></pre>

<h3>Full-Text Search</h3>
<pre><code>-- tsvector: предобработанный текст для поиска
SELECT to_tsvector('english', 'The quick brown fox jumped');
-- 'brown':3 'fox':4 'jump':5 'quick':2

-- Поиск:
SELECT * FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'quick & fox');

-- Индекс для ускорения:
CREATE INDEX idx_fts ON articles USING GIN (to_tsvector('english', content));

-- GIN индекс ускоряет FTS в 10-100 раз на больших таблицах!</code></pre>`,
      tasks: [
        {
          id: 'sql_ch16_t1', title: 'Мониторинг мёртвых строк', difficulty: 'medium',
          description: '<p>Смоделируйте pg_stat_user_tables: отслеживайте количество live и dead строк после операций INSERT/UPDATE/DELETE. Определите, когда нужен VACUUM (dead > 20% от live).</p>',
          hints: ['При UPDATE: live не меняется, dead += 1', 'vacuum_needed = dead / live > 0.2'],
          startCode: `public class Main {
    static int live = 0, dead = 0;
    static int totalOps = 0;

    static void insert(int count) { live += count; totalOps++; }
    static void update(int count) { dead += count; totalOps++; } // old versions become dead
    static void delete(int count) { live -= count; dead += count; totalOps++; }
    static void vacuum()          { dead = 0; System.out.println("  VACUUM выполнен"); }

    static void stats() {
        double ratio = live > 0 ? (double)dead / live : 0;
        boolean needVacuum = ratio > 0.2;
        System.out.printf("live=%-5d dead=%-5d ratio=%.2f %s%n",
            live, dead, ratio, needVacuum ? "← VACUUM NEEDED!" : "");
    }

    public static void main(String[] args) {
        System.out.println("Симуляция pg_stat_user_tables:");
        insert(1000); System.out.print("После INSERT 1000: "); stats();
        update(100);  System.out.print("После UPDATE 100:  "); stats();
        update(200);  System.out.print("После UPDATE 200:  "); stats();
        // Ожидаем: dead/live = 300/1000 = 0.30 > 0.20 → VACUUM NEEDED
        vacuum();
        System.out.print("После VACUUM:      "); stats();
    }
}`
        },
        {
          id: 'sql_ch16_t2', title: 'Генератор миграций', difficulty: 'medium',
          description: '<p>Реализуйте простую систему миграций: список версионированных SQL-скриптов. "Выполните" только те, что ещё не применялись.</p>',
          hints: ['Set<String> applied — уже применённые миграции', 'Сортируйте по версии (V1, V2, ...)'],
          startCode: `import java.util.*;
public class Main {
    static Set<String> appliedMigrations = new HashSet<>(Arrays.asList("V1","V2"));

    static void migrate(String[][] scripts) {
        Arrays.sort(scripts, Comparator.comparing(s -> s[0]));
        System.out.println("Flyway migration:");
        for (String[] m : scripts) {
            if (appliedMigrations.contains(m[0])) {
                System.out.println("  " + m[0] + " [уже выполнена, пропуск]");
            } else {
                System.out.println("  " + m[0] + " Executing: " + m[1]);
                appliedMigrations.add(m[0]);
            }
        }
        System.out.println("Migration complete. Applied: " + appliedMigrations.size());
    }

    public static void main(String[] args) {
        String[][] migrations = {
            {"V1","CREATE TABLE employees (...)"},
            {"V2","ALTER TABLE employees ADD COLUMN phone VARCHAR(20)"},
            {"V3","CREATE INDEX idx_emp_dept ON employees(dept_id)"},
            {"V4","ALTER TABLE employees ALTER COLUMN salary TYPE NUMERIC(12,2)"}
        };
        migrate(migrations);
    }
}`
        }
      ]
    }
  ]
});
