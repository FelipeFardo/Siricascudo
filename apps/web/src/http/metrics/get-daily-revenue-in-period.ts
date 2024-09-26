import { api } from '../api-client'

export interface getDailyRevenueInPeriodQuery {
  org: string
  from?: Date
  to?: Date
}

export type GetDailyRevenueInPeriodResponse = {
  date: string
  receipt: number
}[]

type SearchParams = Record<string, string | number | boolean>

export async function getDailyRevenueInPeriod({
  org,
  from,
  to,
}: getDailyRevenueInPeriodQuery) {
  const params: SearchParams = {}
  if (typeof from?.toISOString() === 'string') params.from = from?.toISOString()
  if (typeof to?.toISOString() === 'string') params.to = to?.toISOString()

  const result = await api
    .get(`organizations/${org}/metrics/daily-receipt-in-period`, {
      searchParams: params,
    })
    .json<GetDailyRevenueInPeriodResponse>()

  return result
}
