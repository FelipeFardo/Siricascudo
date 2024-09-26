import { api } from '../api-client'

export interface GetDayOrdersAmountResponse {
  amount: number
  diffFromYesterday: number
}

export async function getDayOrdersAmount(org: string) {
  const result = await api
    .get(`organizations/${org}/metrics/day-orders-amount`)
    .json<GetDayOrdersAmountResponse>()

  return result
}
