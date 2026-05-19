package com.example.open_health.service;

import com.example.open_health.domain.CondicaoSaude;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.CondicaoSaudeRequest;
import com.example.open_health.dto.CondicaoSaudeResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.CondicaoSaudeMapper;
import com.example.open_health.repository.CondicaoSaudeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CondicaoSaudeService {

    private final CondicaoSaudeRepository repository;
    private final UsuarioFinder usuarioFinder;
    private final CondicaoSaudeMapper mapper;

    @Transactional
    public CondicaoSaudeResponse criar(String emailUsuario, CondicaoSaudeRequest request) {
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        CondicaoSaude condicao = mapper.toEntity(request, usuario);
        return mapper.toResponse(repository.save(condicao));
    }

    public List<CondicaoSaudeResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public CondicaoSaudeResponse atualizar(String emailUsuario, UUID id, CondicaoSaudeRequest request) {
        CondicaoSaude condicao = buscarCondicaoDoUsuario(emailUsuario, id);

        mapper.updateEntity(condicao, request);

        return mapper.toResponse(condicao);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        CondicaoSaude condicao = buscarCondicaoDoUsuario(emailUsuario, id);
        repository.delete(condicao);
    }

    private CondicaoSaude buscarCondicaoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new NotFoundException("Registro de saúde não encontrado"));
    }
}
