import { api } from '../api-client'

export interface GetCartDetailsResponse {
  cart: {
    totalInCents: number
    quantityItems: number
    items: {
      id: string
      productId: string
      quantity: number
      subTotalInCents: number
    }[]
    organizationSlug: string | null
  }
}

export async function getCartDetails() {
  const result = await api
    .get(`cart/details`, {
      next: {
        tags: [`cart-details`],
      },
    })
    .json<GetCartDetailsResponse>()

  return result
}
