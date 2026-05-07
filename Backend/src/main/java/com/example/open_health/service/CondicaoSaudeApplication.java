package com.example.open_health.service;

import com.example.open_health.domain.CondicaoSaude;
import com.example.open_health.domain.TipoProblemaSaude;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.CondicaoSaudeRequest;
import com.example.open_health.dto.CondicaoSaudeResponse;
import com.example.open_health.repository.CondicaoSaudeRepository;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CondicaoSaudeApplication {

    private final CondicaoSaudeRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CondicaoSaudeResponse criar(String emailUsuario, CondicaoSaudeRequest request) {
        Usuario usuario = buscarUsuarioPorEmail(emailUsuario);

        CondicaoSaude condicao = new CondicaoSaude();
        condicao.setUsuario(usuario);
        preencherDados(condicao, request);

        repository.save(condicao);

        return paraResponse(condicao);
    }

    public List<CondicaoSaudeResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public CondicaoSaudeResponse atualizar(String emailUsuario, UUID id, CondicaoSaudeRequest request) {
        CondicaoSaude condicao = buscarCondicaoDoUsuario(emailUsuario, id);

        preencherDados(condicao, request);

        return paraResponse(condicao);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        CondicaoSaude condicao = buscarCondicaoDoUsuario(emailUsuario, id);
        repository.delete(condicao);
    }

    private void preencherDados(CondicaoSaude condicao, CondicaoSaudeRequest request) {
        condicao.setTipoProblema(TipoProblemaSaude.from(request.tipoProblema()));
        condicao.setDescricao(request.descricao().trim());
    }

    private Usuario buscarUsuarioPorEmail(String emailUsuario) {
        return usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    private CondicaoSaude buscarCondicaoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new RuntimeException("Registro de saude nao encontrado"));
    }

    private CondicaoSaudeResponse paraResponse(CondicaoSaude condicao) {
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
