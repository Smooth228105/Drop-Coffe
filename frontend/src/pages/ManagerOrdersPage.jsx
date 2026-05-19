import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteOrder, fetchOrders, updateOrderStatus } from '../api/ordersApi'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../utils/formatPrice'
import { ORDER_STATUSES, canManageProducts } from '../utils/roles'

export default function ManagerOrdersPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionId, setActionId] = useState(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusChange = async (orderId, status) => {
    setActionId(orderId)
    try {
      await updateOrderStatus(orderId, status)
      await loadOrders()
      showToast('Статус заказа обновлён')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (orderId) => {
    if (!window.confirm('Удалить заказ?')) {
      return
    }
    setActionId(orderId)
    try {
      await deleteOrder(orderId)
      await loadOrders()
      showToast('Заказ удалён')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-cream-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
              Drop Coffee
            </p>
            <h1 className="font-display text-3xl font-bold text-espresso-900">
              Управление заказами
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-espresso-900 transition hover:border-caramel-500/30"
          >
            ← Каталог
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {loading && <Loader />}
        {!loading && error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <EmptyState title="Заказов пока нет" description="Новые заказы появятся здесь" />
        )}
        {!loading && !error && orders.length > 0 && (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-espresso-700/70">
                      Заказ #{order.id}
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-espresso-900">
                      {order.user?.username}
                    </p>
                    <p className="text-sm text-espresso-700/70">{order.user?.email}</p>
                    <p className="mt-2 text-sm text-espresso-700/60">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <OrderStatusBadge status={order.status} label={order.status_display} />
                    <p className="font-display text-2xl font-bold text-caramel-600">
                      {formatPrice(order.total_price)}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 border-t border-cream-200 pt-4">
                  {order.items?.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm text-espresso-800/80"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-semibold">{formatPrice(item.line_total)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-cream-200 pt-4">
                  <label className="text-sm font-semibold text-espresso-800">Статус:</label>
                  <select
                    value={order.status}
                    disabled={actionId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm font-medium text-espresso-900 outline-none focus:border-caramel-500"
                  >
                    {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {canManageProducts(user) && (
                    <button
                      type="button"
                      disabled={actionId === order.id}
                      onClick={() => handleDelete(order.id)}
                      className="ml-auto rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      Удалить заказ
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
