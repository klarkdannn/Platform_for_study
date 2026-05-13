package com.bank.advanced;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   ПОЛНЫЙ СПРАВОЧНИК АННОТАЦИЙ SPRING + JPA              ║
 * ║   Каждая аннотация объяснена с примером для банка        ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ЭТОТ ФАЙЛ НЕ КОМПИЛИРУЕТСЯ — он содержит псевдокод.
 * Реальный код будет в папке spring/ когда подключишь зависимости.
 *
 * КАК ЧИТАТЬ:
 *   Каждый раздел = отдельная тема.
 *   Аннотация + объяснение + пример из банковского контекста.
 */
public class SpringJpaAnnotationsGuide {

    /*
    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 1: SPRING CORE — УПРАВЛЕНИЕ BEANS
    ════════════════════════════════════════════════════════════════

    @Component
      Помечает класс как Spring Bean (компонент).
      Spring найдёт его при component scan и добавит в IoC контейнер.
      Базовая аннотация. Остальные (@Service, @Repository, @Controller)
      — специализации @Component.

      @Component
      public class CurrencyConverter {
          public BigDecimal convert(BigDecimal amount, String from, String to) {...}
      }

    ─────────────────────────────────────────────────────────────────
    @Service
      Семантически = @Component, но обозначает СЕРВИСНЫЙ слой.
      Здесь живёт бизнес-логика. AOP аспекты применяются сюда.

      @Service
      public class TransferService {
          @Transactional
          public void transfer(String fromId, String toId, BigDecimal amount) {...}
      }

    ─────────────────────────────────────────────────────────────────
    @Repository
      Семантически = @Component, но для слоя DATA ACCESS.
      Дополнительно: Spring переводит исключения JDBC/JPA
      в RuntimeException иерархию (DataAccessException).

      @Repository
      public class JdbcAccountRepository implements AccountRepository {
          // JDBC код...
      }

    ─────────────────────────────────────────────────────────────────
    @Controller
      Веб-контроллер. Возвращает имя VIEW (шаблона Thymeleaf/JSP).
      Для REST используй @RestController.

    @RestController = @Controller + @ResponseBody
      Автоматически сериализует возврат методов в JSON.
      Это то что ты используешь для REST API.

      @RestController
      @RequestMapping("/api/v1/accounts")
      public class AccountController {
          // Все методы автоматически возвращают JSON
      }

    ─────────────────────────────────────────────────────────────────
    @Configuration
      Класс содержит Bean-определения (@Bean методы).
      Аналог XML конфигурации Spring в виде Java кода.

      @Configuration
      public class AppConfig {
          @Bean
          public PasswordEncoder passwordEncoder() {
              return new BCryptPasswordEncoder(12);
          }

          @Bean
          public ModelMapper modelMapper() {
              return new ModelMapper();
          }
      }

    ─────────────────────────────────────────────────────────────────
    @Bean
      Метод в @Configuration классе создаёт Bean.
      Spring вызывает этот метод ОДИН раз (singleton scope).

    ─────────────────────────────────────────────────────────────────
    @Autowired
      Внедряет зависимость. НЕ РЕКОМЕНДУЕТСЯ на полях.
      Используй через КОНСТРУКТОР (без @Autowired если один конструктор):

      @Service
      public class AccountService {
          private final AccountRepository repo;    // final!
          private final NotificationService notif;

          // Один конструктор → @Autowired не нужен:
          public AccountService(AccountRepository repo, NotificationService notif) {
              this.repo = repo;
              this.notif = notif;
          }
      }

    ─────────────────────────────────────────────────────────────────
    @Qualifier("beanName")
      Когда несколько реализаций одного интерфейса, указываем какую брать.

      @Service("cardPaymentService")
      public class CardPaymentService implements PaymentService {...}

      @Service("sbpPaymentService")
      public class SbpPaymentService implements PaymentService {...}

      // В другом классе:
      public AccountController(@Qualifier("sbpPaymentService") PaymentService ps) {...}

    ─────────────────────────────────────────────────────────────────
    @Primary
      Эта реализация используется "по умолчанию" если @Qualifier не указан.

    ─────────────────────────────────────────────────────────────────
    @Value("${property.name}")
      Внедряет значение из application.properties.

      @Value("${bank.daily.limit}")
      private BigDecimal dailyLimit; // = 300_000

      @Value("${bank.name:Мой банк}")  // ← значение по умолчанию
      private String bankName;

    ─────────────────────────────────────────────────────────────────
    @ConfigurationProperties(prefix = "bank")
      Связывает группу свойств с Java классом. Лучше @Value для групп.

      // application.properties:
      // bank.daily-limit=300000
      // bank.name=My Bank
      // bank.swift=MYBKRUMM

      @ConfigurationProperties(prefix = "bank")
      @Component
      public class BankProperties {
          private BigDecimal dailyLimit;
          private String name;
          private String swift;
          // getters + setters
      }

    ─────────────────────────────────────────────────────────────────
    @Scope("prototype")
      По умолчанию все бины — SINGLETON (один экземпляр).
      prototype = новый экземпляр на каждое внедрение.
      request   = один на HTTP запрос (только для веб).
      session   = один на HTTP сессию (только для веб).

    ─────────────────────────────────────────────────────────────────
    @Lazy
      Bean создаётся только при первом использовании (не при старте).
      Ускоряет старт приложения для редко используемых компонентов.

    ─────────────────────────────────────────────────────────────────
    @PostConstruct / @PreDestroy
      Методы вызываются ПОСЛЕ создания и ПЕРЕД уничтожением Bean.

      @Service
      public class CacheService {
          @PostConstruct
          public void init() {
              // Загружаем кэш курсов валют при старте
              loadCurrencyRates();
          }

          @PreDestroy
          public void cleanup() {
              // Сохраняем состояние перед остановкой
              persistState();
          }
      }

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 2: SPRING MVC — HTTP АННОТАЦИИ
    ════════════════════════════════════════════════════════════════

    @RequestMapping(path = "/api/v1", method = RequestMethod.GET)
      Базовая аннотация маппинга. Можно ставить на класс (базовый путь)
      и на методы (конкретный путь).

    Сокращения:
      @GetMapping("/path")    = @RequestMapping(method=GET)
      @PostMapping("/path")   = @RequestMapping(method=POST)
      @PutMapping("/path")    = @RequestMapping(method=PUT)
      @PatchMapping("/path")  = @RequestMapping(method=PATCH)
      @DeleteMapping("/path") = @RequestMapping(method=DELETE)

    ─────────────────────────────────────────────────────────────────
    @PathVariable
      Извлекает {переменную} из URL.

      @GetMapping("/accounts/{id}")
      public Account get(@PathVariable String id) {...}
      // GET /accounts/ACC-001 → id = "ACC-001"

      // Несколько:
      @GetMapping("/clients/{clientId}/accounts/{accountId}")
      public Account get(@PathVariable String clientId,
                         @PathVariable String accountId) {...}

    ─────────────────────────────────────────────────────────────────
    @RequestParam
      Извлекает query-параметр из URL.

      @GetMapping("/transactions")
      public List<Transaction> getAll(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "20") int size,
          @RequestParam(required = false) String type
      ) {...}
      // GET /transactions?page=2&size=10&type=DEPOSIT

    ─────────────────────────────────────────────────────────────────
    @RequestBody
      Десериализует тело HTTP запроса (JSON → Java объект).

      @PostMapping("/transfers")
      public TransferResult transfer(@Valid @RequestBody TransferRequest req) {...}
      // Body: {"fromAccountId":"ACC-1","toAccountId":"ACC-2","amount":1000}

    ─────────────────────────────────────────────────────────────────
    @ResponseBody
      Сериализует возврат метода в тело HTTP ответа.
      В @RestController включено автоматически для всех методов.

    ─────────────────────────────────────────────────────────────────
    @ResponseStatus(HttpStatus.CREATED)
      Устанавливает HTTP статус-код ответа.

      @PostMapping("/accounts")
      @ResponseStatus(HttpStatus.CREATED) // 201
      public Account create(@RequestBody CreateAccountRequest req) {...}

    ─────────────────────────────────────────────────────────────────
    @RequestHeader
      Извлекает значение из HTTP заголовка.

      @GetMapping("/me")
      public Client getCurrent(
          @RequestHeader("X-Request-ID") String requestId,
          @RequestHeader(value = "Accept-Language", defaultValue = "ru") String lang
      ) {...}

    ─────────────────────────────────────────────────────────────────
    @CrossOrigin
      Разрешает CORS для эндпоинта или контроллера.

      @CrossOrigin(origins = "https://bank-frontend.ru")
      @RestController
      public class AccountController {...}

    ─────────────────────────────────────────────────────────────────
    @ExceptionHandler
      Обрабатывает исключение в контроллере.

      @ExceptionHandler(AccountNotFoundException.class)
      @ResponseStatus(HttpStatus.NOT_FOUND)
      public ErrorResponse handle(AccountNotFoundException ex) {
          return new ErrorResponse("NOT_FOUND", ex.getMessage());
      }

    @ControllerAdvice / @RestControllerAdvice
      Глобальная обработка исключений для ВСЕХ контроллеров.

    ─────────────────────────────────────────────────────────────────
    @Valid / @Validated
      Запускает Bean Validation для параметра.
      Аннотации валидации (javax.validation / jakarta.validation):

      record CreateAccountRequest(
          @NotNull(message = "ownerID обязателен")
          String ownerId,

          @NotBlank
          @Size(min = 2, max = 100)
          String ownerName,

          @NotNull
          @Positive(message = "Сумма должна быть положительной")
          @DecimalMax("1000000.00")
          BigDecimal initialBalance,

          @NotNull
          @Email
          String email,

          @Pattern(regexp = "\\+7\\d{10}", message = "Формат: +7XXXXXXXXXX")
          String phone
      ) {}

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 3: SPRING DATA JPA — АННОТАЦИИ СУЩНОСТЕЙ
    ════════════════════════════════════════════════════════════════

    @Entity
      Класс является JPA сущностью (отображается в таблицу БД).
      Обязателен @Id.

    @Table(name = "accounts", schema = "banking",
           uniqueConstraints = @UniqueConstraint(columnNames = {"account_number"}))
      Настраивает имя таблицы, схему, уникальные ограничения.

    ─────────────────────────────────────────────────────────────────
    @Id
      Поле является PRIMARY KEY.

    @GeneratedValue(strategy = GenerationType.IDENTITY)  — auto-increment (PostgreSQL SERIAL)
    @GeneratedValue(strategy = GenerationType.UUID)      — UUID (Java 17+)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)  — последовательность БД

    @SequenceGenerator(name = "acc_seq", sequenceName = "account_id_seq", allocationSize = 50)
    @GeneratedValue(generator = "acc_seq")
      Использует именованную последовательность с батчингом (50 = 50 ID за один запрос).

    ─────────────────────────────────────────────────────────────────
    @Column
      Настройка отображения поля на колонку.

      @Column(
          name = "account_balance",   // имя колонки в БД
          nullable = false,           // NOT NULL
          precision = 19,             // точность BigDecimal
          scale = 4,                  // знаков после запятой
          updatable = true,
          insertable = true
      )
      private BigDecimal balance;

    ─────────────────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)  ← ВСЕГДА используй STRING, не ORDINAL!
      ORDINAL: хранит 0,1,2... Если добавишь/переставишь enum — БД сломается.
      STRING: хранит "ACTIVE","BLOCKED"... — читаемо и безопасно.

      @Enumerated(EnumType.STRING)
      @Column(length = 20)
      private AccountStatus status;

    ─────────────────────────────────────────────────────────────────
    @OneToMany / @ManyToOne / @OneToOne / @ManyToMany

      // Один клиент — много счетов:
      @OneToMany(
          mappedBy = "client",          // поле в Account которое ссылается на Client
          cascade = CascadeType.ALL,    // операции каскадируются на счета
          fetch = FetchType.LAZY,       // ← ВСЕГДА LAZY! Иначе N+1 проблема
          orphanRemoval = true          // удалить счёт если убрать из списка
      )
      private List<Account> accounts = new ArrayList<>();

      // Со стороны Account:
      @ManyToOne(fetch = FetchType.LAZY)  // LAZY!
      @JoinColumn(name = "client_id", nullable = false)
      private Client client;

      // Many-to-Many (клиент — роли):
      @ManyToMany(fetch = FetchType.LAZY)
      @JoinTable(
          name = "client_roles",
          joinColumns = @JoinColumn(name = "client_id"),
          inverseJoinColumns = @JoinColumn(name = "role_id")
      )
      private Set<Role> roles = new HashSet<>();

    ─────────────────────────────────────────────────────────────────
    @Transient
      Поле НЕ сохраняется в БД (только в памяти).

      @Transient
      private String tempCalculation; // только для расчётов

    ─────────────────────────────────────────────────────────────────
    @CreationTimestamp / @UpdateTimestamp  (Hibernate-специфичные)
      Автоматически устанавливает дату создания/обновления.

      @CreationTimestamp
      @Column(updatable = false)
      private LocalDateTime createdAt;

      @UpdateTimestamp
      private LocalDateTime updatedAt;

    Или через JPA Auditing (@EnableJpaAuditing):
      @CreatedDate
      @Column(updatable = false)
      private LocalDateTime createdAt;

      @LastModifiedDate
      private LocalDateTime updatedAt;

      @CreatedBy
      @Column(updatable = false)
      private String createdBy; // кто создал (из SecurityContext)

    ─────────────────────────────────────────────────────────────────
    @Version
      Оптимистическая блокировка. Предотвращает "потерянные обновления".
      При параллельном обновлении — бросает OptimisticLockException.
      ИСПОЛЬЗУЙ для сущностей с одновременными изменениями (баланс счёта).

      @Version
      private Long version; // Hibernate сам обновляет это поле

    ─────────────────────────────────────────────────────────────────
    @Lob
      Для больших объектов (BLOB/CLOB в БД).

      @Lob
      @Column(columnDefinition = "TEXT")
      private String description; // длинный текст

    ─────────────────────────────────────────────────────────────────
    @Embedded / @Embeddable
      Встраивает значимый объект (value object) в сущность.
      Не создаёт отдельную таблицу, поля живут в родительской.

      @Embeddable
      class Address {
          private String city;
          private String street;
          private String zip;
      }

      @Entity
      class Client {
          @Embedded
          @AttributeOverrides({
              @AttributeOverride(name = "city", column = @Column(name = "city")),
              @AttributeOverride(name = "zip",  column = @Column(name = "postal_code"))
          })
          private Address address;
      }

    ─────────────────────────────────────────────────────────────────
    @Convert(converter = MoneyConverter.class)
      Преобразует тип при чтении/записи в БД.

      @Converter(autoApply = true)
      class MoneyConverter implements AttributeConverter<Money, String> {
          public String convertToDatabaseColumn(Money m) { return m.amount() + " " + m.currency(); }
          public Money convertToEntityAttribute(String s) { var p = s.split(" "); return new Money(new BigDecimal(p[0]), p[1]); }
      }

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 4: SPRING DATA JPA — REPOSITORY АННОТАЦИИ
    ════════════════════════════════════════════════════════════════

    @Query
      Кастомный JPQL или SQL запрос.

      // JPQL (работает с Entity, не таблицами):
      @Query("SELECT a FROM Account a WHERE a.status = :status AND a.balance > :minBalance")
      List<Account> findActiveWithBalance(@Param("status") AccountStatus status,
                                          @Param("minBalance") BigDecimal minBalance);

      // Native SQL:
      @Query(value = "SELECT * FROM accounts WHERE created_at::date = CURRENT_DATE",
             nativeQuery = true)
      List<Account> findCreatedToday();

    ─────────────────────────────────────────────────────────────────
    @Modifying
      Для UPDATE/DELETE/INSERT запросов (@Query с изменениями).
      Без него Hibernate не выполнит изменяющий запрос.

      @Modifying
      @Transactional
      @Query("UPDATE Account a SET a.balance = a.balance + :amount WHERE a.id = :id")
      int addToBalance(@Param("id") String id, @Param("amount") BigDecimal amount);
      // Возвращает количество обновлённых строк.

    ─────────────────────────────────────────────────────────────────
    @EntityGraph(attributePaths = {"transactions", "client"})
      Решает N+1 проблему. Загружает связи жадно для КОНКРЕТНОГО запроса.
      Основные связи — LAZY, а для этого запроса — EAGER.

      @EntityGraph(attributePaths = {"transactions"})
      Optional<Account> findWithTransactionsById(String id);

    ─────────────────────────────────────────────────────────────────
    @Lock(LockModeType.PESSIMISTIC_WRITE)
      Пессимистическая блокировка — SELECT FOR UPDATE в PostgreSQL.
      Используй при параллельных операциях с балансом.

      @Lock(LockModeType.PESSIMISTIC_WRITE)
      @Query("SELECT a FROM Account a WHERE a.id = :id")
      Optional<Account> findByIdForUpdate(@Param("id") String id);

    ─────────────────────────────────────────────────────────────────
    @Transactional (из Spring, не JPA)
      Оборачивает метод в транзакцию.

      Атрибуты:
        isolation = Isolation.REPEATABLE_READ   — уровень изоляции
        propagation = Propagation.REQUIRED      — дефолт: присоединиться к текущей
        propagation = Propagation.REQUIRES_NEW  — всегда новая транзакция
        readOnly = true                         — только чтение (оптимизация)
        timeout = 30                            — таймаут в секундах
        rollbackFor = {Exception.class}         — откатить при этом исключении
        noRollbackFor = {BusinessException.class} — НЕ откатывать

      @Transactional(isolation = Isolation.REPEATABLE_READ,
                     timeout = 10,
                     rollbackFor = Exception.class)
      public void transfer(String from, String to, BigDecimal amount) {
          // Атомарно: списание + зачисление
      }

      ВАЖНО:
        - @Transactional работает только через Spring Proxy
        - self-invocation (вызов @Transactional метода из того же класса) = НЕ РАБОТАЕТ
        - Ставить в @Service, не в @Repository или @Controller
        - readOnly = true для всех запросов только на чтение!

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 5: SPRING SECURITY АННОТАЦИИ
    ════════════════════════════════════════════════════════════════

    @EnableWebSecurity
      Активирует Spring Security в @Configuration классе.

    @PreAuthorize("hasRole('ADMIN')")
      Проверка ПЕРЕД выполнением метода.

      @PreAuthorize("hasRole('ADMIN')")
      public void deleteAccount(String id) {...}

      @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
      public List<Account> getAllAccounts() {...}

      @PreAuthorize("#clientId == authentication.name or hasRole('ADMIN')")
      public List<Account> getClientAccounts(String clientId) {...}
      // Клиент видит только свои счета, Администратор — все

    ─────────────────────────────────────────────────────────────────
    @PostAuthorize("returnObject.ownerId == authentication.name")
      Проверка ПОСЛЕ выполнения (на возвращаемый объект).

    @Secured({"ROLE_ADMIN", "ROLE_OPERATOR"})
      Более простая альтернатива @PreAuthorize. Нет SpEL выражений.

    @EnableMethodSecurity(prePostEnabled = true)
      Активирует @PreAuthorize/@PostAuthorize на @Configuration.

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 6: SPRING BOOT СПЕЦИФИЧЕСКИЕ АННОТАЦИИ
    ════════════════════════════════════════════════════════════════

    @SpringBootApplication = @EnableAutoConfiguration + @ComponentScan + @Configuration
      Точка входа Spring Boot приложения.

    @EnableJpaAuditing
      Активирует автоматические @CreatedDate/@LastModifiedDate.
      Нужен AuditorAware bean для @CreatedBy.

    @EnableScheduling
      Активирует планировщик задач.
      @Scheduled(cron = "0 0 1 * * *")   — каждую ночь в 1:00
      @Scheduled(fixedDelay = 5000)      — каждые 5 секунд (после окончания)
      @Scheduled(fixedRate = 10000)      — каждые 10 секунд (с момента старта)

    @Async
      Метод выполняется в отдельном потоке из пула.
      Нужен @EnableAsync.

      @Async
      public CompletableFuture<Void> sendEmailAsync(String to, String body) {
          // выполняется асинхронно
          emailService.send(to, body);
          return CompletableFuture.completedFuture(null);
      }

    @Cacheable(value = "rates", key = "#currency")
    @CacheEvict(value = "rates", allEntries = true)
    @CachePut(value = "rates", key = "#result.currency")
      Кэширование результатов методов.
      Нужен @EnableCaching и CacheManager (обычно RedisCache).

    @Profile("prod")
      Bean создаётся только при активном профиле "prod".

      @Configuration
      @Profile("test")
      public class TestDataConfig {
          @Bean
          public DataLoader testDataLoader() { return new TestDataLoader(); }
      }

    @ConditionalOnProperty(name = "feature.fraud-detection.enabled", havingValue = "true")
      Bean создаётся только если свойство = указанному значению.
      Удобно для feature flags.

    ════════════════════════════════════════════════════════════════
      ЧАСТЬ 7: АННОТАЦИИ ТЕСТИРОВАНИЯ
    ════════════════════════════════════════════════════════════════

    @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
      Поднимает полный контекст Spring для интеграционного теста.

    @WebMvcTest(AccountController.class)
      Поднимает только веб-слой (контроллер) без сервисов/репозиториев.
      Быстрее @SpringBootTest.

    @DataJpaTest
      Поднимает только JPA слой. In-memory H2 по умолчанию.
      Для реального PostgreSQL + @AutoConfigureTestDatabase(replace=NONE) + Testcontainers.

    @MockBean
      Создаёт Mockito мок и регистрирует как Spring Bean.

    @Sql("/sql/test-data.sql")
      Выполняет SQL скрипт перед тестом.

    @Transactional (на тесте)
      Откатывает тестовые данные после каждого теста.
      Не нужно очищать БД вручную!
    */

    public static void main(String[] args) {
        System.out.println("Это справочный файл по Spring/JPA аннотациям.");
        System.out.println("Читай комментарии в коде — там всё объяснено с примерами.");
    }
}
