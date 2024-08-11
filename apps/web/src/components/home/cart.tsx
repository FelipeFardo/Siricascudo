import { removeItem } from '@/app/(app)/(home)/cart/actions'
import { getCartDetails } from '@/http/cart/get-cart-details'

import { Button } from '../ui/button'

export async function Cart() {
  const { cart } = await getCartDetails()
  return (
    <div className="space-y-4">
      {!cart.organization && <h1>Não possui items</h1>}
      {cart.organization && (
        <>
          <div className="mb-4 flex justify-between border-b pb-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg">{cart.organization.name}</h1>
              <span className="font-medium">{cart.organization.category}</span>
            </div>
            <button className="text-primary focus:outline-none">
              Cardápio
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {cart.items.map((item) => (
              <div key={item.id} className="mb-4 space-y-4 border-b pb-4">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <span className="text-gray-600">{item.quantity}x</span>
                    <h3 className="font-medium">{item.product.name}</h3>
                  </div>
                  <span className="text-gray-600">
                    {(
                      (item.product.priceInCents * item.quantity) /
                      100
                    ).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
                <div className="flex gap-10 font-medium">
                  <button className="text-primary  focus:outline-none">
                    Editar
                  </button>
                  <form action={removeItem.bind(null, item.id)}>
                    <button className="text-gray-500 focus:outline-none">
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
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

          <Button className="w-full" type="submit">
            Finalizar Pedido
          </Button>
        </>
      )}
    </div>
  )
}
