import { useEffect, useState } from 'react'
import { getViagens, getVeiculos, createViagem, updateViagem, deleteViagem } from '../api'
import ViagemModal from '../components/ViagemModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function ViagensPage() {
  const [viagens, setViagens] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null) // viagem sendo editada

  const [confirmId, setConfirmId] = useState(null) // id para deletar

  // Carrega viagens e veículos ao montar
  useEffect(() => {
    Promise.all([getViagens(), getVeiculos()])
      .then(([v, ve]) => {
        setViagens(v.data)
        setVeiculos(ve.data)
      })
      .finally(() => setLoading(false))
  }, [])

  function openNew() {
    setSelected(null)
    setModalOpen(true)
  }

  function openEdit(viagem) {
    setSelected(viagem)
    setModalOpen(true)
  }

  async function handleSave(dto) {
    if (selected) {
      const res = await updateViagem(selected.id, dto)
      setViagens((prev) => prev.map((v) => (v.id === selected.id ? res.data : v)))
    } else {
      const res = await createViagem(dto)
      setViagens((prev) => [...prev, res.data])
    }
    setModalOpen(false)
    setSelected(null)
  }

  async function handleDelete() {
    await deleteViagem(confirmId)
    setViagens((prev) => prev.filter((v) => v.id !== confirmId))
    setConfirmId(null)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" /> Carregando viagens…
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Módulo de Viagens</h1>
        <p className="page-subtitle">Gerencie todas as viagens da frota</p>
      </div>

      <div className="toolbar">
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {viagens.length} {viagens.length === 1 ? 'viagem' : 'viagens'} registradas
        </span>
        <button id="btn-nova-viagem" className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Viagem
        </button>
      </div>

      {viagens.length === 0 ? (
        <div className="empty-state">
          <MapPin size={40} />
          <p>Nenhuma viagem registrada ainda. Clique em Nova Viagem para começar.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Veículo</th>
                <th>Tipo</th>
                <th>Origem → Destino</th>
                <th>Saída</th>
                <th>Chegada</th>
                <th>KM</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map((v) => (
                <tr key={v.id}>
                  <td className="td-main">{v.id}</td>
                  <td className="td-main">{v.veiculoModelo}</td>
                  <td>
                    <span className={`badge badge-${v.veiculoTipo?.toLowerCase()}`}>
                      {v.veiculoTipo}
                    </span>
                  </td>
                  <td>{v.origem} → {v.destino}</td>
                  <td>{formatDate(v.dataSaida)}</td>
                  <td>{formatDate(v.dataChegada)}</td>
                  <td className="td-main">
                    {v.kmPercorrida != null ? `${Number(v.kmPercorrida).toLocaleString('pt-BR')} km` : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Editar"
                        onClick={() => openEdit(v)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Excluir"
                        onClick={() => setConfirmId(v.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Criar / Editar */}
      {modalOpen && (
        <ViagemModal
          viagem={selected}
          veiculos={veiculos}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setSelected(null) }}
        />
      )}

      {/* Confirmação de exclusão */}
      {confirmId && (
        <ConfirmDialog
          message="Esta viagem será removida permanentemente. Tem certeza?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
