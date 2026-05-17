const CATEGORY_ORDER = [
  'Напитки',
  'Выпечка',
  'Десерты',
  'Торты',
  'Пироги',
  'Хлеб',
]

export function sortCategories(categories) {
  const orderIndex = new Map(CATEGORY_ORDER.map((name, index) => [name, index]))

  return [...categories].sort((a, b) => {
    const aIndex = orderIndex.get(a.name) ?? Number.MAX_SAFE_INTEGER
    const bIndex = orderIndex.get(b.name) ?? Number.MAX_SAFE_INTEGER
    if (aIndex !== bIndex) {
      return aIndex - bIndex
    }
    return a.name.localeCompare(b.name, 'ru')
  })
}
