package repository;

import domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // O Spring Boot é inteligente o suficiente para ler o nome do método
    // e criar o SQL automático (SELECT count(*) WHERE email = ?)
    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    // Precisaremos deste método no futuro para a hora de fazer o Login
    Optional<Usuario> findByEmail(String email);
}
