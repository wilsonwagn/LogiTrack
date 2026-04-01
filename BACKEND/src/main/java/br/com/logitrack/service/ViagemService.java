package br.com.logitrack.service;

import br.com.logitrack.dto.ViagemDTO;
import br.com.logitrack.entity.Veiculo;
import br.com.logitrack.entity.Viagem;
import br.com.logitrack.repository.VeiculoRepository;
import br.com.logitrack.repository.ViagemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final VeiculoRepository veiculoRepository;

    public List<ViagemDTO> findAll() {
        return viagemRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ViagemDTO findById(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Transactional
    public ViagemDTO create(ViagemDTO dto) {
        Viagem viagem = toEntity(dto);
        return toDTO(viagemRepository.save(viagem));
    }

    @Transactional
    public ViagemDTO update(Long id, ViagemDTO dto) {
        Viagem viagem = findOrThrow(id);
        Veiculo veiculo = findVeiculoOrThrow(dto.getVeiculoId());

        viagem.setVeiculo(veiculo);
        viagem.setDataSaida(dto.getDataSaida());
        viagem.setDataChegada(dto.getDataChegada());
        viagem.setOrigem(dto.getOrigem());
        viagem.setDestino(dto.getDestino());
        viagem.setKmPercorrida(dto.getKmPercorrida());

        return toDTO(viagemRepository.save(viagem));
    }

    @Transactional
    public void delete(Long id) {
        if (!viagemRepository.existsById(id)) throw new EntityNotFoundException("Viagem não encontrada: " + id);
        viagemRepository.deleteById(id);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private Viagem findOrThrow(Long id) {
        return viagemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada: " + id));
    }

    private Veiculo findVeiculoOrThrow(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Veículo não encontrado: " + id));
    }

    private ViagemDTO toDTO(Viagem v) {
        ViagemDTO dto = new ViagemDTO();
        dto.setId(v.getId());
        dto.setVeiculoId(v.getVeiculo().getId());
        dto.setVeiculoModelo(v.getVeiculo().getModelo());
        dto.setVeiculoPlaca(v.getVeiculo().getPlaca());
        dto.setVeiculoTipo(v.getVeiculo().getTipo() != null ? v.getVeiculo().getTipo().name() : null);
        dto.setDataSaida(v.getDataSaida());
        dto.setDataChegada(v.getDataChegada());
        dto.setOrigem(v.getOrigem());
        dto.setDestino(v.getDestino());
        dto.setKmPercorrida(v.getKmPercorrida());
        return dto;
    }

    private Viagem toEntity(ViagemDTO dto) {
        return Viagem.builder()
                .veiculo(findVeiculoOrThrow(dto.getVeiculoId()))
                .dataSaida(dto.getDataSaida())
                .dataChegada(dto.getDataChegada())
                .origem(dto.getOrigem())
                .destino(dto.getDestino())
                .kmPercorrida(dto.getKmPercorrida())
                .build();
    }
}
