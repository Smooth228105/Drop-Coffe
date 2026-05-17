const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'BYN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  const amount = Number.parseFloat(String(value).replace(',', '.'))
  if (Number.isNaN(amount)) {
    return String(value)
  }
  return formatter.format(amount)
}
