import { api } from '../api-client'

export interface GetProductsResponse {
  products: {
    description: string
    id: string
    name: string
    imageUrl: string
    createdAt: Date
    updatedAt: Date
    organizationId: string
    priceInCents: number
    organization: {
      slug: string
    }
  }[]
}

export async function getProducts() {
  const result = await api
    .get(`product`, {
      next: {
        tags: ['products'],
      },
    })
    .json<GetProductsResponse>()

  return result
}
