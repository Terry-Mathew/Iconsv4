import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iconsherald.com'
  
  const robots = `User-agent: *
Allow: /
Allow: /profile/*
Allow: /profiles

Disallow: /admin
Disallow: /api/
Disallow: /builder
Disallow: /payment
Disallow: /auth/

Sitemap: ${baseUrl}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
