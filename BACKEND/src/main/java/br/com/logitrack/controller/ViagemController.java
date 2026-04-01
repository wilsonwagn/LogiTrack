package br.com.logitrack.controller;

import br.com.logitrack.dto.ViagemDTO;
import br.com.logitrack.service.ViagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemService viagemService;

    @GetMapping
    public ResponseEntity<List<ViagemDTO>> findAll() {
        return ResponseEntity.ok(viagemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(viagemService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ViagemDTO> create(@Valid @RequestBody ViagemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagemService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemDTO> update(@PathVariable Long id, @Valid @RequestBody ViagemDTO dto) {
        return ResponseEntity.ok(viagemService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        viagemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
