import { api } from '../api-client'

export interface UpdateCartItemRequest {
  itemId: string
  quantity: number
}

export async function updateCartItem({
  itemId,
  quantity,
}: UpdateCartItemRequest) {
  const result = await api
    .put(`cart/${itemId}`, {
      json: {
        quantity,
      },
    })
    .json()

  return result
}
