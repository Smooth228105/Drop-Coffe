import { apiClient } from './client'

export async function fetchOrders() {
  const { data } = await apiClient.get('/api/orders/')
  return data
}

export async function checkoutOrder() {
  const { data } = await apiClient.post('/api/orders/checkout/')
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await apiClient.patch(`/api/orders/${orderId}/status/`, { status })
  return data
}

export async function deleteOrder(orderId) {
  await apiClient.delete(`/api/orders/${orderId}/`)
}
