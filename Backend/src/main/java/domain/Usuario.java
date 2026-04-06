package domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Data // O Lombok cria os Getters e Setters automaticamente
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nomeCompleto;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, unique = true, length = 14) // Tamanho para guardar o formato 000.000.000-00
    private String cpf;

    @Column(nullable = true, length = 3) // Opcional, como você pediu (ex: A+, AB-, O+)
    private String tipoSanguineo;

    @Column(nullable = false)
    private LocalDate dataNascimento; // Substituindo a "Idade" fixa

    @Column(nullable = false)
    private String senha;
}
