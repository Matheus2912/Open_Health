package com.example.open_health.mapper;

import com.example.open_health.domain.Medicamento;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.MedicamentoRequest;
import com.example.open_health.dto.MedicamentoResponse;
import org.springframework.stereotype.Component;

@Component
public class MedicamentoMapper {

    public Medicamento toEntity(MedicamentoRequest request, Usuario usuario) {
        Medicamento medicamento = new Medicamento();
        medicamento.setUsuario(usuario);
        updateEntity(medicamento, request);
        return medicamento;
    }

    public void updateEntity(Medicamento medicamento, MedicamentoRequest request) {
        medicamento.setMedicamentoPosologia(request.medicamentoPosologia().trim());
    }

    public MedicamentoResponse toResponse(Medicamento medicamento) {
        return new MedicamentoResponse(
                medicamento.getId(),
                medicamento.getMedicamentoPosologia(),
                medicamento.getCriadoEm(),
                medicamento.getAtualizadoEm()
        );
    }
}
