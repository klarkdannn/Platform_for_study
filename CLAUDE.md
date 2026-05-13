# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dual-module educational Java project — a self-study curriculum for learning Java from basics to Spring Boot. It has two independent Maven projects:

1. **Root module** — CLI-based interactive lesson runner (Java 21, JUnit 5, Mockito)
2. **`web/` module** — Spring Boot web portal with in-browser Java code execution (like LeetCode)

## Commands

### Root module (CLI curriculum)

```powershell
# Build and run interactive lesson menu
mvn compile exec:java

# Build fat JAR
mvn package

# Run the fat JAR
java -jar target\java-bank-study-1.0.0.jar

# Run all tests
mvn test

# Run a single test class
mvn test -Dtest=AlgorithmsTest

# Run a specific test method
mvn test -Dtest=AlgorithmsTest#BinarySearchTests
```

### Web portal (`web/` directory)

```powershell
# Start the Spring Boot dev server (port 8080, hot reload via devtools)
cd web
mvn spring-boot:run

# Build fat JAR for the portal
cd web
mvn package
java -jar target\java-bank-portal-*.jar
```

### Docker

```powershell
# Build and run the root module image
docker build -t java-bank .
docker run -it java-bank
```

## Architecture

### Root module — CLI lesson runner

`Main.java` is an interactive menu that dispatches to numbered lesson classes. Each lesson is a self-contained runnable class under `src/main/java/com/bank/`. The OOP bank domain (`oop/model/`) serves as the practical example running across multiple lessons.

Curriculum phases (in order): basics → OOP → collections/streams → algorithms → patterns → concurrency → testing → Spring Boot (web module).

### Web portal — Spring Boot SPA

The portal is a Single Page Application served by Thymeleaf from a single `index.html`. Page navigation is client-side only (no page reloads). Architecture:

```
Browser (Monaco Editor + vanilla JS)
  ↕  POST /api/run/java  (JSON: { code })
CodeRunnerController
  ↕
CodeExecutionService   ← compiles code in a temp dir, runs with 15s timeout, captures stdout/stderr
  ↕  returns { output, errors }
Browser shows result
```

**Frontend data model** — Course content lives in JS data files under `web/src/main/resources/static/js/data/`. Each file (e.g., `collections.js`) exports a curriculum object with lectures and tasks. `app.js` reads these objects to render chapter pages and task pages. When adding a new topic, create a new data file and load it in `index.html`.

**Key files:**
- `web/.../controller/CodeRunnerController.java` — REST endpoint `POST /api/run/java`
- `web/.../service/CodeExecutionService.java` — sandboxed compilation + execution (8000 char output cap)
- `web/src/main/resources/templates/index.html` — the entire SPA shell
- `web/src/main/resources/static/js/app.js` — all client-side navigation, tab switching, code execution calls
- `web/src/main/resources/static/js/data/` — per-topic curriculum data files

### Encoding

All source files use UTF-8. The root `Main.java` forces `System.setOut` / `System.setIn` to UTF-8 at startup to handle Cyrillic in comments and output on Windows. The web module's `application.properties` forces UTF-8 for HTTP, Thymeleaf, and Jackson.

## Curriculum data file format

Each JS data file in `static/js/data/` follows this structure (see `collections.js` as the canonical example):

```js
const topicData = {
  id: "topic-id",
  title: "Topic Title",
  chapters: [
    {
      id: "chapter-id",
      title: "Chapter Title",
      lecture: "HTML lecture content",
      tasks: [
        {
          id: "task-id",
          title: "Task Title",
          difficulty: "easy|medium|hard",
          description: "Task description",
          starterCode: "// Java code template",
          solution: "// Reference solution"
        }
      ]
    }
  ]
};
```

## Tests

Tests live in `src/test/java/com/bank/`. Three test files cover:
- `BasicsTest.java` — JUnit 5 fundamentals demo
- `AlgorithmsTest.java` — nested test classes for sorting, search, DP, stacks, financial logic
- `MockitoAndServiceTest.java` — Mockito mocking patterns

The web module has no tests yet.
