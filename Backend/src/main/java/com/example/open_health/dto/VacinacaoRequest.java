package com.example.open_health.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record VacinacaoRequest(
        @NotBlank(message = "Informe o nome da vacina")
        @Size(max = 100, message = "O nome da vacina deve ter no maximo 100 caracteres")
        String nomeVacina,

        @NotNull(message = "Informe a data da vacinacao")
        LocalDate data,

        @NotBlank(message = "Informe o status")
        String status
) {
}
