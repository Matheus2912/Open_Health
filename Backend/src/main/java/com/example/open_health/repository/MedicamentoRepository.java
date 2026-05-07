package com.example.open_health.repository;

import com.example.open_health.domain.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID> {

    List<Medicamento> findByUsuarioEmailOrderByCriadoEmDesc(String email);

    Optional<Medicamento> findByIdAndUsuarioEmail(UUID id, String email);
}
