import { api } from '../api-client'

interface DispatchOrder {
  org: string
  orderId: string
}

export async function dispatchOrder({ org, orderId }: DispatchOrder) {
  const result = await api
    .patch(`organizations/${org}/orders/${orderId}/dispatch`)
    .json()

  return result
}
