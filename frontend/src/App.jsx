import { useState } from 'react'
import CartDrawer from './components/CartDrawer'
import EmptyState from './components/EmptyState'
import Header from './components/Header'
import Loader from './components/Loader'
import AuthModal from './components/AuthModal'
import ProductDrawer from './components/ProductDrawer'
import ProductGrid from './components/ProductGrid'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import { useCart } from './contexts/CartContext'
import { useCatalog } from './hooks/useCatalog'
import { getCategoryDisplayName } from './utils/categoryDisplay'

function ErrorBanner({ message, onRetry }) {
  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
      <h2 className="font-display text-2xl font-semibold text-red-900">Ошибка загрузки</h2>
      <p className="mt-2 text-sm text-red-800/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-espresso-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-espresso-800"
      >
        Повторить
      </button>
    </section>
  )
}

export default function App() {
  const {
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
    retry,
  } = useCatalog()

  const { totalQuantity, addToCart, actionLoading: cartActionLoading, openCart } = useCart()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleProductClick = (product) => {
    openProduct(product)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    window.setTimeout(closeProduct, 300)
  }

  const handleAddToCart = async (product) => {
    const added = await addToCart(product.id)
    if (!added) {
      openCart()
    }
  }

  const subtitle = loading
    ? 'Загрузка…'
    : `${products.length} ${products.length === 1 ? 'позиция' : 'позиций'}`

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <Header
          title={getCategoryDisplayName(selectedCategory) || 'Каталог'}
          subtitle={subtitle}
          cartCount={totalQuantity}
          onCartClick={openCart}
        />

        <div className="border-b border-cream-200 bg-cream-50/90 px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {loading && <Loader />}
          {!loading && error && <ErrorBanner message={error} onRetry={retry} />}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              title={searchQuery ? 'По запросу ничего не найдено' : 'В этой категории пока пусто'}
              description={
                searchQuery
                  ? 'Измените поисковый запрос или выберите другую категорию слева.'
                  : 'Скоро здесь появятся новые позиции.'
              }
            />
          )}
          {!loading && !error && products.length > 0 && (
            <ProductGrid
              products={products}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              addLoading={cartActionLoading}
            />
          )}
        </section>
      </main>

      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen && Boolean(selectedProduct)}
        onClose={handleDrawerClose}
        onAddToCart={handleAddToCart}
        addLoading={cartActionLoading}
      />

      <CartDrawer />
      <AuthModal />
    </div>
  )
}
