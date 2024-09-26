import { api } from '../api-client'

export interface GetMonthRevenueResponse {
  receipt: number
  diffFromLastMonth: number
}

export async function getMonthRevenue(org: string) {
  const result = await api
    .get(`organizations/${org}/metrics/month-receipt`)
    .json<GetMonthRevenueResponse>()

  return result
}
