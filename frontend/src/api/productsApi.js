import { apiClient } from './client'

export async function createProduct(formData) {
  const { data } = await apiClient.post('/api/products/create/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProduct(productId, formData) {
  const { data } = await apiClient.patch(`/api/products/${productId}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProduct(productId) {
  await apiClient.delete(`/api/products/${productId}/`)
}
