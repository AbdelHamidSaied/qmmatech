import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  // For localhost:3000 without subdomain, do nothing (slug defaults in code)
  // For production, you could route based on subdomain or custom domain here
  return NextResponse.next()
}