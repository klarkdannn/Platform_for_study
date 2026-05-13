'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'patterns',
  title: 'Паттерны проектирования',
  icon: '🎨',
  description: 'Singleton, Factory, Observer, Strategy, Builder, Decorator',
  color: '#ec4899',
  chapters: [
    {
      id: 'pat_ch1',
      title: 'Порождающие паттерны',
      lecture: `<h2>Порождающие паттерны (Creational)</h2>
<p>Управляют созданием объектов.</p>

<h3>Singleton — единственный экземпляр</h3>
<pre><code>public class DatabaseConnection {
    private static volatile DatabaseConnection instance;

    private DatabaseConnection() {} // private конструктор

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}
// Использование: DatabaseConnection.getInstance()</code></pre>

<h3>Factory Method — фабричный метод</h3>
<pre><code>public interface Notification {
    void send(String message);
}

public class EmailNotification implements Notification {
    public void send(String msg) { System.out.println("Email: " + msg); }
}

public class SMSNotification implements Notification {
    public void send(String msg) { System.out.println("SMS: " + msg); }
}

public class NotificationFactory {
    public static Notification create(String type) {
        return switch (type) {
            case "email" -> new EmailNotification();
            case "sms"   -> new SMSNotification();
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}

// Использование:
Notification n = NotificationFactory.create("email");
n.send("Привет!");</code></pre>

<h3>Builder — пошаговое создание</h3>
<pre><code>HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.com/data"))
    .header("Content-Type", "application/json")
    .timeout(Duration.ofSeconds(30))
    .GET()
    .build();</code></pre>`,
      tasks: [
        {
          id: 'pat_t1', title: 'Singleton Logger', difficulty: 'easy',
          description: '<p>Реализуйте логгер как Singleton. Метод <code>log(String message)</code> добавляет сообщение с номером. Создайте два "экземпляра" через getInstance() и убедитесь что это один объект.</p>',
          hints: ['private static Logger instance;', 'Двойная проверка не нужна в однопоточном — достаточно простого if (instance == null)'],
          startCode: `public class Main {
    static class Logger {
        private static Logger instance;
        private int logCount = 0;

        private Logger() {}

        public static Logger getInstance() {
            // реализуйте Singleton
            return null;
        }

        public void log(String message) {
            System.out.println("[" + (++logCount) + "] " + message);
        }

        public int getLogCount() { return logCount; }
    }

    public static void main(String[] args) {
        Logger log1 = Logger.getInstance();
        Logger log2 = Logger.getInstance();

        log1.log("Application started");
        log2.log("Processing request");
        log1.log("Request complete");

        System.out.println("Один объект? " + (log1 == log2)); // true
        System.out.println("Всего логов: " + log2.getLogCount()); // 3
    }
}`
        },
        {
          id: 'pat_t2', title: 'Фабрика фигур', difficulty: 'easy',
          description: '<p>Создайте фабрику геометрических фигур. По строке "circle", "rectangle", "triangle" возвращает объект с методом <code>area()</code>.</p>',
          hints: ['interface Shape { double area(); }', 'ShapeFactory.create("circle", 5.0)'],
          startCode: `public class Main {
    interface Shape {
        double area();
        String name();
    }

    // реализуйте Circle, Rectangle, Triangle

    static class ShapeFactory {
        static Shape create(String type, double... params) {
            return switch (type) {
                // circle: params[0] = radius
                // rectangle: params[0] = width, params[1] = height
                // triangle: params[0] = base, params[1] = height
                default -> throw new IllegalArgumentException("Unknown shape: " + type);
            };
        }
    }

    public static void main(String[] args) {
        Shape c = ShapeFactory.create("circle", 5);
        Shape r = ShapeFactory.create("rectangle", 4, 6);
        System.out.printf("%s area: %.2f%n", c.name(), c.area());
        System.out.printf("%s area: %.2f%n", r.name(), r.area());
    }
}`
        },
        {
          id: 'pat_t3', title: 'Builder для запроса', difficulty: 'medium',
          description: '<p>Реализуйте паттерн Builder для класса <code>ApiRequest</code>. Поля: url, method, body, headers (Map). Метод <code>build()</code> валидирует что url не пустой.</p>',
          hints: ['class ApiRequest.Builder { ... return this; }', 'build() бросает IllegalStateException если url пустой'],
          startCode: `import java.util.*;
public class Main {
    static class ApiRequest {
        final String url, method, body;
        final Map<String, String> headers;

        private ApiRequest(Builder b) {
            this.url = b.url; this.method = b.method;
            this.body = b.body; this.headers = b.headers;
        }

        public String toString() {
            return method + " " + url + " headers=" + headers + " body=" + body;
        }

        static class Builder {
            private String url = "", method = "GET", body = "";
            private Map<String, String> headers = new HashMap<>();

            public Builder url(String url) { this.url = url; return this; }
            public Builder method(String m) { this.method = m; return this; }
            public Builder body(String b)   { this.body = b; return this; }
            public Builder header(String k, String v) {
                // добавьте заголовок
                return this;
            }

            public ApiRequest build() {
                // валидация: url не должен быть пустым
                return new ApiRequest(this);
            }
        }
    }

    public static void main(String[] args) {
        ApiRequest req = new ApiRequest.Builder()
            .url("https://api.example.com/users")
            .method("POST")
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer token")
            .body("{\"name\":\"Alice\"}")
            .build();
        System.out.println(req);

        try {
            new ApiRequest.Builder().build(); // должно выбросить исключение
        } catch (IllegalStateException e) {
            System.out.println("Поймано: " + e.getMessage());
        }
    }
}`
        }
      ]
    },
    {
      id: 'pat_ch2',
      title: 'Поведенческие паттерны',
      lecture: `<h2>Поведенческие паттерны (Behavioral)</h2>

<h3>Observer — наблюдатель</h3>
<pre><code>public interface Observer {
    void update(String event, Object data);
}

public class EventBus {
    private Map&lt;String, List&lt;Observer&gt;&gt; listeners = new HashMap&lt;&gt;();

    public void subscribe(String event, Observer observer) {
        listeners.computeIfAbsent(event, k -> new ArrayList&lt;&gt;()).add(observer);
    }

    public void publish(String event, Object data) {
        listeners.getOrDefault(event, List.of())
            .forEach(o -> o.update(event, data));
    }
}

// Использование:
EventBus bus = new EventBus();
bus.subscribe("user.created", (event, data) ->
    System.out.println("Email sent to: " + data));
bus.publish("user.created", "alice@test.com"); // Email sent to: alice@test.com</code></pre>

<h3>Strategy — стратегия</h3>
<pre><code>// Разные алгоритмы сортировки, взаимозаменяемые
interface SortStrategy {
    void sort(int[] arr);
}

class BubbleSort implements SortStrategy {
    public void sort(int[] arr) { /* пузырёк */ }
}

class QuickSort implements SortStrategy {
    public void sort(int[] arr) { /* быстрая */ }
}

class Sorter {
    private SortStrategy strategy;
    public Sorter(SortStrategy s) { this.strategy = s; }
    public void setStrategy(SortStrategy s) { this.strategy = s; }
    public void sort(int[] arr) { strategy.sort(arr); }
}</code></pre>

<h3>Command — команда</h3>
<pre><code>interface Command { void execute(); void undo(); }

class TextEditor {
    private StringBuilder text = new StringBuilder();
    private Deque&lt;Command&gt; history = new ArrayDeque&lt;&gt;();

    public void executeCommand(Command cmd) {
        cmd.execute();
        history.push(cmd);
    }

    public void undo() {
        if (!history.isEmpty()) history.pop().undo();
    }
}</code></pre>`,
      tasks: [
        {
          id: 'pat_t4', title: 'EventBus (Observer)', difficulty: 'medium',
          description: '<p>Реализуйте простой EventBus: <code>subscribe(event, handler)</code> и <code>publish(event, data)</code>. Подпишите несколько обработчиков на события "login" и "logout".</p>',
          hints: ['Map<String, List<Consumer<Object>>> listeners', '.computeIfAbsent(event, k -> new ArrayList<>()).add(handler)'],
          startCode: `import java.util.*;
import java.util.function.Consumer;
public class Main {
    static class EventBus {
        private Map<String, List<Consumer<Object>>> listeners = new HashMap<>();

        void subscribe(String event, Consumer<Object> handler) {
            // реализуйте подписку
        }

        void publish(String event, Object data) {
            // реализуйте публикацию
        }
    }

    public static void main(String[] args) {
        EventBus bus = new EventBus();

        bus.subscribe("login", data -> System.out.println("Лог: вход " + data));
        bus.subscribe("login", data -> System.out.println("Email: добро пожаловать, " + data));
        bus.subscribe("logout", data -> System.out.println("Лог: выход " + data));

        bus.publish("login", "Alice");
        bus.publish("logout", "Alice");
        bus.publish("login", "Bob");
    }
}`
        },
        {
          id: 'pat_t5', title: 'Undo/Redo (Command)', difficulty: 'hard',
          description: '<p>Реализуйте текстовый редактор с паттерном Command. Команды: AddText, DeleteLast. Поддержите undo() — отмену последнего действия через стек.</p>',
          hints: ['interface Command { void execute(); void undo(); }', 'Deque<Command> history', 'AddText.undo() удаляет добавленный текст'],
          startCode: `import java.util.*;
public class Main {
    interface Command {
        void execute();
        void undo();
    }

    static class TextEditor {
        StringBuilder text = new StringBuilder();
        Deque<Command> history = new ArrayDeque<>();

        void execute(Command cmd) {
            cmd.execute();
            history.push(cmd);
        }

        void undo() {
            if (!history.isEmpty()) history.pop().undo();
        }

        String getText() { return text.toString(); }
    }

    static class AddText implements Command {
        TextEditor editor; String addition;
        AddText(TextEditor e, String a) { editor=e; addition=a; }

        public void execute() {
            // добавьте текст
        }

        public void undo() {
            // отмените добавление
        }
    }

    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        editor.execute(new AddText(editor, "Hello"));
        editor.execute(new AddText(editor, " World"));
        System.out.println(editor.getText()); // Hello World

        editor.undo();
        System.out.println(editor.getText()); // Hello

        editor.undo();
        System.out.println(editor.getText()); // (пусто)
    }
}`
        }
      ]
    }
  ]
});
