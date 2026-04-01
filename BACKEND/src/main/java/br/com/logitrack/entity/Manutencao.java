package br.com.logitrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "manutencoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_finalizacao")
    private LocalDate dataFinalizacao;

    @Column(name = "tipo_servico", length = 100)
    private String tipoServico;

    @Column(name = "custo_estimado", precision = 10, scale = 2)
    private BigDecimal custoEstimado;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDENTE";
}
