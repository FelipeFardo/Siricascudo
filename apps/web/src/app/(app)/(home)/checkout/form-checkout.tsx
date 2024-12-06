'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export const checkoutSchema = z.object({
  addressId: z.string({ message: 'Por favor selecione um endereço' }),
  paymentMethod: z.enum(['card', 'money']),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

export function FormCheckout({ children }: { children: React.ReactNode }) {
  const methods = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
    },
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}
