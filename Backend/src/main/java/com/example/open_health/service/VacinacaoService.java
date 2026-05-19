package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.domain.Vacinacao;
import com.example.open_health.dto.VacinacaoRequest;
import com.example.open_health.dto.VacinacaoResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.VacinacaoMapper;
import com.example.open_health.repository.VacinacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VacinacaoService {

    private final VacinacaoRepository repository;
    private final UsuarioFinder usuarioFinder;
    private final VacinacaoMapper mapper;

    @Transactional
    public VacinacaoResponse criar(String emailUsuario, VacinacaoRequest request) {
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        Vacinacao vacinacao = mapper.toEntity(request, usuario);
        return mapper.toResponse(repository.save(vacinacao));
    }

    public List<VacinacaoResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByDataDescCriadoEmDesc(emailUsuario)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public VacinacaoResponse atualizar(String emailUsuario, UUID id, VacinacaoRequest request) {
        Vacinacao vacinacao = buscarVacinacaoDoUsuario(emailUsuario, id);

        mapper.updateEntity(vacinacao, request);

        return mapper.toResponse(vacinacao);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Vacinacao vacinacao = buscarVacinacaoDoUsuario(emailUsuario, id);
        repository.delete(vacinacao);
    }

    private Vacinacao buscarVacinacaoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new NotFoundException("Vacinação não encontrada"));
    }
}
