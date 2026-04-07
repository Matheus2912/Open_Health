package com.example.open_health.service;

import com.example.open_health.domain.Usuario;
import com.example.open_health.dto.AuthResponse;
import com.example.open_health.dto.UsuarioRequest;
import com.example.open_health.dto.UsuarioResponse;
import com.example.open_health.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
        String cpfNormalizado = normalizarCpf(request.cpf());

        if (repository.existsByEmail(request.email())) {
            throw new RuntimeException("E-mail ja cadastrado");
        }
        if (!cpfValido(cpfNormalizado)) {
            throw new RuntimeException("CPF invalido");
        }
        if (repository.existsByCpfNormalizado(cpfNormalizado)) {
            throw new RuntimeException("CPF ja cadastrado");
        }
        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RuntimeException("As senhas nao coincidem");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNomeCompleto(request.nomeCompleto());
        novoUsuario.setEmail(request.email());
        novoUsuario.setCpf(cpfNormalizado);
        novoUsuario.setTipoSanguineo(request.tipoSanguineo());
        novoUsuario.setSexo(request.sexo());
        novoUsuario.setDataNascimento(request.dataNascimento());
        novoUsuario.setSenha(passwordEncoder.encode(request.senha()));

        repository.save(novoUsuario);

        return paraResponse(novoUsuario);
    }

    @Transactional
    public AuthResponse fazerLogin(String email, String senha) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail nao encontrado"));

        autenticarUsuario(usuario, senha);

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
                .orElseThrow(() -> new RuntimeException("E-mail nao encontrado"));

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

    private void autenticarUsuario(Usuario usuario, String senha) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(usuario.getEmail(), senha)
            );
            return;
        } catch (BadCredentialsException ex) {
            if (!senhaLegadaValida(usuario.getSenha(), senha)) {
                throw ex;
            }
        }

        usuario.setSenha(passwordEncoder.encode(senha));
        repository.save(usuario);
    }

    private boolean senhaLegadaValida(String senhaSalva, String senhaInformada) {
        if (senhaSalva == null) {
            return false;
        }

        boolean pareceHashBcrypt =
                senhaSalva.startsWith("$2a$")
                        || senhaSalva.startsWith("$2b$")
                        || senhaSalva.startsWith("$2y$");

        return !pareceHashBcrypt && senhaSalva.equals(senhaInformada);
    }

    private String normalizarCpf(String cpf) {
        return cpf.replaceAll("\\D", "");
    }

    private boolean cpfValido(String cpf) {
        if (cpf == null || cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }

        int primeiroDigito = calcularDigitoCpf(cpf, 9, 10);
        int segundoDigito = calcularDigitoCpf(cpf, 10, 11);

        return primeiroDigito == Character.getNumericValue(cpf.charAt(9))
                && segundoDigito == Character.getNumericValue(cpf.charAt(10));
    }

    private int calcularDigitoCpf(String cpf, int comprimento, int pesoInicial) {
        int soma = 0;

        for (int index = 0; index < comprimento; index += 1) {
            soma += Character.getNumericValue(cpf.charAt(index)) * (pesoInicial - index);
        }

        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}
