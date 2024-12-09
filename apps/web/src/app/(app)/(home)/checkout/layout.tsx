import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function LayoutCheckout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/sign-in')

  return children
}
