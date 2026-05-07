package com.example.open_health.repository;

import com.example.open_health.domain.Vacinacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VacinacaoRepository extends JpaRepository<Vacinacao, UUID> {

    List<Vacinacao> findByUsuarioEmailOrderByDataDescCriadoEmDesc(String email);

    Optional<Vacinacao> findByIdAndUsuarioEmail(UUID id, String email);
}
