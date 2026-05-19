package com.example.open_health.mapper;

import com.example.open_health.domain.CondicaoSaude;
import com.example.open_health.domain.TipoProblemaSaude;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.CondicaoSaudeRequest;
import com.example.open_health.dto.CondicaoSaudeResponse;
import org.springframework.stereotype.Component;

@Component
public class CondicaoSaudeMapper {

    public CondicaoSaude toEntity(CondicaoSaudeRequest request, Usuario usuario) {
        CondicaoSaude condicao = new CondicaoSaude();
        condicao.setUsuario(usuario);
        updateEntity(condicao, request);
        return condicao;
    }

    public void updateEntity(CondicaoSaude condicao, CondicaoSaudeRequest request) {
        condicao.setTipoProblema(TipoProblemaSaude.from(request.tipoProblema()));
        condicao.setDescricao(request.descricao().trim());
    }

    public CondicaoSaudeResponse toResponse(CondicaoSaude condicao) {
        return new CondicaoSaudeResponse(
                condicao.getId(),
                condicao.getTipoProblema().name(),
                condicao.getTipoProblema().getDescricao(),
                condicao.getDescricao(),
                condicao.getCriadoEm(),
                condicao.getAtualizadoEm()
        );
    }
}
