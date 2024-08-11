import { api } from '../api-client'
import type { CategoryOrganization } from './get-organizations'

interface UpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  category: CategoryOrganization
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
  category,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      category,
    },
  })
}
