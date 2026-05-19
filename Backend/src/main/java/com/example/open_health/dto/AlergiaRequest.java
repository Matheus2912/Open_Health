package com.example.open_health.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlergiaRequest(
        @NotBlank(message = "Informe o nome da alergia")
        @Size(max = 100, message = "O nome da alergia deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "Informe a gravidade")
        String gravidade
) {
}
