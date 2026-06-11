package com.example.open_health.service;

import com.example.open_health.domain.AgendaMedico;
import com.example.open_health.domain.Medico;
import com.example.open_health.dto.HorarioDisponivelResponse;
import com.example.open_health.dto.MedicoResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.MedicoMapper;
import com.example.open_health.repository.AgendaMedicoRepository;
import com.example.open_health.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final AgendaMedicoRepository agendaMedicoRepository;
    private final MedicoMapper mapper;

    public List<String> listarEspecialidades() {
        return medicoRepository.findDistinctEspecialidades();
    }

    public List<MedicoResponse> listarMedicos(String especialidade) {
        List<Medico> medicos = especialidade == null || especialidade.isBlank()
                ? medicoRepository.findAllByOrderByEspecialidadeAscNomeAsc()
                : medicoRepository.findByEspecialidadeIgnoreCaseOrderByNome(especialidade.trim());

        return medicos.stream()
                .map(mapper::toMedicoResponse)
                .toList();
    }

    public List<HorarioDisponivelResponse> listarHorariosDisponiveis(UUID medicoId) {
        if (!medicoRepository.existsById(medicoId)) {
            throw new NotFoundException("Medico nao encontrado");
        }

        return agendaMedicoRepository.findByMedicoIdAndDisponivelTrueAndInicioAfterOrderByInicioAsc(medicoId, LocalDateTime.now())
                .stream()
                .map(mapper::toHorarioResponse)
                .toList();
    }
}
