package com.example.open_health.validation;

import com.example.open_health.exception.BusinessException;
import org.springframework.stereotype.Component;

@Component
public class CpfValidator {

    public String normalizarEValidar(String cpf) {
        String cpfNormalizado = normalizar(cpf);

        if (!valido(cpfNormalizado)) {
            throw new BusinessException("CPF inválido");
        }

        return cpfNormalizado;
    }

    public String normalizar(String cpf) {
        if (cpf == null) {
            return "";
        }

        return cpf.replaceAll("\\D", "");
    }

    public boolean valido(String cpf) {
        if (cpf == null || cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }

        int primeiroDigito = calcularDigito(cpf, 9, 10);
        int segundoDigito = calcularDigito(cpf, 10, 11);

        return primeiroDigito == Character.getNumericValue(cpf.charAt(9))
                && segundoDigito == Character.getNumericValue(cpf.charAt(10));
    }

    private int calcularDigito(String cpf, int comprimento, int pesoInicial) {
        int soma = 0;

        for (int index = 0; index < comprimento; index += 1) {
            soma += Character.getNumericValue(cpf.charAt(index)) * (pesoInicial - index);
        }

        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}
