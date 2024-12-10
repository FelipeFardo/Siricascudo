'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { GetOrderDetailsResponse } from '@/http/orders/get-order-details'
import { getOrdersUserDetails } from '@/http/orders/get-order-user-details'

export default function UserOrders() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const { data: result } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => getOrdersUserDetails(),
  })

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const getStatusColor = (
    status: GetOrderDetailsResponse['order']['status'],
  ) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500'
      case 'processing':
        return 'bg-yellow-500'
      case 'delivering':
        return 'bg-blue-500'
      case 'canceled':
        return 'bg-red-500'
      case 'pending':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatStatus = (status: GetOrderDetailsResponse['order']['status']) => {
    const statusMap: Record<
      GetOrderDetailsResponse['order']['status'],
      string
    > = {
      pending: 'Pendente',
      canceled: 'Cancelado',
      processing: 'Em preparo',
      delivering: 'A caminho',
      delivered: 'Entregue',
      not_paid: 'Não pago',
    }
    return statusMap[status]
  }

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const orders = result?.orders
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Meus Pedidos</h1>
      {orders &&
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pedido #{order.id}</span>
                <Badge className={getStatusColor(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </CardTitle>
              <CardDescription>
                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Total: {formatCurrency(order.totalInCents)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? (
                    <>
                      Ocultar detalhes
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Ver detalhes
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {expandedOrder === order.id && (
                <div className="mt-4">
                  <Separator className="my-2" />
                  <h4 className="mb-2 font-semibold">Itens do pedido:</h4>
                  <ul className="space-y-2">
                    {order.ordersItems &&
                      order.ordersItems.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.product.name}
                          </span>
                          <span>
                            {formatCurrency(item.priceInCents * item.quantity)}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {order.address && (
                    <>
                      <Separator className="my-2" />
                      <h4 className="mb-2 font-semibold">
                        Endereço de entrega:
                      </h4>
                      <p>
                        {order.address.street}, {order.address.number}
                      </p>
                      {order.address.complement && (
                        <p>{order.address.complement}</p>
                      )}
                      <p>
                        {order.address.city} - {order.address.state}
                      </p>
                      {order.address.zipCode && (
                        <p>CEP: {order.address.zipCode}</p>
                      )}
                      <p>{order.address.country}</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
