'use client'

import { FilePenLine, Loader2, Trash } from 'lucide-react'

import { removeItem } from '@/app/(app)/(home)/cart/actions'
import { Currency } from '@/components/currency'
import { getProductById } from '@/http/products/get-product-by-id'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { removeItemToCart } from '@/http/cart/remove-item-to-cart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UpdateCartItemControl } from './edit-cart-item-control'
import { useState } from 'react'

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
  const [dialogEdit, setDialogEdit] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: [`cart-${itemId}`],
    queryFn: () => getProductById(productId),
  })

  const queryClient = useQueryClient()

  const { mutateAsync: removeItemToCartMutate, isPending } = useMutation({
    mutationFn: removeItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-details'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
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
        <Dialog open={dialogEdit} onOpenChange={setDialogEdit}>
          <DialogTrigger asChild>
            <button className="flex  gap-2 text-primary focus:outline-none">
              <FilePenLine />
              Editar
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar item</DialogTitle>
            </DialogHeader>
            <UpdateCartItemControl
              onClose={() => {
                setDialogEdit(false)
              }}
              initialQuantity={quantity}
              itemId={itemId}
              priceInCents={product.priceInCents}
            />
          </DialogContent>
        </Dialog>

        <button
          onClick={() => removeItemToCartMutate({ itemId })}
          className="flex gap-2 text-gray-500 focus:outline-none"
        >
          <Trash />
          {isPending ? <Loader2 className="size-5 animate-spin" /> : 'Excluir'}
        </button>
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
