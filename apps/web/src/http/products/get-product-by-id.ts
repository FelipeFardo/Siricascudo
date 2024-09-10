import { api } from '../api-client'

interface GetProductByIdResponse {
  product: {
    description: string
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    organizationId: string
    priceInCents: number
  }
}

export async function getProductById(productId: string) {
  const result = await api
    .get(`product/${productId}`, {
      next: {
        tags: ['product', productId],
        revalidate: 100000,
      },
    })
    .json<GetProductByIdResponse>()

  return result
}
