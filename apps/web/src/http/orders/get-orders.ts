import { api } from '../api-client'

interface GetOrdersRequest {
  org: string
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: string | null
}

export interface GetOrdersResponse {
  orders: {
    orderId: string
    createdAt: string
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
    customerName: string
    total: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

type SearchParams = Record<string, string | number | boolean>

export async function getOrders({
  org,
  customerName,
  orderId,
  pageIndex,
  status,
}: GetOrdersRequest) {
  const params: SearchParams = {}
  if (typeof customerName === 'string') params.customerName = customerName
  if (typeof orderId === 'string') params.orderId = orderId
  if (typeof status === 'string') params.status = status
  if (typeof pageIndex === 'number') params.pageIndex = pageIndex

  const result = await api
    .get(`organizations/${org}/orders`, {
      searchParams: params,
    })
    .json<GetOrdersResponse>()

  return result
}
