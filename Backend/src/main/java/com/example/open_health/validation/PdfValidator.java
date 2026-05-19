package com.example.open_health.validation;

import com.example.open_health.exception.BusinessException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class PdfValidator {

    private static final long TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024;

    public void validar(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new BusinessException("Informe um arquivo PDF");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new BusinessException("O PDF deve ter no máximo 10MB");
        }

        String nomeArquivo = arquivo.getOriginalFilename() == null ? "" : arquivo.getOriginalFilename();
        String contentType = arquivo.getContentType() == null ? "" : arquivo.getContentType();
        boolean parecePdf = "application/pdf".equalsIgnoreCase(contentType)
                || nomeArquivo.toLowerCase().endsWith(".pdf");

        if (!parecePdf) {
            throw new BusinessException("Envie apenas arquivos PDF");
        }
    }
}
