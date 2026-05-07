package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MedicamentoResponse(
        UUID id,
        String medicamentoPosologia,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
