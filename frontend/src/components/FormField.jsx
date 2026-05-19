const inputClassName =
  'w-full rounded-xl border bg-cream-50 px-4 py-3 text-espresso-900 outline-none transition focus:ring-2 focus:ring-caramel-500/20'

export function getInputClassName(hasError) {
  return [
    inputClassName,
    hasError ? 'border-red-300 focus:border-red-400' : 'border-cream-200 focus:border-caramel-500',
  ].join(' ')
}

export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div className="block">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-espresso-800">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
