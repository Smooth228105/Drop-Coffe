import { apiClient } from './client'

export async function fetchCart() {
  const { data } = await apiClient.get('/api/cart/')
  return data
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await apiClient.post('/api/cart/add/', {
    product_id: productId,
    quantity,
  })
  return data
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await apiClient.patch('/api/cart/update/', {
    item_id: itemId,
    quantity,
  })
  return data
}

export async function removeCartItem(itemId) {
  await apiClient.delete('/api/cart/remove/', {
    data: { item_id: itemId },
  })
}
