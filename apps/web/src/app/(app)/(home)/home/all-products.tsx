import { ProductCard } from '@/components/product/product-card'
import { getProducts } from '@/http/products/get-products'

export async function AllProducts() {
  const { products } = await getProducts()
  return (
    <>
      {products.map((product) => (
        // <Suspense key={product.id} fallback={<ProductSkeleton />}>
        <ProductCard key={product.id} product={product} />
        // </Suspense>
      ))}
    </>
  )
}
