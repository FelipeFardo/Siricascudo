import { api } from '../api-client'

interface UpdateReservationRequest {
  slug: string
  reservationId: string
}

type UpdateReservationResponse = void

export async function updateReservation({
  slug,
  reservationId,
}: UpdateReservationRequest): Promise<UpdateReservationResponse> {
  await api.put(`organizations/${slug}/reservations/${reservationId}/arrived`)
}
