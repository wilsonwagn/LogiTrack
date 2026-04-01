import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Injeta o token em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('logitrack_token')
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
