'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Currency } from '@/components/currency'
import { Input } from '@/components/ui/input'
import { updateCartItem } from '@/http/cart/update-item-to-cart'

interface UpdateCartItemControlProps {
  itemId: string
  priceInCents: number
  initialQuantity: number
  onClose: () => void
}

export function UpdateCartItemControl({
  priceInCents,
  itemId,
  initialQuantity,
  onClose,
}: UpdateCartItemControlProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-details'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  function handleIncrement() {
    setQuantity((e) => e + 1)
  }

  function handleDecrement() {
    if (quantity > 1) setQuantity((e) => e - 1)
  }

  function alterCartItem() {
    mutateAsync({ itemId, quantity })
    onClose()
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
        onClick={() => alterCartItem()}
        className="w-full bg-red-500 py-6 text-white hover:bg-red-600"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Alterar • <Currency value={priceInCents * quantity} />
          </>
        )}
      </Button>
    </>
  )
}
