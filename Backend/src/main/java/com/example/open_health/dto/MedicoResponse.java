package com.example.open_health.dto;

import java.util.UUID;

public record MedicoResponse(
        UUID id,
        String nome,
        String especialidade,
        String crm,
        String unidadeAtendimento
) {
}
