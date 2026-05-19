package com.example.open_health.service;

import com.example.open_health.domain.ExamePdf;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.ExamePdfResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.ExamePdfMapper;
import com.example.open_health.repository.ExamePdfRepository;
import com.example.open_health.validation.PdfValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamePdfService {

    private final ExamePdfRepository repository;
    private final UsuarioFinder usuarioFinder;
    private final PdfValidator pdfValidator;
    private final ExamePdfMapper mapper;

    @Transactional
    public ExamePdfResponse enviar(String emailUsuario, MultipartFile arquivo) {
        pdfValidator.validar(arquivo);
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        ExamePdf exame = mapper.toEntity(arquivo, usuario);
        return mapper.toResponse(repository.save(exame));
    }

    public List<ExamePdfResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ExamePdf buscarArquivo(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new NotFoundException("PDF não encontrado"));
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        ExamePdf exame = buscarArquivo(emailUsuario, id);
        repository.delete(exame);
    }
}
