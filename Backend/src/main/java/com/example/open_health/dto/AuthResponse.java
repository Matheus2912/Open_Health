package com.example.open_health.dto;

public record AuthResponse(
        String token,
        String tipo,
        UsuarioResponse usuario
) {
}
