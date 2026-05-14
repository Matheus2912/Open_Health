package com.example.open_health.dto;

import java.time.LocalDate;
import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nomeCompleto,
        String email,
        String cpf,
        String tipoSanguineo,
        String sexo,
        LocalDate dataNascimento,
        String telefoneEmergencia
) {
}
