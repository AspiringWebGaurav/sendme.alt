import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/create': { max: 10, windowMs: 60_000 },
  '/api/validate': { max: 20, windowMs: 60_000 },
  '/api/signal': { max: 60, windowMs: 60_000 },
}

function pruneExpired() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(key)
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const limit = RATE_LIMITS[path]

  if (!limit) return NextResponse.next()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  const key = `${path}:${ip}`
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + limit.windowMs })
    return NextResponse.next()
  }

  entry.count++
  if (entry.count > limit.max) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  // Prune expired entries every 500 requests to avoid unbounded growth
  if (Math.random() < 0.002) pruneExpired()

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/create', '/api/validate', '/api/signal'],
}