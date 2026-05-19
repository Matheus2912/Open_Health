package com.example.open_health.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/")
public class PaginaController {

    @GetMapping
    public ResponseEntity<Map<String, String>> paginaInicial() {
        return ResponseEntity.ok(Map.of(
                "mensagem", "OpenHealth API",
                "status", "online"
        ));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
