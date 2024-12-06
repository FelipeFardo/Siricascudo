import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { getCartDetails } from '@/http/cart/get-cart-details'

import { CartItem } from './cart-item'
import { CartItemSkeleton } from './cart-item'
import { CartOrganization } from './cart-organization'

export function Cart() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart', 'cart-details'],
    queryFn: getCartDetails,
  })

  if (isLoading) return <p>Carregando...</p>

  const cart = data?.cart

  if (!cart) return <p>Carregando...</p>
  return (
    <div className="space-y-4">
      {cart.items.length === 0 && <h1>Não possui items</h1>}
      {cart.organizationSlug && (
        <>
          <CartOrganization slug={cart.organizationSlug} />
          <div className="grid grid-cols-1 gap-4">
            {cart.items.map((item) => (
              <Suspense key={item.id} fallback={<CartItemSkeleton />}>
                <CartItem
                  key={item.id}
                  itemId={item.id}
                  productId={item.productId}
                  quantity={item.quantity}
                  subTotalInCents={item.subTotalInCents}
                />
              </Suspense>
            ))}
          </div>
          <div className="flex justify-between border-b pb-4">
            <span>Total: </span>
            <span>
              {(cart.totalInCents / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
