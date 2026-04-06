package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF; // Validador nativo do Spring/Hibernate para CPF brasileiro

import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank(message = "O nome completo é obrigatório")
        String nomeCompleto,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        String tipoSanguineo, // Não tem anotação de validação, logo é opcional

        @NotNull(message = "A data de nascimento é obrigatória")
        LocalDate dataNascimento,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        String senha,

        @NotBlank(message = "A confirmação de senha é obrigatória")
        String confirmarSenha
) {}
