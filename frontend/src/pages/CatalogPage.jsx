import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartDrawer from '../components/CartDrawer'
import EmptyState from '../components/EmptyState'
import Header from '../components/Header'
import Loader from '../components/Loader'
import ProductDrawer from '../components/ProductDrawer'
import ProductFormModal from '../components/ProductFormModal'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../hooks/useCatalog'
import { deleteProduct } from '../api/productsApi'
import { useToast } from '../contexts/ToastContext'
import { getCategoryDisplayName } from '../utils/categoryDisplay'
import { canManageOrders, canManageProducts, canUseCart } from '../utils/roles'

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

export default function CatalogPage() {
  const { user, isAuthenticated, openLogin } = useAuth()
  const { showToast } = useToast()
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
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const showCart = canUseCart(user)
  const showManageOrders = canManageOrders(user)
  const showProductAdmin = canManageProducts(user)

  const handleProductClick = (product) => {
    openProduct(product)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    window.setTimeout(closeProduct, 300)
  }

  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !showCart) {
      openLogin()
      return
    }
    await addToCart(product.id)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductModalOpen(true)
    setIsDrawerOpen(false)
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Удалить «${product.name}»?`)) {
      return
    }
    try {
      await deleteProduct(product.id)
      showToast('Товар удалён')
      handleDrawerClose()
      retry()
    } catch (err) {
      showToast(err.message, 'error')
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
          cartCount={showCart ? totalQuantity : 0}
          onCartClick={openCart}
          showCart={showCart || !isAuthenticated}
        />

        {(showManageOrders || (isAuthenticated && showCart)) && (
          <div className="flex flex-wrap gap-2 border-b border-cream-200 bg-white/80 px-4 py-3 sm:px-6 lg:px-8">
            {isAuthenticated && showCart && (
              <Link
                to="/orders"
                className="rounded-xl border border-cream-200 bg-cream-50 px-4 py-2 text-sm font-semibold text-espresso-900 transition hover:border-caramel-500/30 hover:bg-white"
              >
                Мои заказы
              </Link>
            )}
            {showManageOrders && (
              <Link
                to="/manage-orders"
                className="rounded-xl border border-caramel-500/30 bg-caramel-600/10 px-4 py-2 text-sm font-semibold text-caramel-600 transition hover:bg-caramel-600/20"
              >
                Управление заказами
              </Link>
            )}
          </div>
        )}

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
              showAddButton={showCart || !isAuthenticated}
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
        showAddButton={showCart || !isAuthenticated}
        canEdit={showProductAdmin}
        canDelete={showProductAdmin}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <CartDrawer />

      {showProductAdmin && (
        <>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null)
              setProductModalOpen(true)
            }}
            aria-label="Добавить товар"
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-caramel-600 text-3xl font-light text-white shadow-xl transition hover:scale-105 hover:bg-caramel-500"
          >
            +
          </button>
          <ProductFormModal
            isOpen={productModalOpen}
            onClose={() => {
              setProductModalOpen(false)
              setEditingProduct(null)
            }}
            product={editingProduct}
            categories={categories}
            onSuccess={retry}
          />
        </>
      )}
    </div>
  )
}
