'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Banknote, CreditCard } from 'lucide-react'
import Form from 'next/form'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { processOrder } from './actions'

const schema = z.object({
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

type FormData = z.infer<typeof schema>

export function FormCheckout() {
  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: 'credit',
    },
  })

  const { status, data, execute, isPending } = useServerAction(processOrder)

  const paymentMethod = watch('paymentMethod')

  const onSubmit = (data: FormData) => {
    // O formulário será submetido via Server Action
    console.log('Form data:', data)
  }

  return (
    <Form action={execute}>
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit" id="credit" />
              <Label htmlFor="credit" className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Cartão de Crédito</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center space-x-2">
                <Banknote className="h-5 w-5" />
                <span>Dinheiro</span>
              </Label>
            </div>
          </RadioGroup>
        )}
      />

      {paymentMethod === 'credit' && (
        <div className="mt-4 space-y-2">
          <Input
            {...register('cardNumber')}
            placeholder="Número do Cartão"
            className={errors.cardNumber ? 'border-red-500' : ''}
          />
          {errors.cardNumber && (
            <p className="text-sm text-red-500">Número de cartão inválido</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Input
              {...register('cardExpiry')}
              placeholder="MM/AA"
              className={errors.cardExpiry ? 'border-red-500' : ''}
            />

            <Input
              {...register('cardCvv')}
              placeholder="CVV"
              className={errors.cardCvv ? 'border-red-500' : ''}
            />
          </div>
          {(errors.cardExpiry || errors.cardCvv) && (
            <p className="text-sm text-red-500">
              Data de expiração ou CVV inválidos
            </p>
          )}

          <Input
            {...register('cardName')}
            placeholder="Nome no Cartão"
            className={errors.cardName ? 'border-red-500' : ''}
          />

          {errors.cardName && (
            <p className="text-sm text-red-500">Nome inválido</p>
          )}
        </div>
      )}
    </Form>
  )
}
