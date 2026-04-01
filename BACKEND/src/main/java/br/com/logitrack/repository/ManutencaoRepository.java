package br.com.logitrack.repository;

import br.com.logitrack.entity.Manutencao;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    // Métrica 3 – Todas as manutenções (PENDENTE e CONCLUIDA) ordenadas por data
    @Query("SELECT m FROM Manutencao m JOIN FETCH m.veiculo ORDER BY m.dataInicio ASC")
    List<Manutencao> findTodasManutencoes(Pageable pageable);

    // Métrica 5 – Projeção financeira do mês atual (native query — EXTRACT é SQL)
    @Query(value = "SELECT COALESCE(SUM(custo_estimado), 0) FROM manutencoes " +
                   "WHERE EXTRACT(MONTH FROM data_inicio) = EXTRACT(MONTH FROM CURRENT_DATE) " +
                   "AND EXTRACT(YEAR FROM data_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)",
           nativeQuery = true)
    Double sumCustoMesAtual();
}
