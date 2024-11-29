import { env } from '@siricascudo/env'
import { getCookie } from 'cookies-next'
import ky from 'ky'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async () => {
        if (env.NEXT_PUBLIC_NODE_ENV === 'development')
          await delay(Math.round(Math.random() * 3000))
      },

      async (request) => {
        let token: string | undefined
        if (typeof window === 'undefined') {
          const { cookies } = await import('next/headers')

          const cookieStore = await cookies()

          token = cookieStore.get('token')?.value
        } else {
          token = await getCookie('token')
        }
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
      async (request) => {
        let visitor: string | undefined
        // const visitor = 'f389b338-4320-44a6-b41b-2f8280c77cdf'
        if (typeof window === 'undefined') {
          const { cookies } = await import('next/headers')

          const cookieStore = await cookies()
          visitor = cookieStore.get('visitor')?.value
        } else {
          visitor = await getCookie('visitor')
        }
        if (visitor) {
          const cookie = `visitor=${visitor}`
          request.headers.set('Cookie', cookie)
        }
      },
    ],
  },
  credentials: 'include',
})
