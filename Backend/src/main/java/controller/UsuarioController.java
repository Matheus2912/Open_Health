package controller;

import dto.LoginRequest;
import dto.UsuarioRequest;
import dto.UsuarioResponse;
import service.UsuarioAplication;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioAplication service;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponse> registrar(@RequestBody @Valid UsuarioRequest request) {
        UsuarioResponse response = service.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Veja: O método de login agora está DENTRO da classe
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody @Valid LoginRequest request) {
        // Adicionamos o "service." aqui para ele achar o método correto
        UsuarioResponse response = service.fazerLogin(request.email(), request.senha());
        return ResponseEntity.ok(response);
    }

}
