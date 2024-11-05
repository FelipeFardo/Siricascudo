import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components//ui/button'
import { Currency } from '@/components/currency'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductByOrg } from '@/http/products/get-products-by-org'

import { DeleteProductButton } from './delete-product-button'
import { ProductForm } from './product-form'

export default async function AdminPage() {
  const currentOrg = await getCurrentOrg()

  const { products } = await getProductByOrg(currentOrg!)
  return (
    <div className="m-2 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <Button size="sm" asChild>
          <Link href={`/admin/${currentOrg}/products/create-product`}>
            <Plus className="mr-2 size-4" />
            Create Product
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => {
          return (
            <Sheet key={product.id}>
              <SheetTrigger asChild>
                <Card className="transform cursor-pointer rounded-lg border-transparent  shadow-none transition duration-300 ease-in-out hover:scale-105 hover:border-gray-200 hover:shadow-md">
                  <CardContent className="flex gap-5 p-4">
                    <Suspense
                      fallback={
                        <Skeleton className="max-h-[100px] max-w-[100px]" />
                      }
                    >
                      <Image
                        height={100}
                        width={100}
                        src={product.imageUrl || '/placeholder-image-2.webp'}
                        alt={product.name}
                        className="rounded-lg"
                      />
                    </Suspense>

                    <div className="flex flex-col items-start justify-center truncate">
                      <h1 className="text-md truncate font-semibold">
                        {product.name}
                      </h1>

                      <span>
                        <Currency value={product.priceInCents} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent>
                <h1 className="text-xl font-bold">Edit Product</h1>
                <div className="space-y-2">
                  <ProductForm initialData={product} isUpdating={true} />
                  <DeleteProductButton productId={product.id} />
                </div>
              </SheetContent>
            </Sheet>
          )
        })}
      </div>
    </div>
  )
}
