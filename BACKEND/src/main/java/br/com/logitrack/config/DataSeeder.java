package br.com.logitrack.config;

import br.com.logitrack.entity.Manutencao;
import br.com.logitrack.entity.Veiculo;
import br.com.logitrack.entity.Viagem;
import br.com.logitrack.repository.ManutencaoRepository;
import br.com.logitrack.repository.VeiculoRepository;
import br.com.logitrack.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final VeiculoRepository veiculoRepository;
    private final ViagemRepository viagemRepository;
    private final ManutencaoRepository manutencaoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (veiculoRepository.count() > 0) return;

        // ── Veículos (dados do script original) ──
        Veiculo v1 = veiculoRepository.save(Veiculo.builder().placa("ABC-1234").modelo("Fiorino").tipo(Veiculo.TipoVeiculo.LEVE).ano(2022).build());
        Veiculo v2 = veiculoRepository.save(Veiculo.builder().placa("XYZ-9876").modelo("Volvo FH").tipo(Veiculo.TipoVeiculo.PESADO).ano(2021).build());
        Veiculo v3 = veiculoRepository.save(Veiculo.builder().placa("KJG-1122").modelo("Mercedes Sprinter").tipo(Veiculo.TipoVeiculo.LEVE).ano(2020).build());
        veiculoRepository.save(Veiculo.builder().placa("LMN-4455").modelo("Scania R500").tipo(Veiculo.TipoVeiculo.PESADO).ano(2023).build());

        // ── Viagens (dados do script original) ──
        viagemRepository.saveAll(List.of(
            Viagem.builder().veiculo(v1).dataSaida(LocalDateTime.of(2024,5,1,8,0)).dataChegada(LocalDateTime.of(2024,5,1,18,0)).origem("São Paulo").destino("Rio de Janeiro").kmPercorrida(new BigDecimal("435.00")).build(),
            Viagem.builder().veiculo(v1).dataSaida(LocalDateTime.of(2024,5,5,9,0)).dataChegada(LocalDateTime.of(2024,5,5,12,0)).origem("Rio de Janeiro").destino("Niterói").kmPercorrida(new BigDecimal("20.50")).build(),
            Viagem.builder().veiculo(v2).dataSaida(LocalDateTime.of(2024,5,2,5,0)).dataChegada(LocalDateTime.of(2024,5,3,20,0)).origem("Curitiba").destino("Belo Horizonte").kmPercorrida(new BigDecimal("1000.00")).build()
        ));

        // ── Manutenções (dados do script original) ──
        manutencaoRepository.saveAll(List.of(
            Manutencao.builder().veiculo(v1).dataInicio(LocalDate.of(2024,6,10)).dataFinalizacao(LocalDate.of(2024,6,11)).tipoServico("Troca de Óleo").custoEstimado(new BigDecimal("350.00")).status("PENDENTE").build(),
            Manutencao.builder().veiculo(v2).dataInicio(LocalDate.of(2024,6,15)).dataFinalizacao(LocalDate.of(2024,6,17)).tipoServico("Revisão de Freios").custoEstimado(new BigDecimal("1500.00")).status("PENDENTE").build(),
            Manutencao.builder().veiculo(v3).dataInicio(LocalDate.of(2024,5,20)).dataFinalizacao(LocalDate.of(2024,5,20)).tipoServico("Troca de Pneus").custoEstimado(new BigDecimal("2200.00")).status("CONCLUIDA").build()
        ));

        log.info("✅ Dados iniciais carregados com sucesso");
    }
}
