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

export function useSend() {
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

  const selectFile = useCallback((selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > APP_CONFIG.MAX_FILE_SIZE) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE)
      return
    }

    setFile(selectedFile)
    setError(null)
  }, [])

  const startSending = useCallback(async () => {
    if (!file) return

    try {
      setState('connecting')
      setIsGeneratingToken(true)
      setError(null)

      // Create WebRTC connection
      const connection = new P2PConnection()
      connectionRef.current = connection

      // Create offer
      const offer = await connection.createOffer()

      // Collect ICE candidates
      const iceCandidates: RTCIceCandidateInit[] = []
      
      connection.onIceCandidate((candidate) => {
        if (candidate) {
          iceCandidates.push(candidate)
        }
      })

      // Wait a bit for ICE gathering
      await new Promise(resolve => setTimeout(resolve, 1000))

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

      setToken(data.token)
      setIsGeneratingToken(false)
      setState('waiting')

      // Send initial ICE candidates
      for (const candidate of iceCandidates) {
        await fetch(API_ENDPOINTS.SIGNAL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: data.token,
            type: 'ice',
            data: candidate,
            role: 'sender',
          }),
        })
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

      // Wait for channel to open
      connection.onChannelOpen(async () => {
        setState('transferring')
        
        try {
          await connection.sendFile(file, (progressInfo) => {
            setProgress(progressInfo)
          })
          
          setState('complete')
          setTimeout(() => cleanup(), 3000)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TRANSFER_FAILED
          if (errorMessage.includes('cancelled')) {
            setError('Transfer cancelled')
          } else {
            setError(ERROR_MESSAGES.TRANSFER_FAILED)
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
      setIsGeneratingToken(false)
    }
  }, [file])

  const removeFile = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  const cancel = useCallback(() => {
    // Cancel active transfer if in progress
    if (connectionRef.current && (state === 'transferring' || state === 'waiting')) {
      try {
        connectionRef.current.cancelTransfer()
      } catch (err) {
        // Ignore errors during cancellation
      }
    }
    
    cleanup()
    setState('idle')
    setFile(null)
    setToken(null)
    setProgress(null)
    setError(null)
    setIsGeneratingToken(false)
    setCopySuccess(false)
  }, [state])

  const handleCopyToken = useCallback(async (token: string) => {
    try {
      const success = await copyToClipboard(token)
      if (success) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (err) {
      // Silent fail - user can try again
    }
  }, [])

  const cleanup = useCallback(() => {
    sseRef.current?.close()
    sseRef.current = null
    connectionRef.current?.close()
    connectionRef.current = null
    processedCandidatesRef.current.clear()
    answerSetRef.current = false
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
