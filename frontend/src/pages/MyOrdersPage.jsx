import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../api/ordersApi'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { formatPrice } from '../utils/formatPrice'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-cream-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
              Drop Coffee
            </p>
            <h1 className="font-display text-3xl font-bold text-espresso-900">Мои заказы</h1>
          </div>
          <Link
            to="/"
            className="rounded-xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-espresso-900 transition hover:border-caramel-500/30"
          >
            ← Каталог
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        {loading && <Loader />}
        {!loading && error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <EmptyState
            title="У вас пока нет заказов"
            description="Оформите заказ из корзины"
          />
        )}
        {!loading && !error && orders.length > 0 && (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-espresso-900">
                      Заказ #{order.id}
                    </p>
                    <p className="mt-1 text-sm text-espresso-700/60">
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
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
