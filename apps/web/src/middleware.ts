import { type NextRequest, NextResponse } from 'next/server'

import { createVisitorSession } from './http/auth/create-visitor-session'

export async function middleware(request: NextRequest) {
  // orgSlug
  const { pathname } = request.nextUrl

  const response = NextResponse.next()
  if (pathname.startsWith('/admin') || pathname.startsWith('/organization')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  // session visitor
  if (!request.cookies.get('visitor')) {
    const { sessionId } = await createVisitorSession()
    response.cookies.set('visitor', sessionId, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  }

  return response
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
