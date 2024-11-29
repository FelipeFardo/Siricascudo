'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import { Currency } from '@/components/currency'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { GetCartResponse } from '@/http/cart/get-cart'
import { insertItemToCart } from '@/http/cart/insert-item-to-cart'

interface AddToCartControlProps {
  productId: string
  priceInCents: number
  organizationSlug: string
}

export function AddToCartControl({
  priceInCents,
  productId,
}: AddToCartControlProps) {
  const [quantity, setQuantity] = useState(1)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
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
        disabled={isPending}
        onClick={() => addItemToCartAndRedirect()}
        className="w-full bg-red-500 py-6 text-white hover:bg-red-600"
      >
        {isPending ? (
          'Adicionando...'
        ) : (
          <>
            Adicionar • <Currency value={priceInCents * quantity} />
          </>
        )}
      </Button>
    </>
  )
}