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
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')

          cookieStore = serverCookies
        }
        const visitorSession = getCookie('visitor', { cookies: cookieStore })

        if (visitorSession) {
          const cookie = `visitor=${visitorSession}`
          request.headers.set('Cookie', cookie)
        }
      },
    ],
    // afterResponse: [
    //   // async (_, __, response) => {
    //   //   const cookies = response.headers.get('set-cookie')
    //   //   const sessionCookie = getCookies('session', cookies!)!
    //   //   if (typeof window === 'undefined') {
    //   //     const { cookies: serverCookies } = await import('next/headers')
    //   //     serverCookies().set('token', sessionCookie, {
    //   //       path: '/',
    //   //       httpOnly: true,
    //   //       secure: false,
    //   //       maxAge: 3600 * 24 * 7,
    //   //     })
    //   //   }
    //   // },
    // ],
  },
})

// function getCookies(name: string, cookies: string) {
//   const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'))
//   if (match) {
//     return match[2]
//   } else {
//     return null
//   }
// }
