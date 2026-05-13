package com.bank.algorithms.strings;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║       АЛГОРИТМЫ НА СТРОКАХ — ПОЛНЫЙ РАЗБОР              ║
 * ║  KMP, Rabin-Karp, Z-function, Trie, Aho-Corasick        ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * БАНК ИСПОЛЬЗУЕТ СТРОКОВЫЕ АЛГОРИТМЫ:
 *   - Поиск паттернов мошенничества в описаниях транзакций
 *   - Автодополнение при вводе имени получателя
 *   - Нечёткий поиск клиентов (опечатки)
 *   - Разбор XML/JSON ответов от внешних систем
 *   - Маскировка данных (номер карты, ИНН)
 *   - Валидация форматов (IBAN, номер телефона, Email)
 */
public class StringAlgorithms {

    // ══════════════════════════════════════════════════════════
    // 1. НАИВНЫЙ ПОИСК ПОДСТРОКИ — O(n*m)
    // ══════════════════════════════════════════════════════════

    public static int naiveSearch(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        for (int i = 0; i <= n - m; i++) {
            int j = 0;
            while (j < m && text.charAt(i + j) == pattern.charAt(j)) j++;
            if (j == m) return i;
        }
        return -1;
    }

    // ══════════════════════════════════════════════════════════
    // 2. KMP (Кнут-Моррис-Пратт) — O(n + m)
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: При несовпадении — не начинаем с начала, а используем
    // информацию о частичных совпадениях (prefix-suffix).
    //
    // prefix-функция (failure function): для каждой позиции j в
    // паттерне — наибольшая длина суффикса = префиксу.
    //
    // БАНК: Поиск ключевого слова "МОШЕННИЧЕСТВО" в 10 млн. описаний.

    private static int[] buildKMPTable(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m]; // longest proper prefix which is also suffix
        int len = 0, i = 1;
        lps[0] = 0;
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            } else if (len > 0) {
                len = lps[len - 1]; // не уменьшаем i!
            } else {
                lps[i++] = 0;
            }
        }
        return lps;
    }

    public static List<Integer> kmpSearch(String text, String pattern) {
        List<Integer> positions = new ArrayList<>();
        int n = text.length(), m = pattern.length();
        int[] lps = buildKMPTable(pattern);
        int i = 0, j = 0;
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) { i++; j++; }
            if (j == m) {
                positions.add(i - j); // нашли!
                j = lps[j - 1];
            } else if (i < n && text.charAt(i) != pattern.charAt(j)) {
                if (j > 0) j = lps[j - 1];
                else i++;
            }
        }
        return positions; // O(n + m)
    }

    // ══════════════════════════════════════════════════════════
    // 3. RABIN-KARP — хэширование — O(n+m) среднее
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Считаем хэш паттерна и хэш каждого окна в тексте.
    // Хэши совпали → проверяем посимвольно.
    // Rolling hash: обновляем хэш за O(1) при сдвиге окна.
    //
    // БАНК: Поиск нескольких паттернов одновременно.

    public static List<Integer> rabinKarp(String text, String pattern) {
        List<Integer> positions = new ArrayList<>();
        int n = text.length(), m = pattern.length();
        final long BASE = 31L, MOD = 1_000_000_007L;

        // Вычисляем BASE^(m-1) % MOD
        long power = 1;
        for (int i = 0; i < m - 1; i++) power = power * BASE % MOD;

        // Хэш паттерна и первого окна
        long patHash = 0, winHash = 0;
        for (int i = 0; i < m; i++) {
            patHash = (patHash * BASE + pattern.charAt(i)) % MOD;
            winHash = (winHash * BASE + text.charAt(i)) % MOD;
        }

        for (int i = 0; i <= n - m; i++) {
            if (winHash == patHash) {
                // Проверяем посимвольно (защита от коллизий)
                if (text.substring(i, i + m).equals(pattern)) positions.add(i);
            }
            if (i < n - m) {
                // Rolling hash: убираем левый символ, добавляем правый
                winHash = (winHash - text.charAt(i) * power % MOD + MOD) % MOD;
                winHash = (winHash * BASE + text.charAt(i + m)) % MOD;
            }
        }
        return positions;
    }

    // ══════════════════════════════════════════════════════════
    // 4. Z-ФУНКЦИЯ — O(n + m)
    // ══════════════════════════════════════════════════════════
    // z[i] = длина наибольшей подстроки, начинающейся с i,
    //        которая является префиксом строки.
    // Используется для поиска паттерна: строим s = pattern + "$" + text.

    public static int[] zFunction(String s) {
        int n = s.length();
        int[] z = new int[n];
        z[0] = n;
        int l = 0, r = 0;
        for (int i = 1; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }

    public static List<Integer> zSearch(String text, String pattern) {
        String s = pattern + "$" + text;
        int[] z = zFunction(s);
        List<Integer> positions = new ArrayList<>();
        int m = pattern.length();
        for (int i = m + 1; i < s.length(); i++) {
            if (z[i] == m) positions.add(i - m - 1);
        }
        return positions;
    }

    // ══════════════════════════════════════════════════════════
    // 5. TRIE (ПРЕФИКСНОЕ ДЕРЕВО) — O(L) на операцию
    //    L = длина строки
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Дерево где каждый путь от корня до листа = строка.
    // Все строки с общим префиксом делят одну ветку.
    //
    // БАНК: Автодополнение при вводе имени банка-получателя.
    // Быстрый поиск всех счетов с заданным префиксом.
    // Хранение и поиск SWIFT/BIC кодов.

    public static class Trie {
        private static class TrieNode {
            Map<Character, TrieNode> children = new HashMap<>();
            boolean isEnd = false;
            String word = null; // хранит полное слово если isEnd
        }

        private final TrieNode root = new TrieNode();

        public void insert(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                curr.children.putIfAbsent(c, new TrieNode());
                curr = curr.children.get(c);
            }
            curr.isEnd = true;
            curr.word = word;
        }

        public boolean search(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                if (!curr.children.containsKey(c)) return false;
                curr = curr.children.get(c);
            }
            return curr.isEnd;
        }

        public boolean startsWith(String prefix) {
            TrieNode curr = root;
            for (char c : prefix.toCharArray()) {
                if (!curr.children.containsKey(c)) return false;
                curr = curr.children.get(c);
            }
            return true;
        }

        // Найти все слова с данным префиксом (автодополнение)
        public List<String> autocomplete(String prefix) {
            TrieNode curr = root;
            for (char c : prefix.toCharArray()) {
                if (!curr.children.containsKey(c)) return Collections.emptyList();
                curr = curr.children.get(c);
            }
            List<String> results = new ArrayList<>();
            dfsCollect(curr, results);
            return results;
        }

        private void dfsCollect(TrieNode node, List<String> results) {
            if (node.isEnd) results.add(node.word);
            for (TrieNode child : node.children.values()) dfsCollect(child, results);
        }

        public boolean delete(String word) {
            return deleteHelper(root, word, 0);
        }

        private boolean deleteHelper(TrieNode node, String word, int idx) {
            if (idx == word.length()) {
                if (!node.isEnd) return false;
                node.isEnd = false;
                node.word = null;
                return node.children.isEmpty();
            }
            char c = word.charAt(idx);
            if (!node.children.containsKey(c)) return false;
            boolean shouldDelete = deleteHelper(node.children.get(c), word, idx + 1);
            if (shouldDelete) node.children.remove(c);
            return !node.isEnd && node.children.isEmpty();
        }
    }

    // ══════════════════════════════════════════════════════════
    // 6. ПОЛЕЗНЫЕ СТРОКОВЫЕ ЗАДАЧИ
    // ══════════════════════════════════════════════════════════

    // Маскировка номера карты: "4276811012341234" → "4276 **** **** 1234"
    public static String maskCardNumber(String pan) {
        if (pan == null || pan.length() != 16) return "INVALID";
        return pan.substring(0, 4) + " **** **** " + pan.substring(12);
    }

    // Валидация Email — упрощённая
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");
    }

    // Валидация IBAN (базовая — длина и префикс для РФ)
    public static boolean isValidIBAN(String iban) {
        if (iban == null) return false;
        String cleaned = iban.replaceAll("\\s", "").toUpperCase();
        return cleaned.matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$");
    }

    // Все анаграммы в строке — Sliding Window + HashMap — O(n)
    // Банк: поиск паттернов транзакций-анаграмм (перестановка символов описания)
    public static List<Integer> findAnagrams(String s, String p) {
        List<Integer> result = new ArrayList<>();
        if (s.length() < p.length()) return result;
        int[] pCount = new int[26], wCount = new int[26];
        for (char c : p.toCharArray()) pCount[c - 'a']++;
        for (int i = 0; i < p.length(); i++) wCount[s.charAt(i) - 'a']++;
        if (Arrays.equals(pCount, wCount)) result.add(0);
        for (int i = p.length(); i < s.length(); i++) {
            wCount[s.charAt(i) - 'a']++;
            wCount[s.charAt(i - p.length()) - 'a']--;
            if (Arrays.equals(pCount, wCount)) result.add(i - p.length() + 1);
        }
        return result;
    }

    // Longest Palindromic Substring — расширение от центра — O(n²)
    // Банк: Нахождение симметричных паттернов в транзакционных кодах
    public static String longestPalindrome(String s) {
        if (s.isEmpty()) return "";
        int start = 0, maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            // Нечётная длина: центр = i
            int len1 = expandFromCenter(s, i, i);
            // Чётная длина: центр между i и i+1
            int len2 = expandFromCenter(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > maxLen) { maxLen = len; start = i - (len - 1) / 2; }
        }
        return s.substring(start, start + maxLen);
    }

    private static int expandFromCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--; right++;
        }
        return right - left - 1;
    }

    // ══════════════════════════════════════════════════════════
    // ★ ЗАДАНИЯ ДЛЯ ТЕБЯ:
    //
    // 1. Реализуй Aho-Corasick:
    //    Поиск МНОЖЕСТВА паттернов одновременно за O(n + sum(m) + k).
    //    Строим Trie из всех паттернов + failure links (как в KMP).
    //    Банк: Поиск списка запрещённых слов в 1 проходе по тексту.
    //
    // 2. Алгоритм Манакера (Manacher's) — O(n):
    //    Найти наидлиннейший палиндром за линейное время.
    //    Самый сложный строковый алгоритм — отличный показатель
    //    для senior позиции.
    //
    // 3. Суффиксный массив — O(n log n):
    //    Все суффиксы строки, отсортированные лексикографически.
    //    Позволяет искать подстроки, LCS строк, repeating patterns.
    //    Банк: Полнотекстовый поиск по базе транзакций.
    //
    // 4. Реализуй BankSearchEngine:
    //    - Trie для автодополнения имён получателей
    //    - KMP для поиска ключевых слов в описаниях
    //    - Edit Distance для нечёткого поиска клиентов
    //    - Маскировка чувствительных данных в логах
    // ══════════════════════════════════════════════════════════

    public static void run() {
        System.out.println("=== АЛГОРИТМЫ НА СТРОКАХ ===\n");

        String text = "AABAACAADAABAABA";
        String pattern = "AABA";

        System.out.println("── Поиск паттерна ──");
        System.out.printf("Текст:   \"%s\"%n", text);
        System.out.printf("Паттерн: \"%s\"%n%n", pattern);
        System.out.println("Наивный поиск: индекс " + naiveSearch(text, pattern));
        System.out.println("KMP:           позиции " + kmpSearch(text, pattern));
        System.out.println("Rabin-Karp:    позиции " + rabinKarp(text, pattern));
        System.out.println("Z-функция:     позиции " + zSearch(text, pattern));

        System.out.println("\n── Trie (автодополнение банков) ──");
        Trie trie = new Trie();
        String[] banks = {"Сбербанк", "Сбер", "СберБизнес", "ВТБ", "ВТБ 24",
                "Тинькофф", "Тинькофф Банк", "Альфа", "Альфа-Банк"};
        for (String b : banks) trie.insert(b);
        System.out.println("Поиск 'Сбер': " + trie.search("Сбер"));
        System.out.println("Автодополнение 'Сбер': " + trie.autocomplete("Сбер"));
        System.out.println("Автодополнение 'ВТБ':  " + trie.autocomplete("ВТБ"));
        System.out.println("Автодополнение 'Альфа':" + trie.autocomplete("Альфа"));

        System.out.println("\n── Маскировка данных ──");
        System.out.println(maskCardNumber("4276811012341234"));
        System.out.println("Email valid: " + isValidEmail("user@bank.ru"));
        System.out.println("Email invalid: " + isValidEmail("notanemail"));

        System.out.println("\n── Палиндром ──");
        System.out.println("Longest palindrome in 'babad': " + longestPalindrome("babad"));
        System.out.println("Longest palindrome in 'cbbd':  " + longestPalindrome("cbbd"));
    }
}
