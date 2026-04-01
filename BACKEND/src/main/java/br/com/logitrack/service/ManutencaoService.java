package br.com.logitrack.service;

import br.com.logitrack.dto.ManutencaoDTO;
import br.com.logitrack.entity.Manutencao;
import br.com.logitrack.entity.Veiculo;
import br.com.logitrack.repository.ManutencaoRepository;
import br.com.logitrack.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;
    private final VeiculoRepository veiculoRepository;

    public Manutencao agendar(ManutencaoDTO dto) {
        Veiculo veiculo = veiculoRepository.findById(dto.getVeiculoId())
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado: " + dto.getVeiculoId()));

        Manutencao manutencao = Manutencao.builder()
                .veiculo(veiculo)
                .dataInicio(LocalDate.parse(dto.getDataInicio()))
                .tipoServico(dto.getTipoServico())
                .custoEstimado(dto.getCustoEstimado() != null
                        ? BigDecimal.valueOf(dto.getCustoEstimado())
                        : BigDecimal.ZERO)
                .status("PENDENTE")
                .build();

        return manutencaoRepository.save(manutencao);
    }
}
