package br.com.logitrack.dto;

import lombok.Data;

@Data
public class ManutencaoDTO {
    private Long veiculoId;
    private String dataInicio;
    private String tipoServico;
    private Double custoEstimado;
}
