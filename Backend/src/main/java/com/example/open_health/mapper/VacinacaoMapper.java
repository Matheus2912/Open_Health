package com.example.open_health.mapper;

import com.example.open_health.domain.StatusVacinacao;
import com.example.open_health.domain.Usuario;
import com.example.open_health.domain.Vacinacao;
import com.example.open_health.dto.VacinacaoRequest;
import com.example.open_health.dto.VacinacaoResponse;
import org.springframework.stereotype.Component;

@Component
public class VacinacaoMapper {

    public Vacinacao toEntity(VacinacaoRequest request, Usuario usuario) {
        Vacinacao vacinacao = new Vacinacao();
        vacinacao.setUsuario(usuario);
        updateEntity(vacinacao, request);
        return vacinacao;
    }

    public void updateEntity(Vacinacao vacinacao, VacinacaoRequest request) {
        vacinacao.setNomeVacina(request.nomeVacina().trim());
        vacinacao.setData(request.data());
        vacinacao.setStatus(StatusVacinacao.from(request.status()));
    }

    public VacinacaoResponse toResponse(Vacinacao vacinacao) {
        return new VacinacaoResponse(
                vacinacao.getId(),
                vacinacao.getNomeVacina(),
                vacinacao.getData(),
                vacinacao.getStatus().name(),
                vacinacao.getStatus().getDescricao(),
                vacinacao.getCriadoEm(),
                vacinacao.getAtualizadoEm()
        );
    }
}
