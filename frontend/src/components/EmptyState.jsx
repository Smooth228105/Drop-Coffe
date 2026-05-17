export default function EmptyState({ title, description }) {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-cream-200 bg-white px-8 py-14 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 text-3xl">
        ☕
      </div>
      <h3 className="font-display text-2xl font-semibold text-espresso-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-espresso-700/70">{description}</p>
      )}
    </section>
  )
}
