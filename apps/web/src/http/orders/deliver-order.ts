import { api } from '../api-client'

interface DeliverOrder {
  org: string
  orderId: string
}

export async function deliverOrder({ org, orderId }: DeliverOrder) {
  const result = await api
    .patch(`organizations/${org}/orders/${orderId}/deliver`)
    .json()

  return result
}
