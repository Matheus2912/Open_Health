package com.example.open_health.service;

import com.example.open_health.domain.Medicamento;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.MedicamentoRequest;
import com.example.open_health.dto.MedicamentoResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.MedicamentoMapper;
import com.example.open_health.repository.MedicamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicamentoService {

    private final MedicamentoRepository repository;
    private final UsuarioFinder usuarioFinder;
    private final MedicamentoMapper mapper;

    @Transactional
    public MedicamentoResponse criar(String emailUsuario, MedicamentoRequest request) {
        Usuario usuario = usuarioFinder.buscarPorEmail(emailUsuario);
        Medicamento medicamento = mapper.toEntity(request, usuario);
        return mapper.toResponse(repository.save(medicamento));
    }

    public List<MedicamentoResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public MedicamentoResponse atualizar(String emailUsuario, UUID id, MedicamentoRequest request) {
        Medicamento medicamento = buscarMedicamentoDoUsuario(emailUsuario, id);

        mapper.updateEntity(medicamento, request);

        return mapper.toResponse(medicamento);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Medicamento medicamento = buscarMedicamentoDoUsuario(emailUsuario, id);
        repository.delete(medicamento);
    }

    private Medicamento buscarMedicamentoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new NotFoundException("Medicamento não encontrado"));
    }
}
