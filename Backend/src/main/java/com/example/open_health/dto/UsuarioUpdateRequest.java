package com.example.open_health.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UsuarioUpdateRequest(
        @NotBlank(message = "O nome completo e obrigatorio")
        String nomeCompleto,

        @NotBlank(message = "O e-mail e obrigatorio")
        @Email(message = "Formato de e-mail invalido")
        String email,

        @NotBlank(message = "O CPF e obrigatorio")
        String cpf,

        String tipoSanguineo,

        @NotBlank(message = "O sexo e obrigatorio")
        String sexo,

        @NotNull(message = "A data de nascimento e obrigatoria")
        LocalDate dataNascimento,

        String telefoneEmergencia
) {
}
