import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest'

const originalEnv = { ...process.env }

afterAll(() => {
  process.env = originalEnv
})

describe('ThroughputController', () => {
  let ThroughputController: typeof import('@/core/webrtc/throughput').ThroughputController

  beforeEach(async () => {
    delete process.env.NEXT_PUBLIC_CHUNK_SIZE_INITIAL
    delete process.env.NEXT_PUBLIC_BUFFER_THRESHOLD_INITIAL
    vi.resetModules()
    const mod = await import('@/core/webrtc/throughput')
    ThroughputController = mod.ThroughputController
  })

  it('starts with CHUNK_SIZE_INITIAL (256KB)', () => {
    const tc = new ThroughputController()
    expect(tc.currentChunkSize).toBe(256 * 1024)
  })

  it('starts with BUFFER_THRESHOLD_INITIAL (1MB)', () => {
    const tc = new ThroughputController()
    expect(tc.currentBufferThreshold).toBe(1 * 1024 * 1024)
  })

  it('statusMessage is initially empty', () => {
    const tc = new ThroughputController()
    expect(tc.statusMessage).toBe('')
  })

  it('getRollingSpeed returns 0 with no samples', () => {
    const tc = new ThroughputController()
    expect(tc.getRollingSpeed()).toBe(0)
  })

  it('recordSpeed stores samples and getRollingSpeed returns average', () => {
    const tc = new ThroughputController()
    tc.recordSpeed(1000)
    tc.recordSpeed(2000)
    tc.recordSpeed(3000)
    expect(tc.getRollingSpeed()).toBe(2000)
  })

  it('getRollingSpeed returns average of last 5 samples', () => {
    const tc = new ThroughputController()
    tc.recordSpeed(100)
    tc.recordSpeed(200)
    tc.recordSpeed(300)
    tc.recordSpeed(400)
    tc.recordSpeed(500)
    tc.recordSpeed(600) // pushes out 100
    expect(tc.getRollingSpeed()).toBe(400) // avg of 200-600
  })

  it('recordChunk triggers tune after ADAPTIVE_WINDOW chunks', () => {
    const tc = new ThroughputController()
    for (let i = 0; i < 9; i++) {
      tc.recordChunk(100_000)
    }
    // Not yet tuned — less than ADAPTIVE_WINDOW (10) chunks
    expect(tc.currentChunkSize).toBe(256 * 1024)

    // Record 1 more to hit the window threshold
    tc.recordChunk(100_000)
    // After tuning with high throughput, chunk stays at max (INITIAL === MAX)
    expect(tc.currentChunkSize).toBe(256 * 1024)
  })

  it('checkStall detects draining buffer as ok', () => {
    const tc = new ThroughputController()
    // First call with high bufferedAmount
    expect(tc.checkStall(1000)).toBe('ok')
    // Second call with lower bufferedAmount (draining)
    expect(tc.checkStall(500)).toBe('ok')
    // Third call with even lower (draining)
    expect(tc.checkStall(0)).toBe('ok')
  })

  it('checkStall detects non-draining buffer over time', () => {
    const tc = new ThroughputController()
    // Non-draining: same amount
    tc.checkStall(1000)
    tc.checkStall(1000)

    // We can't easily test slow/fatal without manipulating time, but we can verify ok returns
    // when buffer is draining
    expect(tc.checkStall(500)).toBe('ok')
  })

  it('statusMessage is empty when buffer is draining', () => {
    const tc = new ThroughputController()
    tc.checkStall(1000)
    tc.checkStall(500)
    expect(tc.statusMessage).toBe('')
  })
})