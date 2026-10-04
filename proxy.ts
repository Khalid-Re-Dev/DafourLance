import { NextResponse, type NextRequest } from 'next/server'
// Override client-supplied headers; the URL is the authoritative locale.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-site-language', request.nextUrl.pathname.split('/')[1] === 'en' ? 'en' : 'ar')
  return NextResponse.next({ request: { headers } })
}
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
