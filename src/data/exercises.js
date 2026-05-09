export const EXERCISES = [
  // ── УРОК 1 ─────────────────────────────────────────────────────────
  {
    id: 'l01_e01', lessonId: 'l01', title: 'Hello World', difficulty: 'Easy',
    description: `## Привет, мир!\n\nНапиши программу, которая выводит \`Hello, World!\`\n\n**Ожидаемый вывод:**\n\`\`\`\nHello, World!\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        // Выведи "Hello, World!"

    }
}`,
    expectedOutput: 'Hello, World!'
  },
  {
    id: 'l01_e02', lessonId: 'l01', title: 'Банковский чек', difficulty: 'Easy',
    description: `## Банковский чек\n\nВыведи форматированный чек:\n\n\`\`\`\n=== Чек ===\nКлиент: Алиса Иванова\nСумма:  50,000.00 руб.\n==========\n\`\`\`\n\nИспользуй \`System.out.printf\` с форматом \`%,.2f\`.`,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        String name = "Алиса Иванова";
        double amount = 50000.0;
        // Выведи чек точно как в примере

    }
}`,
    expectedOutput: '=== Чек ===\nКлиент: Алиса Иванова\nСумма:  50,000.00 руб.\n=========='
  },
  {
    id: 'l01_e03', lessonId: 'l01', title: 'Таблица умножения (3×3)', difficulty: 'Medium',
    description: `## Таблица умножения\n\nВыведи таблицу умножения от 1 до 3:\n\n\`\`\`\n1  2  3 \n2  4  6 \n3  6  9 \n\`\`\`\n\nКаждое число занимает ровно 2 символа (используй \`%2d\`).`,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        // Вложенные циклы, printf("%2d ", i*j)

    }
}`,
    expectedOutput: ' 1  2  3 \n 2  4  6 \n 3  6  9 '
  },

  // ── УРОК 2 ─────────────────────────────────────────────────────────
  {
    id: 'l02_e01', lessonId: 'l02', title: 'Типы данных', difficulty: 'Easy',
    description: `## Переменные клиента\n\nОбъяви переменные и выведи их:\n\n\`\`\`\nИмя: Иван\nВозраст: 30\nБаланс: 125430.75\nАктивен: true\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        String name = "Иван";
        int age = 30;
        double balance = 125430.75;
        boolean active = true;
        // Выведи 4 строки как в примере

    }
}`,
    expectedOutput: 'Имя: Иван\nВозраст: 30\nБаланс: 125430.75\nАктивен: true'
  },
  {
    id: 'l02_e02', lessonId: 'l02', title: 'Целочисленное деление', difficulty: 'Easy',
    description: `## Комиссия банка\n\nПосчитай комиссию: 13% от суммы 1000 рублей.\n\nПроблема: \`1000 * 13 / 100\` в integer даёт 130, а \`(int)(1000 * 0.13)\` тоже 130. Но что если сумма 999?\n\nВыведи:\n\`\`\`\nDouble: 129.87\nInt: 129\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        double amount = 999.0;
        double rate = 0.13;
        double feeDouble = amount * rate;
        int feeInt = (int)(amount * rate);
        // Выведи как в примере (%.2f для double)

    }
}`,
    expectedOutput: 'Double: 129.87\nInt: 129'
  },

  // ── УРОК 3 ─────────────────────────────────────────────────────────
  {
    id: 'l03_e01', lessonId: 'l03', title: 'Одобрение кредита', difficulty: 'Medium',
    description: `## Одобрение кредита\n\nОпредели, одобрен ли кредит. Условия:\n- Возраст от 18 до 70\n- Доход >= 30000\n- Кредитный рейтинг >= 600\n- Нет долгов\n\nДля данных: возраст=25, доход=45000, рейтинг=720, долг=false\n\n\`\`\`\ntrue\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        int age = 25;
        double income = 45000;
        int creditScore = 720;
        boolean hasDebt = false;
        // Одна строка: boolean approved = условие && условие && ...
        // System.out.println(approved)

    }
}`,
    expectedOutput: 'true'
  },
  {
    id: 'l03_e02', lessonId: 'l03', title: 'Тернарный оператор', difficulty: 'Easy',
    description: `## Категория клиента\n\nИспользуя **только тернарный оператор** (без if), определи категорию:\n- >= 1_000_000 → "Премиум"\n- >= 100_000  → "Золото"\n- >= 10_000   → "Серебро"\n- иначе       → "Стандарт"\n\nДля balance = 75_000:\n\`\`\`\nЗолото\n\`\`\`\n\nПодсказка: вложенный тернарный \`a ? b : c ? d : e\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        double balance = 75_000;
        String category = balance >= 1_000_000 ? "Премиум" :
                          /* заполни остальное */
                          "Стандарт";
        System.out.println(category);
    }
}`,
    expectedOutput: 'Золото'
  },

  // ── УРОК 4 ─────────────────────────────────────────────────────────
  {
    id: 'l04_e01', lessonId: 'l04', title: 'Switch Expression', difficulty: 'Easy',
    description: `## Комиссия по типу операции\n\nИспользуя switch expression, определи комиссию:\n- DEPOSIT    → 0.0\n- WITHDRAWAL → 50.0\n- TRANSFER   → 101.0\n- PAYMENT    → 30.0\n\nДля txType = "TRANSFER":\n\`\`\`\nКомиссия: 101.0 руб.\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        String txType = "TRANSFER";
        double fee = switch (txType) {
            case "DEPOSIT"    -> 0.0;
            // добавь остальные case
            default           -> 0.0;
        };
        System.out.println("Комиссия: " + fee + " руб.");
    }
}`,
    expectedOutput: 'Комиссия: 101.0 руб.'
  },
  {
    id: 'l04_e02', lessonId: 'l04', title: 'FizzBuzz для банка', difficulty: 'Easy',
    description: `## Банковский FizzBuzz\n\nДля чисел от 1 до 15 выведи:\n- Кратно 15 → "FeeTax"\n- Кратно 3  → "Fee"\n- Кратно 5  → "Tax"\n- Иначе     → само число\n\nОжидаемый вывод:\n\`\`\`\n1 2 Fee 4 Tax Fee 7 8 Fee Tax 11 Fee 13 14 FeeTax\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 15; i++) {
            // добавь в sb нужную строку + пробел если не последний

        }
        System.out.println(sb.toString().trim());
    }
}`,
    expectedOutput: '1 2 Fee 4 Tax Fee 7 8 Fee Tax 11 Fee 13 14 FeeTax'
  },

  // ── УРОК 5 ─────────────────────────────────────────────────────────
  {
    id: 'l05_e01', lessonId: 'l05', title: 'Рост вклада', difficulty: 'Easy',
    description: `## Симуляция вклада\n\nНачальный баланс 10000 руб., ставка 7% в год.\nВыведи баланс за 5 лет (округление до 2 знаков):\n\n\`\`\`\nГод 1: 10700.00\nГод 2: 11449.00\nГод 3: 12250.43\nГод 4: 13107.96\nГод 5: 14025.52\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        double balance = 10000.0;
        double rate = 0.07;
        for (int year = 1; year <= 5; year++) {
            balance = balance * (1 + rate);
            // Выведи "Год N: XXXXX.XX"

        }
    }
}`,
    expectedOutput: 'Год 1: 10700.00\nГод 2: 11449.00\nГод 3: 12250.43\nГод 4: 13107.96\nГод 5: 14025.52'
  },
  {
    id: 'l05_e02', lessonId: 'l05', title: 'Числа Фибоначчи', difficulty: 'Medium',
    description: `## Первые 10 чисел Фибоначчи\n\nВыведи числа в одну строку через пробел:\n\`\`\`\n0 1 1 2 3 5 8 13 21 34\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        // Подсказка: a=0, b=1, потом a=b, b=a+b

    }
}`,
    expectedOutput: '0 1 1 2 3 5 8 13 21 34'
  },

  // ── УРОК 6 ─────────────────────────────────────────────────────────
  {
    id: 'l06_e01', lessonId: 'l06', title: 'Поиск min/max', difficulty: 'Easy',
    description: `## Максимум и минимум\n\nДан массив. Найди min и max **без Arrays.sort()**:\n\n\`\`\`\nMin: 1000\nMax: 50000\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        double[] amounts = {5000, 15000, 1000, 50000, 3000, 25000};
        double min = amounts[0];
        double max = amounts[0];
        for (double a : amounts) {
            // обнови min и max

        }
        System.out.println("Min: " + (int)min);
        System.out.println("Max: " + (int)max);
    }
}`,
    expectedOutput: 'Min: 1000\nMax: 50000'
  },
  {
    id: 'l06_e02', lessonId: 'l06', title: 'Реверс массива', difficulty: 'Medium',
    description: `## Реверс массива\n\nРазверни массив **без вспомогательного массива** (два указателя i и j, swap).\n\nВвод: \`1 2 3 4 5\`\nВывод:\n\`\`\`\n5 4 3 2 1\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Реализуй реверс: i=0, j=arr.length-1, swap пока i<j

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    expectedOutput: '5 4 3 2 1'
  },

  // ── УРОК 7 ─────────────────────────────────────────────────────────
  {
    id: 'l07_e01', lessonId: 'l07', title: 'Форматирование номера счёта', difficulty: 'Easy',
    description: `## Форматирование номера счёта\n\nНомер счёта \`"40817810000000000001"\` (20 цифр) преобразуй в формат \`"4081 7810 0000 0000 0001"\` — группы по 4 символа через пробел.\n\n\`\`\`\n4081 7810 0000 0000 0001\n\`\`\``,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        String acc = "40817810000000000001";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < acc.length(); i += 4) {
            // Добавляй 4 символа, потом пробел (кроме последней группы)

        }
        System.out.println(sb.toString().trim());
    }
}`,
    expectedOutput: '4081 7810 0000 0000 0001'
  },
  {
    id: 'l07_e02', lessonId: 'l07', title: 'Маскировка карты', difficulty: 'Easy',
    description: `## Маскировка карты\n\nМаскируй все цифры кроме последних 4:\n\n\`\`\`\n************0001\n\`\`\`\n\nИспользуй \`replaceAll\`.`,
    starterCode:
`public class Main {
    public static void main(String[] args) {
        String card = "4081781000000001";
        // replaceAll с lookahead: "\\d(?=\\d{4})"
        String masked = card.replaceAll(/* твоё regex */"", "*");
        System.out.println(masked);
    }
}`,
    expectedOutput: '************0001'
  },
  {
    id: 'l07_e03', lessonId: 'l07', title: 'Палиндром', difficulty: 'Medium',
    description: `## Проверка палиндрома\n\nПроверь, является ли строка палиндромом (игнорируй пробелы и регистр).\n\nПроверь \`"казак"\` и \`"рояль"\`:\n\`\`\`\nказак: true\nрояль: false\n\`\`\``,
    starterCode:
`public class Main {
    static boolean isPalindrome(String s) {
        s = s.replaceAll("\\\\s+", "").toLowerCase();
        // Сравни с реверсом: new StringBuilder(s).reverse().toString()

    }

    public static void main(String[] args) {
        System.out.println("казак: " + isPalindrome("казак"));
        System.out.println("рояль: " + isPalindrome("рояль"));
    }
}`,
    expectedOutput: 'казак: true\nрояль: false'
  },

  // ── УРОК 8 ─────────────────────────────────────────────────────────
  {
    id: 'l08_e01', lessonId: 'l08', title: 'Сложные проценты', difficulty: 'Medium',
    description: `## Формула сложных процентов\n\nФормула: \`A = P * (1 + r/n)^(n*t)\`\n\nПараметры: P=100000, r=8.5% (0.085), n=12 (ежемесячно), t=5 лет\n\nВыведи:\n\`\`\`\n152396.16\n\`\`\`\n\nОбязательно используй **BigDecimal** (не double)!`,
    starterCode:
`import java.math.BigDecimal;
import java.math.RoundingMode;

public class Main {
    public static void main(String[] args) {
        BigDecimal P = new BigDecimal("100000");
        BigDecimal r = new BigDecimal("0.085");
        int n = 12, t = 5;

        // rPerN = r.divide(new BigDecimal(n), 10, RoundingMode.HALF_UP)
        // base  = BigDecimal.ONE.add(rPerN)
        // A     = P.multiply(base.pow(n * t)).setScale(2, RoundingMode.HALF_UP)

    }
}`,
    expectedOutput: '152396.16'
  },
  {
    id: 'l08_e02', lessonId: 'l08', title: 'Банковское округление', difficulty: 'Easy',
    description: `## HALF_UP vs HALF_EVEN\n\nПокажи разницу округления:\n\n\`\`\`\nHALF_UP:   2.5 -> 3\nHALF_EVEN: 2.5 -> 2\nHALF_EVEN: 3.5 -> 4\n\`\`\`\n\n*HALF_EVEN = "банковское округление" — уменьшает накопленную погрешность*`,
    starterCode:
`import java.math.BigDecimal;
import java.math.RoundingMode;

public class Main {
    public static void main(String[] args) {
        BigDecimal v1 = new BigDecimal("2.5");
        BigDecimal v2 = new BigDecimal("3.5");
        System.out.println("HALF_UP:   2.5 -> " + v1.setScale(0, RoundingMode.HALF_UP));
        // Добавь HALF_EVEN для 2.5 и 3.5

    }
}`,
    expectedOutput: 'HALF_UP:   2.5 -> 3\nHALF_EVEN: 2.5 -> 2\nHALF_EVEN: 3.5 -> 4'
  },

  // ── УРОК 12 ─────────────────────────────────────────────────────────
  {
    id: 'l12_e01', lessonId: 'l12', title: 'HashMap — баланс счёта', difficulty: 'Easy',
    description: `## Работа с HashMap\n\nСоздай Map счёт → баланс, проведи транзакции и выведи итог:\n\n\`\`\`\nACC001: 55000.0\nACC002: 30000.0\n\`\`\``,
    starterCode:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Double> balances = new HashMap<>();
        balances.put("ACC001", 50000.0);
        balances.put("ACC002", 30000.0);
        // Пополни ACC001 на 5000
        // Выведи все пары ключ: значение, СОРТИРУЙ по ключу!
        new TreeMap<>(balances).forEach((k, v) ->
            System.out.println(k + ": " + v));
    }
}`,
    expectedOutput: 'ACC001: 55000.0\nACC002: 30000.0'
  },

  // ── УРОК 14 ─────────────────────────────────────────────────────────
  {
    id: 'l14_e01', lessonId: 'l14', title: 'Stream — фильтр и сумма', difficulty: 'Medium',
    description: `## Stream API\n\nИспользуя Stream, найди сумму транзакций > 5000:\n\n\`\`\`\n90000.0\n\`\`\``,
    starterCode:
`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Double> amounts = List.of(1000.0, 15000.0, 3000.0, 50000.0, 500.0, 25000.0);
        double result = amounts.stream()
            // .filter(...)
            // .mapToDouble(Double::doubleValue)
            // .sum()
            ;
        System.out.println(result);
    }
}`,
    expectedOutput: '90000.0'
  },
]
