import { api } from '../api-client'

export interface InsertProductToCartRequest {
  productId: string
  quantity: number
}

export async function insertItemToCart({
  productId,
  quantity,
}: InsertProductToCartRequest) {
  const result = await api
    .post(`cart/item`, {
      json: {
        productId,
        quantity,
      },
    })
    .json()

  return result
}
