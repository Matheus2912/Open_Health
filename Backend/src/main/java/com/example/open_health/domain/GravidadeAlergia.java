package com.example.open_health.domain;

import com.example.open_health.exception.BusinessException;

import java.text.Normalizer;
import java.util.Arrays;

public enum GravidadeAlergia {
    BAIXA("Baixa"),
    MEDIA("Média"),
    ALTA("Alta");

    private final String descricao;

    GravidadeAlergia(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static GravidadeAlergia from(String valor) {
        String valorNormalizado = normalizar(valor);

        return Arrays.stream(values())
                .filter(gravidade -> gravidade.name().equals(valorNormalizado) || normalizar(gravidade.descricao).equals(valorNormalizado))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Gravidade da alergia inválida"));
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
