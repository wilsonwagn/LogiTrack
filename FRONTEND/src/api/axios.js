import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Injeta o token em toda requisição autenticada
// Toda vez que usarmos api.get('/veiculos') por exemplo, ele passa por aqui *antes* de ir pro Backend
api.interceptors.request.use((config) => {
  // 3️⃣ Pegamos o token que foi salvo no AuthContext (localStorage)
  const token = localStorage.getItem('logitrack_token')
  
  // 4️⃣ Colocamos o Token no "Cabeçalho (Header)" da requisição. Sem isso o Backend bloqueia
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se o token expirar, redireciona para login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('logitrack_token')
      localStorage.removeItem('logitrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
