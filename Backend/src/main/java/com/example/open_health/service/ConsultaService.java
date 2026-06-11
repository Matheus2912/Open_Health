package com.example.open_health.service;

import com.example.open_health.domain.AgendaMedico;
import com.example.open_health.domain.Consulta;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.ConsultaRequest;
import com.example.open_health.dto.ConsultaResponse;
import com.example.open_health.dto.NotificacaoConsultaResponse;
import com.example.open_health.exception.BusinessException;
import com.example.open_health.exception.ConflictException;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.MedicoMapper;
import com.example.open_health.repository.AgendaMedicoRepository;
import com.example.open_health.repository.ConsultaRepository;
import com.example.open_health.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final AgendaMedicoRepository agendaMedicoRepository;
    private final MedicoRepository medicoRepository;
    private final UsuarioFinder usuarioFinder;
    private final MedicoMapper mapper;

    @Transactional
    public ConsultaResponse agendar(String emailUsuario, ConsultaRequest request) {
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        if (!medicoRepository.existsById(request.medicoId())) {
            throw new NotFoundException("Medico nao encontrado");
        }

        AgendaMedico agenda = agendaMedicoRepository.findByIdAndMedicoId(request.agendaMedicoId(), request.medicoId())
                .orElseThrow(() -> new NotFoundException("Horario nao encontrado"));

        if (!agenda.isDisponivel() || consultaRepository.existsByAgendaMedicoId(agenda.getId())) {
            throw new ConflictException("Horario indisponivel");
        }

        if (!agenda.getInicio().isAfter(LocalDateTime.now())) {
            throw new BusinessException("Escolha um horario futuro");
        }

        agenda.setDisponivel(false);

        Consulta consulta = new Consulta();
        consulta.setUsuario(usuario);
        consulta.setMedico(agenda.getMedico());
        consulta.setAgendaMedico(agenda);
        consulta.setDataHora(agenda.getInicio());
        consulta.setStatus("AGENDADA");

        return mapper.toConsultaResponse(consultaRepository.save(consulta));
    }

    public List<ConsultaResponse> listar(String emailUsuario) {
        return consultaRepository.findByUsuarioEmailOrderByDataHoraAsc(emailUsuario)
                .stream()
                .map(mapper::toConsultaResponse)
                .toList();
    }

    public List<NotificacaoConsultaResponse> listarNotificacoesDeAmanha(String emailUsuario) {
        LocalDate amanha = LocalDate.now().plusDays(1);
        LocalDateTime inicio = amanha.atStartOfDay();
        LocalDateTime fim = amanha.plusDays(1).atStartOfDay().minusNanos(1);

        return consultaRepository.findByUsuarioEmailAndDataHoraBetweenOrderByDataHoraAsc(emailUsuario, inicio, fim)
                .stream()
                .map(mapper::toNotificacaoResponse)
                .toList();
    }
}
