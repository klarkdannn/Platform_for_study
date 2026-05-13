package com.bank.portal.controller;

import com.bank.portal.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CodeRunnerController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @SuppressWarnings("unchecked")
    @PostMapping(value = "/run/java",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> runJava(@RequestBody Map<String, Object> body) {
        List<Map<String, String>> files = (List<Map<String, String>>) body.get("files");

        if (files == null || files.isEmpty()) {
            String code = (String) body.get("code");
            if (code == null || code.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Код пуст", "output", ""));
            }

            // Snippet mode: wrap bare statements in a full class
            Boolean snippet = (Boolean) body.get("snippet");
            if (Boolean.TRUE.equals(snippet) && !code.contains("class ")) {
                code = "import java.util.*;\n"
                     + "import java.math.*;\n"
                     + "import java.text.*;\n"
                     + "public class Main {\n"
                     + "    public static void main(String[] args) throws Exception {\n"
                     + "        " + code.trim().replace("\n", "\n        ") + "\n"
                     + "    }\n"
                     + "}";
            }

            files = List.of(Map.of("name", "Main.java", "code", code));
        }

        return ResponseEntity.ok(codeExecutionService.runJava(files));
    }
}
