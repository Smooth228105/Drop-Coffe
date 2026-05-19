import AccountDropdown from './AccountDropdown'

function CartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16l-2 10H6L4 7z" strokeLinejoin="round" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

export default function Header({ cartCount, onCartClick, title, subtitle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <section className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-600">
            Drop Coffee
          </p>
          {title && (
            <h2 className="truncate font-display text-2xl font-bold text-espresso-900 sm:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-1 text-sm text-espresso-700/70">{subtitle}</p>}
        </section>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <AccountDropdown />

          <button
            type="button"
            onClick={onCartClick}
            aria-label="Корзина"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cream-200 bg-white text-espresso-900 shadow-sm transition-all hover:border-caramel-500/30 hover:shadow-md"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-600 px-1 text-[11px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
