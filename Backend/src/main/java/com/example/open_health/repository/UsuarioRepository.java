package com.example.open_health.repository;

import com.example.open_health.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    boolean existsByCpf(String cpf);

    @Query("""
            select count(u) > 0
            from Usuario u
            where replace(replace(u.cpf, '.', ''), '-', '') = :cpf
            """)
    boolean existsByCpfNormalizado(@Param("cpf") String cpf);

    @Query("""
            select count(u) > 0
            from Usuario u
            where replace(replace(u.cpf, '.', ''), '-', '') = :cpf
            and u.id <> :id
            """)
    boolean existsByCpfNormalizadoAndIdNot(@Param("cpf") String cpf, @Param("id") UUID id);

    Optional<Usuario> findByEmail(String email);
}
