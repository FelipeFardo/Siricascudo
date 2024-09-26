import { api } from '../api-client'

export type GetPopularProductsResponse = {
  product: string
  amount: number
}[]

export async function getPopularProducts(org: string) {
  const result = await api
    .get(`organizations/${org}/metrics/popular-products`)
    .json<GetPopularProductsResponse>()

  return result
}
