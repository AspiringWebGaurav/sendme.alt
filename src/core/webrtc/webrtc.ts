/**
 * sendme.alt - WebRTC Core
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { RTC_CONFIG, DATA_CHANNEL_CONFIG, APP_CONFIG } from '../constants'
import type { ProgressInfo } from '@/types'
import { ThroughputController } from './throughput'

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
 private onIceConnectionStateChangeCallback: ((state: RTCIceConnectionState) => void) | null = null

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

 this.onIceConnectionStateChangeCallback?.(state)

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

 channel.onerror = (event: Event) => {
 const errorEvent = event as RTCErrorEvent
 const errorMsg = errorEvent.error?.message || 'Unknown error'
 console.error(`[P2P] Data channel error: ${errorMsg}`, event)
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

 onIceConnectionStateChange(callback: (state: RTCIceConnectionState) => void) {
 this.onIceConnectionStateChangeCallback = callback
 }

 getIceConnectionState(): RTCIceConnectionState {
 return this.pc.iceConnectionState
 }

 getChannelReadyState(): RTCDataChannelState | undefined {
 return this.channel?.readyState
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
    this.iceCandidateBuffer = []
    
    if (this.channel && this.channel.readyState === 'open') {
      try {
        // Send structured cancel with reason so peer knows it was intentional
        // Note: if buffer is full, this may be delayed. We rely on OOB Firebase signaling for instant kill.
        this.channel.send(JSON.stringify({ type: 'cancel', reason: 'user' }))
      } catch {
        // Ignore send error if channel is closing
      }
      this.channel.close()
    }
    setTimeout(() => {
      this.pc.close()
      this.isRemoteDescriptionSet = false
    }, 100)
  }

  /**
   * Instantly abort transfer due to OOB signal or fatal error
   */
  abortTransfer(reason: string) {
    this.isCancelled = true
    this.peerCancelReceived = true
    this.iceCandidateBuffer = []
    
    if (this.channel) {
      this.channel.onmessage = null // Stop processing chunks
      try { this.channel.close() } catch {}
    }
    
    setTimeout(() => {
      this.pc.close()
      this.isRemoteDescriptionSet = false
    }, 10)
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
 // Connection diagnostics
 let connectionType: 'Direct P2P' | 'STUN' | 'TURN' | undefined
 this.getConnectionDiagnostics().then(type => { connectionType = type })

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
        const newLowThreshold = Math.max(Math.floor(chunkSize * 4), Math.floor(bufferThreshold / 2))
        if (this.channel.bufferedAmountLowThreshold !== newLowThreshold) {
          this.channel.bufferedAmountLowThreshold = newLowThreshold
        }
        // Event-driven backpressure: wait for buffer to drain
        if (this.channel.bufferedAmount > bufferThreshold) {
          await new Promise<void>((resolve, reject) => {
            const stallCheckInterval = setInterval(() => {
              if (!this.channel || this.isCancelled || this.channel.readyState !== 'open') {
                clearInterval(stallCheckInterval)
                reject(new Error('Transfer cancelled or connection lost'))
                return
              }
              const stallResult = controller.checkStall(this.channel.bufferedAmount)
              if (stallResult === 'fatal') {
                clearInterval(stallCheckInterval)
                reject(new Error('Transfer stalled — connection lost. Try again on a stable network.'))
              }
            }, 1000)

            this.channel!.onbufferedamountlow = () => {
              clearInterval(stallCheckInterval)
              if (this.channel) {
                this.channel.onbufferedamountlow = null
                controller.checkStall(this.channel.bufferedAmount) // clear stall
              }
              resolve()
            }
          })
        }

        // Read a larger block to minimize await/event-loop overhead
        const readBlockSize = 4 * 1024 * 1024 // 4MB reads
        const blockEnd = Math.min(offset + readBlockSize, file.size)
        const blockBlob = file.slice(offset, blockEnd)
        const blockBuffer = await blockBlob.arrayBuffer()

        // Synchronously slice and send SCTP chunks
        let blockOffset = 0
        while (blockOffset < blockBuffer.byteLength) {
          const chunkEnd = Math.min(blockOffset + chunkSize, blockBuffer.byteLength)
          const arrayBuffer = blockBuffer.slice(blockOffset, chunkEnd)

          // Send with retry on buffer-full (Chromium throws TypeError if SCTP overflows)
          let sendAttempts = 0
          while (true) {
            try {
              this.channel.send(arrayBuffer)
              break
            } catch (e) {
              console.error('[P2P] Send failed:', e)
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

          blockOffset += chunkSize
        }

        offset += blockBuffer.byteLength
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
 connectionType,
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
 const blobs: Blob[] = []
 let currentChunks: ArrayBuffer[] = []
 let currentChunksSize = 0
 const FLUSH_THRESHOLD = 50 * 1024 * 1024 // 50MB
 let metadata: { name: string; size: number; type: string; totalChunks: number } | null = null
 let bytesReceived = 0
 const startTime = Date.now()
 const TIMEOUT = 10 * 60 * 1000 // 10 minutes timeout for large files
 const speedSamples: number[] = []
 let lastSpeedSampleTime = 0
 let lastSpeedSampleBytes = 0

 let isComplete = false
 let timeoutId: NodeJS.Timeout | null = null
 let connectionType: 'Direct P2P' | 'STUN' | 'TURN' | undefined
      
 this.getConnectionDiagnostics().then(type => { connectionType = type })

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

 if (currentChunks.length > 0) {
 blobs.push(new Blob(currentChunks, { type: metadata?.type || 'application/octet-stream' }))
 currentChunks = []
 currentChunksSize = 0
 }
      
 const blob = new Blob(blobs, { type: metadata?.type || 'application/octet-stream' })

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

 currentChunks.push(event.data)
 currentChunksSize += event.data.byteLength
 bytesReceived += event.data.byteLength

 if (currentChunksSize >= FLUSH_THRESHOLD) {
 blobs.push(new Blob(currentChunks, { type: metadata?.type || 'application/octet-stream' }))
 currentChunks = []
 currentChunksSize = 0
 }

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
 connectionType,
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

 this.channel!.onerror = (event: Event) => {
 const errorEvent = event as RTCErrorEvent
 const errorMsg = errorEvent.error?.message || 'Unknown error'
 console.error(`[P2P] Data channel error: ${errorMsg}`, event)
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
 this.onIceConnectionStateChangeCallback = null
 }

 /**
 * Get connection state
 */
 getConnectionState(): RTCPeerConnectionState {
 return this.pc.connectionState
 }

 /**
 * Determine connection routing type based on active ICE candidate pair
 */
 async getConnectionDiagnostics(): Promise<'Direct P2P' | 'STUN' | 'TURN' | undefined> {
 if (!this.pc) return undefined
 try {
 const stats = await this.pc.getStats()
 let activeCandidatePair: any = null

 stats.forEach(report => {
 if (report.type === 'candidate-pair' && report.state === 'succeeded') {
 // If there are multiple succeeded pairs, use the nominated one or highest priority
 if (!activeCandidatePair || report.nominated) {
 activeCandidatePair = report
 }
 }
 })

 if (activeCandidatePair) {
 const remoteCandidate = stats.get(activeCandidatePair.remoteCandidateId)
 if (remoteCandidate) {
 if (remoteCandidate.candidateType === 'relay') return 'TURN'
 if (remoteCandidate.candidateType === 'srflx') return 'STUN'
 if (remoteCandidate.candidateType === 'host' || remoteCandidate.candidateType === 'prflx') return 'Direct P2P'
 }
 }
 } catch {
 // Ignore errors
 }
 return undefined
 }
}