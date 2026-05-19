package com.example.open_health.mapper;

import com.example.open_health.domain.Alergia;
import com.example.open_health.domain.GravidadeAlergia;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AlergiaRequest;
import com.example.open_health.dto.AlergiaResponse;
import org.springframework.stereotype.Component;

@Component
public class AlergiaMapper {

    public Alergia toEntity(AlergiaRequest request, Usuario usuario) {
        Alergia alergia = new Alergia();
        alergia.setUsuario(usuario);
        updateEntity(alergia, request);
        return alergia;
    }

    public void updateEntity(Alergia alergia, AlergiaRequest request) {
        alergia.setNome(request.nome().trim());
        alergia.setGravidade(GravidadeAlergia.from(request.gravidade()));
    }

    public AlergiaResponse toResponse(Alergia alergia) {
        return new AlergiaResponse(
                alergia.getId(),
                alergia.getNome(),
                alergia.getGravidade().name(),
                alergia.getGravidade().getDescricao(),
                alergia.getCriadoEm(),
                alergia.getAtualizadoEm()
        );
    }
}
