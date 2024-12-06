import { Button } from '@/components/ui/button'

import { FormCheckout } from './form-checkout'
import { OrderSummary } from './order-summary'
import { FinishyCheckout } from './finishy-checkout'
import AddressSelector from './address-selector'
import { PaymentForm } from './payment-form'

export default function Checkout() {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] py-8">
      <div className="mx-auto flex flex-col gap-4 px-4">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Finalizar Pedido
        </h1>

        <FormCheckout>
          <div className="grid gap-8 md:grid-cols-2">
            <OrderSummary />

            <AddressSelector />
            <PaymentForm />
          </div>

          <FinishyCheckout />
        </FormCheckout>
      </div>
    </div>
  )
}
