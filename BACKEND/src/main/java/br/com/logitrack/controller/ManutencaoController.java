package br.com.logitrack.controller;

import br.com.logitrack.dto.ManutencaoDTO;
import br.com.logitrack.entity.Manutencao;
import br.com.logitrack.service.ManutencaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manutencoes")
@RequiredArgsConstructor
public class ManutencaoController {

    private final ManutencaoService manutencaoService;

    @PostMapping
    public ResponseEntity<Manutencao> agendar(@RequestBody ManutencaoDTO dto) {
        return ResponseEntity.ok(manutencaoService.agendar(dto));
    }
}
