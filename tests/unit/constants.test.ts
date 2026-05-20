import { describe, it, expect, afterAll, vi } from 'vitest'

describe('constants — APP_CONFIG defaults', () => {
  const originalEnv = { ...process.env }

  afterAll(() => {
    process.env = originalEnv
  })

  it('MAX_FILE_SIZE defaults to 10GB', async () => {
    delete process.env.NEXT_PUBLIC_MAX_FILE_SIZE
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.MAX_FILE_SIZE).toBe(10737418240)
  })

  it('MAX_FILE_SIZE respects env override', async () => {
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE = '5368709120' // 5GB
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.MAX_FILE_SIZE).toBe(5368709120)
  })

  it('TOKEN_EXPIRY_MINUTES defaults to 10', async () => {
    delete process.env.NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.TOKEN_EXPIRY_MINUTES).toBe(10)
  })

  it('TOKEN_EXPIRY_MINUTES respects env override', async () => {
    process.env.NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES = '5'
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.TOKEN_EXPIRY_MINUTES).toBe(5)
  })

  it('CHUNK_SIZE_INITIAL is 256KB', async () => {
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.CHUNK_SIZE_INITIAL).toBe(256 * 1024)
  })

  it('BUFFER_THRESHOLD_INITIAL is 1MB', async () => {
    vi.resetModules()

    const { APP_CONFIG } = await import('@/core/constants')
    expect(APP_CONFIG.BUFFER_THRESHOLD_INITIAL).toBe(1 * 1024 * 1024)
  })
})

describe('constants — API_ENDPOINTS', () => {
  it('has all expected endpoints', async () => {
    vi.resetModules()

    const { API_ENDPOINTS } = await import('@/core/constants')
    expect(API_ENDPOINTS.CREATE).toBe('/api/create')
    expect(API_ENDPOINTS.VALIDATE).toBe('/api/validate')
    expect(API_ENDPOINTS.SIGNAL).toBe('/api/signal')
    expect(API_ENDPOINTS.LISTEN).toBe('/api/listen')
  })
})

describe('constants — ERROR_MESSAGES', () => {
  it('has all expected error messages', async () => {
    vi.resetModules()

    const { ERROR_MESSAGES } = await import('@/core/constants')
    expect(ERROR_MESSAGES.FILE_TOO_LARGE).toBeTruthy()
    expect(ERROR_MESSAGES.CONNECTION_FAILED).toBeTruthy()
    expect(ERROR_MESSAGES.TRANSFER_FAILED).toBeTruthy()
    expect(ERROR_MESSAGES.TOKEN_INVALID).toBeTruthy()
    expect(ERROR_MESSAGES.TOKEN_EXPIRED).toBeTruthy()
    expect(ERROR_MESSAGES.NETWORK_ERROR).toBeTruthy()
  })
})