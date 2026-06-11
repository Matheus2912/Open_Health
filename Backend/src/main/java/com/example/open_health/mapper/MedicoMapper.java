package com.example.open_health.mapper;

import com.example.open_health.domain.AgendaMedico;
import com.example.open_health.domain.Consulta;
import com.example.open_health.domain.Medico;
import com.example.open_health.dto.ConsultaResponse;
import com.example.open_health.dto.HorarioDisponivelResponse;
import com.example.open_health.dto.MedicoResponse;
import com.example.open_health.dto.NotificacaoConsultaResponse;
import org.springframework.stereotype.Component;

@Component
public class MedicoMapper {

    public MedicoResponse toMedicoResponse(Medico medico) {
        return new MedicoResponse(
                medico.getId(),
                medico.getNome(),
                medico.getEspecialidade(),
                medico.getCrm(),
                medico.getUnidadeAtendimento()
        );
    }

    public HorarioDisponivelResponse toHorarioResponse(AgendaMedico agenda) {
        return new HorarioDisponivelResponse(
                agenda.getId(),
                agenda.getInicio(),
                agenda.getFim()
        );
    }

    public ConsultaResponse toConsultaResponse(Consulta consulta) {
        Medico medico = consulta.getMedico();
        AgendaMedico agenda = consulta.getAgendaMedico();
        return new ConsultaResponse(
                consulta.getId(),
                medico.getId(),
                medico.getNome(),
                medico.getEspecialidade(),
                medico.getCrm(),
                medico.getUnidadeAtendimento(),
                consulta.getDataHora(),
                agenda.getFim(),
                consulta.getStatus(),
                consulta.getCriadoEm()
        );
    }

    public NotificacaoConsultaResponse toNotificacaoResponse(Consulta consulta) {
        String horario = consulta.getDataHora().toLocalTime().toString();
        return new NotificacaoConsultaResponse(
                consulta.getId(),
                "Consulta amanha",
                "Confirme sua consulta com " + consulta.getMedico().getNome() + " as " + horario + ".",
                consulta.getDataHora()
        );
    }
}
