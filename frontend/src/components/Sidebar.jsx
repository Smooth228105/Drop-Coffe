import { getCategoryDisplayName } from '../utils/categoryDisplay'

const CATEGORY_ICONS = {
  Напитки: '☕',
  Выпечка: '🥐',
  Десерты: '🍰',
  Торты: '🎂',
  Пироги: '🥧',
  Хлеб: '🍞',
}

export default function Sidebar({ categories, selectedCategoryId, onSelectCategory }) {
  return (
    <aside className="w-full shrink-0 border-b border-cream-200 bg-espresso-900 text-cream-50 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="px-5 py-6 lg:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel-500">
          Drop Coffee
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight">Кондитерская</h1>
        <p className="mt-2 text-sm text-cream-100/60">Свежая выпечка и десерты каждый день</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-3 lg:pb-8">
        {categories.map((category) => {
          const isActive = category.id === selectedCategoryId
          const label = getCategoryDisplayName(category)
          const icon = CATEGORY_ICONS[label] ?? '✨'

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={[
                'flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-caramel-500 text-white shadow-lg shadow-caramel-500/30'
                  : 'text-cream-100/80 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              <span className="text-lg" aria-hidden>
                {icon}
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
