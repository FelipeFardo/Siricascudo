import { api } from '../api-client'

interface ApproveOrder {
  org: string
  orderId: string
}

export async function ApproveOrder({ org, orderId }: ApproveOrder) {
  const result = await api
    .patch(`organizations/${org}/orders/${orderId}/approve`)
    .json()

  return result
}
