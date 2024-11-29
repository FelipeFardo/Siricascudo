import { api } from '../api-client'

interface CreateReservationRequest {
  name: string
  slug: string
}

type CreateReservationResponse = void

export async function createOrganization({
  name,
  slug,
}: CreateReservationRequest): Promise<CreateReservationResponse> {
  await api.post(`organizations/${slug}`, {
    json: {
      name,
    },
  })
}
