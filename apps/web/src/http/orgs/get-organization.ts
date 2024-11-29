import { api } from '../api-client'
import type { CategoryOrganization } from './get-organizations'

export interface GetOrganizationResponse {
  organization: {
    slug: string
    id: string
    name: string
    category: CategoryOrganization
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization(org: string) {
  const result = await api
    .get(`organizations/${org}`, {
      next: {
        tags: [`organization:${org}`],
        revalidate: 2 * 60 * 60 * 1000,
      },
    })
    .json<GetOrganizationResponse>()

  return result
}

// function delay(milliseconds: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, milliseconds))
// }
// await delay(2000) // Delay for 2 seconds
