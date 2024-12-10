import { api } from '../api-client'

interface GetReservationsRequest {
  date: Date
  org: string
  pageIndex: number
}

export interface GetReservationsResponse {
  reservations: {
    id: string
    description: string | null
    createdAt: Date
    customerName: string
    organizationId: string
    customerEmail: string
    numberOfPeople: number
    reservationDate: string
    reservationTime: string
    hasArrived: boolean
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

type SearchParams = Record<string, string | number>

export async function getReservations({
  date,
  org,
  pageIndex,
}: GetReservationsRequest): Promise<GetReservationsResponse> {
  const params: SearchParams = {}
  if (typeof date === 'object') params.date = date.toISOString()
  if (typeof pageIndex === 'number') params.pageIndex = pageIndex

  const result = await api
    .get(`organizations/${org}/reservations`, {
      searchParams: params,
    })
    .json<GetReservationsResponse>()

  return result
}
