package com.example.open_health.domain;

import java.text.Normalizer;
import java.util.Arrays;

public enum StatusVacinacao {
    COMPLETO("Completo"),
    PENDENTE("Pendente"),
    REFORCO_NECESSARIO("Reforco Necessario");

    private final String descricao;

    StatusVacinacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusVacinacao from(String valor) {
        String valorNormalizado = normalizar(valor);

        return Arrays.stream(values())
                .filter(status -> status.name().equals(valorNormalizado) || normalizar(status.descricao).equals(valorNormalizado))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Status da vacinacao invalido"));
    }

    private static String normalizar(String valor) {
        if (valor == null) {
            return "";
        }

        return Normalizer.normalize(valor.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z0-9]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "")
                .toUpperCase();
    }
}
