package com.example.open_health.repository;

import com.example.open_health.domain.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MedicoRepository extends JpaRepository<Medico, UUID> {

    List<Medico> findByEspecialidadeIgnoreCaseOrderByNome(String especialidade);

    List<Medico> findAllByOrderByEspecialidadeAscNomeAsc();

    @Query("select distinct m.especialidade from Medico m order by m.especialidade")
    List<String> findDistinctEspecialidades();

    boolean existsByCrm(String crm);
}
