package com.example.open_health.controller;

import com.example.open_health.domain.ExamePdf;
import com.example.open_health.dto.ExamePdfResponse;
import com.example.open_health.service.ExamePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/exames-pdf")
@RequiredArgsConstructor
public class ExamePdfController {

    private final ExamePdfService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExamePdfResponse> enviar(
            Authentication authentication,
            @RequestPart("arquivo") MultipartFile arquivo
    ) {
        ExamePdfResponse response = service.enviar(authentication.getName(), arquivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ExamePdfResponse>> listar(Authentication authentication) {
        return ResponseEntity.ok(service.listar(authentication.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> baixar(Authentication authentication, @PathVariable UUID id) {
        ExamePdf exame = service.buscarArquivo(authentication.getName(), id);
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(exame.getNomeArquivo())
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(exame.getArquivo());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(Authentication authentication, @PathVariable UUID id) {
        service.remover(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
