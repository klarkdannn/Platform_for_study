package com.platform;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.Comparator;
import java.util.concurrent.*;

/**
 * HTTP-сервер платформы JavaLearn.
 *
 *  GET  /*           → статика из dist/ (React SPA)
 *  POST /api/execute → локально запускает javac + java (без внешних API)
 *
 * Запуск: mvn compile exec:java
 */
public class Server {

    private static final int  PORT            = 3000;
    private static final Path DIST            = Path.of("dist");
    private static final int  COMPILE_TIMEOUT = 10;   // секунд
    private static final int  RUN_TIMEOUT     = 5;    // секунд

    public static void main(String[] args) throws Exception {
        if (!Files.exists(DIST)) {
            System.err.println("[ERROR] dist/ не найден. Выполни: mvn generate-resources");
            System.exit(1);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 100);
        server.createContext("/api/execute", Server::handleExecute);
        server.createContext("/",            Server::handleStatic);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.start();

        System.out.println();
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║      JavaLearn Platform — запущен!       ║");
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.printf ("║  URL:  http://localhost:%-17d║%n", PORT);
        System.out.println("║  API:  /api/execute → локальный javac    ║");
        System.out.println("║  Стоп: Ctrl+C                            ║");
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println();

        Thread.currentThread().join();
    }

    // ── POST /api/execute ─────────────────────────────────────────────
    private static void handleExecute(HttpExchange ex) throws IOException {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin",  "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            return;
        }
        if (!"POST".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }

        String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        String code = extractField(body, "content");

        if (code == null || code.isBlank()) {
            sendJson(ex, 400, "{\"error\":\"Missing 'content' field\"}");
            return;
        }

        RunResult result = runJava(code);
        String json = String.format(
            "{\"run\":{\"stdout\":%s,\"stderr\":%s,\"code\":%d}," +
             "\"compile\":{\"stderr\":%s}}",
            jsonStr(result.stdout()),
            jsonStr(result.runErr()),
            result.exitCode(),
            jsonStr(result.compileErr())
        );
        sendJson(ex, 200, json);
    }

    // ── Компиляция и запуск Java ──────────────────────────────────────
    private static RunResult runJava(String code) {
        Path tmp = null;
        try {
            tmp = Files.createTempDirectory("jexec_");

            // Записываем Main.java
            Files.writeString(tmp.resolve("Main.java"), code, StandardCharsets.UTF_8);

            // javac
            Process compile = new ProcessBuilder("javac", "-encoding", "UTF-8", "Main.java")
                    .directory(tmp.toFile())
                    .redirectErrorStream(true)
                    .start();
            String compileOut = readStream(compile.getInputStream());
            boolean compiled  = compile.waitFor(COMPILE_TIMEOUT, TimeUnit.SECONDS);

            if (!compiled || compile.exitValue() != 0) {
                return new RunResult("", "", compileOut.trim(), 1);
            }

            // java
            Process run = new ProcessBuilder(
                    "java", "-cp", ".", "-Xmx128m", "-Xss512k", "Main"
            ).directory(tmp.toFile()).start();

            // читаем stdout и stderr параллельно (иначе deadlock на больших выводах)
            var pool    = Executors.newVirtualThreadPerTaskExecutor();
            var stdoutF = pool.submit(() -> readStream(run.getInputStream()));
            var stderrF = pool.submit(() -> readStream(run.getErrorStream()));

            boolean finished = run.waitFor(RUN_TIMEOUT, TimeUnit.SECONDS);
            pool.shutdownNow();

            if (!finished) {
                run.destroyForcibly();
                return new RunResult("", "Timeout: программа работала более " + RUN_TIMEOUT + " сек.", "", 1);
            }

            String stdout = getQuiet(stdoutF);
            String stderr = getQuiet(stderrF);
            return new RunResult(stdout, stderr, "", run.exitValue());

        } catch (Exception e) {
            return new RunResult("", e.getMessage(), "", 1);
        } finally {
            deleteDir(tmp);
        }
    }

    // ── GET /* — статические файлы SPA ───────────────────────────────
    private static void handleStatic(HttpExchange ex) throws IOException {
        if (!"GET".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }
        String uri = ex.getRequestURI().getPath();
        if (uri.equals("/")) uri = "/index.html";

        Path file = DIST.resolve(uri.substring(1)).normalize();
        if (!file.startsWith(DIST)) { ex.sendResponseHeaders(403, -1); return; }

        // SPA fallback
        if (!Files.exists(file) || Files.isDirectory(file)) {
            file = DIST.resolve("index.html");
        }

        byte[] bytes = Files.readAllBytes(file);
        String fname = file.getFileName().toString();
        ex.getResponseHeaders().set("Content-Type",  contentType(fname));
        // index.html: no-cache so browser always checks for new builds
        // hashed assets (*.js, *.css): long cache since filename changes on rebuild
        String cacheControl = fname.equals("index.html")
            ? "no-cache, no-store, must-revalidate"
            : "public, max-age=31536000, immutable";
        ex.getResponseHeaders().set("Cache-Control", cacheControl);
        ex.sendResponseHeaders(200, bytes.length);
        try (var os = ex.getResponseBody()) { os.write(bytes); }
    }

    // ── Утилиты ───────────────────────────────────────────────────────
    private static String readStream(InputStream is) {
        try { return new String(is.readAllBytes(), StandardCharsets.UTF_8); }
        catch (Exception e) { return ""; }
    }

    private static String getQuiet(Future<String> f) {
        try { return f.get(2, TimeUnit.SECONDS); }
        catch (Exception e) { return ""; }
    }

    private static void deleteDir(Path dir) {
        if (dir == null) return;
        try {
            Files.walk(dir).sorted(Comparator.reverseOrder())
                 .forEach(p -> { try { Files.deleteIfExists(p); } catch (Exception ignored) {} });
        } catch (Exception ignored) {}
    }

    private static void sendJson(HttpExchange ex, int status, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(status, bytes.length);
        try (var os = ex.getResponseBody()) { os.write(bytes); }
    }

    /** Извлекает значение поля из JSON-строки без внешних библиотек */
    private static String extractField(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx < 0) return null;
        idx += search.length();
        // пропускаем : и пробелы до "
        while (idx < json.length() && json.charAt(idx) != '"') idx++;
        if (idx >= json.length()) return null;
        idx++; // пропускаем открывающую "

        StringBuilder sb = new StringBuilder();
        while (idx < json.length()) {
            char c = json.charAt(idx);
            if (c == '\\' && idx + 1 < json.length()) {
                char n = json.charAt(++idx);
                switch (n) {
                    case '"'  -> sb.append('"');
                    case '\\' -> sb.append('\\');
                    case 'n'  -> sb.append('\n');
                    case 'r'  -> sb.append('\r');
                    case 't'  -> sb.append('\t');
                    default   -> sb.append(n);
                }
            } else if (c == '"') {
                break;
            } else {
                sb.append(c);
            }
            idx++;
        }
        return sb.toString();
    }

    private static String jsonStr(String s) {
        if (s == null) return "\"\"";
        return "\"" + s
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n",  "\\n")
            .replace("\r",  "\\r")
            .replace("\t",  "\\t")
            + "\"";
    }

    private static String contentType(String name) {
        if (name.endsWith(".html"))  return "text/html; charset=utf-8";
        if (name.endsWith(".js"))    return "application/javascript; charset=utf-8";
        if (name.endsWith(".css"))   return "text/css; charset=utf-8";
        if (name.endsWith(".svg"))   return "image/svg+xml";
        if (name.endsWith(".png"))   return "image/png";
        if (name.endsWith(".ico"))   return "image/x-icon";
        if (name.endsWith(".woff2")) return "font/woff2";
        if (name.endsWith(".json"))  return "application/json";
        return "application/octet-stream";
    }

    record RunResult(String stdout, String runErr, String compileErr, int exitCode) {}
}
