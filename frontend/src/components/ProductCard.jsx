import { formatPrice } from '../utils/formatPrice'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="#f7efe6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a86538" font-family="sans-serif" font-size="18">Нет фото</text></svg>',
  )

export default function ProductCard({ product, onClick, onAddToCart, addLoading }) {
  const imageSrc = product.image || PLACEHOLDER

  const handleAddClick = (event) => {
    event.stopPropagation()
    onAddToCart?.(product)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick(product)
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-caramel-500/30 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER
          }}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-900/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <h3 className="font-display text-xl font-semibold leading-snug text-espresso-900 transition-colors group-hover:text-caramel-600">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-caramel-600">{formatPrice(product.price)}</p>
          <button
            type="button"
            onClick={handleAddClick}
            disabled={addLoading}
            className="rounded-xl bg-espresso-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-cream-50 transition hover:bg-caramel-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm sm:normal-case sm:tracking-normal"
          >
            {addLoading ? '…' : 'В корзину'}
          </button>
        </div>
      </div>
    </article>
  )
}
