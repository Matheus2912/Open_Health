package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExamePdfResponse(
        UUID id,
        String nomeArquivo,
        String contentType,
        Long tamanhoBytes,
        LocalDateTime criadoEm
) {
}
