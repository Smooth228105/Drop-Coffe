import axios from 'axios'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage'
import { getApiErrorMessage, parseApiFieldErrors } from '../utils/parseApiErrors'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
})

let refreshPromise = null

function createApiError(error) {
  const data = error.response?.data
  const apiError = new Error(
    getApiErrorMessage(data, error.message || 'Не удалось выполнить запрос к серверу'),
  )
  apiError.fieldErrors = parseApiFieldErrors(data)
  apiError.status = error.response?.status
  return apiError
}

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) {
    throw new Error('Сессия истекла')
  }

  const response = await axios.post(
    `${baseURL}/api/auth/refresh/`,
    { refresh },
    { headers: { Accept: 'application/json' } },
  )

  const access = response.data.access
  setTokens({ access, refresh: response.data.refresh ?? refresh })
  return access
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/login/') &&
      !originalRequest.url?.includes('/api/auth/register/') &&
      !originalRequest.url?.includes('/api/auth/refresh/')
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        const access = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${access}`
        return apiClient(originalRequest)
      } catch {
        clearTokens()
      }
    }

    return Promise.reject(createApiError(error))
  },
)
