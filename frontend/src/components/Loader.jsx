export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-cream-200 border-t-caramel-500"
        role="status"
        aria-label="Загрузка"
      />
      <p className="text-sm font-medium text-espresso-700/70">Загружаем меню…</p>
    </div>
  )
}
