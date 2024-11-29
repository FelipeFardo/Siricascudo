import { Banknote, CreditCard } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import type { CheckoutSchema } from './form-checkout'

export function PaymentForm() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<CheckoutSchema>()

  const paymentMethod = watch('paymentMethod')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
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
                  <Label
                    htmlFor="credit"
                    className="flex items-center space-x-2"
                  >
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
                <p className="text-sm text-red-500">
                  Número de cartão inválido
                </p>
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
        </form>
      </CardContent>
    </Card>
  )
}
