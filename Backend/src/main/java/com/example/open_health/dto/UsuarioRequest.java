package com.example.open_health.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UsuarioRequest(
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

        String telefoneEmergencia,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        String senha,

        @NotBlank(message = "A confirmação de senha é obrigatória")
        String confirmarSenha
) {
}
