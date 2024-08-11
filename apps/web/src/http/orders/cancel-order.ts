import { api } from '../api-client'

interface CancelOrder {
  org: string
  orderId: string
}

export async function cancelOrder({ org, orderId }: CancelOrder) {
  const result = await api
    .patch(`organizations/${org}/orders/${orderId}/cancel`)
    .json()

  return result
}
