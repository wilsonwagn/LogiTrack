package br.com.logitrack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "veiculos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 10)
    private String placa;

    @Column(nullable = false, length = 50)
    private String modelo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TipoVeiculo tipo;

    private Integer ano;

    public enum TipoVeiculo {
        LEVE, PESADO
    }
}
