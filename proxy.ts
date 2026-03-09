import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password']

async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes and internal Next.js paths
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Read token from cookie (set on login/signup)
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    // Token invalid or expired
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export default proxy

export const config = {
  matcher: ['/notes/:path*'],
}