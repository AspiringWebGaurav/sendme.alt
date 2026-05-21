/**
 * sendme.alt - Receive Hook
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { P2PConnection } from '@/core/webrtc/webrtc'
import { downloadFile, formatBytes } from '@/core/webrtc/transfer'
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/core/constants'
import type { TransferState, FileInfo, ProgressInfo } from '@/types'
import { useNotification } from '@/state/NotificationContext'

export function useReceive() {
 const { addNotification } = useNotification()
 const [state, setState] = useState<TransferState>('idle')
 const [token, setToken] = useState<string>('')
 const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
 const [progress, setProgress] = useState<ProgressInfo | null>(null)
 const [error, setError] = useState<string | null>(null)
 const [receivedFileName, setReceivedFileName] = useState<string>('')
 const [receivedBlob, setReceivedBlob] = useState<Blob | null>(null)

 const connectionRef = useRef<P2PConnection | null>(null)
 const sseRef = useRef<EventSource | null>(null)
 const processedCandidatesRef = useRef<Set<string>>(new Set())
 const channelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
 const generationRef = useRef<number>(0)
 const isTerminalRef = useRef<boolean>(false)
 const stateRef = useRef<TransferState>('idle')
 const isPassiveModeRef = useRef<boolean>(false)

 const setSafeState = useCallback((newState: TransferState) => {
 stateRef.current = newState
 setState(newState)
 }, [])

 // Ref for cleanup on unmount
 const activeTokenRef = useRef<string | null>(null)

 const cleanup = useCallback(() => {
 generationRef.current++
 if (channelTimeoutRef.current) {
 clearTimeout(channelTimeoutRef.current)
 channelTimeoutRef.current = null
 }
 sseRef.current?.close()
 sseRef.current = null
 connectionRef.current?.close()
 connectionRef.current = null
 processedCandidatesRef.current.clear()

 // Explicitly destroy Firebase session on unmount or cancel if not terminal
 if (activeTokenRef.current && !isTerminalRef.current) {
 if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
 navigator.sendBeacon('/api/cleanup', JSON.stringify({ token: activeTokenRef.current }))
 } else {
 fetch('/api/cleanup', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ token: activeTokenRef.current }),
 keepalive: true
 }).catch(() => { })
 }
 activeTokenRef.current = null
 }
 }, [])

 const startReceiving = useCallback(async () => {
 if (!token.trim()) return

 const currentGeneration = ++generationRef.current
 isTerminalRef.current = false
 isPassiveModeRef.current = false

 try {
 setSafeState('connecting')
 setError(null)

 // Validate token
 const normalizedToken = token.trim().toLowerCase()

 if (!normalizedToken) {
 throw new Error('Please enter a token')
 }

 const validateResponse = await fetch(API_ENDPOINTS.VALIDATE, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ token: normalizedToken }),
 })

 if (!validateResponse.ok) {
 const errorText = await validateResponse.text()
 let errorMessage = 'Failed to validate token'
 try {
 const errorData = JSON.parse(errorText)
 errorMessage = errorData.error || errorMessage
 } catch {
 errorMessage = `Server error: ${validateResponse.status} ${validateResponse.statusText}`
 }
 throw new Error(errorMessage)
 }

 const validateData = await validateResponse.json()

 if (!validateData.valid) {
 throw new Error(validateData.error || ERROR_MESSAGES.TOKEN_INVALID)
 }

 const session = validateData.session
 setFileInfo(session.file)
 activeTokenRef.current = normalizedToken

 // Create WebRTC connection
 const connection = new P2PConnection()
 connectionRef.current = connection

 // Handle connection state changes
 connection.onConnectionStateChange((state: RTCPeerConnectionState) => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 if (state === 'failed') {
 isTerminalRef.current = true
 addNotification('Connection failed — peer network blocked.', 'error')
 setError('Connection failed — your network may be blocking peer connections. Try a different network or disable VPN.')
 setSafeState('error')
 } else if (state === 'connected') {
 // Connection established
 }
 })

 // Add ICE connection state change listener for advanced passive mode trigger
 connection.onIceConnectionStateChange((pcState) => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 const channelState = connectionRef.current?.getChannelReadyState()
 if (channelState === 'open' && (pcState === 'connected' || pcState === 'completed')) {
 isPassiveModeRef.current = true
 }
 })

 // Send ICE candidates (register BEFORE createAnswer to not miss trickle candidates)
 connection.onIceCandidate(async (candidate: RTCIceCandidateInit | null) => {
 if (candidate) {
 await fetch(API_ENDPOINTS.SIGNAL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 token: token.trim().toLowerCase(),
 type: 'ice',
 data: candidate,
 role: 'receiver',
 }),
 }).catch(console.error)
 }
 })

 // Listen for sender's ICE candidates via SSE BEFORE sending answer
 // to ensure we don't miss any generated immediately after sender receives answer
 const eventSource = new EventSource(
 `${API_ENDPOINTS.LISTEN}?token=${token.trim().toLowerCase()}&role=receiver`
 )
 sseRef.current = eventSource

 eventSource.onmessage = async (event) => {
 if (generationRef.current !== currentGeneration) return

 const message = JSON.parse(event.data)

 if (message.type === 'update') {
 // Add sender's ICE candidates
 if (message.candidates) {
 for (const candidate of message.candidates) {
 const key = JSON.stringify(candidate)
 if (!processedCandidatesRef.current.has(key)) {
 processedCandidatesRef.current.add(key)
 try {
 await connection.addIceCandidate(candidate)
 } catch (err) {
 // Ignore candidate errors
 }
 }
 }
 }
 } else if (message.type === 'cancel') {
      // Out-Of-Band Cancellation received from peer
      if (isTerminalRef.current) return
      isTerminalRef.current = true

      addNotification('Sender cancelled the transfer.', 'error')
      try { connection.abortTransfer('Sender cancelled the transfer.') } catch (e) {}

      cleanup()
      setProgress(null)
      setError(null)
      setFileInfo(null)
      setReceivedFileName('')
      setReceivedBlob(null)
      setToken('')
      setSafeState('idle')
    } else if (message.type === 'expired') {
      // Passive signaling mode guard
      if (isTerminalRef.current || isPassiveModeRef.current || sseRef.current !== eventSource) {
        return
      }
      isTerminalRef.current = true
      addNotification('Signaling token expired.', 'warning')
      setError(ERROR_MESSAGES.TOKEN_EXPIRED)
      setSafeState('error')
      cleanup()
    }
 }

 // Register channel open handler BEFORE creating the answer.
 // On fast local connections, the channel can open during the await fetch()
 // for sending the answer. If we register after, the callback is missed.
 connection.onChannelOpen(async () => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 
 // Advanced passive mode trigger evaluation
 const pcState = connectionRef.current?.getIceConnectionState()
 if (pcState === 'connected' || pcState === 'completed') {
 isPassiveModeRef.current = true
 }

 if (channelTimeoutRef.current) {
 clearTimeout(channelTimeoutRef.current)
 channelTimeoutRef.current = null
 }
 setSafeState('transferring')

 try {
 const blob = await connection.receiveFile((progressInfo: ProgressInfo) => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 setProgress(progressInfo)
 })

 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 isTerminalRef.current = true

 // Verify blob is valid
 if (!blob || blob.size === 0) {
 throw new Error('Received empty or invalid file')
 }

 // Verify size matches expected (silent check)
 if (session.file.size && blob.size !== session.file.size) {
 // Size mismatch
 }

 // Removed aggressive POST /api/cleanup. Relying on TTL.
 
 // Store blob for user-initiated save
 setReceivedBlob(blob)
 setReceivedFileName(session.file.name)
 setSafeState('complete')
 addNotification('File received! Tap Save File to download.', 'success')
 } catch (err) {
 if (generationRef.current !== currentGeneration) return
 isTerminalRef.current = true
 const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TRANSFER_FAILED

 // UI Protocol Mapping V4
 if (connection.peerCancelReceived) {
 addNotification('Sender cancelled the transfer.', 'warning')
 setError('Sender cancelled the transfer.')
 setState('error')
 } else if (connection.isCancelled || errorMessage.toLowerCase().includes('cancelled')) {
 // Already handled by local cancel() via addNotification
 } else if (errorMessage.toLowerCase().includes('disconnected') || errorMessage.toLowerCase().includes('closed')) {
 addNotification('Peer disconnected.', 'error')
 setError('Peer disconnected.')
 setState('error')
 } else {
 addNotification(errorMessage || ERROR_MESSAGES.TRANSFER_FAILED, 'error')
 setError(errorMessage || ERROR_MESSAGES.TRANSFER_FAILED)
 setSafeState('error')
 }
 cleanup()
 }
 })

 // Create answer AFTER registering onChannelOpen, so the callback is
 // ready when the channel opens (which can happen during the fetch below).
 const answer = await connection.createAnswer(session.sender.offer)

 // Send answer to signaling server
 await fetch(API_ENDPOINTS.SIGNAL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 token: token.trim().toLowerCase(),
 type: 'answer',
 data: answer,
 role: 'receiver',
 }),
 }).catch((err) => {
 console.error('[P2P] Failed to send answer:', err)
 throw new Error('Failed to signal answer to peer server')
 })

 // Set a timeout for connection establishment
 channelTimeoutRef.current = setTimeout(() => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 if (connectionRef.current?.getConnectionState() !== 'connected') {
 isTerminalRef.current = true
 addNotification('Connection timed out.', 'error')
 setError('Connection timed out — your firewall or NAT is blocking the peer connection. Try a different network.')
 setSafeState('error')
 cleanup()
 }
 }, 180000) // 3 minutes timeout

 connection.onChannelError((err: Error) => {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 isTerminalRef.current = true
 addNotification(err.message, 'error')
 setError(err.message)
 setSafeState('error')
 })

 } catch (err) {
 if (generationRef.current !== currentGeneration || isTerminalRef.current) return
 isTerminalRef.current = true
 setError((err as Error).message || ERROR_MESSAGES.CONNECTION_FAILED)
 setSafeState('error')
 }
 }, [token, addNotification, cleanup])

  const cancel = useCallback(() => {
    // Determine if we are actively cancelling a mid-flight transfer to toast
    const currentState = stateRef.current
    const isMidFlight = currentState === 'transferring' || currentState === 'connecting'

    if (connectionRef.current && isMidFlight) {
      try {
        connectionRef.current.cancelTransfer()
      } catch { }
      addNotification('You cancelled the transfer.', 'info')
    }

    // Out-Of-Band cancellation via Firebase
    if (token) {
      fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim().toLowerCase(), type: 'cancel', role: 'receiver' })
      }).catch(() => {})
    }

    // Reset UI state atomically — progress first, then state
    setProgress(null)
    setError(null)
    setFileInfo(null)
    setReceivedFileName('')
    setReceivedBlob(null)
    setToken('')

    // Delay state reset to `idle` until after cancel message is sent + cleanup
    setTimeout(() => {
      cleanup()
      setSafeState('idle')
    }, 1000)
  }, [token, cleanup, addNotification, setSafeState])

 return {
 state,
 token,
 setToken,
 fileInfo,
 progress,
 error,
 receivedFileName,
 receivedBlob,
 startReceiving,
 cancel,
 }
}
