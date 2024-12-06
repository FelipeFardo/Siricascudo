import { getCurrentOrg } from '@/auth/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductByOrg } from '@/http/products/get-products-by-org'
import { Suspense } from 'react'
import { ProductCard } from './product-card'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export async function ProductsOrg() {
  const currentOrg = await getCurrentOrg()

  const { products } = await getProductByOrg(currentOrg!)

  return (
    <>
      {products.map((product) => (
        <Suspense
          key={product.id}
          fallback={<Skeleton className="h-[300px] w-[300px]" />}
        >
          <ProductCard
            key={product.id}
            organizationSlug={currentOrg!}
            product={product}
          />
        </Suspense>
      ))}
    </>
  )
}

export function ProductsSkeleton() {
  const skeletons = Array.from({ length: 8 })

  return (
    <>
      {skeletons.map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </>
  )
}

export function ProductSkeleton() {
  return (
    <Card className="transform rounded-lg border-transparent shadow-none">
      <CardHeader className="p-0">
        <div className="relative h-[150px] w-full animate-pulse rounded-t-lg bg-gray-200"></div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-200"></div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200"></div>
      </CardFooter>
    </Card>
  )
}
