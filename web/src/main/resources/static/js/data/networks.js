'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'networks',
  title: 'Сети и HTTP',
  icon: '🌐',
  description: 'TCP/IP, HTTP, WebSocket, Socket, REST клиент, JSON',
  color: '#a855f7',
  chapters: [
    {
      id: 'net_ch1',
      title: 'Основы сетей',
      lecture: `<h2>Основы компьютерных сетей</h2>

<h3>Модель OSI</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#1e293b"><th style="padding:8px;border:1px solid #334155">Уровень</th><th style="padding:8px;border:1px solid #334155">Название</th><th style="padding:8px;border:1px solid #334155">Пример протоколов</th></tr>
<tr><td style="padding:8px;border:1px solid #334155">7</td><td style="padding:8px;border:1px solid #334155">Прикладной</td><td style="padding:8px;border:1px solid #334155">HTTP, FTP, SMTP, DNS</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">6</td><td style="padding:8px;border:1px solid #334155">Представления</td><td style="padding:8px;border:1px solid #334155">TLS, SSL, JSON, XML</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">5</td><td style="padding:8px;border:1px solid #334155">Сеансовый</td><td style="padding:8px;border:1px solid #334155">NetBIOS, RPC</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">4</td><td style="padding:8px;border:1px solid #334155">Транспортный</td><td style="padding:8px;border:1px solid #334155">TCP, UDP</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">3</td><td style="padding:8px;border:1px solid #334155">Сетевой</td><td style="padding:8px;border:1px solid #334155">IP, ICMP</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">2</td><td style="padding:8px;border:1px solid #334155">Канальный</td><td style="padding:8px;border:1px solid #334155">Ethernet, Wi-Fi</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">1</td><td style="padding:8px;border:1px solid #334155">Физический</td><td style="padding:8px;border:1px solid #334155">Кабели, радиоволны</td></tr>
</table>

<h3>IP-адреса и порты</h3>
<pre><code>// IP — адрес хоста
127.0.0.1  = localhost (сам компьютер)
0.0.0.0    = все интерфейсы
192.168.x.x = локальная сеть

// Порты (0–65535)
80   = HTTP
443  = HTTPS
22   = SSH
3306 = MySQL
5432 = PostgreSQL
8080 = Java-приложения (dev)</code></pre>

<h3>TCP vs UDP</h3>
<ul>
<li><strong>TCP</strong>: надёжная доставка, подтверждения, порядок → HTTP, SMTP</li>
<li><strong>UDP</strong>: быстрая, без подтверждений → видео-стриминг, DNS, игры</li>
</ul>

<h3>DNS</h3>
<p>Переводит доменное имя в IP: <code>google.com → 142.250.185.46</code></p>`,
      tasks: [
        {
          id: 'net_t1', title: 'Парсинг URL', difficulty: 'easy',
          description: '<p>Напишите метод, который разбирает URL на части: протокол, хост, порт, путь. Для <code>http://api.example.com:8080/users/1</code> выведите каждую часть.</p>',
          hints: ['url.split("://") — разделяет протокол и остаток', 'Дальше разбивайте по ":", "/" и т.д.', 'Или используйте java.net.URL'],
          startCode: `public class Main {
    static void parseUrl(String url) {
        // Разберите URL на части:
        // protocol: http
        // host: api.example.com
        // port: 8080
        // path: /users/1
    }

    public static void main(String[] args) {
        parseUrl("http://api.example.com:8080/users/1");
        parseUrl("https://github.com/user/repo");
    }
}`
        },
        {
          id: 'net_t2', title: 'Симуляция HTTP запроса', difficulty: 'easy',
          description: '<p>Создайте классы <code>HttpRequest</code> и <code>HttpResponse</code>. Симулируйте GET и POST запросы (без реальной сети). Роутер выбирает ответ по методу и пути.</p>',
          hints: ['class HttpRequest { String method; String path; String body; }', 'class HttpResponse { int status; String body; }', 'Map<String, ...> routes'],
          startCode: `import java.util.*;
public class Main {
    static class HttpRequest {
        String method, path, body;
        HttpRequest(String method, String path) { this.method=method; this.path=path; }
        HttpRequest(String method, String path, String body) { this(method,path); this.body=body; }
    }

    static class HttpResponse {
        int status; String body;
        HttpResponse(int status, String body) { this.status=status; this.body=body; }
        public String toString() { return "HTTP " + status + " | " + body; }
    }

    static class SimpleRouter {
        // Добавьте маршруты GET /users → "список пользователей"
        // POST /users → "пользователь создан"
        // иначе → 404

        HttpResponse handle(HttpRequest req) {
            // реализуйте роутинг
            return new HttpResponse(404, "Not Found");
        }
    }

    public static void main(String[] args) {
        SimpleRouter router = new SimpleRouter();
        System.out.println(router.handle(new HttpRequest("GET", "/users")));
        System.out.println(router.handle(new HttpRequest("POST", "/users", "{name:Alice}")));
        System.out.println(router.handle(new HttpRequest("GET", "/unknown")));
    }
}`
        },
        {
          id: 'net_t3', title: 'Парсинг JSON вручную', difficulty: 'medium',
          description: '<p>Напишите простой парсер, который извлекает значение по ключу из плоского JSON-объекта. Для <code>{"name":"Alice","age":"25","city":"Moscow"}</code> и ключа "name" вернуть "Alice".</p>',
          hints: ['Удалить { и }', 'Разделить по ,', 'Каждую пару разделить по : и взять значение в кавычках'],
          startCode: `import java.util.*;
public class Main {
    static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> result = new HashMap<>();
        // Удалите { } и разберите пары "key":"value"
        return result;
    }

    public static void main(String[] args) {
        String json = "{\"name\":\"Alice\",\"age\":\"25\",\"city\":\"Moscow\"}";
        Map<String, String> data = parseSimpleJson(json);
        System.out.println(data.get("name")); // Alice
        System.out.println(data.get("age"));  // 25
        System.out.println(data.get("city")); // Moscow
    }
}`
        }
      ]
    },
    {
      id: 'net_ch2',
      title: 'HTTP и REST',
      lecture: `<h2>HTTP — Hypertext Transfer Protocol</h2>

<h3>Структура HTTP-запроса</h3>
<pre><code>GET /api/users/1 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer token123
Content-Type: application/json

{
  "name": "Alice"
}</code></pre>

<h3>Структура HTTP-ответа</h3>
<pre><code>HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45

{
  "id": 1,
  "name": "Alice",
  "email": "alice@test.com"
}</code></pre>

<h3>Заголовки (Headers)</h3>
<pre><code>// Запрос
Content-Type: application/json      // тип тела
Authorization: Bearer jwt_token     // аутентификация
Accept: application/json            // ожидаемый формат

// Ответ
Cache-Control: max-age=3600         // кеширование
Location: /api/users/5              // (201 Created) адрес ресурса
Set-Cookie: session=abc; HttpOnly   // установить cookie</code></pre>

<h3>Java HttpClient (Java 11+)</h3>
<pre><code>import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

// GET запрос
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/users"))
    .header("Accept", "application/json")
    .GET()
    .build();

HttpResponse&lt;String&gt; response = client.send(request,
    HttpResponse.BodyHandlers.ofString());

System.out.println(response.statusCode()); // 200
System.out.println(response.body());       // JSON

// POST запрос
HttpRequest postRequest = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/users"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"Alice\"}"))
    .build();</code></pre>`,
      tasks: [
        {
          id: 'net_t4', title: 'HTTP-статус коды', difficulty: 'easy',
          description: '<p>Создайте метод <code>getStatusDescription(int code)</code> который возвращает описание HTTP кода. Покройте коды: 200, 201, 204, 400, 401, 403, 404, 409, 500, 503.</p>',
          hints: ['Используйте switch expression (Java 14+)', 'default -> "Unknown status"'],
          startCode: `public class Main {
    static String getStatusDescription(int code) {
        return switch (code) {
            // добавьте все коды
            default -> "Unknown status code";
        };
    }

    public static void main(String[] args) {
        int[] codes = {200, 201, 204, 400, 401, 403, 404, 409, 500, 503};
        for (int code : codes) {
            System.out.println(code + " → " + getStatusDescription(code));
        }
    }
}`
        },
        {
          id: 'net_t5', title: 'HTTP-заголовки', difficulty: 'medium',
          description: '<p>Реализуйте класс <code>HttpHeaders</code> — хранит заголовки как Map. Методы: <code>add()</code>, <code>get()</code>, <code>getAll()</code>, <code>contains()</code>. Добавьте несколько заголовков и проверьте.</p>',
          hints: ['Map<String, List<String>> headers', 'Заголовки case-insensitive — ключи toLowerCase()', 'Один ключ может иметь несколько значений'],
          startCode: `import java.util.*;
public class Main {
    static class HttpHeaders {
        private Map<String, List<String>> headers = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

        void add(String name, String value) {
            // добавьте заголовок (несколько значений для одного имени)
        }

        String get(String name) {
            // вернуть первое значение заголовка
            return null;
        }

        List<String> getAll(String name) {
            return headers.getOrDefault(name.toLowerCase(), Collections.emptyList());
        }

        boolean contains(String name) { return headers.containsKey(name); }

        void print() {
            headers.forEach((k, v) -> System.out.println(k + ": " + String.join(", ", v)));
        }
    }

    public static void main(String[] args) {
        HttpHeaders h = new HttpHeaders();
        h.add("Content-Type", "application/json");
        h.add("Accept", "text/html");
        h.add("Accept", "application/json");

        System.out.println(h.get("content-type")); // application/json
        System.out.println(h.getAll("Accept"));     // [text/html, application/json]
        System.out.println(h.contains("Authorization")); // false
        h.print();
    }
}`
        }
      ]
    }
  ]
});
