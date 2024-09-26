import { api } from '../api-client'

export interface GetMonthOrdersAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getMonthOrdersAmount(org: string) {
  const result = await api
    .get(`organizations/${org}/metrics/month-orders-amount`)
    .json<GetMonthOrdersAmountResponse>()

  return result
}
