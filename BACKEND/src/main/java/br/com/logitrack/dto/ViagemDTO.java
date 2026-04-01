package br.com.logitrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ViagemDTO {

    private Long id;

    @NotNull(message = "Veículo obrigatório")
    private Long veiculoId;

    private String veiculoModelo;
    private String veiculoPlaca;
    private String veiculoTipo;

    @NotNull(message = "Data de saída obrigatória")
    private LocalDateTime dataSaida;

    private LocalDateTime dataChegada;
    private String origem;
    private String destino;
    private BigDecimal kmPercorrida;
}
