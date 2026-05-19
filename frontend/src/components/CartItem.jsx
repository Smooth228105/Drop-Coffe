import { formatPrice } from '../utils/formatPrice'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="#f7efe6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a86538" font-family="sans-serif" font-size="18">Нет фото</text></svg>',
  )

export default function CartItem({ item, onIncrease, onDecrease, onRemove, disabled }) {
  const imageSrc = item.product?.image || PLACEHOLDER

  return (
    <article className="flex gap-4 rounded-2xl border border-cream-200 bg-white p-3 shadow-sm">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
        <img
          src={imageSrc}
          alt={item.product?.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER
          }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-espresso-900">
            {item.product?.name}
          </h3>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            aria-label="Удалить товар"
            className="rounded-lg p-1 text-espresso-700/50 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-sm font-semibold text-caramel-600">
          {formatPrice(item.product?.price)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDecrease(item)}
              disabled={disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-200 bg-cream-50 text-espresso-900 transition hover:border-caramel-500/30 disabled:opacity-50"
              aria-label="Уменьшить количество"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onIncrease(item)}
              disabled={disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-200 bg-cream-50 text-espresso-900 transition hover:border-caramel-500/30 disabled:opacity-50"
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
          <p className="text-sm font-bold text-espresso-900">{formatPrice(item.line_total)}</p>
        </div>
      </div>
    </article>
  )
}
