'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrders } from '@/http/orders/get-orders'

import { OrderTableFilters } from './order-table-filters'
import { OrderTableRow } from './order-table-row'
import { OrderTableSkeleton } from './order-table-skeleton'

export function Orders() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { slug: orgSlug } = useParams<{
    slug: string
    project: string
  }>()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        org: orgSlug,
        pageIndex,
        orderId,
        customerName,
        status: status === 'all' ? null : status,
      }),
  })

  function handlePaginate(pageIndex: number) {
    const params = new URLSearchParams({
      page: String(pageIndex + 1),
    })

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

  const orders = result?.orders

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <div className="space-y-2.5">
        <OrderTableFilters />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]"></TableHead>
                <TableHead className="w-[140px]">Identificador</TableHead>
                <TableHead className="w-[180px]">Realizado há</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="w-[140px]">Total do pedido</TableHead>
                <TableHead className="w-[164px]"></TableHead>
                <TableHead className="w-[132px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOrders && <OrderTableSkeleton />}
              {orders &&
                orders.map((order) => {
                  return <OrderTableRow key={order.orderId} order={order} />
                })}
            </TableBody>
          </Table>
        </div>

        {result && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={result.meta.perPage}
          />
        )}
      </div>
    </div>
  )
}
