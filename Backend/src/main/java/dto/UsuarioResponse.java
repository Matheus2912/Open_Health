package dto;

import java.time.LocalDate;
import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nomeCompleto,
        String email,
        String cpf,
        String tipoSanguineo,
        LocalDate dataNascimento
) {
    // Você pode criar um construtor customizado aqui depois
    // para converter facilmente a Entidade Usuario neste Response
}