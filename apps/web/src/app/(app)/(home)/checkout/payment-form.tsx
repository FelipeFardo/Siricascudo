'use client'
import { Banknote, CreditCard } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import type { CheckoutSchema } from './form-checkout'

export function PaymentForm() {
  const { control } = useFormContext<CheckoutSchema>()

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
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Cartão de Crédito</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="money" id="money" />
                  <Label
                    htmlFor="money"
                    className="flex items-center space-x-2"
                  >
                    <Banknote className="h-5 w-5" />
                    <span>Dinheiro</span>
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </form>
      </CardContent>
    </Card>
  )
}
