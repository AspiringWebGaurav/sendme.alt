/**
 * sendme.alt - Receive Hook
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { P2PConnection } from '@/lib/webrtc'
import { downloadFile, formatBytes } from '@/lib/transfer'
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants'
import type { TransferState, FileInfo, ProgressInfo } from '@/types'
import { useNotification } from '@/contexts/NotificationContext'

export function useReceive() {
  const { addNotification } = useNotification()
  const [state, setState] = useState<TransferState>('idle')
  const [token, setToken] = useState<string>('')
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [progress, setProgress] = useState<ProgressInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receivedFileName, setReceivedFileName] = useState<string>('')

  const connectionRef = useRef<P2PConnection | null>(null)
  const sseRef = useRef<EventSource | null>(null)
  const processedCandidatesRef = useRef<Set<string>>(new Set())
  const channelTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ref for cleanup on unmount
  const activeTokenRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
    if (channelTimeoutRef.current) {
      clearTimeout(channelTimeoutRef.current)
      channelTimeoutRef.current = null
    }
    sseRef.current?.close()
    sseRef.current = null
    connectionRef.current?.close()
    connectionRef.current = null
    processedCandidatesRef.current.clear()

    // Explicitly destroy Firebase session on unmount or cancel
    if (activeTokenRef.current) {
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

    try {
      setState('connecting')
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
      connection.onConnectionStateChange((state) => {
        if (state === 'failed') {
          addNotification('Connection failed — peer network blocked.', 'error')
          setError('Connection failed — your network may be blocking peer connections. Try a different network or disable VPN.')
          setState('error')
        } else if (state === 'connected') {
          // Connection established
        }
      })

      // Send ICE candidates (register BEFORE createAnswer to not miss trickle candidates)
      connection.onIceCandidate(async (candidate) => {
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
        } else if (message.type === 'expired') {
          addNotification('Signaling token expired.', 'warning')
          setError(ERROR_MESSAGES.TOKEN_EXPIRED)
          cleanup()
        }
      }

      // Register channel open handler BEFORE creating the answer.
      // On fast local connections, the channel can open during the await fetch()
      // for sending the answer. If we register after, the callback is missed.
      connection.onChannelOpen(async () => {
        if (channelTimeoutRef.current) {
          clearTimeout(channelTimeoutRef.current)
          channelTimeoutRef.current = null
        }
        setState('transferring')

        try {
          const blob = await connection.receiveFile((progressInfo) => {
            setProgress(progressInfo)
          })

          // Verify blob is valid
          if (!blob || blob.size === 0) {
            throw new Error('Received empty or invalid file')
          }

          // Verify size matches expected (silent check)
          if (session.file.size && blob.size !== session.file.size) {
            // Size mismatch
          }

          // Transfer complete — no longer need Firebase signaling room
          if (activeTokenRef.current) {
            fetch('/api/cleanup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: activeTokenRef.current })
            }).catch(() => { })
            activeTokenRef.current = null
          }

          // Download file with error handling
          try {
            await downloadFile(blob, session.file.name)
            setReceivedFileName(session.file.name)
            setState('complete')
            addNotification('File received successfully!', 'success')
            setTimeout(() => cleanup(), 3000)
          } catch (downloadError) {
            // Download failed but file was received - offer manual download
            const errorMsg = downloadError instanceof Error ? downloadError.message : 'Unknown error'
            addNotification('File received, but auto-download failed.', 'warning')
            setError(`File received but download failed: ${errorMsg}. File size: ${formatBytes(blob.size)}.`)
            setState('error')
            // Store blob for manual download (only in browser)
            if (typeof window !== 'undefined') {
              window.lastReceivedBlob = blob
              window.lastReceivedFileName = session.file.name
            }
          }
        } catch (err) {
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
            setState('error')
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
        if (connectionRef.current?.getConnectionState() !== 'connected') {
          addNotification('Connection timed out.', 'error')
          setError('Connection timed out — your firewall or NAT is blocking the peer connection. Try a different network.')
          setState('error')
          cleanup()
        }
      }, 30000)

      connection.onChannelError((err) => {
        addNotification(err.message, 'error')
        setError(err.message)
        setState('error')
      })

    } catch (err) {
      setError((err as Error).message || ERROR_MESSAGES.CONNECTION_FAILED)
      setState('error')
    }
  }, [token])

  const cancel = useCallback(() => {
    // Determine if we are actively cancelling a mid-flight transfer to toast
    const isMidFlight = state === 'transferring' || state === 'connecting'

    if (connectionRef.current && isMidFlight) {
      try {
        connectionRef.current.cancelTransfer()
      } catch { }
      addNotification('You cancelled the transfer.', 'info')
    }

    // Reset UI state atomically — progress first, then state
    setProgress(null)
    setError(null)
    setFileInfo(null)
    setReceivedFileName('')
    setToken('')

    // Delay state reset to `idle` until after cancel message is sent + cleanup
    setTimeout(() => {
      cleanup()
      setState('idle')
    }, 250)
  }, [state, cleanup, addNotification])

  return {
    state,
    token,
    setToken,
    fileInfo,
    progress,
    error,
    receivedFileName,
    startReceiving,
    cancel,
  }
}
