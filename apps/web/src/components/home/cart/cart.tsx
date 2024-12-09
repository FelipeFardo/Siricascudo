'use client'

import { getCartDetails } from '@/http/cart/get-cart-details'

import { CartItem } from './cart-item'
import { CartItemSkeleton } from './cart-item'
import { CartOrganization } from './cart-organization'
import { useQuery } from '@tanstack/react-query'

export function Cart() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart-details'],
    queryFn: getCartDetails,
  })

  const cart = data?.cart

  return (
    <div className="space-y-4 py-4">
      {cart?.items && cart.items.length === 0 && <h1>Não possui items</h1>}
      {cart && cart.organizationSlug && (
        <>
          <CartOrganization slug={cart.organizationSlug} />

          <div className="grid grid-cols-1 gap-4">
            {isLoading && (
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            )}

            {cart &&
              cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  itemId={item.id}
                  productId={item.productId}
                  quantity={item.quantity}
                  subTotalInCents={item.subTotalInCents}
                />
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
