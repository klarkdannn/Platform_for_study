'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'spring',
  title: 'Java Spring Boot',
  icon: '🌿',
  description: 'Spring Core, REST API, JPA, Security, тестирование',
  color: '#22c55e',
  chapters: [
    {
      id: 'sp_ch1',
      title: 'Spring Boot — быстрый старт',
      lecture: `<h2>Spring Boot — основы</h2>
<p>Spring Boot — фреймворк для быстрого создания production-ready приложений на Java. Автоматически конфигурирует Spring на основе зависимостей в classpath.</p>

<h3>Структура проекта</h3>
<pre><code>src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── DemoApplication.java      ← точка входа
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── service/
│   │   │   └── UserService.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   └── model/
│   │       └── User.java
│   └── resources/
│       └── application.properties
└── test/</code></pre>

<h3>Точка входа</h3>
<pre><code>@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}</code></pre>

<h3>application.properties</h3>
<pre><code>server.port=8080
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true</code></pre>

<h3>IoC и DI — ключевые концепции</h3>
<p><strong>Inversion of Control (IoC)</strong> — Spring управляет созданием объектов.<br>
<strong>Dependency Injection (DI)</strong> — зависимости вводятся через конструктор, поле или сеттер.</p>

<pre><code>@Service
public class UserService {
    private final UserRepository repo; // зависимость

    // DI через конструктор (рекомендуется)
    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}

@Component  // Spring создаст и управляет этим бином
public class MyComponent { ... }

@Service    // бизнес-логика
@Repository // работа с БД
@Controller // MVC-контроллер
@RestController // REST API</code></pre>`,
      tasks: [
        {
          id: 'sp_t1', title: 'Spring Bean вручную', difficulty: 'easy',
          description: '<p>Создайте два класса: <code>EmailService</code> и <code>NotificationService</code>. NotificationService зависит от EmailService. Реализуйте внедрение зависимости через конструктор вручную (без Spring — просто понять принцип DI).</p>',
          hints: ['class NotificationService { private EmailService email; NotificationService(EmailService e){...} }', 'EmailService es = new EmailService(); NotificationService ns = new NotificationService(es);'],
          startCode: `public class Main {
    static class EmailService {
        public void sendEmail(String to, String msg) {
            System.out.println("Email to " + to + ": " + msg);
        }
    }

    static class NotificationService {
        // внедрите EmailService через конструктор
        public void notify(String user) {
            // используйте emailService.sendEmail(...)
        }
    }

    public static void main(String[] args) {
        // создайте зависимости вручную
        NotificationService service = // new NotificationService(...)
        service.notify("alice@example.com");
    }
}`
        },
        {
          id: 'sp_t2', title: 'REST-аннотации (теория)', difficulty: 'easy',
          description: '<p>Напишите Java-код REST-контроллера (без запуска Spring). Создайте класс UserController с методами getUser(), createUser(), deleteUser(). Добавьте нужные аннотации в комментариях и вызовите методы напрямую.</p>',
          hints: ['// @RestController', '// @GetMapping("/users/{id}")', '// @PostMapping("/users")'],
          startCode: `public class Main {
    // @RestController
    // @RequestMapping("/api/users")
    static class UserController {

        // @GetMapping("/{id}")
        static String getUser(int id) {
            return "User #" + id;
        }

        // @PostMapping
        static String createUser(String name) {
            return "Created: " + name;
        }

        // @DeleteMapping("/{id}")
        static String deleteUser(int id) {
            return "Deleted user #" + id;
        }
    }

    public static void main(String[] args) {
        System.out.println(UserController.getUser(1));
        System.out.println(UserController.createUser("Alice"));
        System.out.println(UserController.deleteUser(1));
    }
}`
        },
        {
          id: 'sp_t3', title: 'Слоёная архитектура', difficulty: 'medium',
          description: '<p>Реализуйте трёхслойную архитектуру: Repository (хранит список), Service (бизнес-логика), Controller (точка входа). Service зависит от Repository через конструктор. Добавьте пользователей и найдите по id.</p>',
          hints: ['class UserRepository — хранит Map<Integer, String>', 'class UserService — зависит от repo', 'class UserController — зависит от service'],
          startCode: `import java.util.*;
public class Main {

    static class UserRepository {
        private Map<Integer, String> db = new HashMap<>();
        public void save(int id, String name) { db.put(id, name); }
        public String findById(int id) { return db.get(id); }
    }

    static class UserService {
        // внедрите UserRepository
        public String getUserName(int id) {
            // используйте repo
            return null;
        }
    }

    static class UserController {
        // внедрите UserService
        public void handleGetUser(int id) {
            System.out.println(/* получите пользователя через service */ null);
        }
    }

    public static void main(String[] args) {
        // собрать вручную
        UserRepository repo = new UserRepository();
        repo.save(1, "Alice"); repo.save(2, "Bob");

        UserService service = new UserService(/* repo */);
        UserController controller = new UserController(/* service */);

        controller.handleGetUser(1); // Alice
        controller.handleGetUser(3); // null
    }
}`
        }
      ]
    },
    {
      id: 'sp_ch2',
      title: 'REST API',
      lecture: `<h2>REST API в Spring Boot</h2>
<p>REST (Representational State Transfer) — архитектурный стиль для создания веб-сервисов.</p>

<h3>HTTP методы</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#1e293b"><th style="padding:8px;border:1px solid #334155">Метод</th><th style="padding:8px;border:1px solid #334155">Действие</th><th style="padding:8px;border:1px solid #334155">Пример URL</th></tr>
<tr><td style="padding:8px;border:1px solid #334155">GET</td><td style="padding:8px;border:1px solid #334155">Получить данные</td><td style="padding:8px;border:1px solid #334155">GET /api/users</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">POST</td><td style="padding:8px;border:1px solid #334155">Создать</td><td style="padding:8px;border:1px solid #334155">POST /api/users</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">PUT</td><td style="padding:8px;border:1px solid #334155">Обновить полностью</td><td style="padding:8px;border:1px solid #334155">PUT /api/users/1</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">PATCH</td><td style="padding:8px;border:1px solid #334155">Обновить частично</td><td style="padding:8px;border:1px solid #334155">PATCH /api/users/1</td></tr>
<tr><td style="padding:8px;border:1px solid #334155">DELETE</td><td style="padding:8px;border:1px solid #334155">Удалить</td><td style="padding:8px;border:1px solid #334155">DELETE /api/users/1</td></tr>
</table>

<h3>Пример контроллера</h3>
<pre><code>@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public List&lt;Product&gt; getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity&lt;Product&gt; getById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody @Valid Product product) {
        return service.save(product);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}</code></pre>

<h3>HTTP статус-коды</h3>
<ul>
<li><strong>200 OK</strong> — успех</li>
<li><strong>201 Created</strong> — создан</li>
<li><strong>204 No Content</strong> — успех без тела</li>
<li><strong>400 Bad Request</strong> — ошибка в запросе</li>
<li><strong>404 Not Found</strong> — не найдено</li>
<li><strong>500 Internal Server Error</strong> — ошибка сервера</li>
</ul>`,
      tasks: [
        {
          id: 'sp_t4', title: 'In-memory CRUD', difficulty: 'medium',
          description: '<p>Реализуйте CRUD для продуктов в памяти (без Spring): создание, чтение по id, обновление, удаление. Симулируйте REST-запросы вызовом методов.</p>',
          hints: ['Map<Integer, Product> store = new HashMap<>();', 'int nextId = 1;', 'Методы: create, findById, update, delete'],
          startCode: `import java.util.*;
public class Main {
    static class Product {
        int id; String name; double price;
        Product(int id, String name, double price) { this.id=id; this.name=name; this.price=price; }
        public String toString() { return "Product{id=" + id + ", name=" + name + ", price=" + price + "}"; }
    }

    static Map<Integer, Product> store = new HashMap<>();
    static int nextId = 1;

    // POST /products
    static Product create(String name, double price) {
        // создайте продукт, сохраните в store
        return null;
    }

    // GET /products/{id}
    static Optional<Product> findById(int id) {
        return Optional.ofNullable(store.get(id));
    }

    // PUT /products/{id}
    static boolean update(int id, String name, double price) {
        // обновите если существует
        return false;
    }

    // DELETE /products/{id}
    static boolean delete(int id) {
        return store.remove(id) != null;
    }

    public static void main(String[] args) {
        Product p = create("Laptop", 999.99);
        System.out.println(p);
        System.out.println(findById(p.id));
        update(p.id, "Laptop Pro", 1299.99);
        System.out.println(findById(p.id));
        System.out.println(delete(p.id)); // true
        System.out.println(findById(p.id)); // empty
    }
}`
        }
      ]
    },
    {
      id: 'sp_ch3',
      title: 'JPA и работа с БД',
      lecture: `<h2>Spring Data JPA</h2>
<p>JPA (Java Persistence API) — стандарт для ORM (Object-Relational Mapping) в Java. Spring Data JPA упрощает работу с БД до минимума кода.</p>

<h3>Entity</h3>
<pre><code>@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List&lt;Order&gt; orders = new ArrayList&lt;&gt;();
}</code></pre>

<h3>Repository</h3>
<pre><code>// Spring Data автоматически создаёт реализацию
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // Готовые методы: findAll(), findById(), save(), delete()

    // Derived queries — Spring сам создаёт SQL по имени метода
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByNameContaining(String name);
    List&lt;User&gt; findBySalaryGreaterThan(double salary);

    // Custom JPQL
    @Query("SELECT u FROM User u WHERE u.salary > :min ORDER BY u.salary DESC")
    List&lt;User&gt; findHighPaid(@Param("min") double minSalary);
}</code></pre>

<h3>Связи</h3>
<pre><code>// One-to-Many / Many-to-One
@Entity
public class Order {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

// Many-to-Many
@ManyToMany
@JoinTable(name = "student_course",
    joinColumns = @JoinColumn(name = "student_id"),
    inverseJoinColumns = @JoinColumn(name = "course_id"))
private Set&lt;Course&gt; courses;</code></pre>`,
      tasks: [
        {
          id: 'sp_t5', title: 'ORM вручную (симуляция)', difficulty: 'medium',
          description: '<p>Реализуйте простой ORM-подобный репозиторий для User. Класс <code>UserRepository</code> хранит объекты в Map. Методы: <code>save()</code>, <code>findById()</code>, <code>findAll()</code>, <code>deleteById()</code>, <code>findByName()</code>.</p>',
          hints: ['Map<Long, User> storage', 'AtomicLong idGen = new AtomicLong(1)', 'findByName: filter через stream'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    static class User {
        long id; String name; String email;
        User(long id, String name, String email) { this.id=id; this.name=name; this.email=email; }
        public String toString() { return "User{id="+id+", name="+name+"}"; }
    }

    static class UserRepository {
        private Map<Long, User> storage = new HashMap<>();
        private long nextId = 1;

        public User save(User user) {
            if (user.id == 0) user.id = nextId++;
            storage.put(user.id, user);
            return user;
        }

        public Optional<User> findById(long id) { return Optional.ofNullable(storage.get(id)); }
        public List<User> findAll() { return new ArrayList<>(storage.values()); }
        public boolean deleteById(long id) { return storage.remove(id) != null; }

        public List<User> findByName(String name) {
            // реализуйте поиск по имени через stream
            return Collections.emptyList();
        }
    }

    public static void main(String[] args) {
        UserRepository repo = new UserRepository();
        repo.save(new User(0, "Alice", "alice@test.com"));
        repo.save(new User(0, "Bob", "bob@test.com"));
        repo.save(new User(0, "Alice2", "alice2@test.com"));

        System.out.println(repo.findAll());
        System.out.println(repo.findByName("Alice"));
    }
}`
        }
      ]
    }
  ]
});
