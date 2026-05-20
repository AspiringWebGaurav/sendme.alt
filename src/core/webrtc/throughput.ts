/**
 * sendme.alt - Adaptive Throughput Controller
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 * 
 * Self-tunes chunk size and buffer threshold based on real-time drain rate.
 */

import { APP_CONFIG } from '../constants'

export class ThroughputController {
  private chunkSize = APP_CONFIG.CHUNK_SIZE_INITIAL
  private bufferThreshold = APP_CONFIG.BUFFER_THRESHOLD_INITIAL
  private chunksSinceLastTune = 0
  private bytesInWindow = 0
  private windowStartTime = 0
  private lastDrainCheck = 0
  private lastBufferedAmount = 0
  private stallStartTime = 0
  private speedSamples: number[] = []
  private _statusMessage = ''

  get currentChunkSize() { return this.chunkSize }
  get currentBufferThreshold() { return this.bufferThreshold }
  get statusMessage() { return this._statusMessage }

  /** Record a chunk send for adaptive tuning */
  recordChunk(bytesSent: number) {
    if (this.windowStartTime === 0) this.windowStartTime = Date.now()
    this.chunksSinceLastTune++
    this.bytesInWindow += bytesSent

    if (this.chunksSinceLastTune >= APP_CONFIG.ADAPTIVE_WINDOW) {
      this.tune()
    }
  }

  /** Record a speed sample for rolling average */
  recordSpeed(bytesPerSec: number) {
    this.speedSamples.push(bytesPerSec)
    if (this.speedSamples.length > 5) this.speedSamples.shift()
  }

  /** Get rolling average speed (last 5 samples) */
  getRollingSpeed(): number {
    if (this.speedSamples.length === 0) return 0
    return this.speedSamples.reduce((a, b) => a + b, 0) / this.speedSamples.length
  }

  /** Check for stalled buffer drain. Returns status message or empty. */
  checkStall(bufferedAmount: number): 'ok' | 'slow' | 'fatal' {
    const now = Date.now()

    if (bufferedAmount < this.lastBufferedAmount || bufferedAmount === 0) {
      this.stallStartTime = 0
      this.lastBufferedAmount = bufferedAmount
      this.lastDrainCheck = now
      this._statusMessage = ''
      return 'ok'
    }

    if (this.stallStartTime === 0) {
      this.stallStartTime = now
      this.lastBufferedAmount = bufferedAmount
    }

    const stallDuration = now - this.stallStartTime

    if (stallDuration >= APP_CONFIG.STALL_FATAL_MS) {
      this._statusMessage = 'Transfer stalled — connection may be lost'
      return 'fatal'
    }

    if (stallDuration >= APP_CONFIG.STALL_DETECT_MS) {
      this._statusMessage = 'Network slow — optimizing…'
      this.chunkSize = Math.max(APP_CONFIG.CHUNK_SIZE_MIN, Math.floor(this.chunkSize / 2))
      this.bufferThreshold = Math.max(APP_CONFIG.BUFFER_THRESHOLD_MIN, Math.floor(this.bufferThreshold / 2))
      return 'slow'
    }

    this.lastBufferedAmount = bufferedAmount
    return 'ok'
  }

  /** Auto-tune chunk size and buffer threshold based on measured throughput */
  private tune() {
    const elapsed = (Date.now() - this.windowStartTime) / 1000
    if (elapsed <= 0) return

    const throughput = this.bytesInWindow / elapsed

    if (throughput > 5 * 1024 * 1024) {
      this.chunkSize = Math.min(APP_CONFIG.CHUNK_SIZE_MAX, this.chunkSize * 2)
      this.bufferThreshold = Math.min(APP_CONFIG.BUFFER_THRESHOLD_MAX, this.bufferThreshold * 2)
      this._statusMessage = ''
    } else if (throughput < 500 * 1024) {
      this.chunkSize = Math.max(APP_CONFIG.CHUNK_SIZE_MIN, Math.floor(this.chunkSize / 2))
      this.bufferThreshold = Math.max(APP_CONFIG.BUFFER_THRESHOLD_MIN, Math.floor(this.bufferThreshold / 2))
      this._statusMessage = 'Network slow — optimizing…'
    } else {
      this._statusMessage = ''
    }

    this.chunksSinceLastTune = 0
    this.bytesInWindow = 0
    this.windowStartTime = Date.now()
  }
}