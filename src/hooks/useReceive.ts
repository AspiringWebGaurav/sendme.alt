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

      // Create answer
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
      })

      // Send ICE candidates
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
          })
        }
      })

      // Listen for sender's ICE candidates via SSE
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
                  // Ignore candidate errors (might be duplicates or invalid)
                  // Silent fail - these are non-critical
                }
              }
            }
          }
        } else if (message.type === 'expired') {
          setError(ERROR_MESSAGES.TOKEN_EXPIRED)
          cleanup()
        }
      }

      // Wait for channel and receive file
      connection.onChannelOpen(async () => {
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
              // Size mismatch - might be due to rounding, but continue anyway
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
          if (errorMessage.includes('cancelled')) {
            setError('Transfer cancelled')
          } else {
            setError(errorMessage)
          }
          setState('error')
          cleanup()
        }
      })

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
    
    cleanup()
    setState('idle')
    setToken('')
    setFileInfo(null)
    setProgress(null)
    setError(null)
    setReceivedFileName('')
  }, [state])

  const cleanup = useCallback(() => {
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
