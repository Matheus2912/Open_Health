package com.example.open_health.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ConsultaRequest(
        @NotNull(message = "Informe o medico")
        UUID medicoId,

        @NotNull(message = "Informe o horario")
        UUID agendaMedicoId
) {
}
