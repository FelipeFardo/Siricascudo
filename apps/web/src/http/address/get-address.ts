import { api } from '../api-client'

export interface GetAddressesResponse {
  addresses: {
    street: string
    city: string
    state: string
    zipCode: string | null
    complement?: string | null | undefined
    id: string
    number: string
    country: string
  }[]
}

export async function getAddresses() {
  const result = await api.get('address').json<GetAddressesResponse>()

  return result
}
