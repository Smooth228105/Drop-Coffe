import { apiClient } from './client'

export async function login({ login, password }) {
  const { data } = await apiClient.post('/api/auth/login/', { login, password })
  return data
}

export async function register({ username, email, password, password_confirm }) {
  const { data } = await apiClient.post('/api/auth/register/', {
    username,
    email,
    password,
    password_confirm,
  })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/api/auth/me/')
  return data
}

export async function refreshToken(refresh) {
  const { data } = await apiClient.post('/api/auth/refresh/', { refresh })
  return data
}
