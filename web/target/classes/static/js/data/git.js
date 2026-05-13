'use strict';
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: 'git',
  title: 'Git и GitLab',
  icon: '🔀',
  description: 'Ветки, коммиты, merge, rebase, CI/CD, GitLab Pipelines',
  color: '#f97316',
  chapters: [
    {
      id: 'git_ch1',
      title: 'Основы Git',
      lecture: `<h2>Git — система контроля версий</h2>
<p>Git отслеживает изменения в коде и позволяет командам работать над проектом одновременно.</p>

<h3>Установка и настройка</h3>
<pre><code># Настройка пользователя (один раз)
git config --global user.name "Ваше Имя"
git config --global user.email "email@example.com"
git config --global core.editor "code --wait"  # VS Code</code></pre>

<h3>Инициализация репозитория</h3>
<pre><code>git init                    # создать новый репозиторий
git clone URL               # клонировать существующий</code></pre>

<h3>Жизненный цикл файла</h3>
<pre><code>Untracked → Staged → Committed

git status                  # статус файлов
git add file.java           # добавить файл в staging
git add .                   # добавить все изменения
git commit -m "Add user auth feature"
git log --oneline           # история коммитов</code></pre>

<h3>Основные команды</h3>
<pre><code>git diff                    # изменения в рабочей директории
git diff --staged           # изменения в staging
git show HEAD               # последний коммит

git restore file.java       # отменить изменения в файле
git restore --staged file.java  # убрать из staging

git rm file.java            # удалить файл и из Git
git mv old.java new.java    # переименовать</code></pre>

<h3>Игнорирование файлов (.gitignore)</h3>
<pre><code># .gitignore
target/
*.class
.idea/
*.log
.env</code></pre>`,
      tasks: [
        {
          id: 'git_t1', title: 'Симуляция git add/commit', difficulty: 'easy',
          description: '<p>Напишите простую симуляцию трёх состояний файла в Git: Untracked → Staged → Committed. Используйте enum для состояний.</p>',
          hints: ['enum State { UNTRACKED, STAGED, COMMITTED }', 'class GitFile { String name; State state; }'],
          startCode: `import java.util.*;
public class Main {
    enum State { UNTRACKED, STAGED, COMMITTED }

    static class GitFile {
        String name;
        State state;
        GitFile(String name) { this.name = name; this.state = State.UNTRACKED; }
    }

    static class GitRepo {
        List<GitFile> files = new ArrayList<>();

        void addFile(String name) {
            files.add(new GitFile(name));
        }

        void stageFile(String name) {
            // найдите файл и переведите в STAGED
        }

        void commit(String message) {
            // переведите все STAGED файлы в COMMITTED
            System.out.println("Commit: " + message);
        }

        void status() {
            // выведите все файлы и их статусы
        }
    }

    public static void main(String[] args) {
        GitRepo repo = new GitRepo();
        repo.addFile("Main.java");
        repo.addFile("Service.java");
        repo.status();          // Untracked: Main.java, Service.java

        repo.stageFile("Main.java");
        repo.status();          // Staged: Main.java, Untracked: Service.java

        repo.commit("Initial commit");
        repo.status();          // Committed: Main.java, Untracked: Service.java
    }
}`
        },
        {
          id: 'git_t2', title: 'История коммитов', difficulty: 'easy',
          description: '<p>Создайте класс <code>GitLog</code>, который хранит историю коммитов (как <code>git log</code>). Добавьте 5 коммитов и выведите их в обратном порядке (последний первым).</p>',
          hints: ['class Commit { String hash; String message; String date; }', 'Используйте List, добавляйте в начало или переверните'],
          startCode: `import java.util.*;
public class Main {
    static class Commit {
        String hash;
        String message;
        String author;

        Commit(String hash, String msg, String author) {
            this.hash = hash; this.message = msg; this.author = author;
        }

        public String toString() {
            return hash.substring(0, 7) + " " + author + ": " + message;
        }
    }

    static class GitLog {
        List<Commit> commits = new LinkedList<>();

        void addCommit(String hash, String message, String author) {
            // добавьте в начало (как git log — новые сверху)
        }

        void show() {
            // выведите все коммиты
        }
    }

    public static void main(String[] args) {
        GitLog log = new GitLog();
        log.addCommit("a1b2c3d4", "Initial project setup", "Alice");
        log.addCommit("e5f6a7b8", "Add user model", "Bob");
        log.addCommit("c9d0e1f2", "Add REST controller", "Alice");
        log.addCommit("a3b4c5d6", "Add unit tests", "Charlie");
        log.addCommit("e7f8a9b0", "Fix bug in auth", "Bob");
        log.show();
    }
}`
        },
        {
          id: 'git_t3', title: 'Ветки (branches)', difficulty: 'medium',
          description: '<p>Симулируйте работу с ветками Git. Создайте класс <code>GitBranch</code>. Методы: <code>createBranch()</code>, <code>checkout()</code>, <code>merge()</code> (просто добавляет коммиты из ветки). Переключайтесь и добавляйте коммиты в разные ветки.</p>',
          hints: ['Map<String, List<String>> branches', 'String currentBranch', 'merge: добавить коммиты из другой ветки в текущую'],
          startCode: `import java.util.*;
public class Main {
    static class GitRepo {
        Map<String, List<String>> branches = new HashMap<>();
        String currentBranch = "main";

        GitRepo() { branches.put("main", new ArrayList<>()); }

        void commit(String message) {
            branches.get(currentBranch).add(message);
            System.out.println("[" + currentBranch + "] " + message);
        }

        void createBranch(String name) {
            // создайте ветку с копией текущих коммитов
        }

        void checkout(String name) {
            // переключитесь на ветку
        }

        void merge(String from) {
            // добавьте коммиты из 'from' в текущую ветку
            System.out.println("Merged " + from + " into " + currentBranch);
        }

        void log() {
            System.out.println(currentBranch + ": " + branches.get(currentBranch));
        }
    }

    public static void main(String[] args) {
        GitRepo repo = new GitRepo();
        repo.commit("Initial commit");
        repo.createBranch("feature/login");
        repo.checkout("feature/login");
        repo.commit("Add login form");
        repo.commit("Add auth service");
        repo.checkout("main");
        repo.merge("feature/login");
        repo.log();
    }
}`
        }
      ]
    },
    {
      id: 'git_ch2',
      title: 'Удалённые репозитории и GitLab',
      lecture: `<h2>Работа с удалёнными репозиториями</h2>
<pre><code># Добавить remote
git remote add origin https://gitlab.com/user/repo.git
git remote -v                # показать remotes

# Отправить изменения
git push origin main         # отправить в main
git push -u origin main      # с установкой upstream (первый раз)
git push origin feature/auth # отправить ветку

# Получить изменения
git fetch origin             # загрузить (не сливать)
git pull origin main         # fetch + merge</code></pre>

<h3>Branching стратегия (GitFlow)</h3>
<pre><code>main          ← production-ready код
develop       ← ветка разработки
feature/*     ← новые фичи (от develop)
release/*     ← подготовка релиза
hotfix/*      ← срочные исправления в main</code></pre>

<h3>Merge Request / Pull Request</h3>
<ol>
<li>Создать ветку: <code>git checkout -b feature/user-profile</code></li>
<li>Разработать фичу и сделать коммиты</li>
<li>Отправить: <code>git push origin feature/user-profile</code></li>
<li>Создать MR в GitLab UI</li>
<li>Code Review → Approve → Merge</li>
</ol>

<h3>Решение конфликтов</h3>
<pre><code>git pull origin main
# Если конфликт:
# Файл будет содержать:
# &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
# ваш код
# =======
# код из main
# &gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main

# 1. Отредактируйте файл вручную
# 2. git add conflicted-file.java
# 3. git commit -m "Resolve merge conflict"</code></pre>

<h3>GitLab CI/CD Pipeline (.gitlab-ci.yml)</h3>
<pre><code>stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - mvn package -DskipTests

test:
  stage: test
  script:
    - mvn test

deploy:
  stage: deploy
  script:
    - java -jar target/*.jar
  only:
    - main</code></pre>`,
      tasks: [
        {
          id: 'git_t4', title: 'Симуляция push/pull', difficulty: 'easy',
          description: '<p>Симулируйте работу локального и удалённого репозиториев. Класс <code>RemoteRepo</code> хранит коммиты. Методы <code>push()</code> и <code>pull()</code> передают коммиты между ними.</p>',
          hints: ['RemoteRepo хранит List<String> commits', 'push: добавить местные коммиты в remote', 'pull: получить коммиты из remote'],
          startCode: `import java.util.*;
public class Main {
    static class Repository {
        String name;
        List<String> commits = new ArrayList<>();

        Repository(String name) { this.name = name; }

        void commit(String msg) { commits.add(msg); System.out.println("[" + name + "] Commit: " + msg); }

        void push(Repository remote) {
            // отправьте новые коммиты в remote
        }

        void pull(Repository remote) {
            // получите коммиты из remote которых нет локально
        }

        void log() { System.out.println(name + " log: " + commits); }
    }

    public static void main(String[] args) {
        Repository local = new Repository("local");
        Repository remote = new Repository("origin");

        local.commit("First commit");
        local.commit("Add feature");
        local.push(remote);
        remote.log(); // должен содержать 2 коммита

        Repository local2 = new Repository("local2");
        local2.pull(remote);
        local2.log(); // должен содержать 2 коммита
    }
}`
        },
        {
          id: 'git_t5', title: 'Парсер .gitignore', difficulty: 'medium',
          description: '<p>Реализуйте простой парсер .gitignore-правил. Метод <code>isIgnored(filename)</code> возвращает true если файл совпадает с паттерном (поддержите * wildcards и точные совпадения).</p>',
          hints: ['Для *.class: filename.endsWith(".class")', 'Для target/: filename.startsWith("target/")', 'Для точных имён: equals()'],
          startCode: `import java.util.*;
public class Main {
    static class GitIgnore {
        List<String> patterns = new ArrayList<>();

        void addPattern(String pattern) { patterns.add(pattern); }

        boolean isIgnored(String filename) {
            for (String pattern : patterns) {
                if (pattern.startsWith("*.")) {
                    String ext = pattern.substring(1); // ".class"
                    if (filename.endsWith(ext)) return true;
                } else if (pattern.endsWith("/")) {
                    if (filename.startsWith(pattern)) return true;
                } else {
                    if (filename.equals(pattern)) return true;
                }
            }
            return false;
        }
    }

    public static void main(String[] args) {
        GitIgnore gi = new GitIgnore();
        gi.addPattern("*.class");
        gi.addPattern("target/");
        gi.addPattern(".env");

        System.out.println(gi.isIgnored("Main.class"));     // true
        System.out.println(gi.isIgnored("Main.java"));      // false
        System.out.println(gi.isIgnored("target/app.jar")); // true
        System.out.println(gi.isIgnored(".env"));            // true
        System.out.println(gi.isIgnored("pom.xml"));        // false
    }
}`
        }
      ]
    },
    {
      id: 'git_ch3',
      title: 'Продвинутый Git',
      lecture: `<h2>Продвинутые команды Git</h2>

<h3>Rebase vs Merge</h3>
<pre><code># Merge — создаёт merge-commit, сохраняет историю
git checkout main
git merge feature/login
# История: A-B-C-M (M — merge commit)

# Rebase — перемещает коммиты ветки поверх main
git checkout feature/login
git rebase main
# История: A-B-C-D'-E' (линейная, без merge-commit)</code></pre>

<h3>Interactive rebase</h3>
<pre><code># Объединить последние 3 коммита
git rebase -i HEAD~3
# В редакторе:
# pick a1b2c3 feat: add login
# squash d4e5f6 fix typo
# squash g7h8i9 fix another typo</code></pre>

<h3>Stash — временное сохранение</h3>
<pre><code>git stash              # сохранить незакоммиченные изменения
git stash list         # список stash-записей
git stash pop          # восстановить последний stash
git stash drop         # удалить stash</code></pre>

<h3>cherry-pick — перенести конкретный коммит</h3>
<pre><code>git cherry-pick abc1234  # применить коммит в текущую ветку</code></pre>

<h3>Теги (Tags)</h3>
<pre><code>git tag v1.0.0              # лёгкий тег
git tag -a v1.0.0 -m "Release 1.0"  # аннотированный
git push origin v1.0.0      # отправить тег</code></pre>`,
      tasks: [
        {
          id: 'git_t6', title: 'Squash коммитов', difficulty: 'hard',
          description: '<p>Реализуйте метод <code>squash(n)</code>, который объединяет последние n коммитов в один (симуляция git rebase -i squash). Новый коммит содержит все сообщения через " | ".</p>',
          hints: ['Взять последние n коммитов', 'Объединить сообщения через " | "', 'Удалить n коммитов, добавить один'],
          startCode: `import java.util.*;
import java.util.stream.*;
public class Main {
    static LinkedList<String> commits = new LinkedList<>();

    static void commit(String msg) { commits.addLast(msg); }

    static void squash(int n) {
        if (n > commits.size()) { System.out.println("Not enough commits"); return; }
        // объедините последние n коммитов в один
    }

    public static void main(String[] args) {
        commit("feat: add login form");
        commit("fix: typo in form");
        commit("fix: another typo");
        commit("feat: add signup");
        System.out.println("Before: " + commits);
        squash(3);
        System.out.println("After:  " + commits);
        // After: [feat: add login form | fix: typo in form | fix: another typo, feat: add signup]
    }
}`
        }
      ]
    }
  ]
});
