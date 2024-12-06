'use client'

import { Button } from '@/components/ui/button'
import { createCheckout } from '@/http/checkout/create-checkout'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { env } from '@siricascudo/env'
import { useFormContext } from 'react-hook-form'
import type { CheckoutSchema } from './form-checkout'

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export function FinishyCheckout() {
  const { watch, handleSubmit } = useFormContext<CheckoutSchema>()
  const navigate = useRouter()
  const addressId = watch('addressId')
  const paymentMethod = watch('paymentMethod')

  async function handleClick() {
    try {
      const stripe = await stripePromise
      console.log({
        addressId,
        payMethod: 'card',
      })
      const { sessionId } = await createCheckout({
        addressId,
        payMethod: paymentMethod,
      })
      if (paymentMethod == 'card') {
        await stripe?.redirectToCheckout({ sessionId })
      } else if (paymentMethod == 'money') {
        navigate.push('/orders')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button className="mx-auto flex" onClick={handleSubmit(handleClick)}>
      Finalizar pedido
    </Button>
  )
}
