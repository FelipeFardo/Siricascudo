import { defineAbilityFor } from '@siricascudo/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/auth/get-profile'
import { getMembership } from '@/http/orgs/get-membership'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}
export function getCurrentOrg() {
  return cookies().get('org')?.value ?? null
}

export async function getCurrentMembership() {
  const org = getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const token = cookies().get('token')

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return {
      user,
    }
  } catch (err) {
    console.log(err)
  }
  redirect('/api/auth/sign-out')
}
