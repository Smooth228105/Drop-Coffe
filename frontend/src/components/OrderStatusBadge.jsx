import { ORDER_STATUSES } from '../utils/roles'

export default function OrderStatusBadge({ status, label }) {
  const config = ORDER_STATUSES[status] || {
    label: label || status,
    color: 'bg-cream-200 text-espresso-800',
  }

  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        config.color,
      ].join(' ')}
    >
      {label || config.label}
    </span>
  )
}
