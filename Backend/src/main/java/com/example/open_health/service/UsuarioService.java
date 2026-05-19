package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AuthResponse;
import com.example.open_health.dto.UsuarioRequest;
import com.example.open_health.dto.UsuarioResponse;
import com.example.open_health.dto.UsuarioUpdateRequest;
import com.example.open_health.exception.ConflictException;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.UsuarioMapper;
import com.example.open_health.repository.UsuarioRepository;
import com.example.open_health.validation.CpfValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CpfValidator cpfValidator;
    private final UsuarioMapper usuarioMapper;
    private final UsuarioDeletionService usuarioDeletionService;

    @Transactional
    public UsuarioResponse cadastrar(UsuarioRequest request) {
        String emailNormalizado = request.email().trim();
        String cpfNormalizado = cpfValidator.normalizarEValidar(request.cpf());

        validarEmailDisponivel(emailNormalizado);
        validarCpfDisponivel(cpfNormalizado);
        validarSenhasIguais(request.senha(), request.confirmarSenha());

        Usuario novoUsuario = usuarioMapper.toEntity(request, cpfNormalizado);
        novoUsuario.setEmail(emailNormalizado);
        novoUsuario.setSenha(passwordEncoder.encode(request.senha()));

        return usuarioMapper.toResponse(usuarioRepository.save(novoUsuario));
    }

    public UsuarioResponse buscarPerfil(String email) {
        Usuario usuario = buscarPorEmail(email);
        return usuarioMapper.toResponse(usuario);
    }

    @Transactional
    public AuthResponse atualizarPerfil(String emailAtual, UsuarioUpdateRequest request) {
        Usuario usuario = buscarPorEmail(emailAtual);
        String cpfNormalizado = cpfValidator.normalizarEValidar(request.cpf());
        String emailNormalizado = request.email().trim();

        if (usuarioRepository.existsByEmailAndIdNot(emailNormalizado, usuario.getId())) {
            throw new ConflictException("E-mail já cadastrado");
        }
        if (usuarioRepository.existsByCpfNormalizadoAndIdNot(cpfNormalizado, usuario.getId())) {
            throw new ConflictException("CPF já cadastrado");
        }

        usuarioMapper.updateEntity(usuario, request, cpfNormalizado);
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(
                User.withUsername(usuarioAtualizado.getEmail())
                        .password(usuarioAtualizado.getSenha())
                        .authorities(List.of())
                        .build()
        );

        return new AuthResponse(token, "Bearer", usuarioMapper.toResponse(usuarioAtualizado));
    }

    @Transactional
    public void deletarPerfil(String email) {
        usuarioDeletionService.deletar(buscarPorEmail(email));
    }

    private Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("E-mail não encontrado"));
    }

    private void validarEmailDisponivel(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictException("E-mail já cadastrado");
        }
    }

    private void validarCpfDisponivel(String cpfNormalizado) {
        if (usuarioRepository.existsByCpfNormalizado(cpfNormalizado)) {
            throw new ConflictException("CPF já cadastrado");
        }
    }

    private void validarSenhasIguais(String senha, String confirmarSenha) {
        if (!senha.equals(confirmarSenha)) {
            throw new ConflictException("As senhas não coincidem");
        }
    }
}
