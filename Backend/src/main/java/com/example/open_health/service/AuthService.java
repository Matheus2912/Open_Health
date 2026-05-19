package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AuthResponse;
import com.example.open_health.exception.NotFoundException;
import com.example.open_health.mapper.UsuarioMapper;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioMapper usuarioMapper;

    public AuthResponse fazerLogin(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("E-mail não encontrado"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usuario.getEmail(), senha)
        );

        String token = jwtService.gerarToken(
                User.withUsername(usuario.getEmail())
                        .password(usuario.getSenha())
                        .authorities(List.of())
                        .build()
        );

        return new AuthResponse(token, "Bearer", usuarioMapper.toResponse(usuario));
    }
}
