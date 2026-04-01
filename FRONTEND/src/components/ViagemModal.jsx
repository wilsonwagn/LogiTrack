import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

const EMPTY = {
  veiculoId: '',
  dataSaida: '',
  dataChegada: '',
  origem: '',
  destino: '',
  kmPercorrida: '',
}

// Formata LocalDateTime para input datetime-local
function toInputDate(dt) {
  if (!dt) return ''
  return dt.slice(0, 16) // "2024-05-01T08:00"
}

// Converte de volta para o formato que o backend espera
function toApiDate(dt) {
  if (!dt) return null
  return dt + ':00' // adiciona segundos
}

export default function ViagemModal({ viagem, veiculos, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (viagem) {
      setForm({
        veiculoId: viagem.veiculoId || '',
        dataSaida: toInputDate(viagem.dataSaida),
        dataChegada: toInputDate(viagem.dataChegada),
        origem: viagem.origem || '',
        destino: viagem.destino || '',
        kmPercorrida: viagem.kmPercorrida || '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [viagem])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.veiculoId || !form.dataSaida) return
    setSaving(true)
    await onSave({
      veiculoId: Number(form.veiculoId),
      dataSaida: toApiDate(form.dataSaida),
      dataChegada: toApiDate(form.dataChegada),
      origem: form.origem,
      destino: form.destino,
      kmPercorrida: form.kmPercorrida ? Number(form.kmPercorrida) : null,
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{viagem ? 'Editar Viagem' : 'Nova Viagem'}</span>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group full">
              <label>Veículo *</label>
              <select value={form.veiculoId} onChange={(e) => set('veiculoId', e.target.value)} required>
                <option value="">Selecione um veículo</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.modelo} — {v.placa} ({v.tipo})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data/Hora Saída *</label>
              <input
                type="datetime-local"
                value={form.dataSaida}
                onChange={(e) => set('dataSaida', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data/Hora Chegada</label>
              <input
                type="datetime-local"
                value={form.dataChegada}
                onChange={(e) => set('dataChegada', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cidade de Origem</label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                value={form.origem}
                onChange={(e) => set('origem', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cidade de Destino</label>
              <input
                type="text"
                placeholder="Ex: Rio de Janeiro"
                value={form.destino}
                onChange={(e) => set('destino', e.target.value)}
              />
            </div>

            <div className="form-group full">
              <label>KM Percorrida</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 435.00"
                value={form.kmPercorrida}
                onChange={(e) => set('kmPercorrida', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
