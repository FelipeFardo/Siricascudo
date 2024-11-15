import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { FormCheckout } from './form-checkout'
import { OrderSummary } from './order-summary'

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Finalizar Pedido
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <OrderSummary />
          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <FormCheckout />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
