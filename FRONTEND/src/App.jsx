import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ViagensPage from './pages/ViagensPage'
import VeiculosPage from './pages/VeiculosPage'
import Sidebar from './components/Sidebar'

// Rota protegida: redireciona para login se não autenticado
function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// Layout com sidebar
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/viagens" element={
            <PrivateRoute>
              <AppLayout><ViagensPage /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/veiculos" element={
            <PrivateRoute>
              <AppLayout><VeiculosPage /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
