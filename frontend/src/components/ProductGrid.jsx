import ProductCard from './ProductCard'

export default function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  addLoading,
  showAddButton = true,
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          onAddToCart={onAddToCart}
          addLoading={addLoading}
          showAddButton={showAddButton}
        />
      ))}
    </div>
  )
}
