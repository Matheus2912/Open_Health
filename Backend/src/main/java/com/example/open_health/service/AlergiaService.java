package com.example.open_health.service;

import com.example.open_health.domain.Alergia;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AlergiaRequest;
import com.example.open_health.dto.AlergiaResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.AlergiaMapper;
import com.example.open_health.repository.AlergiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlergiaService {

    private final AlergiaRepository repository;
    private final UsuarioFinder usuarioFinder;
    private final AlergiaMapper mapper;

    @Transactional
    public AlergiaResponse criar(String emailUsuario, AlergiaRequest request) {
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        Alergia alergia = mapper.toEntity(request, usuario);
        return mapper.toResponse(repository.save(alergia));
    }

    public List<AlergiaResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public AlergiaResponse atualizar(String emailUsuario, UUID id, AlergiaRequest request) {
        Alergia alergia = buscarAlergiaDoUsuario(emailUsuario, id);

        mapper.updateEntity(alergia, request);

        return mapper.toResponse(alergia);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Alergia alergia = buscarAlergiaDoUsuario(emailUsuario, id);
        repository.delete(alergia);
    }

    private Alergia buscarAlergiaDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new NotFoundException("Alergia não encontrada"));
    }
}
