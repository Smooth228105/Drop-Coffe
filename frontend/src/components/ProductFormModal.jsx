import { useEffect, useState } from 'react'
import FormField, { getInputClassName } from './FormField'
import { createProduct, updateProduct } from '../api/productsApi'

const emptyForm = {
  name: '',
  price: '',
  description: '',
  category_id: '',
  image: null,
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      return
    }
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category_id: String(product.category?.id || ''),
        image: null,
      })
    } else {
      setForm({
        ...emptyForm,
        category_id: String(categories[0]?.id || ''),
      })
    }
    setError(null)
    setFieldErrors({})
  }, [isOpen, product, categories])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('price', form.price)
    formData.append('description', form.description.trim())
    formData.append('category_id', form.category_id)
    if (form.image) {
      formData.append('image', form.image)
    }

    try {
      if (isEdit) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fieldErrors ?? {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cream-200 bg-white shadow-2xl"
      >
        <div className="border-b border-cream-200 px-6 py-5">
          <h2 className="font-display text-2xl font-bold text-espresso-900">
            {isEdit ? 'Редактировать товар' : 'Новый товар'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <FormField label="Название" htmlFor="product-name" error={fieldErrors.name}>
            <input
              id="product-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={getInputClassName(Boolean(fieldErrors.name))}
            />
          </FormField>

          <FormField label="Цена" htmlFor="product-price" error={fieldErrors.price}>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className={getInputClassName(Boolean(fieldErrors.price))}
            />
          </FormField>

          <FormField label="Категория" htmlFor="product-category" error={fieldErrors.category_id}>
            <select
              id="product-category"
              required
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className={getInputClassName(Boolean(fieldErrors.category_id))}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Описание" htmlFor="product-description" error={fieldErrors.description}>
            <textarea
              id="product-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={getInputClassName(Boolean(fieldErrors.description))}
            />
          </FormField>

          <FormField label="Изображение" htmlFor="product-image" error={fieldErrors.image}>
            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
              }
              className="w-full text-sm text-espresso-700"
            />
          </FormField>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-cream-200 px-4 py-3 text-sm font-semibold text-espresso-800 transition hover:bg-cream-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-caramel-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-caramel-500 disabled:opacity-60"
            >
              {loading ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
