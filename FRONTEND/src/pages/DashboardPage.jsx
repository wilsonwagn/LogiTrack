import { useEffect, useState } from 'react'
import { getDashboard } from '../api'
import MetricCard from '../components/MetricCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Route, Trophy, Wrench, Banknote, TrendingUp } from 'lucide-react'

function fmt(n) {
  return n?.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) ?? '—'
}

function fmtCurrency(n) {
  return n != null
    ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ —'
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" /> Carregando métricas…
      </div>
    )
  }

  const chartData = data?.volumePorCategoria
    ? Object.entries(data.volumePorCategoria).map(([tipo, total]) => ({ tipo, total }))
    : []

  const badgeColor = (status) => {
    const s = status?.toUpperCase()
    if (s === 'CONCLUIDA') return 'badge-concluida'
    if (s === 'EM_REALIZACAO') return 'badge-em_realizacao'
    return 'badge-pendente'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral da frota em tempo real</p>
      </div>

      {/* ── 5 Métricas ─────────────────────────────────────────────────── */}
      <div className="metric-grid">
        <MetricCard
          label="Total KM Percorrido"
          value={`${fmt(data?.totalKm)} km`}
          sub="Toda a frota acumulada"
          icon={Route}
          color="var(--indigo)"
          bgColor="var(--indigo-glow)"
        />
        <MetricCard
          label="Veículos Leve"
          value={data?.volumePorCategoria?.LEVE ?? 0}
          sub="viagens realizadas"
          icon={TrendingUp}
          color="var(--sky)"
          bgColor="var(--sky-glow)"
        />
        <MetricCard
          label="Veículos Pesado"
          value={data?.volumePorCategoria?.PESADO ?? 0}
          sub="viagens realizadas"
          icon={TrendingUp}
          color="var(--indigo)"
          bgColor="var(--indigo-glow)"
        />
        <MetricCard
          label="Ranking — Maior KM"
          value={data?.rankingUtilizacao?.veiculo ?? '—'}
          sub={data?.rankingUtilizacao ? `${fmt(data.rankingUtilizacao.totalKm)} km acumulados` : ''}
          icon={Trophy}
          color="var(--amber)"
          bgColor="var(--amber-glow)"
        />
        <MetricCard
          label="Projeção Financeira"
          value={fmtCurrency(data?.projecaoFinanceira)}
          sub="Custo estimado de manutenções este mês"
          icon={Banknote}
          color="var(--emerald)"
          bgColor="var(--emerald-glow)"
        />
      </div>

      {/* ── Gráfico + Manutenções ───────────────────────────────────────── */}
      <div className="dashboard-bottom">

        {/* Gráfico Volume por Categoria */}
        <div className="card">
          <div className="card-title">Volume de Viagens por Categoria</div>
          {chartData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sem dados de viagens.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="tipo" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--text)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.tipo}
                      fill={entry.tipo === 'LEVE' ? 'var(--sky)' : 'var(--indigo)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Manutenções */}
        <div className="card">
          <div className="card-title">
            <Wrench size={14} style={{ display: 'inline', marginRight: 6 }} />
            Manutenções
          </div>
          {data?.proximasManutencoes?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma manutenção registrada.</p>
          ) : (
            <div className="manutencao-list">
              {data?.proximasManutencoes?.map((m) => (
                <div className="manutencao-item" key={m.id}>
                  <div className="manutencao-info">
                    <span className="manutencao-nome">{m.veiculo} — {m.tipoServico}</span>
                    <span className="manutencao-data">{m.dataInicio}</span>
                  </div>
                  <span className={`badge badge-${m.status?.toLowerCase()}`}>
                    {m.status === 'CONCLUIDA' ? 'CONCLUÍDA' : m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
