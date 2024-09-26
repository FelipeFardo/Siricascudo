import { api } from '../api-client'

export interface GetMonthCanceledOrdersAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthCanceledOrdersAmount(org: string) {
  const result = await api
    .get(`organizations/${org}/metrics/month-canceled-orders-amount`)
    .json<GetMonthCanceledOrdersAmountResponse>()

  return result
}
