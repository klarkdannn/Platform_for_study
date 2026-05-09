package com.executor;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.util.Comparator;
import java.util.concurrent.*;

/**
 * Локальный Java-исполнитель.
 * POST /execute  → компилирует и запускает Main.java, возвращает JSON в формате Piston.
 * GET  /health   → "OK"
 *
 * Запускается как Docker-сервис (порт 4000).
 */
public class Executor {

    private static final int PORT    = 4000;
    private static final int COMPILE_TIMEOUT = 10;
    private static final int RUN_TIMEOUT     = 5;

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 200);
        server.createContext("/execute", Executor::handleExecute);
        server.createContext("/health",  Executor::handleHealth);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.start();
        System.out.printf("Executor ready on port %d%n", PORT);
        Thread.currentThread().join();
    }

    // ── /health ───────────────────────────────────────────────────────
    private static void handleHealth(HttpExchange ex) throws IOException {
        byte[] body = "OK".getBytes();
        ex.sendResponseHeaders(200, body.length);
        try (var os = ex.getResponseBody()) { os.write(body); }
    }

    // ── /execute ──────────────────────────────────────────────────────
    private static void handleExecute(HttpExchange ex) throws IOException {
        corsHeaders(ex);

        if ("OPTIONS".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            return;
        }
        if (!"POST".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }

        String body = new String(ex.getRequestBody().readAllBytes(), "UTF-8");
        String code  = extractField(body, "content");

        if (code == null || code.isBlank()) {
            sendJson(ex, 400, "{\"error\":\"Missing code\"}");
            return;
        }

        Result result = run(code);
        String json = String.format(
            "{\"run\":{\"stdout\":%s,\"stderr\":%s,\"code\":%d},\"compile\":{\"stderr\":%s}}",
            jsonStr(result.stdout()), jsonStr(result.runErr()),
            result.exitCode(), jsonStr(result.compileErr())
        );
        sendJson(ex, 200, json);
    }

    // ── Компиляция и запуск ───────────────────────────────────────────
    private static Result run(String code) {
        Path tmp = null;
        try {
            tmp = Files.createTempDirectory("jexec_");
            Path src = tmp.resolve("Main.java");
            Files.writeString(src, code, java.nio.charset.StandardCharsets.UTF_8);

            // javac
            Process cProc = new ProcessBuilder("javac", "-encoding", "UTF-8", "Main.java")
                    .directory(tmp.toFile()).redirectErrorStream(true).start();
            String compileOut = read(cProc.getInputStream());
            boolean ok = cProc.waitFor(COMPILE_TIMEOUT, TimeUnit.SECONDS);
            if (!ok || cProc.exitValue() != 0) {
                return new Result("", "", compileOut.trim(), 1);
            }

            // java
            Process rProc = new ProcessBuilder(
                    "java", "-cp", ".", "-Xmx128m", "-Xss512k", "Main"
            ).directory(tmp.toFile()).start();

            // читаем stdout/stderr параллельно чтобы не было deadlock
            var pool = Executors.newVirtualThreadPerTaskExecutor();
            Future<String> stdoutF = pool.submit(() -> read(rProc.getInputStream()));
            Future<String> stderrF = pool.submit(() -> read(rProc.getErrorStream()));

            boolean finished = rProc.waitFor(RUN_TIMEOUT, TimeUnit.SECONDS);
            pool.shutdownNow();

            if (!finished) {
                rProc.destroyForcibly();
                return new Result("", "Timeout: программа выполнялась более " + RUN_TIMEOUT + " секунд", "", 1);
            }

            String stdout = getQuiet(stdoutF);
            String stderr = getQuiet(stderrF);
            return new Result(stdout, stderr, "", rProc.exitValue());

        } catch (Exception e) {
            return new Result("", e.getMessage(), "", 1);
        } finally {
            if (tmp != null) deleteDir(tmp);
        }
    }

    // ── Утилиты ───────────────────────────────────────────────────────
    private static String read(InputStream is) {
        try { return new String(is.readAllBytes(), "UTF-8"); }
        catch (Exception e) { return ""; }
    }

    private static String getQuiet(Future<String> f) {
        try { return f.get(2, TimeUnit.SECONDS); }
        catch (Exception e) { return ""; }
    }

    private static void deleteDir(Path dir) {
        try {
            Files.walk(dir).sorted(Comparator.reverseOrder())
                    .forEach(p -> { try { Files.deleteIfExists(p); } catch (Exception ignored) {} });
        } catch (Exception ignored) {}
    }

    private static void corsHeaders(HttpExchange ex) {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJson(HttpExchange ex, int status, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        byte[] bytes = json.getBytes("UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (var os = ex.getResponseBody()) { os.write(bytes); }
    }

    /** Простой парсер JSON-строки для поля с заданным ключом */
    private static String extractField(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx < 0) return null;
        idx += search.length();
        while (idx < json.length() && json.charAt(idx) != '"') idx++;
        if (idx >= json.length()) return null;
        idx++; // skip opening "

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
            .replace("\\", "\\\\").replace("\"", "\\\"")
            .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
            + "\"";
    }

    record Result(String stdout, String runErr, String compileErr, int exitCode) {}
}
