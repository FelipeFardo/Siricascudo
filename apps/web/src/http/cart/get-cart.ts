import { api } from '../api-client'

export interface GetCartResponse {
  cart: {
    quantityItems: number
    totalInCents: number
  }
}

export async function getCart() {
  const result = await api.get(`cart`).json<GetCartResponse>()

  return result
}
