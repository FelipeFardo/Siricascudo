import { api } from '../api-client'

interface CreateCheckoutRequest {
  payMethod: 'money' | 'card'
  addressId: string
}

interface CreateCheckoutResponse {
  sessionId: string
}

export async function createCheckout({
  addressId,
  payMethod,
}: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
  const result = await api
    .post(`create-checkout-session`, {
      json: {
        addressId,
        payMethod,
      },
    })
    .json<CreateCheckoutResponse>()

  return result
}
