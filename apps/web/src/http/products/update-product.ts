import { api } from '../api-client'

interface CreateProductRequest {
  productId: string
  org: string
  name: string
  description: string
  priceInCents: number
  imageUrl: string
}

type UpdateProductResponse = void

export async function updateProduct({
  org,
  name,
  description,
  productId,
  imageUrl,
  priceInCents,
}: CreateProductRequest): Promise<UpdateProductResponse> {
  await api.put(`organizations/${org}/products/${productId}`, {
    json: {
      name,
      description,
      imageUrl,
      priceInCents,
    },
  })
}
