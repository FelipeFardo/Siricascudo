import { api } from '../api-client'

interface GetMemberOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getMemberOrganizations() {
  const result = await api
    .get('organizations/member')
    .json<GetMemberOrganizationsResponse>()

  return result
}
