package br.com.logitrack.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardDTO {

    private Double totalKm;
    private Map<String, Long> volumePorCategoria;
    private List<ManutencaoResumoDTO> proximasManutencoes;
    private RankingDTO rankingUtilizacao;
    private Double projecaoFinanceira;

    @Data
    @Builder
    public static class ManutencaoResumoDTO {
        private Long id;
        private String veiculo;
        private String tipoServico;
        private String dataInicio;
        private String status;
    }

    @Data
    @Builder
    public static class RankingDTO {
        private String veiculo;
        private Double totalKm;
    }
}
