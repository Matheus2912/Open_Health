package com.example.open_health.domain;

import com.example.open_health.exception.BusinessException;

import java.text.Normalizer;
import java.util.Arrays;

public enum TipoProblemaSaude {
    CARDIACO("Cardíaco"),
    PULMONAR("Pulmonar"),
    DIABETES("Diabetes"),
    NEUROLOGICO("Neurológico"),
    ORTOPEDICO("Ortopédico"),
    DERMATOLOGICO("Dermatológico"),
    OUTRO("Outro");

    private final String descricao;

    TipoProblemaSaude(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static TipoProblemaSaude from(String valor) {
        String valorNormalizado = normalizar(valor);

        return Arrays.stream(values())
                .filter(tipo -> tipo.name().equals(valorNormalizado) || normalizar(tipo.descricao).equals(valorNormalizado))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Tipo de problema de saúde inválido"));
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
