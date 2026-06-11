package com.example.open_health.controller;

import com.example.open_health.dto.ConsultaRequest;
import com.example.open_health.dto.ConsultaResponse;
import com.example.open_health.dto.NotificacaoConsultaResponse;
import com.example.open_health.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService service;

    @PostMapping
    public ResponseEntity<ConsultaResponse> agendar(
            Authentication authentication,
            @RequestBody @Valid ConsultaRequest request
    ) {
        ConsultaResponse response = service.agendar(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ConsultaResponse>> listar(Authentication authentication) {
        return ResponseEntity.ok(service.listar(authentication.getName()));
    }

    @GetMapping("/notificacoes")
    public ResponseEntity<List<NotificacaoConsultaResponse>> listarNotificacoes(Authentication authentication) {
        return ResponseEntity.ok(service.listarNotificacoesDeAmanha(authentication.getName()));
    }
}
