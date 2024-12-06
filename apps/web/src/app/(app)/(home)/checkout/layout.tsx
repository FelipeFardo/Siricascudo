import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function LayoutCheckout() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/sign-in')
}
