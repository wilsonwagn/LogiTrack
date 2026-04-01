import api from './axios'

export const getViagens = () => api.get('/viagens')
export const createViagem = (data) => api.post('/viagens', data)
export const updateViagem = (id, data) => api.put(`/viagens/${id}`, data)
export const deleteViagem = (id) => api.delete(`/viagens/${id}`)
export const getVeiculos = () => api.get('/veiculos')
export const getDashboard = () => api.get('/dashboard/metricas')
export const login = (username, password) =>
  api.post('/auth/login', { username, password })
export const createManutencao = (data) => api.post('/manutencoes', data)
