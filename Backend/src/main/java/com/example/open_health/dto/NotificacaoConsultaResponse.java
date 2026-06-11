package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificacaoConsultaResponse(
        UUID consultaId,
        String titulo,
        String mensagem,
        LocalDateTime dataHora
) {
}
