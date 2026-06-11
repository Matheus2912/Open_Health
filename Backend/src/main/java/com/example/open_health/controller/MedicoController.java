package com.example.open_health.controller;

import com.example.open_health.dto.HorarioDisponivelResponse;
import com.example.open_health.dto.MedicoResponse;
import com.example.open_health.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/medicos")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService service;

    @GetMapping("/especialidades")
    public ResponseEntity<List<String>> listarEspecialidades() {
        return ResponseEntity.ok(service.listarEspecialidades());
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponse>> listar(@RequestParam(required = false) String especialidade) {
        return ResponseEntity.ok(service.listarMedicos(especialidade));
    }

    @GetMapping("/{id}/horarios-disponiveis")
    public ResponseEntity<List<HorarioDisponivelResponse>> listarHorariosDisponiveis(@PathVariable UUID id) {
        return ResponseEntity.ok(service.listarHorariosDisponiveis(id));
    }
}
