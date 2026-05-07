package com.example.open_health.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record VacinacaoResponse(
        UUID id,
        String nomeVacina,
        LocalDate data,
        String status,
        String statusDescricao,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
