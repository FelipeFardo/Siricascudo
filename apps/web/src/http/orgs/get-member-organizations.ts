import { api } from '../api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api
    .get('organizations/members', {
      next: {
        tags: ['member-organizations'],
      },
    })
    .json<GetOrganizationsResponse>()

  return result
}
