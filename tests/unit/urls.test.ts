import { describe, it, expect, afterAll, vi } from 'vitest'

describe('urls — getIceServers', () => {
  const originalEnv = { ...process.env }

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns STUN servers by default (no TURN configured)', async () => {
    delete process.env.NEXT_PUBLIC_TURN_URL
    delete process.env.NEXT_PUBLIC_TURN_USERNAME
    delete process.env.NEXT_PUBLIC_TURN_CREDENTIAL

    const { getIceServers } = await import('@/core/urls')
    const servers = getIceServers()

    expect(servers.length).toBeGreaterThanOrEqual(2) // At least 2 STUN
    expect(servers.some(s => (typeof s.urls === 'string' ? s.urls : s.urls?.[0])?.startsWith('stun:'))).toBe(true)
  })

  it('returns STUN + primary TURN when TURN is configured', async () => {
    process.env.NEXT_PUBLIC_TURN_URL = 'turn:example.com:3478'
    process.env.NEXT_PUBLIC_TURN_USERNAME = 'user'
    process.env.NEXT_PUBLIC_TURN_CREDENTIAL = 'pass'

    // Force module reload by clearing cache
    vi.resetModules()
    const { getIceServers } = await import('@/core/urls')
    const servers = getIceServers()

    const turnServers = servers.filter(s => {
      const url = typeof s.urls === 'string' ? s.urls : s.urls?.[0]
      return url?.startsWith('turn:')
    })
    expect(turnServers.length).toBeGreaterThanOrEqual(1)
    expect(turnServers[0]?.username).toBe('user')
    expect(turnServers[0]?.credential).toBe('pass')
  })

  it('does NOT return fallback TURN when fallback is not configured', async () => {
    delete process.env.NEXT_PUBLIC_TURN_URL
    delete process.env.NEXT_PUBLIC_FALLBACK_TURN_URLS
    delete process.env.NEXT_PUBLIC_FALLBACK_TURN_USERNAME
    delete process.env.NEXT_PUBLIC_FALLBACK_TURN_CREDENTIAL

    vi.resetModules()
    const { getIceServers } = await import('@/core/urls')
    const servers = getIceServers()

    const turnServers = servers.filter(s => {
      const url = typeof s.urls === 'string' ? s.urls : s.urls?.[0]
      return url?.startsWith('turn:')
    })
    expect(turnServers.length).toBe(0)
  })

  it('returns fallback TURN when fallback is explicitly configured', async () => {
    delete process.env.NEXT_PUBLIC_TURN_URL
    process.env.NEXT_PUBLIC_FALLBACK_TURN_URLS = 'turn:fallback.example.com:3478'
    process.env.NEXT_PUBLIC_FALLBACK_TURN_USERNAME = 'fbuser'
    process.env.NEXT_PUBLIC_FALLBACK_TURN_CREDENTIAL = 'fbpass'

    vi.resetModules()
    const { getIceServers } = await import('@/core/urls')
    const servers = getIceServers()

    const turnServers = servers.filter(s => {
      const url = typeof s.urls === 'string' ? s.urls : s.urls?.[0]
      return url?.startsWith('turn:')
    })
    expect(turnServers.length).toBeGreaterThanOrEqual(1)
    expect(turnServers[0]?.username).toBe('fbuser')
    expect(turnServers[0]?.credential).toBe('fbpass')
  })
})

describe('urls — getFullUrl', () => {
  const originalEnv = { ...process.env }

  afterAll(() => {
    process.env = originalEnv
  })

  it('prepends BASE_URL to a path', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
    vi.resetModules()

    const { getFullUrl } = await import('@/core/urls')
    expect(getFullUrl('/test')).toBe('https://example.com/test')
  })

  it('adds leading slash if missing', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
    vi.resetModules()

    const { getFullUrl } = await import('@/core/urls')
    expect(getFullUrl('test')).toBe('https://example.com/test')
  })

  it('returns BASE_URL with empty path', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
    vi.resetModules()

    const { getFullUrl } = await import('@/core/urls')
    expect(getFullUrl()).toBe('https://example.com/')
  })
})