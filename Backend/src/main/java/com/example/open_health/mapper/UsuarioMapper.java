package com.example.open_health.mapper;

import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.UsuarioRequest;
import com.example.open_health.dto.UsuarioResponse;
import com.example.open_health.dto.UsuarioUpdateRequest;
import com.example.open_health.validation.TelefoneNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioMapper {

    private final TelefoneNormalizer telefoneNormalizer;

    public Usuario toEntity(UsuarioRequest request, String cpfNormalizado) {
        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(request.nomeCompleto().trim());
        usuario.setEmail(request.email().trim());
        usuario.setCpf(cpfNormalizado);
        usuario.setTipoSanguineo(request.tipoSanguineo());
        usuario.setSexo(request.sexo());
        usuario.setDataNascimento(request.dataNascimento());
        usuario.setTelefoneEmergencia(telefoneNormalizer.normalizar(request.telefoneEmergencia()));
        return usuario;
    }

    public void updateEntity(Usuario usuario, UsuarioUpdateRequest request, String cpfNormalizado) {
        usuario.setNomeCompleto(request.nomeCompleto().trim());
        usuario.setEmail(request.email().trim());
        usuario.setCpf(cpfNormalizado);
        usuario.setTipoSanguineo(request.tipoSanguineo());
        usuario.setSexo(request.sexo());
        usuario.setDataNascimento(request.dataNascimento());
        usuario.setTelefoneEmergencia(telefoneNormalizer.normalizar(request.telefoneEmergencia()));
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTipoSanguineo(),
                usuario.getSexo(),
                usuario.getDataNascimento(),
                usuario.getTelefoneEmergencia()
        );
    }
}
