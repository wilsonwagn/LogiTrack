package br.com.logitrack.repository;

import br.com.logitrack.entity.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    //TODO | COALESCE: Se a soma for nula (ex: não tem viagens), retorna 0 em vez de NULL.

    // Métrica 1 – Total KM de toda a frota 
    @Query("SELECT COALESCE(SUM(v.kmPercorrida), 0) FROM Viagem v")
    Double sumTotalKm();

    // Métrica 1 – Total KM por veículo
    @Query("SELECT COALESCE(SUM(v.kmPercorrida), 0) FROM Viagem v WHERE v.veiculo.id = :veiculoId")
    Double sumKmByVeiculo(@Param("veiculoId") Long veiculoId);

    // Métrica 2 – Volume por Categoria (LEVE vs PESADO)
    @Query("SELECT v.veiculo.tipo, COUNT(v) FROM Viagem v GROUP BY v.veiculo.tipo")
    List<Object[]> countViagensByTipo();

    // Métrica 4 – Ranking de utilização (km acumulada por veículo)
    @Query("SELECT v.veiculo.modelo, SUM(v.kmPercorrida) AS total " +
           "FROM Viagem v GROUP BY v.veiculo.id, v.veiculo.modelo ORDER BY total DESC")
    List<Object[]> rankingUtilizacao();
}
