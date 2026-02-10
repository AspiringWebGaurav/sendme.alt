/**
 * sendme.alt - WebRTC Core
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { RTC_CONFIG, DATA_CHANNEL_CONFIG, APP_CONFIG } from './constants'
import type { ProgressInfo } from '@/types'

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

  private isCancelled = false

  /**
   * Cancel current transfer and notify peer
   */
  cancelTransfer() {
    this.isCancelled = true
    if (this.channel && this.channel.readyState === 'open') {
      try {
        this.channel.send(JSON.stringify({ type: 'cancel' }))
      } catch (err) {
        // Ignore send error if channel is closing
      }
      this.channel.close()
    }
    // Don't close PC immediately to allow cancel message to send? 
    // Actually standard practice is to close. Peer will see 'close' event anyway.
    // But specific 'cancel' message is better for UI.
    // We'll trust the 'close' event as backup, but try to send 'cancel' first.
    setTimeout(() => {
      this.pc.close()
      this.iceCandidateBuffer = []
      this.isRemoteDescriptionSet = false
    }, 100)
  }

  /**
   * Send file over data channel
   */
  async sendFile(file: File, onProgress: (progress: ProgressInfo) => void): Promise<void> {
    if (!this.channel || this.channel.readyState !== 'open') {
      throw new Error('Data channel not open')
    }

    this.isCancelled = false
    const CHUNK_SIZE = APP_CONFIG.CHUNK_SIZE
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    let chunksSent = 0
    const startTime = Date.now()

    // Setup listener for cancel message from receiver during transfer
    const originalOnMessage = this.channel.onmessage
    this.channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'cancel') {
            this.isCancelled = true
            throw new Error('Transfer cancelled by receiver')
          }
        } catch (e) {
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
        totalChunks,
      }
      this.channel.send(JSON.stringify({ type: 'metadata', data: metadata }))

      // Send file in chunks
      for (let offset = 0; offset < file.size; offset += CHUNK_SIZE) {
        // Check if cancelled
        if (this.isCancelled || this.channel.readyState !== 'open') {
          throw new Error('Transfer cancelled')
        }

        // Wait if buffer is full (backpressure)
        while (this.channel.bufferedAmount > APP_CONFIG.BUFFER_THRESHOLD) {
          if (this.isCancelled) {
            throw new Error('Transfer cancelled')
          }
          await new Promise(resolve => setTimeout(resolve, 10))
        }

        const chunk = file.slice(offset, offset + CHUNK_SIZE)
        const arrayBuffer = await chunk.arrayBuffer()
        this.channel.send(arrayBuffer)

        chunksSent++
        const bytesTransferred = Math.min(offset + CHUNK_SIZE, file.size)
        const elapsed = (Date.now() - startTime) / 1000
        const speed = bytesTransferred / elapsed
        const eta = (file.size - bytesTransferred) / speed

        onProgress({
          bytesTransferred,
          totalBytes: file.size,
          percentage: (bytesTransferred / file.size) * 100,
          speed,
          eta,
        })
      }

      // Check if cancelled before sending completion
      if (this.isCancelled || this.channel.readyState !== 'open') {
        throw new Error('Transfer cancelled')
      }

      // Send completion signal
      this.channel.send(JSON.stringify({ type: 'complete' }))
    } finally {
      // Restore original handler
      this.channel.onmessage = originalOnMessage
    }
  }

  /**
   * Receive file over data channel
   */
  async receiveFile(onProgress: (progress: ProgressInfo) => void): Promise<Blob> {
    if (!this.channel) {
      throw new Error('Data channel not available')
    }

    this.isCancelled = false

    return new Promise((resolve, reject) => {
      const chunks: ArrayBuffer[] = []
      let metadata: { name: string; size: number; type: string; totalChunks: number } | null = null
      let bytesReceived = 0
      const startTime = Date.now()
      const TIMEOUT = 10 * 60 * 1000 // 10 minutes timeout for large files

      let isComplete = false
      let timeoutId: NodeJS.Timeout | null = null

      // Set timeout
      timeoutId = setTimeout(() => {
        if (!isComplete && !this.isCancelled) {
          reject(new Error('File transfer timeout - connection may have been lost'))
        }
      }, TIMEOUT)

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
            } else if (message.type === 'complete') {
              if (isComplete || this.isCancelled) return // Prevent duplicate completion or cancelled
              isComplete = true

              // Verify we received all data
              // const totalReceived = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0) // Optimization: use bytesReceived

              // Create blob with all chunks
              const blob = new Blob(chunks, { type: metadata?.type || 'application/octet-stream' })

              // Verify blob size matches expected size (silent check)
              if (metadata && blob.size !== metadata.size) {
                console.warn(`[P2P] Size mismatch. Expected: ${metadata.size}, Received: ${blob.size}`)
              }

              // Clear timeout
              if (timeoutId) clearTimeout(timeoutId)

              resolve(blob)
            }
          } catch (err) {
            console.error('[P2P] Failed to parse message:', err)
            if (!isComplete && !this.isCancelled) {
              // Don't reject for simple parsing errors if transfer is ongoing
            }
          }
        } else {
          // Binary data (file chunk)
          if (isComplete || this.isCancelled) {
            // Ignore data after completion signal or if cancelled
            return
          }

          chunks.push(event.data)
          bytesReceived += event.data.byteLength

          if (metadata) {
            const elapsed = (Date.now() - startTime) / 1000
            const speed = bytesReceived / elapsed
            const eta = (metadata.size - bytesReceived) / speed

            onProgress({
              bytesTransferred: bytesReceived,
              totalBytes: metadata.size,
              percentage: Math.min((bytesReceived / metadata.size) * 100, 100),
              speed,
              eta,
            })
          }
        }
      }

      this.channel!.onerror = (event) => {
        console.error('[P2P] Data channel error:', event)
        if (timeoutId) clearTimeout(timeoutId)
        reject(new Error('Data channel error - transfer failed'))
      }

      // Handle channel close unexpectedly
      this.channel!.onclose = () => {
        if (!isComplete && !this.isCancelled) {
          if (timeoutId) clearTimeout(timeoutId)
          reject(new Error('Connection closed unexpectedly'))
        }
      }
    })
  }

  /**
   * Close connection and cleanup
   */
  close() {
    this.isCancelled = true
    this.channel?.close()
    this.pc.close()
    this.iceCandidateBuffer = []
    this.isRemoteDescriptionSet = false
  }

  /**
   * Get connection state
   */
  getConnectionState(): RTCPeerConnectionState {
    return this.pc.connectionState
  }
}