package com.example.open_health.service;

import com.example.open_health.domain.Medicamento;
import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.MedicamentoRequest;
import com.example.open_health.dto.MedicamentoResponse;
import com.example.open_health.repository.MedicamentoRepository;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicamentoApplication {

    private final MedicamentoRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public MedicamentoResponse criar(String emailUsuario, MedicamentoRequest request) {
        Usuario usuario = buscarUsuarioPorEmail(emailUsuario);

        Medicamento medicamento = new Medicamento();
        medicamento.setUsuario(usuario);
        preencherDados(medicamento, request);

        repository.save(medicamento);

        return paraResponse(medicamento);
    }

    public List<MedicamentoResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByCriadoEmDesc(emailUsuario)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public MedicamentoResponse atualizar(String emailUsuario, UUID id, MedicamentoRequest request) {
        Medicamento medicamento = buscarMedicamentoDoUsuario(emailUsuario, id);

        preencherDados(medicamento, request);

        return paraResponse(medicamento);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Medicamento medicamento = buscarMedicamentoDoUsuario(emailUsuario, id);
        repository.delete(medicamento);
    }

    private void preencherDados(Medicamento medicamento, MedicamentoRequest request) {
        medicamento.setMedicamentoPosologia(request.medicamentoPosologia().trim());
    }

    private Usuario buscarUsuarioPorEmail(String emailUsuario) {
        return usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    private Medicamento buscarMedicamentoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new RuntimeException("Medicamento nao encontrado"));
    }

    private MedicamentoResponse paraResponse(Medicamento medicamento) {
        return new MedicamentoResponse(
                medicamento.getId(),
                medicamento.getMedicamentoPosologia(),
                medicamento.getCriadoEm(),
                medicamento.getAtualizadoEm()
        );
    }
}
