import { Reservation } from './reservation'
import { Suspense } from 'react'
import OrgHeader, { OrgHeaderSkeleton } from './org-header'
import { ProductsOrg, ProductsSkeleton } from './products-org'

export default async function organizationPage() {
  return (
    <div className="mx-auto my-8 flex max-w-[1200px] flex-col px-4">
      <header className="bg-white shadow-md">
        <Suspense fallback={<OrgHeaderSkeleton />}>
          <OrgHeader />
        </Suspense>
      </header>

      <main className="mx-auto w-full py-8">
        <Reservation />

        <h2 className="my-6 flex w-full justify-center text-2xl font-semibold">
          Cardápio
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsOrg />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
