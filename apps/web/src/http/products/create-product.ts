import { api } from '../api-client'

interface CreateProductRequest {
  org: string
  name: string
  description: string
  priceInCents: number
  imageUrl: string
}

interface CreateProductResponse {
  product: {
    description: string
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    imageUrl: string
    organizationId: string
    priceInCents: number
  }
}

export async function createProduct({
  org,
  description,
  name,
  priceInCents,
  imageUrl,
}: CreateProductRequest) {
  const result = await api
    .post(`organizations/${org}/products/create-product`, {
      json: {
        name,
        description,
        priceInCents,
        imageUrl,
      },
      next: {
        tags: ['products', org],
        revalidate: 100000,
      },
    })
    .json<CreateProductResponse>()

  return result
}
