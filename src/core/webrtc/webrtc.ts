/**
 * sendme.alt - WebRTC Core
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { RTC_CONFIG, DATA_CHANNEL_CONFIG, APP_CONFIG } from '../constants'
import type { ProgressInfo } from '@/types'

/**
 * Adaptive Throughput Controller
 * Self-tunes chunk size and buffer threshold based on real-time drain rate.
 */
class ThroughputController {
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
      // Buffer is draining — reset stall tracker
      this.stallStartTime = 0
      this.lastBufferedAmount = bufferedAmount
      this.lastDrainCheck = now
      this._statusMessage = ''
      return 'ok'
    }

    // Buffer NOT draining
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
      // Scale down aggressively
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

    const throughput = this.bytesInWindow / elapsed // bytes/sec

    if (throughput > 5 * 1024 * 1024) {
      // > 5 MB/s — scale up
      this.chunkSize = Math.min(APP_CONFIG.CHUNK_SIZE_MAX, this.chunkSize * 2)
      this.bufferThreshold = Math.min(APP_CONFIG.BUFFER_THRESHOLD_MAX, this.bufferThreshold * 2)
      this._statusMessage = ''
    } else if (throughput < 500 * 1024) {
      // < 500 KB/s — scale down
      this.chunkSize = Math.max(APP_CONFIG.CHUNK_SIZE_MIN, Math.floor(this.chunkSize / 2))
      this.bufferThreshold = Math.max(APP_CONFIG.BUFFER_THRESHOLD_MIN, Math.floor(this.bufferThreshold / 2))
      this._statusMessage = 'Network slow — optimizing…'
    } else {
      this._statusMessage = ''
    }

    // Reset window
    this.chunksSinceLastTune = 0
    this.bytesInWindow = 0
    this.windowStartTime = Date.now()
  }
}

/**
 * P2P Connection Manager
 * Handles WebRTC peer connection, data channel, and file transfer
 */
export class P2PConnection {
  private pc: RTCPeerConnection
  private channel: RTCDataChannel | null = null
  private onChannelOpenCallback: (() => void) | null = null
  private onChannelCloseCallback: (() => void) | null = null
  private onChannelErrorCallback: ((error: Error) => void) | null = null
  private onConnectionStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null

  // ICE Candidate buffering
  private iceCandidateBuffer: RTCIceCandidateInit[] = []
  private isRemoteDescriptionSet = false

  // State sync: peer cancel detection (public so hooks can read)
  public peerCancelReceived = false

  // Early message buffer: captures messages arriving before receiveFile() installs its handler
  private pendingMessages: MessageEvent[] = []

  constructor() {
    this.pc = new RTCPeerConnection(RTC_CONFIG)
    this.setupConnectionHandlers()
  }

  /**
   * Setup connection state handlers
   */
  private setupConnectionHandlers() {
    this.pc.onconnectionstatechange = () => {
      const state = this.pc.connectionState
      if (process.env.NODE_ENV === 'development') {
        console.log(`[P2P] Connection state changed: ${state}`)
      }
      this.onConnectionStateChangeCallback?.(state)
    }

    this.pc.oniceconnectionstatechange = () => {
      const state = this.pc.iceConnectionState
      if (process.env.NODE_ENV === 'development') {
        console.log(`[P2P] ICE connection state changed: ${state}`)
      }

      if (state === 'failed' || state === 'disconnected') {
        // Optional: trigger fallback or restart logic
      }
    }

    this.pc.onicegatheringstatechange = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[P2P] ICE gathering state: ${this.pc.iceGatheringState}`)
      }
    }
  }

  /**
   * Create offer (sender side)
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    // Create data channel for sender
    this.channel = this.pc.createDataChannel('fileTransfer', DATA_CHANNEL_CONFIG)
    this.channel.binaryType = 'arraybuffer'
    this.setupDataChannelHandlers(this.channel)

    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)

    return offer
  }

  /**
   * Create answer (receiver side)
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    // Setup data channel listener for receiver
    this.pc.ondatachannel = (event) => {
      console.log('[P2P] Received data channel')
      this.channel = event.channel
      this.channel.binaryType = 'arraybuffer'
      this.setupDataChannelHandlers(this.channel)
    }

    await this.pc.setRemoteDescription(offer)
    this.isRemoteDescriptionSet = true
    await this.processIceCandidateBuffer()

    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)

    return answer
  }

  /**
   * Add ICE candidate with buffering support
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!candidate) return

    // Only add candidate if remote description is set
    if (!this.pc.remoteDescription && !this.isRemoteDescriptionSet) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[P2P] Buffering ICE candidate (remote description not set)')
      }
      this.iceCandidateBuffer.push(candidate)
      return
    }

    try {
      await this.pc.addIceCandidate(candidate)
      if (process.env.NODE_ENV === 'development') {
        console.log('[P2P] Added ICE candidate')
      }
    } catch (err) {
      console.warn('[P2P] Failed to add ICE candidate:', err)
      // Ignore errors for duplicate or invalid candidates
    }
  }

  /**
   * Process buffered ICE candidates
   */
  private async processIceCandidateBuffer() {
    if (this.iceCandidateBuffer.length > 0) {
      console.log(`[P2P] Processing ${this.iceCandidateBuffer.length} buffered ICE candidates`)
      for (const candidate of this.iceCandidateBuffer) {
        try {
          await this.pc.addIceCandidate(candidate)
        } catch (err) {
          console.warn('[P2P] Failed to add buffered ICE candidate:', err)
        }
      }
      this.iceCandidateBuffer = []
    }
  }

  /**
   * Set remote description (for sender after receiving answer)
   */
  async setRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    // Check signaling state - should be 'have-local-offer' to set remote answer
    if (this.pc.signalingState === 'have-local-offer') {
      await this.pc.setRemoteDescription(answer)
      this.isRemoteDescriptionSet = true
      await this.processIceCandidateBuffer()
    } else if (this.pc.signalingState === 'stable') {
      // Already set, ignore silently (race condition)
      console.log('[P2P] Remote answer already set or state is stable')
    } else {
      throw new Error(`Cannot set remote answer in signaling state: ${this.pc.signalingState}`)
    }
  }

  /**
   * Get signaling state
   */
  getSignalingState(): RTCSignalingState {
    return this.pc.signalingState
  }

  /**
   * Setup data channel event handlers
   */
  private setupDataChannelHandlers(channel: RTCDataChannel) {
    channel.onopen = () => {
      console.log('[P2P] Data channel opened')
      this.onChannelOpenCallback?.()
    }

    // Buffer messages that arrive before receiveFile() installs its handler.
    // On fast local connections, the sender can start transmitting metadata + chunks
    // before the receiver's onChannelOpen callback has finished setting up receiveFile.
    channel.onmessage = (event) => {
      this.pendingMessages.push(event)
    }

    channel.onclose = () => {
      console.log('[P2P] Data channel closed')
      this.onChannelCloseCallback?.()
    }

    channel.onerror = (error) => {
      console.error('[P2P] Data channel error:', error)
      this.onChannelErrorCallback?.(new Error('Data channel error'))
    }
  }

  /**
   * Register callbacks
   */
  onChannelOpen(callback: () => void) {
    this.onChannelOpenCallback = callback
    if (this.channel && this.channel.readyState === 'open') {
      callback()
    }
  }

  onChannelClose(callback: () => void) {
    this.onChannelCloseCallback = callback
  }

  onChannelError(callback: (error: Error) => void) {
    this.onChannelErrorCallback = callback
  }

  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChangeCallback = callback
  }

  /**
   * Get ICE candidates as they are generated
   */
  onIceCandidate(callback: (candidate: RTCIceCandidateInit | null) => void) {
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[P2P] Generated local ICE candidate')
        }
      }
      callback(event.candidate)
    }
  }

  public isCancelled = false

  /**
   * Cancel current transfer and notify peer
   */
  cancelTransfer() {
    this.isCancelled = true
    if (this.channel && this.channel.readyState === 'open') {
      try {
        // Send structured cancel with reason so peer knows it was intentional
        this.channel.send(JSON.stringify({ type: 'cancel', reason: 'user' }))
      } catch {
        // Ignore send error if channel is closing
      }
      this.channel.close()
    }
    setTimeout(() => {
      this.pc.close()
      this.iceCandidateBuffer = []
      this.isRemoteDescriptionSet = false
    }, 100)
  }

  /**
   * Send file over data channel
   * Uses adaptive ThroughputController for self-optimizing performance
   */
  async sendFile(file: File, onProgress: (progress: ProgressInfo) => void): Promise<void> {
    if (!this.channel || this.channel.readyState !== 'open') {
      throw new Error('Data channel not open — peer may have disconnected. Try generating a new code.')
    }

    this.isCancelled = false
    const controller = new ThroughputController()

    // Setup listener for cancel message from receiver during transfer
    const originalOnMessage = this.channel.onmessage
    this.channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'cancel') {
            this.isCancelled = true
            this.peerCancelReceived = true
          }
        } catch {
          // Ignore
        }
      }
    }

    try {
      // Send file metadata first
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        totalChunks: Math.ceil(file.size / controller.currentChunkSize),
      }
      this.channel.send(JSON.stringify({ type: 'metadata', data: metadata }))

      // Speed tracking — start AFTER metadata, measure only data throughput
      let speedStartTime = 0
      let lastProgressTime = 0
      let offset = 0

      // Adaptive send loop — chunk size changes dynamically
      while (offset < file.size) {
        // Check if cancelled or channel closed
        if (this.isCancelled) {
          throw new Error('Transfer cancelled')
        }
        if (this.channel.readyState !== 'open') {
          throw new Error('Receiver disconnected. Transfer ended.')
        }

        const chunkSize = controller.currentChunkSize
        const bufferThreshold = controller.currentBufferThreshold

        // Configure event-driven backpressure with adaptive threshold
        this.channel.bufferedAmountLowThreshold = Math.floor(chunkSize * 4)

        // Event-driven backpressure: wait for buffer to drain
        if (this.channel.bufferedAmount > bufferThreshold) {
          // Check for stall
          const stallResult = controller.checkStall(this.channel.bufferedAmount)
          if (stallResult === 'fatal') {
            throw new Error('Transfer stalled — connection lost. Try again on a stable network.')
          }

          await new Promise<void>((resolve, reject) => {
            const fallback = setTimeout(() => {
              if (this.channel) this.channel.onbufferedamountlow = null
              if (this.isCancelled) {
                reject(new Error('Transfer cancelled'))
              } else {
                resolve()
              }
            }, 500)
            this.channel!.onbufferedamountlow = () => {
              clearTimeout(fallback)
              if (this.channel) this.channel.onbufferedamountlow = null
              resolve()
            }
          })
        } else {
          // Buffer is draining — clear stall
          controller.checkStall(this.channel.bufferedAmount)
        }

        // Read and send chunk (adaptive size)
        const chunk = file.slice(offset, offset + chunkSize)
        const arrayBuffer = await chunk.arrayBuffer()

        // Send with retry on buffer-full (Chromium throws TypeError if SCTP overflows)
        let sendAttempts = 0
        while (true) {
          try {
            this.channel.send(arrayBuffer)
            break
          } catch {
            sendAttempts++
            if (sendAttempts > 50 || this.isCancelled || this.channel.readyState !== 'open') {
              throw new Error('Transfer failed — send buffer overflow. Try a smaller file or better network.')
            }
            await new Promise<void>(resolve => {
              const t = setTimeout(resolve, 50)
              if (this.channel) {
                this.channel.onbufferedamountlow = () => {
                  clearTimeout(t)
                  if (this.channel) this.channel.onbufferedamountlow = null
                  resolve()
                }
              }
            })
          }
        }

        // Record chunk for adaptive tuning
        controller.recordChunk(arrayBuffer.byteLength)

        // Start speed timer after first chunk is sent
        if (speedStartTime === 0) speedStartTime = Date.now()

        offset += chunkSize
        const bytesTransferred = Math.min(offset, file.size)

        // Throttle progress updates
        const now = Date.now()
        if (now - lastProgressTime >= APP_CONFIG.PROGRESS_THROTTLE_MS || bytesTransferred >= file.size) {
          lastProgressTime = now
          const elapsed = (now - speedStartTime) / 1000
          const instantSpeed = elapsed > 0 ? bytesTransferred / elapsed : 0
          controller.recordSpeed(instantSpeed)
          const speed = controller.getRollingSpeed()
          const eta = speed > 0 ? (file.size - bytesTransferred) / speed : 0

          onProgress({
            bytesTransferred,
            totalBytes: file.size,
            percentage: (bytesTransferred / file.size) * 100,
            speed,
            eta,
            statusMessage: controller.statusMessage || undefined,
          })
        }
      }

      // Check if cancelled before sending completion
      if (this.isCancelled) {
        throw new Error('Transfer cancelled')
      }
      if (this.channel.readyState !== 'open') {
        throw new Error('Receiver disconnected before transfer could finalize.')
      }

      // Send completion signal
      this.channel.send(JSON.stringify({ type: 'complete' }))
    } finally {
      // Restore original handler and clean up
      if (this.channel) {
        this.channel.onmessage = originalOnMessage
        this.channel.onbufferedamountlow = null
      }
    }
  }

  /**
   * Receive file over data channel
   * Uses rolling speed average and statusMessage for enterprise UX
   */
  async receiveFile(onProgress: (progress: ProgressInfo) => void): Promise<Blob> {
    if (!this.channel) {
      throw new Error('Data channel not available — connection was not established.')
    }

    this.isCancelled = false

    return new Promise((resolve, reject) => {
      const chunks: ArrayBuffer[] = []
      let metadata: { name: string; size: number; type: string; totalChunks: number } | null = null
      let bytesReceived = 0
      const startTime = Date.now()
      const TIMEOUT = 10 * 60 * 1000 // 10 minutes timeout for large files
      const speedSamples: number[] = []
      let lastSpeedSampleTime = 0
      let lastSpeedSampleBytes = 0

      let isComplete = false
      let timeoutId: NodeJS.Timeout | null = null

      // Set timeout
      timeoutId = setTimeout(() => {
        if (!isComplete && !this.isCancelled) {
          reject(new Error('File transfer timed out — sender may have disconnected. Try again.'))
        }
      }, TIMEOUT)

      let lastProgressTime = 0
      let completeSignalReceived = false

      // Helper to finalize when all data has arrived
      const finalizeTransfer = () => {
        if (isComplete || this.isCancelled) return
        isComplete = true

        const blob = new Blob(chunks, { type: metadata?.type || 'application/octet-stream' })

        if (metadata && blob.size !== metadata.size) {
          console.warn(`[P2P] Size mismatch. Expected: ${metadata.size}, Received: ${blob.size}`)
        }

        if (timeoutId) clearTimeout(timeoutId)
        resolve(blob)
      }

      this.channel!.onmessage = (event) => {
        // Check if cancelled
        if (this.isCancelled) {
          if (timeoutId) clearTimeout(timeoutId)
          reject(new Error('Transfer cancelled'))
          return
        }

        if (typeof event.data === 'string') {
          try {
            const message = JSON.parse(event.data)

            if (message.type === 'metadata') {
              metadata = message.data
            } else if (message.type === 'cancel') {
              this.peerCancelReceived = true
              this.isCancelled = true
              if (timeoutId) clearTimeout(timeoutId)
              reject(new Error('Sender cancelled the transfer.'))
              return
            } else if (message.type === 'complete') {
              completeSignalReceived = true
              // If all bytes already arrived, finalize immediately
              if (metadata && bytesReceived >= metadata.size) {
                finalizeTransfer()
              }
              // Otherwise, binary handler will finalize when last chunk arrives
            }
          } catch (err) {
            console.error('[P2P] Failed to parse message:', err)
          }
        } else {
          // Binary data (file chunk)
          if (isComplete || this.isCancelled) return

          chunks.push(event.data)
          bytesReceived += event.data.byteLength

          if (metadata) {
            // Throttle progress updates to 10/sec
            const now = Date.now()
            if (now - lastProgressTime >= APP_CONFIG.PROGRESS_THROTTLE_MS || bytesReceived >= metadata.size) {
              lastProgressTime = now

              // Rolling speed (measure over last interval)
              if (lastSpeedSampleTime > 0) {
                const intervalSec = (now - lastSpeedSampleTime) / 1000
                if (intervalSec > 0) {
                  const intervalSpeed = (bytesReceived - lastSpeedSampleBytes) / intervalSec
                  speedSamples.push(intervalSpeed)
                  if (speedSamples.length > 5) speedSamples.shift()
                }
              }
              lastSpeedSampleTime = now
              lastSpeedSampleBytes = bytesReceived

              const speed = speedSamples.length > 0
                ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length
                : (bytesReceived / ((now - startTime) / 1000 || 1))
              const eta = speed > 0 ? (metadata.size - bytesReceived) / speed : 0

              onProgress({
                bytesTransferred: bytesReceived,
                totalBytes: metadata.size,
                percentage: Math.min((bytesReceived / metadata.size) * 100, 100),
                speed,
                eta,
              })
            }

            // Check if all bytes received AND complete signal was sent
            if (completeSignalReceived && bytesReceived >= metadata.size) {
              finalizeTransfer()
            }
          }
        }
      }
      // Replay any messages that were buffered before this handler was installed.
      // On fast local connections, the sender starts transmitting immediately after
      // channel open, and messages can arrive before receiveFile() is called.
      if (this.pendingMessages.length > 0) {
        const buffered = this.pendingMessages.splice(0)
        for (const msg of buffered) {
          this.channel!.onmessage!(msg)
        }
      }

      this.channel!.onerror = (event) => {
        console.error('[P2P] Data channel error:', event)
        if (timeoutId) clearTimeout(timeoutId)
        reject(new Error('Data channel error — transfer failed. Try again.'))
      }

      // Handle channel close unexpectedly
      this.channel!.onclose = () => {
        if (!isComplete && !this.isCancelled) {
          if (timeoutId) clearTimeout(timeoutId)
          // Distinguish: peer sent cancel message vs network drop
          if (this.peerCancelReceived) {
            reject(new Error('Sender cancelled the transfer.'))
          } else {
            reject(new Error('Sender disconnected. Transfer ended.'))
          }
        }
      }
    })
  }

  /**
   * Close connection and cleanup resources (GC optimization)
   */
  close() {
    this.isCancelled = true
    this.peerCancelReceived = false

    if (this.channel) {
      this.channel.onmessage = null
      this.channel.onopen = null
      this.channel.onclose = null
      this.channel.onerror = null
      try { this.channel.close() } catch { }
    }
    this.channel = null

    if (this.pc) {
      this.pc.onicecandidate = null
      this.pc.onconnectionstatechange = null
      this.pc.oniceconnectionstatechange = null
      this.pc.ondatachannel = null
      try { this.pc.close() } catch { }
    }

    this.iceCandidateBuffer = []
    this.isRemoteDescriptionSet = false

    // Clear callbacks to break closure cycles
    this.onChannelOpenCallback = null
    this.onChannelCloseCallback = null
    this.onChannelErrorCallback = null
    this.onConnectionStateChangeCallback = null
  }

  /**
   * Get connection state
   */
  getConnectionState(): RTCPeerConnectionState {
    return this.pc.connectionState
  }
}