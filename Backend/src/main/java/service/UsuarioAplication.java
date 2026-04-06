package service;

import domain.Usuario;
import dto.UsuarioRequest;
import dto.UsuarioResponse;
import repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioAplication {

    private final UsuarioRepository repository;

    @Transactional
    public UsuarioResponse cadastrar(UsuarioRequest request) {
        // 1. Validar duplicados
        if (repository.existsByEmail(request.email())) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        if (repository.existsByCpf(request.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        // 2. Validar confirmação de senha
        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RuntimeException("As senhas não coincidem");
        }

        // 3. Criar a Entidade
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNomeCompleto(request.nomeCompleto());
        novoUsuario.setEmail(request.email());
        novoUsuario.setCpf(request.cpf());
        novoUsuario.setTipoSanguineo(request.tipoSanguineo());
        novoUsuario.setDataNascimento(request.dataNascimento());

        // Salvando a senha diretamente, sem o PasswordEncoder
        novoUsuario.setSenha(request.senha());

        repository.save(novoUsuario);

        // 4. Retornar o Response
        return new UsuarioResponse(
                novoUsuario.getId(),
                novoUsuario.getNomeCompleto(),
                novoUsuario.getEmail(),
                novoUsuario.getCpf(),
                novoUsuario.getTipoSanguineo(),
                novoUsuario.getDataNascimento()
        );
    }

    // Veja: O método fazerLogin agora está DENTRO da classe!
    public UsuarioResponse fazerLogin(String email, String senha) {
        // 1. Busca o usuário no "Banco de Dados" pelo e-mail
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        // 2. Verifica se a senha digitada é igual à senha salva
        if (!usuario.getSenha().equals(senha)) {
            throw new RuntimeException("Senha incorreta");
        }

        // 3. Se deu tudo certo, devolve os dados do usuário (sem a senha)
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTipoSanguineo(),
                usuario.getDataNascimento()
        );
    }
}