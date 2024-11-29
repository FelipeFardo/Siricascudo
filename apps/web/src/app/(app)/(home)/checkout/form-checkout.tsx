'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import AddressSelector from './address-selector'
import { PaymentForm } from './payment-form'

export const checkoutSchema = z.object({
  addressId: z.string(),
  paymentMethod: z.enum(['credit', 'cash']),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/)
    .optional(),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .optional(),
  cardCvv: z
    .string()
    .regex(/^\d{3}$/)
    .optional(),
  cardName: z.string().min(3).optional(),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

export function FormCheckout() {
  const methods = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit',
    },
  })

  return (
    <FormProvider {...methods}>
      <AddressSelector />
      <PaymentForm />
    </FormProvider>
  )
}
