package com.example.open_health.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank(message = "O nome completo e obrigatorio")
        String nomeCompleto,

        @NotBlank(message = "O e-mail e obrigatorio")
        @Email(message = "Formato de e-mail invalido")
        String email,

        @NotBlank(message = "O CPF e obrigatorio")
        @CPF(message = "CPF invalido")
        String cpf,

        String tipoSanguineo,

        @NotBlank(message = "O sexo e obrigatorio")
        String sexo,

        @NotNull(message = "A data de nascimento e obrigatoria")
        LocalDate dataNascimento,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 8, message = "A senha deve ter no minimo 8 caracteres")
        String senha,

        @NotBlank(message = "A confirmacao de senha e obrigatoria")
        String confirmarSenha
) {
}
