package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AlergiaResponse(
        UUID id,
        String nome,
        String gravidade,
        String gravidadeDescricao,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
