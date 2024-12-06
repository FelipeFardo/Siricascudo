'use client'
import { Button } from '@/components/ui/button'
import { getCart } from '@/http/cart/get-cart'
import { getCartDetails } from '@/http/cart/get-cart-details'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export function CheckoutButton() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const disabled = isLoading || !data?.cart || data.cart.quantityItems <= 0

  return (
    <Button className="w-full" disabled={disabled}>
      {disabled ? (
        'Finalizar Pedido'
      ) : (
        <Link href="/checkout">Finalizar Pedido</Link>
      )}
    </Button>
  )
}
