export function getCategoryDisplayName(category) {
  if (!category) {
    return ''
  }
  return category.name ?? category.title ?? ''
}
