package br.com.logitrack.service;

import br.com.logitrack.dto.DashboardDTO;
import br.com.logitrack.entity.Manutencao;
import br.com.logitrack.repository.ManutencaoRepository;
import br.com.logitrack.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ViagemRepository viagemRepository;
    private final ManutencaoRepository manutencaoRepository;

    public DashboardDTO getMetricas() {

        // 1. Total KM percorrido pela frota
        Double totalKm = viagemRepository.sumTotalKm();

        // 2. Volume por Categoria (Leve vs Pesado)
        List<Object[]> volumeRaw = viagemRepository.countViagensByTipo();
        Map<String, Long> volumePorCategoria = volumeRaw.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()
                ));

        // 3. Todas as manutenções (PENDENTE + CONCLUIDA)
        List<Manutencao> manutencoes = manutencaoRepository
                .findTodasManutencoes(PageRequest.of(0, 10));
        List<DashboardDTO.ManutencaoResumoDTO> proximasManutencoes = manutencoes.stream()
                .map(m -> DashboardDTO.ManutencaoResumoDTO.builder()
                        .id(m.getId())
                        .veiculo(m.getVeiculo().getModelo())
                        .tipoServico(m.getTipoServico())
                        .dataInicio(m.getDataInicio().toString())
                        .status(m.getStatus())
                        .build())
                .collect(Collectors.toList());

        // 4. Ranking de utilização (veículo com maior km)
        List<Object[]> rankingRaw = viagemRepository.rankingUtilizacao();
        DashboardDTO.RankingDTO ranking = rankingRaw.isEmpty() ? null :
                DashboardDTO.RankingDTO.builder()
                        .veiculo(rankingRaw.get(0)[0].toString())
                        .totalKm(((Number) rankingRaw.get(0)[1]).doubleValue())
                        .build();

        // 5. Projeção financeira do mês atual
        Double projecaoFinanceira = manutencaoRepository.sumCustoMesAtual();

        return DashboardDTO.builder()
                .totalKm(totalKm != null ? totalKm : 0.0)
                .volumePorCategoria(volumePorCategoria)
                .proximasManutencoes(proximasManutencoes)
                .rankingUtilizacao(ranking)
                .projecaoFinanceira(projecaoFinanceira != null ? projecaoFinanceira : 0.0)
                .build();
    }
}
