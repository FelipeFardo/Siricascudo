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
