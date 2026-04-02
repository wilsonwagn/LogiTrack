import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('logitrack_token'))
  const [username, setUsername] = useState(localStorage.getItem('logitrack_user'))

  function login(tokenValue, usernameValue) {
    // 1️⃣ Em caso de sucesso no login da API, o token JWT recebido é salvo aqui no navegador do usuário
    // O localStorage mantem a informação salva mesmo se o usuário fechar a aba
    localStorage.setItem('logitrack_token', tokenValue)
    localStorage.setItem('logitrack_user', usernameValue)
    
    // 2️⃣ Atualiza a "memória do App (state)" para as páginas saberem na hora que tem alguém logado
    setToken(tokenValue)
    setUsername(usernameValue)
  }

  function logout() {
    localStorage.removeItem('logitrack_token')
    localStorage.removeItem('logitrack_user')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
