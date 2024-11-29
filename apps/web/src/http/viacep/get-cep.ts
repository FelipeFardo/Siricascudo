import { env } from '@siricascudo/env'
import ky from 'ky'

export const viaCepApi = ky.create({
  prefixUrl: env.NEXT_PUBLIC_VIACEP_API_URL,
})

interface GetCepResponse {
  cep: string
  logradouro?: string
  complemento?: string
  unidade?: string
  bairro?: string
  localidade?: string
  uf: string
  ddd: string
  erro?: string
}

export async function getCep(cep: string) {
  const result = await viaCepApi.get(`ws/${cep}/json/`).json<GetCepResponse>()

  return result
}
