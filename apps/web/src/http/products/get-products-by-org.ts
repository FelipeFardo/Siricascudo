import { api } from '../api-client'

interface GetProductByOrgResponse {
  products: {
    description: string
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    imageUrl: string
    organizationId: string
    priceInCents: number
  }[]
}

export async function getProductByOrg(org: string) {
  const result = await api
    .get(`organizations/${org}/products`, {
      next: {
        tags: [`products-${org}`],
        revalidate: 100000,
      },
    })
    .json<GetProductByOrgResponse>()

  return result
}
