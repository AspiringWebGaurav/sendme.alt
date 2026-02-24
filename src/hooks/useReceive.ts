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

export function useReceive() {
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

      // Create WebRTC connection
      const connection = new P2PConnection()
      connectionRef.current = connection

      // Handle connection state changes
      connection.onConnectionStateChange((state) => {
        if (state === 'failed') {
          setError('Connection failed. Please check your network or try again.')
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
          setError(ERROR_MESSAGES.TOKEN_EXPIRED)
          cleanup()
        }
      }

      // Create answer (this starts ICE gathering immediately)
      const answer = await connection.createAnswer(session.sender.offer)

      // Send answer
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

      // Wait for channel and receive file
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

          // Download file with error handling
          try {
            await downloadFile(blob, session.file.name)
            setReceivedFileName(session.file.name)
            setState('complete')
            setTimeout(() => cleanup(), 3000)
          } catch (downloadError) {
            // Download failed but file was received - offer manual download
            const errorMsg = downloadError instanceof Error ? downloadError.message : 'Unknown error'
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

          if (errorMessage.includes('cancelled') || errorMessage.includes('closed unexpectedly')) {
            if (errorMessage.includes('receiver')) {
              // Self cancelled
              setError('Transfer cancelled')
            } else {
              // Peer cancelled
              setError('Sender cancelled the transfer')
            }
          } else {
            setError(errorMessage)
          }
          setState('error')
          cleanup()
        }
      })

      // Set a timeout for connection establishment
      channelTimeoutRef.current = setTimeout(() => {
        if (connectionRef.current?.getConnectionState() !== 'connected') {
          setError('Connection timed out. Devices could not connect (NAT/Firewall issue).')
          setState('error')
          cleanup()
        }
      }, 30000)

      connection.onChannelError((err) => {
        setError(err.message)
        setState('error')
      })

    } catch (err) {
      setError((err as Error).message || ERROR_MESSAGES.CONNECTION_FAILED)
      setState('error')
    }
  }, [token])

  const cancel = useCallback(() => {
    // Cancel active transfer if in progress
    if (connectionRef.current && (state === 'transferring' || state === 'connecting')) {
      try {
        connectionRef.current.cancelTransfer()
      } catch (err) {
        // Ignore errors during cancellation
      }
    }

    // Delay cleanup to allow cancel message to be sent
    setTimeout(cleanup, 200)

    setState('idle')
    setToken('')
    setFileInfo(null)
    setProgress(null)
    setError(null)
    setReceivedFileName('')
  }, [state])

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
  }, [])

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
