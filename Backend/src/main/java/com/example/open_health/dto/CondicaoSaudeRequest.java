package com.example.open_health.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CondicaoSaudeRequest(
        @NotBlank(message = "Informe o tipo de problema")
        String tipoProblema,

        @NotBlank(message = "Informe a descricao")
        @Size(max = 500, message = "A descricao deve ter no maximo 500 caracteres")
        String descricao
) {
}
