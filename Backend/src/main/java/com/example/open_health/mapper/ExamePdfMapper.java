package com.example.open_health.mapper;

import com.example.open_health.domain.ExamePdf;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.ExamePdfResponse;
import com.example.open_health.exception.BusinessException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ExamePdfMapper {

    public ExamePdf toEntity(MultipartFile arquivo, Usuario usuario) {
        ExamePdf exame = new ExamePdf();
        exame.setUsuario(usuario);
        exame.setNomeArquivo(nomeArquivo(arquivo));
        exame.setContentType("application/pdf");
        exame.setTamanhoBytes(arquivo.getSize());

        try {
            exame.setArquivo(arquivo.getBytes());
        } catch (IOException ex) {
            throw new BusinessException("Não foi possível ler o PDF");
        }

        return exame;
    }

    public ExamePdfResponse toResponse(ExamePdf exame) {
        return new ExamePdfResponse(
                exame.getId(),
                exame.getNomeArquivo(),
                exame.getContentType(),
                exame.getTamanhoBytes(),
                exame.getCriadoEm()
        );
    }

    private String nomeArquivo(MultipartFile arquivo) {
        return arquivo.getOriginalFilename() == null ? "exame.pdf" : arquivo.getOriginalFilename();
    }
}
