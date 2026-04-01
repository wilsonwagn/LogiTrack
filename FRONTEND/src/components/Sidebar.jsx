import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, MapPin, LogOut, Truck } from 'lucide-react'

export default function Sidebar() {
  const { logout, username } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Truck size={18} />
        </div>
        <span className="sidebar-logo-text">
          Logi<span>Track</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink
          to="/viagens"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <MapPin size={16} />
          Viagens
        </NavLink>

        <NavLink
          to="/veiculos"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Truck size={16} />
          Veículos
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 12px 10px', fontWeight: 500 }}>
          {username}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
