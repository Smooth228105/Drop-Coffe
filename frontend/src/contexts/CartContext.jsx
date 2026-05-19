import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addToCart as addToCartRequest, fetchCart, removeCartItem, updateCartItem } from '../api/cartApi'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { showToast } = useToast()

  const [items, setItems] = useState([])
  const [totalPrice, setTotalPrice] = useState('0')
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const resetCart = useCallback(() => {
    setItems([])
    setTotalPrice('0')
    setTotalQuantity(0)
    setError(null)
  }, [])

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      resetCart()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchCart()
      setItems(data.items ?? [])
      setTotalPrice(data.total_price ?? '0')
      setTotalQuantity(data.total_quantity ?? 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, resetCart])

  useEffect(() => {
    if (authLoading) {
      return
    }
    if (isAuthenticated) {
      loadCart()
    } else {
      resetCart()
    }
  }, [authLoading, isAuthenticated, loadCart, resetCart])

  const addToCart = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        setIsOpen(true)
        return false
      }

      setActionLoading(true)
      setError(null)
      try {
        await addToCartRequest(productId)
        await loadCart()
        showToast('Товар добавлен в корзину')
        return true
      } catch (err) {
        setError(err.message)
        showToast(err.message, 'error')
        return false
      } finally {
        setActionLoading(false)
      }
    },
    [isAuthenticated, loadCart, showToast],
  )

  const removeFromCart = useCallback(
    async (itemId) => {
      setActionLoading(true)
      setError(null)
      try {
        await removeCartItem(itemId)
        await loadCart()
      } catch (err) {
        setError(err.message)
      } finally {
        setActionLoading(false)
      }
    },
    [loadCart],
  )

  const decreaseQuantity = useCallback(
    async (item) => {
      if (item.quantity <= 1) {
        return removeFromCart(item.id)
      }

      setActionLoading(true)
      setError(null)
      try {
        await updateCartItem(item.id, item.quantity - 1)
        await loadCart()
      } catch (err) {
        setError(err.message)
      } finally {
        setActionLoading(false)
      }
    },
    [loadCart, removeFromCart],
  )

  const increaseQuantity = useCallback(
    async (item) => {
      setActionLoading(true)
      setError(null)
      try {
        await updateCartItem(item.id, item.quantity + 1)
        await loadCart()
      } catch (err) {
        setError(err.message)
      } finally {
        setActionLoading(false)
      }
    },
    [loadCart],
  )

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({
      items,
      totalPrice,
      totalQuantity,
      loading,
      actionLoading,
      error,
      isOpen,
      isEmpty: items.length === 0,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      loadCart,
      openCart,
      closeCart,
    }),
    [
      items,
      totalPrice,
      totalQuantity,
      loading,
      actionLoading,
      error,
      isOpen,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      loadCart,
      openCart,
      closeCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
