import React from 'react'

export const Currency = ({ value }: { value: number }) => {
  const priceInCents = value / 100

  const priceInReais = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceInCents)

  return <>{priceInReais}</>
}
