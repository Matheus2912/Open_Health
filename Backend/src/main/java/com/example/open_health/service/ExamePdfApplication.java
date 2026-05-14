package com.example.open_health.service;

import com.example.open_health.domain.ExamePdf;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.ExamePdfResponse;
import com.example.open_health.repository.ExamePdfRepository;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamePdfApplication {

    private static final long TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024;

    private final ExamePdfRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ExamePdfResponse enviar(String emailUsuario, MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new RuntimeException("Informe um arquivo PDF");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new RuntimeException("O PDF deve ter no maximo 10MB");
        }

        String nomeArquivo = arquivo.getOriginalFilename() == null ? "exame.pdf" : arquivo.getOriginalFilename();
        String contentType = arquivo.getContentType() == null ? "application/pdf" : arquivo.getContentType();
        boolean parecePdf = "application/pdf".equalsIgnoreCase(contentType) || nomeArquivo.toLowerCase().endsWith(".pdf");

        if (!parecePdf) {
            throw new RuntimeException("Envie apenas arquivos PDF");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        ExamePdf exame = new ExamePdf();
        exame.setUsuario(usuario);
        exame.setNomeArquivo(nomeArquivo);
        exame.setContentType("application/pdf");
        exame.setTamanhoBytes(arquivo.getSize());

        try {
            exame.setArquivo(arquivo.getBytes());
        } catch (IOException ex) {
            throw new RuntimeException("Nao foi possivel ler o PDF");
        }

        repository.save(exame);

        return paraResponse(exame);
    }

    public List<ExamePdfResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public ExamePdf buscarArquivo(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new RuntimeException("PDF nao encontrado"));
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        ExamePdf exame = buscarArquivo(emailUsuario, id);
        repository.delete(exame);
    }

    private ExamePdfResponse paraResponse(ExamePdf exame) {
        return new ExamePdfResponse(
                exame.getId(),
                exame.getNomeArquivo(),
                exame.getContentType(),
                exame.getTamanhoBytes(),
                exame.getCriadoEm()
        );
    }
}
