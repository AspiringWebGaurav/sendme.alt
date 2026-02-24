/**
 * sendme.alt - Send Hook
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { P2PConnection } from '@/lib/webrtc'
import { copyToClipboard } from '@/lib/transfer'
import { API_ENDPOINTS, APP_CONFIG, ERROR_MESSAGES } from '@/lib/constants'
import type { TransferState, FileInfo, ProgressInfo } from '@/types'
import { useNotification } from '@/contexts/NotificationContext'

export function useSend() {
  const { addNotification } = useNotification()
  const [state, setState] = useState<TransferState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingToken, setIsGeneratingToken] = useState<boolean>(false)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  const connectionRef = useRef<P2PConnection | null>(null)
  const sseRef = useRef<EventSource | null>(null)
  const processedCandidatesRef = useRef<Set<string>>(new Set())
  const answerSetRef = useRef<boolean>(false)
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
    answerSetRef.current = false

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

  const selectFile = useCallback((selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > APP_CONFIG.MAX_FILE_SIZE) {
      addNotification(ERROR_MESSAGES.FILE_TOO_LARGE, 'error')
      setError(ERROR_MESSAGES.FILE_TOO_LARGE)
      return
    }

    setFile(selectedFile)
    setError(null)
  }, [addNotification])

  const startSending = useCallback(async () => {
    if (!file) return

    try {
      setState('connecting')
      setIsGeneratingToken(true)
      setError(null)

      // Create WebRTC connection
      const connection = new P2PConnection()
      connectionRef.current = connection

      // Handle connection state changes for better UX
      connection.onConnectionStateChange((state) => {
        if (state === 'failed') {
          addNotification('Connection failed — peer network blocked.', 'error')
          setError('Connection failed — your network may be blocking peer connections. Try a different network or disable VPN.')
          setState('error')
        } else if (state === 'connected') {
          // Connection established
        }
      })

      // Register ICE candidate handler BEFORE creating offer to not miss early candidates
      let createdToken: string | null = null
      const earlyIceCandidates: RTCIceCandidateInit[] = []

      connection.onIceCandidate((candidate) => {
        if (candidate) {
          if (createdToken) {
            // Token exists, trickle candidate immediately to signal server
            fetch(API_ENDPOINTS.SIGNAL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: createdToken,
                type: 'ice',
                data: candidate,
                role: 'sender',
              }),
            }).catch(console.error)
          } else {
            // Buffer early candidates before token is created
            earlyIceCandidates.push(candidate)
          }
        }
      })

      // Create offer (this starts ICE gathering immediately)
      const offer = await connection.createOffer()

      // Create session
      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
      }

      const response = await fetch(API_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer, fileInfo }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Failed to create session'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create session')
      }

      if (!data.token) {
        throw new Error('Token not received from server')
      }

      createdToken = data.token
      setToken(data.token)
      activeTokenRef.current = data.token // Set activeTokenRef here
      setIsGeneratingToken(false)
      setState('waiting')

      // Send buffered early ICE candidates that gathered before session creation
      for (const candidate of earlyIceCandidates) {
        await fetch(API_ENDPOINTS.SIGNAL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: data.token,
            type: 'ice',
            data: candidate,
            role: 'sender',
          }),
        }).catch(console.error)
      }

      // Listen for answer and receiver's ICE candidates via SSE
      const eventSource = new EventSource(
        `${API_ENDPOINTS.LISTEN}?token=${data.token}&role=sender`
      )
      sseRef.current = eventSource

      eventSource.onmessage = async (event) => {
        const message = JSON.parse(event.data)

        if (message.type === 'update') {
          // Set remote answer (only once, when in correct signaling state)
          if (message.answer && !answerSetRef.current) {
            try {
              await connection.setRemoteAnswer(message.answer)
              answerSetRef.current = true
            } catch (err) {
              // If answer already set or state wrong, that's okay (race condition)
              answerSetRef.current = true // Mark as set to prevent retries
            }
          }

          // Add receiver's ICE candidates
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

      // Wait for channel to open
      connection.onChannelOpen(async () => {
        if (channelTimeoutRef.current) {
          clearTimeout(channelTimeoutRef.current)
          channelTimeoutRef.current = null
        }
        setState('transferring')

        try {
          await connection.sendFile(file, (progressInfo) => {
            setProgress(progressInfo)
          })

          setState('complete')
          addNotification('Transfer complete!', 'success')

          // Keep the WebRTC connection alive for a few seconds after completion.
          // The receiver may still be processing buffered SCTP chunks that haven't
          // arrived yet. If we clean up Firebase/SSE immediately, the peer connection
          // can be torn down before the receiver processes all data.
          await new Promise(resolve => setTimeout(resolve, 3000))

          // Transfer complete — no longer need Firebase signaling room
          if (activeTokenRef.current) {
            fetch('/api/cleanup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: activeTokenRef.current })
            }).catch(() => { })
            activeTokenRef.current = null
          }

          // cleanup called by user action or timeout
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TRANSFER_FAILED

          // UI Protocol Mapping V4
          if (connection.peerCancelReceived) {
            addNotification('Receiver cancelled the transfer.', 'warning')
            setError('Receiver cancelled the transfer.')
            setState('error')
          } else if (connection.isCancelled || errorMessage.toLowerCase().includes('cancelled')) {
            // Already handled by local cancel() call via addNotification
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

      // Set a timeout for connection establishment
      channelTimeoutRef.current = setTimeout(() => {
        if (connectionRef.current?.getConnectionState() !== 'connected') {
          addNotification('Connection timed out.', 'error')
          setError('Connection timed out — your firewall or NAT is blocking the peer connection. Try a different network.')
          setState('error')
          cleanup()
        }
      }, 180000) // 3 minutes timeout

      connection.onChannelError((err) => {
        addNotification(err.message, 'error')
        setError(err.message)
        setState('error')
      })

    } catch (err) {
      const msg = (err as Error).message || ERROR_MESSAGES.CONNECTION_FAILED
      addNotification(msg, 'error')
      setError(msg)
      setState('error')
      setIsGeneratingToken(false)
    }
  }, [file])

  const removeFile = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  const cancel = useCallback(() => {
    // Determine if we are actively cancelling a mid-flight transfer to toast
    const isMidFlight = state === 'transferring' || state === 'waiting' || state === 'connecting'

    if (connectionRef.current && isMidFlight) {
      try {
        connectionRef.current.cancelTransfer()
      } catch (err) { }
      addNotification('You cancelled the transfer.', 'info')
    }

    // Reset UI state atomically — progress first, then state
    setProgress(null)
    setError(null)
    setIsGeneratingToken(false)
    setCopySuccess(false)
    setFile(null)
    setToken(null)

    // Delay state reset to `idle` until after cancel message is sent + cleanup
    setTimeout(() => {
      cleanup()
      setState('idle')
    }, 250)
  }, [state, cleanup, addNotification])

  const handleCopyToken = useCallback(async (token: string) => {
    try {
      const success = await copyToClipboard(token)
      if (success) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (err) {
      // Silent fail
    }
  }, [])

  return {
    state,
    file,
    token,
    progress,
    error,
    isGeneratingToken,
    copySuccess,
    selectFile,
    startSending,
    cancel,
    removeFile,
    handleCopyToken,
  }
}
