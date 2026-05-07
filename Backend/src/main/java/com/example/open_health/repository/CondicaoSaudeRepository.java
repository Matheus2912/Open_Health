package com.example.open_health.repository;

import com.example.open_health.domain.CondicaoSaude;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CondicaoSaudeRepository extends JpaRepository<CondicaoSaude, UUID> {

    List<CondicaoSaude> findByUsuarioEmailOrderByCriadoEmDesc(String email);

    Optional<CondicaoSaude> findByIdAndUsuarioEmail(UUID id, String email);
}
