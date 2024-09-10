'use client'

import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Input } from '../ui/input'
import { insertItemToCartAction } from './action'
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
  const router = useRouter()

  function handleIncrement() {
    setQuantity((e) => e + 1)
  }

  function handleDecrement() {
    if (quantity > 1) setQuantity((e) => e - 1)
  }

  function addItemToCartAndRedirect() {
    insertItemToCartAction({
      productId,
      quantity,
    })
    // router.push(`organization/${organizationSlug}`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          R$ {(priceInCents / 100).toFixed(2)}
        </span>
        <div className="flex items-center space-x-2 rounded-full border">
          <Button
            variant="ghost"
            onClick={handleDecrement}
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
            onClick={handleIncrement}
            className="rounded-r-full"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <Button
        onClick={() => addItemToCartAndRedirect()}
        className="w-full bg-red-500 py-6 text-white hover:bg-red-600"
      >
        Adicionar • R$ {((priceInCents / 100) * quantity).toFixed(2)}
      </Button>
    </>
  )
}
