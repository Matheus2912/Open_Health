package com.example.open_health.repository;

import com.example.open_health.domain.ExamePdf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExamePdfRepository extends JpaRepository<ExamePdf, UUID> {

    List<ExamePdf> findByUsuarioEmailOrderByCriadoEmDesc(String email);

    Optional<ExamePdf> findByIdAndUsuarioEmail(UUID id, String email);

    void deleteByUsuarioId(UUID usuarioId);
}
