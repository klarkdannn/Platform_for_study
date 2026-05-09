package com.platform;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.util.concurrent.Executors;

/**
 * Лёгкий HTTP-сервер для React SPA.
 * Запуск: mvn compile exec:java
 */
public class Server {

    private static final int  PORT = 8080;
    private static final Path DIST = Path.of("dist");

    public static void main(String[] args) throws Exception {
        if (!Files.exists(DIST)) {
            System.err.println("[ERROR] dist/ не найден. Сначала выполни: mvn generate-resources");
            System.exit(1);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 100);
        server.createContext("/", Server::handle);
        // Virtual threads (Java 21) — каждый запрос в своём потоке без overhead
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.start();

        System.out.println();
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║      JavaLearn Platform — запущен!       ║");
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.printf ("║  URL:  http://localhost:%-17d║%n", PORT);
        System.out.println("║  Стоп: Ctrl+C                            ║");
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println();

        // Держим JVM живым
        Thread.currentThread().join();
    }

    private static void handle(HttpExchange ex) throws IOException {
        if (!"GET".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(405, -1);
            return;
        }

        String uri = ex.getRequestURI().getPath();
        if (uri.equals("/")) uri = "/index.html";

        Path file = DIST.resolve(uri.substring(1)).normalize();

        // Защита от path traversal
        if (!file.startsWith(DIST)) {
            ex.sendResponseHeaders(403, -1);
            return;
        }

        // SPA: всё что не найдено — отдаём index.html (React Router разберётся)
        if (!Files.exists(file) || Files.isDirectory(file)) {
            file = DIST.resolve("index.html");
        }

        byte[]  body = Files.readAllBytes(file);
        String  ct   = contentType(file.getFileName().toString());

        ex.getResponseHeaders().set("Content-Type",  ct);
        ex.getResponseHeaders().set("Cache-Control", "public, max-age=3600");
        ex.sendResponseHeaders(200, body.length);

        try (OutputStream os = ex.getResponseBody()) {
            os.write(body);
        }
    }

    private static String contentType(String name) {
        if (name.endsWith(".html"))  return "text/html; charset=utf-8";
        if (name.endsWith(".js"))    return "application/javascript; charset=utf-8";
        if (name.endsWith(".css"))   return "text/css; charset=utf-8";
        if (name.endsWith(".svg"))   return "image/svg+xml";
        if (name.endsWith(".png"))   return "image/png";
        if (name.endsWith(".jpg"))   return "image/jpeg";
        if (name.endsWith(".ico"))   return "image/x-icon";
        if (name.endsWith(".woff2")) return "font/woff2";
        if (name.endsWith(".woff"))  return "font/woff";
        if (name.endsWith(".json"))  return "application/json";
        if (name.endsWith(".webp"))  return "image/webp";
        return "application/octet-stream";
    }
}
