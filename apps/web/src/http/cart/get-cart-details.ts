import { api } from '../api-client'
import type { CategoryOrganization } from '../orgs/get-organizations'

export interface GetCartDetailsResponse {
  cart: {
    quantityItems: number
    totalInCents: number
    items: {
      id: string
      product: {
        id: string
        name: string
        priceInCents: number
      }
      quantity: number
      subTotalInCents: number
    }[]
    organization: {
      id: string
      name: string
      category: CategoryOrganization
    }
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
