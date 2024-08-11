import { api } from '../api-client'

export interface InsertProductToCartRequest {
  itemId: string
}

export async function removeItemToCart({ itemId }: InsertProductToCartRequest) {
  const result = await api.delete(`cart/${itemId}`).json()

  return result
}
