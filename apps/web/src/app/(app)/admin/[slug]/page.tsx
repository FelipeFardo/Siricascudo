import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  redirect(`/admin/${currentOrg}/orders`)
  return null
}
