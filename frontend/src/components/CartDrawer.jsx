import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import CartItem from './CartItem'
import EmptyState from './EmptyState'
import Loader from './Loader'
import { formatPrice } from '../utils/formatPrice'

export default function CartDrawer() {
  const { isAuthenticated, openLogin } = useAuth()
  const {
    isOpen,
    closeCart,
    items,
    totalPrice,
    loading,
    actionLoading,
    error,
    isEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeCart])

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Закрыть корзину"
        onClick={closeCart}
        className={[
          'absolute inset-0 bg-espresso-900/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={[
          'relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
              Заказ
            </p>
            <h2 id="cart-drawer-title" className="font-display text-2xl font-bold text-espresso-900">
              Корзина
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-espresso-900 transition hover:bg-cream-200"
            aria-label="Закрыть"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {!isAuthenticated && (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <EmptyState
                title="Нужна авторизация"
                description="Для просмотра корзины необходимо авторизоваться"
              />
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  openLogin()
                }}
                className="mt-2 rounded-xl bg-caramel-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-caramel-500"
              >
                Войти
              </button>
            </div>
          )}

          {isAuthenticated && loading && (
            <div className="flex flex-1 items-center justify-center">
              <Loader />
            </div>
          )}

          {isAuthenticated && !loading && error && (
            <div className="p-6">
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            </div>
          )}

          {isAuthenticated && !loading && !error && isEmpty && (
            <div className="flex flex-1 items-center justify-center px-6">
              <EmptyState title="Корзина пуста" description="Добавьте товары из каталога" />
            </div>
          )}

          {isAuthenticated && !loading && !error && !isEmpty && (
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItem
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeFromCart}
                    disabled={actionLoading}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {isAuthenticated && !loading && !error && !isEmpty && (
          <div className="border-t border-cream-200 bg-cream-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-espresso-700/70">
                Итого
              </span>
              <span className="font-display text-2xl font-bold text-espresso-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
