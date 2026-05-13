'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'devops',
  title: 'DevOps основы',
  icon: '🚀',
  description: 'Docker, CI/CD, Maven, Linux команды, мониторинг',
  color: '#64748b',
  chapters: [
    {
      id: 'devops_ch1',
      title: 'Maven — сборка проектов',
      lecture: `<h2>Maven — система сборки Java</h2>
<p>Maven управляет зависимостями, компиляцией, тестированием и упаковкой Java-проектов.</p>

<h3>Структура pom.xml</h3>
<pre><code>&lt;project&gt;
  &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;

  &lt;!-- Координаты проекта --&gt;
  &lt;groupId&gt;com.example&lt;/groupId&gt;
  &lt;artifactId&gt;my-app&lt;/artifactId&gt;
  &lt;version&gt;1.0.0&lt;/version&gt;
  &lt;packaging&gt;jar&lt;/packaging&gt;

  &lt;properties&gt;
    &lt;java.version&gt;21&lt;/java.version&gt;
    &lt;maven.compiler.source&gt;21&lt;/maven.compiler.source&gt;
  &lt;/properties&gt;

  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
      &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
      &lt;version&gt;3.2.0&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
      &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
      &lt;version&gt;5.10.0&lt;/version&gt;
      &lt;scope&gt;test&lt;/scope&gt; &lt;!-- только для тестов --&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/project&gt;</code></pre>

<h3>Жизненный цикл Maven</h3>
<pre><code>mvn clean          # удалить target/
mvn compile        # компилировать src/main/java
mvn test           # запустить тесты
mvn package        # создать JAR
mvn install        # установить в локальный репозиторий ~/.m2
mvn deploy         # опубликовать в удалённый репозиторий

# Часто используемые комбинации:
mvn clean package -DskipTests   # собрать без тестов
mvn clean test                   # чистая сборка + тесты</code></pre>

<h3>Области видимости (scope)</h3>
<ul>
<li><code>compile</code> — по умолчанию, попадает в JAR</li>
<li><code>test</code> — только для тестов</li>
<li><code>provided</code> — предоставляется сервером (не в JAR)</li>
<li><code>runtime</code> — нужен при выполнении, не компиляции</li>
</ul>`,
      tasks: [
        {
          id: 'devops_t1', title: 'Парсер зависимостей Maven', difficulty: 'easy',
          description: '<p>Напишите парсер, который из строк вида <code>"groupId:artifactId:version"</code> создаёт объект Dependency и сортирует зависимости по artifactId.</p>',
          hints: ['split(":")', 'Comparator.comparing(d -> d.artifactId)'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    static class Dependency {
        String groupId, artifactId, version;
        Dependency(String g, String a, String v) { groupId=g; artifactId=a; version=v; }
        public String toString() { return groupId + ":" + artifactId + ":" + version; }
    }

    static Dependency parse(String dep) {
        String[] parts = dep.split(":");
        // создайте объект Dependency
        return null;
    }

    public static void main(String[] args) {
        List<String> deps = Arrays.asList(
            "org.springframework.boot:spring-boot-starter-web:3.2.0",
            "org.junit.jupiter:junit-jupiter:5.10.0",
            "com.fasterxml.jackson.core:jackson-databind:2.16.0"
        );

        List<Dependency> parsed = deps.stream()
            .map(Main::parse)
            // отсортируйте по artifactId
            .collect(Collectors.toList());

        parsed.forEach(System.out::println);
    }
}`
        },
        {
          id: 'devops_t2', title: 'Версионное сравнение', difficulty: 'medium',
          description: '<p>Напишите метод сравнения версий в формате "major.minor.patch". Для "1.2.3" и "1.2.4" вернуть -1 (первая старше), для "2.0.0" и "1.9.9" вернуть 1.</p>',
          hints: ['split("\\\\.")', 'Сравнивайте поочерёдно: major, minor, patch', 'Integer.parseInt(parts[i])'],
          startCode: `public class Main {
    static int compareVersions(String v1, String v2) {
        String[] p1 = v1.split("\\.");
        String[] p2 = v2.split("\\.");
        // сравните поочерёдно major, minor, patch
        // возвратите -1, 0 или 1
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(compareVersions("1.2.3", "1.2.4")); // -1
        System.out.println(compareVersions("2.0.0", "1.9.9")); // 1
        System.out.println(compareVersions("1.0.0", "1.0.0")); // 0
        System.out.println(compareVersions("1.10.0", "1.9.0")); // 1
    }
}`
        }
      ]
    },
    {
      id: 'devops_ch2',
      title: 'Docker',
      lecture: `<h2>Docker — контейнеризация</h2>
<p>Docker упаковывает приложение со всеми зависимостями в контейнер — изолированное окружение.</p>

<h3>Ключевые концепции</h3>
<ul>
<li><strong>Image</strong> — шаблон контейнера (read-only)</li>
<li><strong>Container</strong> — запущенный экземпляр image</li>
<li><strong>Dockerfile</strong> — инструкции по сборке image</li>
<li><strong>Registry</strong> — хранилище образов (Docker Hub)</li>
</ul>

<h3>Dockerfile для Spring Boot</h3>
<pre><code># Многоэтапная сборка
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q    # кешируем зависимости
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine  # минимальный runtime
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

<h3>Docker команды</h3>
<pre><code># Сборка и запуск
docker build -t my-app:1.0 .
docker run -p 8080:8080 my-app:1.0
docker run -d -p 8080:8080 --name myapp my-app:1.0   # в фоне

# Управление
docker ps                    # запущенные контейнеры
docker ps -a                 # все контейнеры
docker stop myapp            # остановить
docker rm myapp              # удалить контейнер
docker images                # список образов
docker rmi my-app:1.0        # удалить образ

# Логи и отладка
docker logs myapp
docker exec -it myapp sh     # войти в контейнер</code></pre>

<h3>docker-compose.yml</h3>
<pre><code>version: '3.8'
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/mydb
    depends_on: [db]

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:</code></pre>`,
      tasks: [
        {
          id: 'devops_t3', title: 'Симуляция контейнера', difficulty: 'easy',
          description: '<p>Создайте симуляцию жизненного цикла Docker-контейнера: создание, запуск, остановка, удаление. Используйте enum для состояний контейнера.</p>',
          hints: ['enum State { CREATED, RUNNING, STOPPED, REMOVED }', 'Методы: start(), stop(), remove() — меняют состояние'],
          startCode: `import java.util.*;
public class Main {
    enum State { CREATED, RUNNING, STOPPED, REMOVED }

    static class Container {
        String id, name, image;
        State state;

        Container(String name, String image) {
            this.id = Integer.toHexString(name.hashCode()).substring(0, 8);
            this.name = name; this.image = image;
            this.state = State.CREATED;
        }

        void start() {
            // проверьте что состояние CREATED или STOPPED, перейдите в RUNNING
        }

        void stop() {
            // проверьте что RUNNING, перейдите в STOPPED
        }

        void remove() {
            // только если STOPPED, перейдите в REMOVED
        }

        public String toString() {
            return String.format("[%s] %s (%s) — %s", id, name, image, state);
        }
    }

    public static void main(String[] args) {
        Container c = new Container("myapp", "java-bank:1.0");
        System.out.println(c);   // CREATED
        c.start();
        System.out.println(c);   // RUNNING
        c.stop();
        System.out.println(c);   // STOPPED
        c.remove();
        System.out.println(c);   // REMOVED
    }
}`
        },
        {
          id: 'devops_t4', title: 'Environment Variables', difficulty: 'medium',
          description: '<p>Реализуйте класс <code>AppConfig</code>, который читает настройки из Map (симуляция переменных окружения). Поддержите значения по умолчанию. Выведите конфигурацию приложения.</p>',
          hints: ['Map<String, String> env', 'getOrDefault(key, defaultValue)', 'Integer.parseInt(env.getOrDefault("PORT", "8080"))'],
          startCode: `import java.util.*;
public class Main {
    static class AppConfig {
        private Map<String, String> env;

        AppConfig(Map<String, String> env) { this.env = env; }

        String get(String key, String defaultValue) {
            return env.getOrDefault(key, defaultValue);
        }

        int getInt(String key, int defaultValue) {
            // получите целочисленное значение
            return defaultValue;
        }

        void print() {
            System.out.println("=== Application Config ===");
            System.out.println("Host: " + get("DB_HOST", "localhost"));
            System.out.println("Port: " + getInt("DB_PORT", 5432));
            System.out.println("DB:   " + get("DB_NAME", "mydb"));
            System.out.println("App Port: " + getInt("SERVER_PORT", 8080));
        }
    }

    public static void main(String[] args) {
        // С переменными окружения
        Map<String, String> prodEnv = new HashMap<>();
        prodEnv.put("DB_HOST", "db.production.com");
        prodEnv.put("DB_PORT", "5432");
        prodEnv.put("SERVER_PORT", "80");

        new AppConfig(prodEnv).print();

        System.out.println();

        // Без переменных — используются дефолты
        new AppConfig(new HashMap<>()).print();
    }
}`
        }
      ]
    },
    {
      id: 'devops_ch3',
      title: 'CI/CD и мониторинг',
      lecture: `<h2>CI/CD — непрерывная интеграция и доставка</h2>

<h3>Что такое CI/CD</h3>
<ul>
<li><strong>CI (Continuous Integration)</strong> — автоматическая сборка и тестирование при каждом push</li>
<li><strong>CD (Continuous Delivery)</strong> — автоматическое развёртывание на staging</li>
<li><strong>CD (Continuous Deployment)</strong> — автоматическое развёртывание в production</li>
</ul>

<h3>GitHub Actions (.github/workflows/ci.yml)</h3>
<pre><code>name: Java CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'

    - name: Cache Maven packages
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}

    - name: Build with Maven
      run: mvn clean package

    - name: Run tests
      run: mvn test

    - name: Build Docker image
      run: docker build -t my-app:${{ github.sha }} .</code></pre>

<h3>Мониторинг Spring Boot (Actuator)</h3>
<pre><code># pom.xml
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;
&lt;/dependency&gt;

# application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always

# Эндпоинты:
GET /actuator/health   → {"status": "UP"}
GET /actuator/metrics  → список метрик
GET /actuator/info     → информация о приложении</code></pre>`,
      tasks: [
        {
          id: 'devops_t5', title: 'Health check', difficulty: 'easy',
          description: '<p>Реализуйте простой health-check монитор. Класс <code>HealthChecker</code> проверяет список компонентов (DB, Cache, ExternalAPI) и возвращает общий статус UP/DOWN.</p>',
          hints: ['enum Status { UP, DOWN }', 'Если хотя бы один DOWN — общий статус DOWN'],
          startCode: `import java.util.*;
public class Main {
    enum Status { UP, DOWN }

    static class Component {
        String name; Status status;
        Component(String name, Status status) { this.name=name; this.status=status; }
    }

    static class HealthChecker {
        private List<Component> components = new ArrayList<>();

        void register(String name, Status status) {
            components.add(new Component(name, status));
        }

        Status overall() {
            // вернуть DOWN если хотя бы один компонент DOWN
            return Status.UP;
        }

        void report() {
            components.forEach(c ->
                System.out.println(c.name + ": " + c.status));
            System.out.println("Overall: " + overall());
        }
    }

    public static void main(String[] args) {
        HealthChecker checker = new HealthChecker();
        checker.register("Database", Status.UP);
        checker.register("Redis Cache", Status.UP);
        checker.register("Payment API", Status.DOWN);
        checker.report();
        // Overall: DOWN
    }
}`
        },
        {
          id: 'devops_t6', title: 'Метрики приложения', difficulty: 'medium',
          description: '<p>Реализуйте простой сборщик метрик (как Prometheus). Поддержите: счётчики (increment), gauge (set/get), timing (запись времени выполнения). Выведите отчёт.</p>',
          hints: ['Map<String, Long> counters', 'Map<String, Double> gauges', 'System.nanoTime() для замера времени'],
          startCode: `import java.util.*;
public class Main {
    static class Metrics {
        private Map<String, Long> counters = new HashMap<>();
        private Map<String, Double> gauges = new HashMap<>();
        private Map<String, List<Long>> timings = new HashMap<>();

        void increment(String name) {
            counters.merge(name, 1L, Long::sum);
        }

        void gauge(String name, double value) {
            gauges.put(name, value);
        }

        long time(String name, Runnable task) {
            long start = System.nanoTime();
            task.run();
            long elapsed = System.nanoTime() - start;
            timings.computeIfAbsent(name, k -> new ArrayList<>()).add(elapsed);
            return elapsed;
        }

        void report() {
            System.out.println("=== Metrics Report ===");
            counters.forEach((k, v) -> System.out.println("counter." + k + " = " + v));
            gauges.forEach((k, v) -> System.out.printf("gauge.%s = %.2f%n", k, v));
            timings.forEach((k, v) -> {
                long avg = (long) v.stream().mapToLong(Long::longValue).average().orElse(0);
                System.out.printf("timer.%s avg = %d ns%n", k, avg);
            });
        }
    }

    public static void main(String[] args) {
        Metrics m = new Metrics();

        // Симулируем работу приложения
        for (int i = 0; i < 5; i++) m.increment("http.requests");
        for (int i = 0; i < 2; i++) m.increment("http.errors");
        m.gauge("memory.used_mb", 256.5);
        m.gauge("active.connections", 42);

        m.time("db.query", () -> {
            try { Thread.sleep(1); } catch (Exception e) {}
        });

        m.report();
    }
}`
        }
      ]
    }
  ]
});
