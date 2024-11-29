import { Controller, useFormContext } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import type { CheckoutSchema } from './form-checkout'

interface Addresses {
  addresses: {
    street: string
    city: string
    state: string
    zipCode: string | null
    complement?: string | null | undefined
    id: string
    number: string
    country: string
  }[]
}

export default function AddressList({ addresses }: Addresses) {
  const { control } = useFormContext<CheckoutSchema>()

  return (
    <Controller
      name="addressId"
      control={control}
      render={({ field }) => (
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          {addresses.map((address) => (
            <div key={address.id} className="mb-2 flex items-center space-x-2">
              <RadioGroupItem value={address.id} id={address.id} />
              <Label htmlFor={address.id} className="flex-grow">
                {address.street}, {address.number}, {address.city},{' '}
                {address.state} {address.zipCode}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  )
}
