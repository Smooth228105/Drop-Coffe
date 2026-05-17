import { useEffect } from 'react'
import { formatPrice } from '../utils/formatPrice'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="#f7efe6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a86538" font-family="sans-serif" font-size="18">Нет фото</text></svg>',
  )

export default function ProductDrawer({ product, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!product) {
    return null
  }

  const imageSrc = product.image || PLACEHOLDER

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
        aria-label="Закрыть"
        onClick={onClose}
        className={[
          'absolute inset-0 bg-espresso-900/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
        className={[
          'relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-espresso-900 shadow-md transition-colors hover:bg-cream-100"
          aria-label="Закрыть панель"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="aspect-[4/3] shrink-0 overflow-hidden bg-cream-100">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER
            }}
          />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
            {product.category?.name}
          </p>
          <h2
            id="product-drawer-title"
            className="mt-2 font-display text-3xl font-bold text-espresso-900"
          >
            {product.name}
          </h2>
          <p className="mt-3 text-2xl font-bold text-caramel-600">{formatPrice(product.price)}</p>
          <div className="mt-6 border-t border-cream-200 pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-espresso-700/60">
              Описание
            </h3>
            <p className="mt-3 text-base leading-relaxed text-espresso-800/80">
              {product.description?.trim() || 'Описание скоро появится.'}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
