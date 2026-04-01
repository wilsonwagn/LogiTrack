package br.com.logitrack.controller;

import br.com.logitrack.entity.Veiculo;
import br.com.logitrack.service.VeiculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService veiculoService;

    @GetMapping
    public ResponseEntity<List<Veiculo>> findAll() {
        return ResponseEntity.ok(veiculoService.findAll());
    }
}
