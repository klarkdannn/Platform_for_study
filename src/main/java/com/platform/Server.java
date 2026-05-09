package com.platform;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.*;
import java.time.Duration;
import java.util.concurrent.Executors;

/**
 * Лёгкий HTTP-сервер:
 *  GET  /*           → отдаёт файлы из dist/ (React SPA)
 *  POST /api/execute → проксирует к Piston API (выполнение Java)
 *
 * Запуск: mvn compile exec:java
 */
public class Server {

    private static final int    PORT     = 3000;
    private static final Path   DIST     = Path.of("dist");
    private static final String PISTON   = "https://emkc.org/api/v2/piston/execute";

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public static void main(String[] args) throws Exception {
        if (!Files.exists(DIST)) {
            System.err.println("[ERROR] dist/ не найден. Сначала: mvn generate-resources");
            System.exit(1);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 100);
        server.createContext("/api/execute", Server::handleProxy);
        server.createContext("/",            Server::handleStatic);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.start();

        System.out.println();
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║      JavaLearn Platform — запущен!       ║");
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.printf ("║  URL:  http://localhost:%-17d║%n", PORT);
        System.out.println("║  API:  /api/execute → Piston API         ║");
        System.out.println("║  Стоп: Ctrl+C                            ║");
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println();

        Thread.currentThread().join();
    }

    // ── Прокси к Piston API ─────────────────────────────────────────
    private static void handleProxy(HttpExchange ex) throws IOException {
        if (!"POST".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }

        byte[] body = ex.getRequestBody().readAllBytes();

        var req = HttpRequest.newBuilder()
                .uri(URI.create(PISTON))
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(30))
                .build();

        try {
            var resp = HTTP.send(req, HttpResponse.BodyHandlers.ofByteArray());
            ex.getResponseHeaders().set("Content-Type", "application/json");
            ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            ex.sendResponseHeaders(resp.statusCode(), resp.body().length);
            try (var os = ex.getResponseBody()) { os.write(resp.body()); }
        } catch (Exception e) {
            byte[] err = ("{\"error\":\"" + e.getMessage() + "\"}").getBytes();
            ex.getResponseHeaders().set("Content-Type", "application/json");
            ex.sendResponseHeaders(502, err.length);
            try (var os = ex.getResponseBody()) { os.write(err); }
        }
    }

    // ── Статические файлы React SPA ──────────────────────────────────
    private static void handleStatic(HttpExchange ex) throws IOException {
        if (!"GET".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }

        String uri = ex.getRequestURI().getPath();
        if (uri.equals("/")) uri = "/index.html";

        Path file = DIST.resolve(uri.substring(1)).normalize();
        if (!file.startsWith(DIST)) { ex.sendResponseHeaders(403, -1); return; }

        if (!Files.exists(file) || Files.isDirectory(file)) {
            file = DIST.resolve("index.html");
        }

        byte[] bytes = Files.readAllBytes(file);
        ex.getResponseHeaders().set("Content-Type", contentType(file.getFileName().toString()));
        ex.getResponseHeaders().set("Cache-Control", "public, max-age=3600");
        ex.sendResponseHeaders(200, bytes.length);
        try (var os = ex.getResponseBody()) { os.write(bytes); }
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
}
