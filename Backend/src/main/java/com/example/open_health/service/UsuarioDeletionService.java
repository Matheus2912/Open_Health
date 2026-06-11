package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.repository.AlergiaRepository;
import com.example.open_health.repository.CondicaoSaudeRepository;
import com.example.open_health.repository.ConsultaRepository;
import com.example.open_health.repository.ExamePdfRepository;
import com.example.open_health.repository.MedicamentoRepository;
import com.example.open_health.repository.UsuarioRepository;
import com.example.open_health.repository.VacinacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioDeletionService {

    private final UsuarioRepository usuarioRepository;
    private final AlergiaRepository alergiaRepository;
    private final CondicaoSaudeRepository condicaoSaudeRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final VacinacaoRepository vacinacaoRepository;
    private final ExamePdfRepository examePdfRepository;
    private final ConsultaRepository consultaRepository;

    public void deletar(Usuario usuario) {
        UUID usuarioId = usuario.getId();
        consultaRepository.deleteByUsuarioId(usuarioId);
        examePdfRepository.deleteByUsuarioId(usuarioId);
        alergiaRepository.deleteByUsuarioId(usuarioId);
        medicamentoRepository.deleteByUsuarioId(usuarioId);
        vacinacaoRepository.deleteByUsuarioId(usuarioId);
        condicaoSaudeRepository.deleteByUsuarioId(usuarioId);
        usuarioRepository.delete(usuario);
    }
}
