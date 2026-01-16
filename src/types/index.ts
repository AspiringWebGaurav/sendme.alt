/**
 * sendme.alt
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

// Transfer States
export type TransferState = 'idle' | 'waiting' | 'connecting' | 'transferring' | 'complete' | 'error'

// File Information
export interface FileInfo {
  name: string
  size: number
  type: string
}

// Progress Information
export interface ProgressInfo {
  bytesTransferred: number
  totalBytes: number
  percentage: number
  speed: number // bytes per second
  eta: number // seconds remaining
}

// Session Data (stored in Firebase)
export interface SessionData {
  createdAt: number
  expiresAt: number
  status: 'waiting' | 'connected' | 'complete'
  file: FileInfo
  sender: {
    offer?: RTCSessionDescriptionInit
    candidates: RTCIceCandidateInit[]
  }
  receiver?: {
    answer?: RTCSessionDescriptionInit
    candidates: RTCIceCandidateInit[]
  }
}

// API Response Types
export interface CreateSessionResponse {
  success: boolean
  token: string
  expiresAt: number
  error?: string
}

export interface ValidateTokenResponse {
  valid: boolean
  session?: SessionData
  error?: string
}

// WebRTC Connection State
export interface ConnectionState {
  state: RTCPeerConnectionState
  iceState: RTCIceConnectionState
  iceGatheringState: RTCIceGatheringState
}
