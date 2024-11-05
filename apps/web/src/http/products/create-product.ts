import { api } from '../api-client'

interface CreateProductRequest {
  org: string
  name: string
  description: string
  priceInCents: number
  imageUrl: string
}

interface CreateProductResponse {
  productId: string
}

export async function createProduct({
  org,
  description,
  name,
  priceInCents,
  imageUrl,
}: CreateProductRequest) {
  const result = await api
    .post(`organizations/${org}/products`, {
      json: {
        name,
        description,
        priceInCents,
        imageUrl,
      },
    })
    .json<CreateProductResponse>()

  return result
}
