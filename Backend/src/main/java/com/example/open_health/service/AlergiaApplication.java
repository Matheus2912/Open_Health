package com.example.open_health.service;

import com.example.open_health.domain.Alergia;
import com.example.open_health.domain.GravidadeAlergia;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AlergiaRequest;
import com.example.open_health.dto.AlergiaResponse;
import com.example.open_health.repository.AlergiaRepository;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlergiaApplication {

    private final AlergiaRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public AlergiaResponse criar(String emailUsuario, AlergiaRequest request) {
        Usuario usuario = buscarUsuarioPorEmail(emailUsuario);

        Alergia alergia = new Alergia();
        alergia.setUsuario(usuario);
        preencherDados(alergia, request);

        repository.save(alergia);

        return paraResponse(alergia);
    }

    public List<AlergiaResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public AlergiaResponse atualizar(String emailUsuario, UUID id, AlergiaRequest request) {
        Alergia alergia = buscarAlergiaDoUsuario(emailUsuario, id);

        preencherDados(alergia, request);

        return paraResponse(alergia);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Alergia alergia = buscarAlergiaDoUsuario(emailUsuario, id);
        repository.delete(alergia);
    }

    private void preencherDados(Alergia alergia, AlergiaRequest request) {
        alergia.setNome(request.nome().trim());
        alergia.setGravidade(GravidadeAlergia.from(request.gravidade()));
    }

    private Usuario buscarUsuarioPorEmail(String emailUsuario) {
        return usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    private Alergia buscarAlergiaDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new RuntimeException("Alergia nao encontrada"));
    }

    private AlergiaResponse paraResponse(Alergia alergia) {
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
