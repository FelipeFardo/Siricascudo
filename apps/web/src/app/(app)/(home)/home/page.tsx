import { Suspense } from 'react'

import { CardOrganization } from '@/components/home/organization-card'
import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { getOrganizations } from '@/http/orgs/get-organizations'
import { getProducts } from '@/http/products/get-products'
import { AllProducts } from './all-products'
import { ProductsSkeleton } from '../organization/[slug]/products-org'

export default async function Home() {
  const { organizations } = await getOrganizations()

  return (
    <div className="space-y-4 p-4">
      <main className="mx-auto min-h-[800px] w-full max-w-[1700px] space-y-4">
        <h1 className="ml-4 text-xl">Restaurantes</h1>
        <div className="grid grid-cols-1 gap-3  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {organizations.map((organization) => (
            <CardOrganization
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
        <h1 className="ml-4 text-xl">Foods</h1>
        <div className="grid grid-cols-1 gap-3  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <Suspense fallback={<ProductsSkeleton />}>
            <AllProducts />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
