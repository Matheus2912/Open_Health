package config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    // Quando qualquer método lançar um "RuntimeException" (como os que fizemos no Service),
    // este método captura e devolve um erro 400 (Bad Request) limpo.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeRegraDeNegocio(RuntimeException ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }
}
