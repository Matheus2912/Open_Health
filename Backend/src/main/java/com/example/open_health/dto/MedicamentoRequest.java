package com.example.open_health.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MedicamentoRequest(
        @NotBlank(message = "Informe o medicamento e a posologia")
        @Size(max = 255, message = "O medicamento e a posologia devem ter no máximo 255 caracteres")
        String medicamentoPosologia
) {
}
