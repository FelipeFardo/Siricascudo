import { api } from '../api-client'

interface CreateAddressRequest {
  number: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  complement?: string | undefined
}

interface CreateAddressResponse {
  address: {
    id: string
    number: string
    street: string
    city: string
    state: string
    country: string
    zipCode: string | null
    complement?: string | null | undefined
  }
}

export async function createAddress({
  city,
  complement,
  state,
  street,
  zipCode,
  country,
  number,
}: CreateAddressRequest): Promise<CreateAddressResponse> {
  const result = await api
    .post('address', {
      json: {
        city,
        complement,
        state,
        street,
        zipCode,
        country,
        number,
      },
    })
    .json<CreateAddressResponse>()

  return result
}
