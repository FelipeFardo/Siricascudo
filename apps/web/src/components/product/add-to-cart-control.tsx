'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { GetCartResponse } from '@/http/cart/get-cart'
import { insertItemToCart } from '@/http/cart/insert-item-to-cart'

import { Currency } from '../currency'
import { Input } from '../ui/input'

interface AddToCartControlProps {
  productId: string
  priceInCents: number
  organizationSlug: string
}

export function AddToCartControl({
  organizationSlug,
  priceInCents,
  productId,
}: AddToCartControlProps) {
  const [quantity, setQuantity] = useState(1)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: insertItemToCart,
    onSuccess: (_, { quantity }) => {
      queryClient.setQueryData<GetCartResponse>(['cart'], (oldData) => {
        if (oldData) {
          return {
            cart: {
              quantityItems: oldData.cart.quantityItems + quantity,
              totalInCents: oldData.cart.totalInCents + quantity * priceInCents,
            },
          }
        }
      })
      router.push(`organization/${organizationSlug}`)
    },
  })

  function handleIncrement() {
    setQuantity((e) => e + 1)
  }

  function handleDecrement() {
    if (quantity > 1) setQuantity((e) => e - 1)
  }

  function addItemToCartAndRedirect() {
    mutate({ productId, quantity })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          <Currency value={priceInCents} />
        </span>
        <div className="flex items-center space-x-2 rounded-full border">
          <Button
            variant="ghost"
            onClick={() => handleDecrement()}
            className="rounded-l-full"
          >
            <Minus size={16} />
          </Button>
          <Input
            type="text"
            id="quantity-input"
            readOnly
            value={quantity}
            className="max-w-12 border-none p-0 text-center"
            required
          />

          <Button
            variant="ghost"
            onClick={() => handleIncrement()}
            className="rounded-r-full"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <Button
        disabled={isPending || isSuccess}
        onClick={() => addItemToCartAndRedirect()}
        className="w-full bg-red-500 py-6 text-white hover:bg-red-600"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Adicionar • <Currency value={priceInCents * quantity} />
          </>
        )}
      </Button>
    </>
  )
}
