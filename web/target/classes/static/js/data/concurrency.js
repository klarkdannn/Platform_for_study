'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'concurrency',
  title: 'Многопоточность',
  icon: '⚡',
  description: 'Thread, ExecutorService, синхронизация, CompletableFuture',
  color: '#f59e0b',
  chapters: [
    {
      id: 'con_ch1',
      title: 'Потоки (Thread)',
      lecture: `<h2>Потоки в Java</h2>
<p>Поток (Thread) — единица выполнения программы. JVM запускает несколько потоков параллельно.</p>

<h3>Создание потоков</h3>
<pre><code>// Способ 1: extends Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Поток: " + getName());
    }
}
new MyThread().start();

// Способ 2: implements Runnable (предпочтительно)
Runnable task = () -> System.out.println("Runnable поток");
Thread t = new Thread(task, "worker-1");
t.start();

// Важно: start() != run()!
// start() → создаёт новый поток → JVM вызывает run()
// run()   → выполняет в текущем потоке (не параллельно!)</code></pre>

<h3>Методы Thread</h3>
<pre><code>Thread.currentThread().getName();  // имя текущего потока
Thread.sleep(1000);                // спать 1 секунду
thread.join();                     // ждать завершения потока
thread.interrupt();                // прервать поток
Thread.currentThread().isInterrupted(); // проверить флаг</code></pre>

<h3>Race condition — проблема</h3>
<pre><code>// ОПАСНО: несколько потоков меняют одну переменную
class Counter {
    int count = 0;
    void increment() { count++; } // НЕ атомарная операция!
}
// count++ = read + add + write — между ними может вмешаться другой поток</code></pre>`,
      tasks: [
        {
          id: 'con_t1', title: 'Простой поток', difficulty: 'easy',
          description: '<p>Создайте поток через Runnable, который выводит числа от 1 до 5 с именем потока. Запустите и дождитесь завершения через <code>join()</code>.</p>',
          hints: ['Thread t = new Thread(() -> { for (int i=1;i<=5;i++) System.out.println(Thread.currentThread().getName()+": "+i); });', 't.start(); t.join();'],
          startCode: `public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            // выведите числа 1-5 с именем потока
        }, "worker");

        t.start();
        t.join(); // ждём завершения
        System.out.println("Главный поток продолжается");
    }
}`
        },
        {
          id: 'con_t2', title: 'Два потока параллельно', difficulty: 'easy',
          description: '<p>Запустите два потока: первый считает чётные числа (2,4,6,...,10), второй — нечётные (1,3,5,...,9). Оба работают параллельно. Дождитесь оба через join().</p>',
          hints: ['Thread t1 = new Thread(...); Thread t2 = new Thread(...);', 't1.start(); t2.start(); t1.join(); t2.join();'],
          startCode: `public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread evens = new Thread(() -> {
            // выведите чётные числа
        }, "even-thread");

        Thread odds = new Thread(() -> {
            // выведите нечётные числа
        }, "odd-thread");

        // запустите оба, дождитесь завершения
    }
}`
        },
        {
          id: 'con_t3', title: 'AtomicInteger', difficulty: 'medium',
          description: '<p>Продемонстрируйте race condition: 10 потоков по 1000 раз делают count++. Покажите результат с обычным int (< 10000) и с AtomicInteger (ровно 10000).</p>',
          hints: ['AtomicInteger count = new AtomicInteger(0);', 'count.incrementAndGet();', 'Для обычного int — результат будет меньше 10000 из-за race condition'],
          startCode: `import java.util.concurrent.atomic.AtomicInteger;
public class Main {
    static int unsafeCount = 0;
    static AtomicInteger safeCount = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    unsafeCount++;           // небезопасно
                    safeCount.incrementAndGet(); // атомарно
                }
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();

        System.out.println("Unsafe: " + unsafeCount); // < 10000 (возможно)
        System.out.println("Safe:   " + safeCount);   // всегда 10000
    }
}`
        }
      ]
    },
    {
      id: 'con_ch2',
      title: 'ExecutorService',
      lecture: `<h2>ExecutorService — пул потоков</h2>
<p>Управляет пулом потоков. Не нужно создавать Thread вручную.</p>

<pre><code>import java.util.concurrent.*;

// Фиксированный пул из 4 потоков
ExecutorService executor = Executors.newFixedThreadPool(4);

// Однопоточный
ExecutorService single = Executors.newSingleThreadExecutor();

// Кешированный (для короткоживущих задач)
ExecutorService cached = Executors.newCachedThreadPool();

// Плановый (для расписания)
ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(2);

// Отправка задачи
executor.execute(() -> System.out.println("Задача выполнена"));

// Future — результат асинхронной задачи
Future&lt;Integer&gt; future = executor.submit(() -> {
    Thread.sleep(1000);
    return 42;
});
int result = future.get(); // блокирует до получения результата

// Завершение
executor.shutdown();              // ждёт завершения задач
executor.shutdownNow();           // немедленная остановка</code></pre>

<h3>CompletableFuture (Java 8+)</h3>
<pre><code>CompletableFuture&lt;String&gt; cf = CompletableFuture
    .supplyAsync(() -> fetchUser(1))         // асинхронно
    .thenApply(user -> user.getName())       // преобразовать
    .thenApply(String::toUpperCase)          // ещё раз
    .exceptionally(ex -> "Error: " + ex.getMessage()); // обработка ошибок

String result = cf.get();</code></pre>`,
      tasks: [
        {
          id: 'con_t4', title: 'Пул потоков', difficulty: 'easy',
          description: '<p>Создайте пул из 3 потоков, отправьте 6 задач (каждая выводит номер задачи и имя потока). Завершите корректно через shutdown().</p>',
          hints: ['ExecutorService pool = Executors.newFixedThreadPool(3);', 'pool.execute(() -> ...);', 'pool.shutdown();'],
          startCode: `import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 6; i++) {
            final int taskNum = i;
            pool.execute(() -> {
                // выведите: "Задача N выполняется в " + Thread.currentThread().getName()
            });
        }

        pool.shutdown();
        // pool.awaitTermination(5, TimeUnit.SECONDS);
    }
}`
        },
        {
          id: 'con_t5', title: 'Future результат', difficulty: 'medium',
          description: '<p>Используйте <code>submit()</code> чтобы асинхронно вычислить сумму чисел от 1 до N. Получите результат через <code>Future.get()</code>. Запустите 3 такие задачи параллельно.</p>',
          hints: ['Future<Long> f = executor.submit(() -> { long sum=0; for(int i=1;i<=n;i++) sum+=i; return sum; });', 'f.get() — ждём результат'],
          startCode: `import java.util.concurrent.*;
import java.util.*;
public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        int[] ranges = {100, 1000, 10000};
        List<Future<Long>> futures = new ArrayList<>();

        for (int n : ranges) {
            final int limit = n;
            futures.add(executor.submit(() -> {
                // вычислите сумму от 1 до limit
                return 0L;
            }));
        }

        for (int i = 0; i < ranges.length; i++) {
            System.out.println("Sum 1.." + ranges[i] + " = " + futures.get(i).get());
        }

        executor.shutdown();
    }
}`
        }
      ]
    },
    {
      id: 'con_ch3',
      title: 'Синхронизация',
      lecture: `<h2>Синхронизация потоков</h2>

<h3>synchronized — монитор объекта</h3>
<pre><code>public class BankAccount {
    private double balance;

    // синхронизированный метод — только один поток за раз
    public synchronized void deposit(double amount) {
        balance += amount;
    }

    // синхронизированный блок (явно выбираем lock-объект)
    public void withdraw(double amount) {
        synchronized (this) {
            if (balance >= amount) balance -= amount;
        }
    }
}</code></pre>

<h3>ReentrantLock — явная блокировка</h3>
<pre><code>import java.util.concurrent.locks.ReentrantLock;

ReentrantLock lock = new ReentrantLock();

public void transfer(double amount) {
    lock.lock();
    try {
        balance -= amount;
    } finally {
        lock.unlock(); // всегда в finally!
    }
}</code></pre>

<h3>volatile — видимость между потоками</h3>
<pre><code>// volatile гарантирует, что изменение видно всем потокам
private volatile boolean running = true;

// В другом потоке:
running = false; // остановит первый поток</code></pre>

<h3>Concurrent коллекции</h3>
<pre><code>ConcurrentHashMap&lt;String, Integer&gt; map = new ConcurrentHashMap&lt;&gt;();
CopyOnWriteArrayList&lt;String&gt; list = new CopyOnWriteArrayList&lt;&gt;();
BlockingQueue&lt;String&gt; queue = new LinkedBlockingQueue&lt;&gt;(100);</code></pre>`,
      tasks: [
        {
          id: 'con_t6', title: 'Synchronized счётчик', difficulty: 'easy',
          description: '<p>Исправьте небезопасный счётчик добавив synchronized. Убедитесь что 10 потоков по 1000 инкрементов дают ровно 10000.</p>',
          hints: ['public synchronized void increment()', 'Или: synchronized(this) { count++; }'],
          startCode: `public class Main {
    static class Counter {
        private int count = 0;

        // сделайте этот метод потокобезопасным
        public void increment() {
            count++;
        }

        public int getCount() { return count; }
    }

    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Thread[] threads = new Thread[10];

        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) counter.increment();
            });
            threads[i].start();
        }

        for (Thread t : threads) t.join();
        System.out.println("Результат: " + counter.getCount()); // должно быть 10000
    }
}`
        },
        {
          id: 'con_t7', title: 'Producer-Consumer', difficulty: 'hard',
          description: '<p>Реализуйте паттерн Producer-Consumer через <code>BlockingQueue</code>. Producer генерирует числа 1-10, Consumer их обрабатывает. Используйте специальное "ядовитое" значение (-1) для остановки.</p>',
          hints: ['BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(5);', 'queue.put(item) — блокирует если очередь полна', 'queue.take() — блокирует если очередь пуста'],
          startCode: `import java.util.concurrent.*;
public class Main {
    static final int POISON = -1;

    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(5);

        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    queue.put(i);
                    System.out.println("Произвёл: " + i);
                    Thread.sleep(100);
                }
                queue.put(POISON); // сигнал остановки
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    int item = queue.take();
                    if (item == POISON) break;
                    // обработайте item
                    System.out.println("Потребил: " + item);
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
        System.out.println("Готово");
    }
}`
        }
      ]
    }
  ]
});
