package com.example.open_health.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UsuarioUpdateRequest(
        @NotBlank(message = "O nome completo é obrigatório")
        String nomeCompleto,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "O CPF é obrigatório")
        String cpf,

        String tipoSanguineo,

        @NotBlank(message = "O sexo é obrigatório")
        String sexo,

        @NotNull(message = "A data de nascimento e obrigatoria")
        LocalDate dataNascimento,

        String telefoneEmergencia
) {
}
