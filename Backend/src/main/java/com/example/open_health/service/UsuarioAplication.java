package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AuthResponse;
import com.example.open_health.dto.UsuarioRequest;
import com.example.open_health.dto.UsuarioResponse;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioAplication {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UsuarioResponse cadastrar(UsuarioRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        if (repository.existsByCpf(request.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RuntimeException("As senhas não coincidem");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNomeCompleto(request.nomeCompleto());
        novoUsuario.setEmail(request.email());
        novoUsuario.setCpf(request.cpf());
        novoUsuario.setTipoSanguineo(request.tipoSanguineo());
        novoUsuario.setSexo(request.sexo());
        novoUsuario.setDataNascimento(request.dataNascimento());
        novoUsuario.setSenha(passwordEncoder.encode(request.senha()));

        repository.save(novoUsuario);

        return paraResponse(novoUsuario);
    }

    public AuthResponse fazerLogin(String email, String senha) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, senha)
        );

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        String token = jwtService.gerarToken(
                User.withUsername(usuario.getEmail())
                        .password(usuario.getSenha())
                        .authorities(java.util.List.of())
                        .build()
        );

        return new AuthResponse(token, "Bearer", paraResponse(usuario));
    }

    public UsuarioResponse buscarPerfil(String email) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        return paraResponse(usuario);
    }

    private UsuarioResponse paraResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTipoSanguineo(),
                usuario.getSexo(),
                usuario.getDataNascimento()
        );
    }
}
