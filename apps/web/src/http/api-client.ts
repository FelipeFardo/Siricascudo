import { env } from '@siricascudo/env'
import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next/lib/types'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')

          cookieStore = serverCookies
        }
        const token = getCookie('token', { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        const cookies = response.headers.get('set-cookie')
        console.log(getCookies('session', cookies!))
      },
    ],
  },
})

function getCookies(name: string, cookies: string) {
  const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) {
    return match[2]
  } else {
    return null
  }
}
