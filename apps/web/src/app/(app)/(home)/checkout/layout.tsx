import { redirect } from 'next/navigation'
import React from 'react'

import { isAuthenticated } from '@/auth/auth'

export default async function LayoutCheckout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/auth/sign-in')

  return children
}
