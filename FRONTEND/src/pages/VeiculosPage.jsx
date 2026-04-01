import { useState, useEffect } from 'react'
import { getVeiculos, createManutencao } from '../api'
import { Wrench, Truck, X, Calendar, DollarSign, FileText } from 'lucide-react'

function AgendarModal({ veiculo, onClose, onSuccess }) {
  const [form, setForm] = useState({
    dataInicio: '',
    tipoServico: '',
    custoEstimado: '',
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.dataInicio || !form.tipoServico) {
      setErro('Data e tipo de serviço são obrigatórios.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      await createManutencao({
        veiculoId: veiculo.id,
        dataInicio: form.dataInicio,
        tipoServico: form.tipoServico,
        custoEstimado: form.custoEstimado ? parseFloat(form.custoEstimado) : 0,
      })
      onSuccess()
      onClose()
    } catch (err) {
      setErro('Erro ao agendar manutenção. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wrench size={18} style={{ color: 'var(--accent)' }} />
            Agendar Manutenção
          </h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Veículo info */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <Truck size={16} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{veiculo.modelo}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {veiculo.placa} · {veiculo.tipo} · {veiculo.ano}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tipo de serviço */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} /> Tipo de Serviço *
            </label>
            <input
              className="form-input"
              placeholder="Ex: Troca de Óleo, Revisão de Freios..."
              value={form.tipoServico}
              onChange={e => setForm({ ...form, tipoServico: e.target.value })}
              required
            />
          </div>

          {/* Data */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} /> Data Agendada *
            </label>
            <input
              className="form-input"
              type="date"
              value={form.dataInicio}
              onChange={e => setForm({ ...form, dataInicio: e.target.value })}
              required
            />
          </div>

          {/* Custo */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={14} /> Custo Estimado (R$)
            </label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.custoEstimado}
              onChange={e => setForm({ ...form, custoEstimado: e.target.value })}
            />
          </div>

          {erro && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#f87171',
              fontSize: 13
            }}>
              {erro}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVeiculo, setModalVeiculo] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    getVeiculos()
      .then(res => setVeiculos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSuccess() {
    setSuccessMsg('✅ Manutenção agendada! Aparecerá no Dashboard em Próximas Manutenções.')
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck size={22} style={{ color: 'var(--accent)' }} />
            Veículos
          </h1>
          <p className="page-subtitle">Frota cadastrada · Clique em "Agendar" para registrar uma manutenção</p>
        </div>
      </div>

      {/* Feedback de sucesso */}
      {successMsg && (
        <div style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 10,
          padding: '12px 16px',
          color: '#4ade80',
          fontSize: 14,
          marginBottom: 20
        }}>
          {successMsg}
        </div>
      )}

      {/* Tabela */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 60 }}>
          Carregando frota...
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Ano</th>
                <th style={{ textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map(v => (
                <tr key={v.id}>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 13,
                      letterSpacing: 1
                    }}>
                      {v.placa}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{v.modelo}</td>
                  <td>
                    <span style={{
                      background: v.tipo === 'PESADO'
                        ? 'rgba(168,85,247,0.15)'
                        : 'rgba(34,211,238,0.15)',
                      color: v.tipo === 'PESADO' ? '#c084fc' : '#22d3ee',
                      border: `1px solid ${v.tipo === 'PESADO' ? 'rgba(168,85,247,0.3)' : 'rgba(34,211,238,0.3)'}`,
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {v.tipo}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{v.ano}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-primary"
                      style={{ fontSize: 13, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      onClick={() => setModalVeiculo(v)}
                    >
                      <Wrench size={14} />
                      Agendar Manutenção
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalVeiculo && (
        <AgendarModal
          veiculo={modalVeiculo}
          onClose={() => setModalVeiculo(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
