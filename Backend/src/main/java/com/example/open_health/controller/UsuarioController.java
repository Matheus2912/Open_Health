package com.example.open_health.controller;

import com.example.open_health.dto.AuthResponse;
import com.example.open_health.dto.LoginRequest;
import com.example.open_health.dto.UsuarioRequest;
import com.example.open_health.dto.UsuarioResponse;
import com.example.open_health.service.UsuarioAplication;
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

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioAplication service;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponse> registrar(@RequestBody @Valid UsuarioRequest request) {
        UsuarioResponse response = service.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = service.fazerLogin(request.email(), request.senha());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> perfil(Authentication authentication) {
        UsuarioResponse response = service.buscarPerfil(authentication.getName());
        return ResponseEntity.ok(response);
    }
}
