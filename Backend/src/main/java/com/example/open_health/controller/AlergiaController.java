package com.example.open_health.controller;

import com.example.open_health.dto.AlergiaRequest;
import com.example.open_health.dto.AlergiaResponse;
import com.example.open_health.service.AlergiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/alergias")
@RequiredArgsConstructor
public class AlergiaController {

    private final AlergiaService service;

    @PostMapping
    public ResponseEntity<AlergiaResponse> criar(
            Authentication authentication,
            @RequestBody @Valid AlergiaRequest request
    ) {
        AlergiaResponse response = service.criar(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AlergiaResponse>> listar(Authentication authentication) {
        List<AlergiaResponse> response = service.listar(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlergiaResponse> atualizar(
            Authentication authentication,
            @PathVariable UUID id,
            @RequestBody @Valid AlergiaRequest request
    ) {
        AlergiaResponse response = service.atualizar(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(Authentication authentication, @PathVariable UUID id) {
        service.remover(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
