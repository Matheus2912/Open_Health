package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class PaginaController {

    // Rota principal (localhost:8080/)
    @GetMapping
    public ResponseEntity<Map<String, String>> paginaInicial() {
        Map<String, String> resposta = new HashMap<>();
        resposta.put("mensagem", "Bem-vindo à API do OpenHealth!");
        resposta.put("status", "Servidor rodando perfeitamente.");
        resposta.put("versao", "1.0.0 - Sprint 1");

        return ResponseEntity.ok(resposta);
    }

    // Rota de teste rápido de conexão (localhost:8080/ping)
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
