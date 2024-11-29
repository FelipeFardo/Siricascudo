'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createAddress } from '@/http/address/create-address'
import {
  getAddresses,
  type GetAddressesResponse,
} from '@/http/address/get-address'
import { getCep } from '@/http/viacep/get-cep'
import { formatZipCode } from '@/utils/formatZipCode'

import AddressList from './address-list'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheckoutSchema } from './form-checkout'

export const addressSchema = z.object({
  street: z.string({ message: 'A Rua é obrigatória' }),
  city: z.string({ message: 'A Cidade é obrigatória' }),
  state: z.string({ message: 'O Estado é obrigatória' }),
  country: z.string({ message: 'O Bairro é obrigatório' }),
  number: z.string({ message: 'O Número é obrigatório' }),
  zipCode: z.string().transform((value) => value.replace(/\D/g, '')),
  complement: z.string().optional(),
})

export type AddressSchema = z.infer<typeof addressSchema>

export default function AddressSelector() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ['address'],
    queryFn: getAddresses,
  })

  const { setValue: setValueCheckout, watch: watchCheckoutValue } =
    useFormContext<CheckoutSchema>()

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: { zipCode: '' },
  })
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAddress,

    onSuccess: (data) => {
      queryClient.setQueryData<GetAddressesResponse>(['address'], (oldData) => {
        if (oldData?.addresses) {
          return {
            addresses: [...oldData?.addresses, data.address],
          }
        }
        return oldData
      })

      setValueCheckout('addressId', data.address.id)
      setIsDialogOpen(false)
      form.reset()
    },
  })

  const { setValue, setError, clearErrors, watch } = form

  const zipCode = watch('zipCode')
  const addressId = watchCheckoutValue('addressId')

  useEffect(() => {
    const formattedCep = formatZipCode(zipCode)
    setValue('zipCode', formattedCep)
    const zipCodeFormated = formattedCep.replace(/\D/g, '')
    autoCompleteAddressByZipCode(zipCodeFormated)
  }, [zipCode])

  async function autoCompleteAddressByZipCode(zipCode: string) {
    if (zipCode.length === 8) {
      try {
        const result = await getCep(zipCode)

        if (result.erro) throw new Error()

        if (result.logradouro) setValue('street', result.logradouro)
        if (result.uf) setValue('state', result.uf)
        if (result.localidade) setValue('city', result.localidade)
        setValue('country', 'Brasil')
        clearErrors(['zipCode', 'country', 'city', 'state', 'street'])
      } catch (err) {
        setValue('street', '')
        setValue('state', '')
        setValue('city', '')
        setValue('country', '')
        setError('zipCode', { message: 'CEP inválido' })
      }
    }
  }

  async function onSubmit(data: AddressSchema) {
    await mutateAsync(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione um endereço</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.addresses && <AddressList addresses={data?.addresses} />}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Adicionar novo endereço</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo endereço</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o CEP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o complemento (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className={cn('h-5 w-5 animate-spin')} />
                  ) : (
                    'Adicionar'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
