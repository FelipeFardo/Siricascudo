'use client'

import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { getCart } from '@/http/cart/get-cart'

export function CartSummary() {
  const { data, status } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  return (
    <div className="flex flex-col text-left">
      {status === 'success' && data.cart && (
        <>
          <span>
            {(data.cart.totalInCents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
          <span className="text-xs">({data.cart.quantityItems}) item(s)</span>
        </>
      )}
      {status === 'pending' && <Skeleton className="h-10 w-14" />}
    </div>
  )
}
