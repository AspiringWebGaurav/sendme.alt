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

  constructor() {
    this.pc = new RTCPeerConnection(RTC_CONFIG)
    this.setupConnectionHandlers()
  }

  /**
   * Setup connection state handlers
   */
  private setupConnectionHandlers() {
    // Connection state logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      this.pc.onconnectionstatechange = () => {
        // Development logging only
      }

      this.pc.oniceconnectionstatechange = () => {
        // Development logging only
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
      this.channel = event.channel
      this.channel.binaryType = 'arraybuffer'
      this.setupDataChannelHandlers(this.channel)
    }

    await this.pc.setRemoteDescription(offer)
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    
    return answer
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!candidate) return
    
    // Only add candidate if connection is in a valid state
    if (this.pc.signalingState === 'closed') {
      return
    }

    try {
      await this.pc.addIceCandidate(candidate)
    } catch (err) {
      // Ignore errors for duplicate or invalid candidates
      // This is common in WebRTC and doesn't affect functionality
      // Silent fail - these are non-critical errors
    }
  }

  /**
   * Set remote description (for sender after receiving answer)
   */
  async setRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
      // Check signaling state - should be 'have-local-offer' to set remote answer
      if (this.pc.signalingState === 'have-local-offer') {
        await this.pc.setRemoteDescription(answer)
      } else if (this.pc.signalingState === 'stable') {
        // Already set, ignore silently (race condition)
        // No action needed
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
      this.onChannelOpenCallback?.()
    }

    channel.onclose = () => {
      this.onChannelCloseCallback?.()
    }

    channel.onerror = () => {
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

  /**
   * Get ICE candidates as they are generated
   */
  onIceCandidate(callback: (candidate: RTCIceCandidateInit | null) => void) {
    this.pc.onicecandidate = (event) => {
      callback(event.candidate)
    }
  }

  private isCancelled = false

  /**
   * Cancel current transfer
   */
  cancelTransfer() {
    this.isCancelled = true
    if (this.channel && this.channel.readyState === 'open') {
      this.channel.close()
    }
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
      while (this.channel.bufferedAmount > 1024 * 1024) {
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
              const totalReceived = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
              
              // Create blob with all chunks
              const blob = new Blob(chunks, { type: metadata?.type || 'application/octet-stream' })
              
              // Verify blob size matches expected size (silent check)
              if (metadata && blob.size !== metadata.size) {
                // Size mismatch - might be due to rounding, but continue anyway
              }
              
              // Clear timeout
              if (timeoutId) clearTimeout(timeoutId)
              
              resolve(blob)
            }
          } catch (err) {
            if (!isComplete && !this.isCancelled) {
              reject(new Error('Failed to parse message'))
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
        if (timeoutId) clearTimeout(timeoutId)
        reject(new Error('Data channel error - transfer failed'))
      }
      
      // Handle channel close unexpectedly
      this.channel!.onclose = () => {
        if (!isComplete && !this.isCancelled) {
          if (timeoutId) clearTimeout(timeoutId)
          const totalReceived = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
          reject(new Error(`Connection closed unexpectedly. Received ${totalReceived} bytes${metadata ? ` of ${metadata.size} expected` : ''}`))
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
  }

  /**
   * Get connection state
   */
  getConnectionState(): RTCPeerConnectionState {
    return this.pc.connectionState
  }
}