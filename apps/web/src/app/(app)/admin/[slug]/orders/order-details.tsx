'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrderDetails } from '@/http/orders/get-order-details'
import { formatDistanceToNow } from '@/lib/format-distance-to-now'

import { OrderDetailsSkeleton } from './order-details-skeleton'
import { OrderStatus } from './order-status'

export interface OrderDetailsProps {
  orderId: string
  open: boolean
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const { slug: orgSlug } = useParams<{
    slug: string
  }>()

  const { data: result } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails({ org: orgSlug, orderId }),
    enabled: open,
  })

  const order = result?.order

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      {order ? (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Status</TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>

              {order.customer ? (
                <>
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Cliente
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Telefone
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.phone ?? 'Não informado'}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      E-mail
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {order.customer.email}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Cliente
                  </TableCell>
                  <TableCell className="flex justify-end">
                    Não informado
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Realizado há
                </TableCell>
                <TableCell className="flex justify-end">
                  {formatDistanceToNow(order.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Qtd.</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.ordersItems &&
                order.ordersItems.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.product.name ?? 'Produto Excluído'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.priceInCents / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          (item.priceInCents / 100) *
                          item.quantity
                        ).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total do pedido</TableCell>
                <TableCell className="text-right font-medium">
                  {(order.totalInCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  )
}
