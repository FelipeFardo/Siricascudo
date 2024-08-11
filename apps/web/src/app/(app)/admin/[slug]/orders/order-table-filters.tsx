'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})
type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export function OrderTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { slug: orgSlug } = useParams<{
    slug: string
    project: string
  }>()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } =
    useForm<OrderFiltersSchema>({
      resolver: zodResolver(orderFiltersSchema),
      defaultValues: {
        orderId: orderId ?? '',
        customerName: customerName ?? '',
        status: status ?? 'all',
      },
    })

  function handleFilter({ orderId, customerName, status }: OrderFiltersSchema) {
    const params = new URLSearchParams()
    if (orderId && orderId.length > 0) {
      params.set('orderId', orderId)
    }
    if (customerName && customerName.length > 0) {
      params.set('customerName', customerName)
    }

    if (status && status.length > 0) {
      params.set('status', status)
    }

    router.push(`/admin/${orgSlug}/orders?${params}`)
  }

  function handleClearFilters() {
    router.push(`/admin/${orgSlug}/orders`)

    reset({
      orderId: '',
      customerName: '',
      status: 'all',
    })
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register('orderId')}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register('customerName')}
      />
      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="processing">Em preparo</SelectItem>
                <SelectItem value="delivering">Em entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      ></Controller>

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultado
      </Button>
      <Button
        onClick={handleClearFilters}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
