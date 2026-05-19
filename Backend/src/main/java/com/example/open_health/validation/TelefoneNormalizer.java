package com.example.open_health.validation;

import org.springframework.stereotype.Component;

@Component
public class TelefoneNormalizer {

    public String normalizar(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            return null;
        }

        return telefone.replaceAll("[^\\d+]", "");
    }
}
