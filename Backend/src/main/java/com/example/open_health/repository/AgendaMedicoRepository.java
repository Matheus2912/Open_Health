package com.example.open_health.repository;

import com.example.open_health.domain.AgendaMedico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AgendaMedicoRepository extends JpaRepository<AgendaMedico, UUID> {

    List<AgendaMedico> findByMedicoIdAndDisponivelTrueAndInicioAfterOrderByInicioAsc(UUID medicoId, LocalDateTime agora);

    Optional<AgendaMedico> findByIdAndMedicoId(UUID id, UUID medicoId);

    boolean existsByMedicoIdAndInicio(UUID medicoId, LocalDateTime inicio);
}
