package com.example.open_health.config;

import com.example.open_health.domain.AgendaMedico;
import com.example.open_health.domain.Medico;
import com.example.open_health.repository.AgendaMedicoRepository;
import com.example.open_health.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MedicoAgendaSeeder implements CommandLineRunner {

    private final MedicoRepository medicoRepository;
    private final AgendaMedicoRepository agendaMedicoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        List<Medico> medicos = criarMedicosBase();
        criarAgendaBase(medicos);
    }

    private List<Medico> criarMedicosBase() {
        List<Medico> medicos = List.of(
                medico("Dra. Ana Ribeiro", "Cardiologia", "CRM-SP 10001", "Unidade Centro"),
                medico("Dr. Bruno Lima", "Dermatologia", "CRM-SP 10002", "Unidade Norte"),
                medico("Dra. Carla Mendes", "Clinica Geral", "CRM-SP 10003", "Unidade Centro"),
                medico("Dr. Diego Santos", "Ortopedia", "CRM-SP 10004", "Unidade Sul")
        );

        medicos.forEach(medico -> {
            if (!medicoRepository.existsByCrm(medico.getCrm())) {
                medicoRepository.save(medico);
            }
        });

        return medicoRepository.findAllByOrderByEspecialidadeAscNomeAsc();
    }

    private Medico medico(String nome, String especialidade, String crm, String unidadeAtendimento) {
        Medico medico = new Medico();
        medico.setNome(nome);
        medico.setEspecialidade(especialidade);
        medico.setCrm(crm);
        medico.setUnidadeAtendimento(unidadeAtendimento);
        return medico;
    }

    private void criarAgendaBase(List<Medico> medicos) {
        List<LocalTime> horarios = List.of(
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0)
        );

        LocalDate hoje = LocalDate.now();
        for (Medico medico : medicos) {
            for (int dia = 1; dia <= 14; dia++) {
                LocalDate data = hoje.plusDays(dia);
                if (data.getDayOfWeek() == DayOfWeek.SUNDAY) {
                    continue;
                }

                for (LocalTime horario : horarios) {
                    LocalDateTime inicio = LocalDateTime.of(data, horario);
                    if (agendaMedicoRepository.existsByMedicoIdAndInicio(medico.getId(), inicio)) {
                        continue;
                    }

                    AgendaMedico agenda = new AgendaMedico();
                    agenda.setMedico(medico);
                    agenda.setInicio(inicio);
                    agenda.setFim(inicio.plusMinutes(50));
                    agenda.setDisponivel(true);
                    agendaMedicoRepository.save(agenda);
                }
            }
        }
    }
}
