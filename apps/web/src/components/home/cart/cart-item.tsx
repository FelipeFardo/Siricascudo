'use client'

import { FilePenLine, Trash } from 'lucide-react'

import { removeItem } from '@/app/(app)/(home)/cart/actions'
import { Currency } from '@/components/currency'
import { getProductById } from '@/http/products/get-product-by-id'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'

interface CartItemProps {
  itemId: string
  productId: string
  quantity: number
  subTotalInCents: number
}

export function CartItem({
  itemId,
  productId,
  quantity,
  subTotalInCents,
}: CartItemProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`cart-${itemId}`],
    queryFn: () => getProductById(productId),
  })

  const product = data?.product

  if (isLoading || !product) {
    return <CartItemSkeleton />
  }

  return (
    <div className="mb-4 space-y-4 border-b pb-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <span className="text-gray-600">{quantity}x</span>
          <h3 className="font-medium">{product.name}</h3>
        </div>
        <span className="text-gray-600">
          <Currency value={subTotalInCents} />
        </span>
      </div>
      <div className="flex gap-10 font-medium">
        <form>
          <button className="flex  gap-2 text-primary focus:outline-none">
            <FilePenLine />
            Editar
          </button>
        </form>
        <form>
          <button className="flex gap-2 text-gray-500 focus:outline-none">
            <Trash />
            Excluir
          </button>
        </form>
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="mb-4 space-y-4 border-b pb-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex gap-10 font-medium">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}
