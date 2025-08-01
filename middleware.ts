import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * ICONS HERALD Middleware
 * Handles route redirects for deleted pages to maintain SEO and user experience
 * 
 * Redirects:
 * - /about → /#about (301)
 * - /contact → /#nominate (301) 
 * - /process → /#process (301)
 * - /nominate → /#nominate (301)
 * - /auth (generic) → /auth/signin (301)
 * - /style-guide → / (301)
 * - /typography → / (301)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect deleted anchor pages to landing page sections
  if (pathname === '/about') {
    return NextResponse.redirect(new URL('/#about', request.url), 301)
  }
  
  if (pathname === '/contact') {
    return NextResponse.redirect(new URL('/#nominate', request.url), 301)
  }
  
  if (pathname === '/process') {
    return NextResponse.redirect(new URL('/#process', request.url), 301)
  }

  // Redirect standalone nominate to modal anchor
  if (pathname === '/nominate') {
    return NextResponse.redirect(new URL('/#nominate', request.url), 301)
  }

  // Redirect generic auth to signin
  if (pathname === '/auth' && !pathname.includes('/auth/')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url), 301)
  }

  // Redirect development tools to home
  if (pathname === '/style-guide' || pathname === '/typography') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/about',
    '/contact', 
    '/process',
    '/nominate',
    '/auth',
    '/style-guide',
    '/typography'
  ]
}
