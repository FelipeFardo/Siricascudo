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
        tags: ['organization'],
      },
    })
    .json<GetOrganizationResponse>()

  return result
}
