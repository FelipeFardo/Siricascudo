import { api } from '../api-client'

export interface GetOrdersUsersDetailsResponse {
  orders: {
    status:
      | 'pending'
      | 'canceled'
      | 'processing'
      | 'delivering'
      | 'delivered'
      | 'not_paid'
    id: string
    createdAt: Date
    totalInCents: number
    address: {
      number: string
      id: string
      createdAt: Date
      updatedAt: Date
      customerId: string | null
      street: string
      city: string
      state: string
      country: string
      zipCode: string | null
      complement: string | null
    } | null
    organization: {
      name: string
    }
    ordersItems: {
      id: string
      priceInCents: number
      quantity: number
      product: {
        name: string | null
      }
    }[]
  }[]
}

export async function getOrdersUserDetails() {
  const result = await api.get(`orders`).json<GetOrdersUsersDetailsResponse>()

  return result
}
