package com.example.open_health.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record HorarioDisponivelResponse(
        UUID id,
        LocalDateTime inicio,
        LocalDateTime fim
) {
}
