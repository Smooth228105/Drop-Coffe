import { apiClient } from './client'

export async function fetchCategories() {
  const { data } = await apiClient.get('/api/categories/')
  return data
}

export async function fetchProducts() {
  const { data } = await apiClient.get('/api/products/')
  return data
}
