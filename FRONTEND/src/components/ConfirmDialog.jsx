import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <AlertTriangle size={36} />
        </div>
        <div className="confirm-title">Confirmar exclusão</div>
        <div className="confirm-text">{message}</div>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}
