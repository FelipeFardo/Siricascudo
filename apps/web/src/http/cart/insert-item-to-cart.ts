import { api } from '../api-client'

export interface InsertProductToCartRequest {
  productId: string
  quantity: string | null
}

export async function insertItemToCart({
  productId,
  quantity,
}: InsertProductToCartRequest) {
  const result = await api
    .post(`cart`, {
      json: {
        productId,
        quantity,
      },
    })
    .json()

  return result
}
