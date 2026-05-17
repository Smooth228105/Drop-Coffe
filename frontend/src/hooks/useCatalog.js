import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchProducts } from '../api/catalogApi'
import { sortCategories } from '../utils/categoryOrder'

export function useCatalog() {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])

      const sortedCategories = sortCategories(categoriesData)
      setAllProducts(productsData)
      setCategories(sortedCategories)
      setSelectedCategoryId((current) => {
        if (current !== null && sortedCategories.some((c) => c.id === current)) {
          return current
        }
        return sortedCategories[0]?.id ?? null
      })
    } catch (err) {
      setError(err.message || 'Не удалось загрузить каталог')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  )

  const products = useMemo(() => {
    let list = allProducts

    if (selectedCategoryId !== null) {
      list = list.filter((product) => product.category?.id === selectedCategoryId)
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      list = list.filter((product) => product.name.toLowerCase().includes(query))
    }

    return list
  }, [allProducts, selectedCategoryId, searchQuery])

  const openProduct = useCallback((product) => {
    setSelectedProduct(product)
  }, [])

  const closeProduct = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCategory,
    selectedProduct,
    openProduct,
    closeProduct,
    retry: load,
  }
}
