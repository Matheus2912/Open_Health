package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaResponse(
        UUID id,
        UUID medicoId,
        String medicoNome,
        String especialidade,
        String crm,
        String unidadeAtendimento,
        LocalDateTime dataHora,
        LocalDateTime fim,
        String status,
        LocalDateTime criadoEm
) {
}
