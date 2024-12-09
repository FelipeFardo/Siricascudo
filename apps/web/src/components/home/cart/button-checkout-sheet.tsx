'use client'

import { Button } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import { getCart } from '@/http/cart/get-cart'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export function CheckoutButtonSheet() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const disabled = isLoading || !data?.cart || data.cart.quantityItems <= 0

  return (
    <SheetClose asChild>
      <Button className="w-full" disabled={disabled} asChild>
        {disabled ? (
          'Finalizar Pedido'
        ) : (
          <Link href="/checkout">Finalizar Pedido</Link>
        )}
      </Button>
    </SheetClose>
  )
}
