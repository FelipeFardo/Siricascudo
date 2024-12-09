import { api } from '../api-client'

export const categoryOrganization = [
  'Marmitas',
  'Hambúrgueres',
  'Refrigerantes',
  'Massas',
  'Carnes',
  'Frango e Aves',
  'Sanduíches e Wraps',
  'Esfihas',
  'Pães',
  'Sushi e Sashimi',
  'Açaí',
  'Sobremesas',
  'Pizzas Salgadas',
  'Bolos e Tortas',
  'Pastéis',
  'Peixes e Frutos-do-mar',
  'Cachorro-quente',
  'Parmegiana',
  'Porções',
  'Batata frita',
] as const

export type CategoryOrganization = (typeof categoryOrganization)[number]

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    category: CategoryOrganization
    avatarUrl: string | null
    description: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api.get('organizations').json<GetOrganizationsResponse>()

  return result
}
