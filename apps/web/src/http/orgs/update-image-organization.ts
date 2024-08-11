import { api } from '../api-client'

interface UpdateImageOrganizationRequest {
  url: string
  org: string
}

type UpdateImageOrganizationResponse = void

export async function updateImageOrganization({
  url,
  org,
}: UpdateImageOrganizationRequest): Promise<UpdateImageOrganizationResponse> {
  await api.patch(`organizations/${org}/avatar-url`, {
    json: {
      imageUrl: url,
    },
  })
}
