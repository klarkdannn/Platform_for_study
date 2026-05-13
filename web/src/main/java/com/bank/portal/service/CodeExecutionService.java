package com.bank.portal.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    private static final int TIMEOUT_SECONDS = 15;
    private static final long MAX_OUTPUT_CHARS = 8_000;

    public Map<String, String> runJava(List<Map<String, String>> files) {
        Map<String, String> result = new HashMap<>();
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("javarun_");
            List<String> sourcePaths = new ArrayList<>();

            for (Map<String, String> file : files) {
                String rawName = file.getOrDefault("name", "Main.java");
                String code   = file.getOrDefault("code", "");
                // Security: strip any path separators so there's no directory traversal
                String safeName = Path.of(rawName).getFileName().toString();
                if (!safeName.endsWith(".java")) safeName += ".java";
                Path src = tempDir.resolve(safeName);
                Files.writeString(src, code, StandardCharsets.UTF_8);
                sourcePaths.add(src.toString());
            }

            if (sourcePaths.isEmpty()) {
                result.put("output", "");
                result.put("error", "Нет файлов для компиляции");
                return result;
            }

            // --- Compile all files together ---
            List<String> compileCmd = new ArrayList<>();
            compileCmd.add("javac");
            compileCmd.add("-encoding");
            compileCmd.add("UTF-8");
            compileCmd.addAll(sourcePaths);

            ProcessBuilder compileBuilder = new ProcessBuilder(compileCmd);
            compileBuilder.directory(tempDir.toFile());
            compileBuilder.redirectErrorStream(true);

            Process compileProcess = compileBuilder.start();
            String compileOut = readStream(compileProcess.getInputStream());
            boolean compileFinished = compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!compileFinished || compileProcess.exitValue() != 0) {
                result.put("output", "");
                result.put("error", compileOut.isEmpty() ? "Ошибка компиляции" : compileOut);
                return result;
            }

            // --- Run Main class ---
            List<String> runCmd = List.of(
                    "java",
                    "-Dfile.encoding=UTF-8",
                    "-Dstdout.encoding=UTF-8",
                    "-Dstderr.encoding=UTF-8",
                    "-cp", tempDir.toString(),
                    "Main"
            );
            ProcessBuilder runBuilder = new ProcessBuilder(runCmd);
            runBuilder.directory(tempDir.toFile());
            runBuilder.environment().remove("JAVA_TOOL_OPTIONS");

            Process runProcess = runBuilder.start();
            String stdout = readStream(runProcess.getInputStream());
            String stderr = readStream(runProcess.getErrorStream());
            boolean finished = runProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!finished) {
                runProcess.destroyForcibly();
                result.put("output", stdout);
                result.put("error", "Превышено время выполнения (" + TIMEOUT_SECONDS + " с). Возможно, бесконечный цикл.");
                return result;
            }

            result.put("output", stdout);
            result.put("error", stderr);

        } catch (Exception e) {
            result.put("output", "");
            result.put("error", "Ошибка сервера: " + e.getMessage());
        } finally {
            if (tempDir != null) deleteDir(tempDir);
        }

        return result;
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (sb.length() >= MAX_OUTPUT_CHARS) {
                    sb.append("\n... вывод обрезан (слишком большой) ...");
                    break;
                }
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    private void deleteDir(Path dir) {
        try {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .forEach(p -> { try { Files.delete(p); } catch (IOException ignored) {} });
        } catch (IOException ignored) {}
    }
}
