import { api } from '../api-client'

interface GetOrderDetailsRequest {
  org: string
  orderId: string
}

export interface GetOrderDetailsResponse {
  order: {
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
    id: string
    createdAt: Date
    totalInCents: number
    customer: {
      name: string
      email: string
      phone: string | null
    } | null
    ordersItems: {
      id: string
      priceInCents: number
      quantity: number
      product: {
        name: string | null
      }
    }[]
  }
}

export async function getOrderDetails({
  org,
  orderId,
}: GetOrderDetailsRequest) {
  const result = await api
    .get(`organizations/${org}/orders/${orderId}`)
    .json<GetOrderDetailsResponse>()

  return result
}
