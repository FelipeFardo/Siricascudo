import { api } from '../api-client'

interface CreateReservationRequest {
  name: string
  date: Date
  slug: string
  time: string
  guests: number
  email: string
  specialRequests?: string | undefined
}

type CreateReservationResponse = void

export async function createReservation({
  name,
  slug,
  date,
  email,
  guests,
  time,
  specialRequests,
}: CreateReservationRequest): Promise<CreateReservationResponse> {
  await api.post(`organizations/${slug}/reservations`, {
    json: {
      name,
      date,
      email,
      guests,
      time,
      specialRequests,
    },
  })
}
