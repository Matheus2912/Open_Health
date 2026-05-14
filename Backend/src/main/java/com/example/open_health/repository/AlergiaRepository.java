package com.example.open_health.repository;

import com.example.open_health.domain.Alergia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlergiaRepository extends JpaRepository<Alergia, UUID> {

    List<Alergia> findByUsuarioEmailOrderByCriadoEmDesc(String email);

    Optional<Alergia> findByIdAndUsuarioEmail(UUID id, String email);

    void deleteByUsuarioId(UUID usuarioId);
}
