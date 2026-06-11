package com.example.open_health.repository;

import com.example.open_health.domain.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ConsultaRepository extends JpaRepository<Consulta, UUID> {

    List<Consulta> findByUsuarioEmailOrderByDataHoraAsc(String email);

    List<Consulta> findByUsuarioEmailAndDataHoraBetweenOrderByDataHoraAsc(String email, LocalDateTime inicio, LocalDateTime fim);

    boolean existsByAgendaMedicoId(UUID agendaMedicoId);

    void deleteByUsuarioId(UUID usuarioId);
}
