package com.example.open_health.service;

import com.example.open_health.domain.StatusVacinacao;
import com.example.open_health.domain.Usuario;
import com.example.open_health.domain.Vacinacao;
import com.example.open_health.dto.VacinacaoRequest;
import com.example.open_health.dto.VacinacaoResponse;
import com.example.open_health.repository.UsuarioRepository;
import com.example.open_health.repository.VacinacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VacinacaoApplication {

    private final VacinacaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public VacinacaoResponse criar(String emailUsuario, VacinacaoRequest request) {
        Usuario usuario = buscarUsuarioPorEmail(emailUsuario);

        Vacinacao vacinacao = new Vacinacao();
        vacinacao.setUsuario(usuario);
        preencherDados(vacinacao, request);

        repository.save(vacinacao);

        return paraResponse(vacinacao);
    }

    public List<VacinacaoResponse> listar(String emailUsuario) {
        return repository.findByUsuarioEmailOrderByDataDescCriadoEmDesc(emailUsuario)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public VacinacaoResponse atualizar(String emailUsuario, UUID id, VacinacaoRequest request) {
        Vacinacao vacinacao = buscarVacinacaoDoUsuario(emailUsuario, id);

        preencherDados(vacinacao, request);

        return paraResponse(vacinacao);
    }

    @Transactional
    public void remover(String emailUsuario, UUID id) {
        Vacinacao vacinacao = buscarVacinacaoDoUsuario(emailUsuario, id);
        repository.delete(vacinacao);
    }

    private void preencherDados(Vacinacao vacinacao, VacinacaoRequest request) {
        vacinacao.setNomeVacina(request.nomeVacina().trim());
        vacinacao.setData(request.data());
        vacinacao.setStatus(StatusVacinacao.from(request.status()));
    }

    private Usuario buscarUsuarioPorEmail(String emailUsuario) {
        return usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
    }

    private Vacinacao buscarVacinacaoDoUsuario(String emailUsuario, UUID id) {
        return repository.findByIdAndUsuarioEmail(id, emailUsuario)
                .orElseThrow(() -> new RuntimeException("Vacinacao nao encontrada"));
    }

    private VacinacaoResponse paraResponse(Vacinacao vacinacao) {
        return new VacinacaoResponse(
                vacinacao.getId(),
                vacinacao.getNomeVacina(),
                vacinacao.getData(),
                vacinacao.getStatus().name(),
                vacinacao.getStatus().getDescricao(),
                vacinacao.getCriadoEm(),
                vacinacao.getAtualizadoEm()
        );
    }
}
