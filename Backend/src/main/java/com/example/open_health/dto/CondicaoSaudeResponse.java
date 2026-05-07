package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CondicaoSaudeResponse(
        UUID id,
        String tipoProblema,
        String tipoProblemaDescricao,
        String descricao,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
