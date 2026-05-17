export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">Поиск по названию</span>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-espresso-700/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3-3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по названию…"
        className="w-full rounded-2xl border border-cream-200 bg-white py-3 pl-12 pr-4 text-sm text-espresso-900 shadow-sm outline-none transition-all placeholder:text-espresso-700/40 focus:border-caramel-500 focus:ring-4 focus:ring-caramel-500/15"
      />
    </label>
  )
}
