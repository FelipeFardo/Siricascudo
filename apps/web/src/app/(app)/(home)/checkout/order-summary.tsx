import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCartDetails } from '@/http/cart/get-cart-details'

import { CartItem } from './order-item'
import { redirect } from 'next/navigation'

export async function OrderSummary() {
  const { cart } = await getCartDetails()

  if (cart.quantityItems === 0) redirect('/home')
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            itemId={item.id}
            productId={item.productId}
            quantity={item.quantity}
            subTotalInCents={item.subTotalInCents}
          />
        ))}
        <div className="mt-4 pt-4">
          <div className="mb-2 flex justify-between">
            <span>Subtotal</span>
            <span>
              {(cart.totalInCents / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
