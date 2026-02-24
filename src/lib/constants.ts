/**
 * sendme.alt - Constants
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import { getIceServers } from './urls'

// App Configuration
export const APP_CONFIG = {
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10737418240'), // 10GB default
  TOKEN_EXPIRY_MINUTES: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES || '10'),
  // Adaptive chunk sizing (ThroughputController auto-tunes within these bounds)
  CHUNK_SIZE_INITIAL: 64 * 1024, // 64KB — conservative start
  CHUNK_SIZE_MIN: 16 * 1024, // 16KB — floor for very slow connections
  CHUNK_SIZE_MAX: 256 * 1024, // 256KB — SCTP ceiling
  // Adaptive buffer threshold (auto-tuned by drain rate)
  BUFFER_THRESHOLD_INITIAL: 2 * 1024 * 1024, // 2MB — safe start
  BUFFER_THRESHOLD_MIN: 512 * 1024, // 512KB — floor
  BUFFER_THRESHOLD_MAX: 8 * 1024 * 1024, // 8MB — ceiling
  // Stall detection
  STALL_DETECT_MS: 3000, // 3s no drain → "Network slow" feedback
  STALL_FATAL_MS: 10000, // 10s no drain → recoverable error
  // Adaptive tuning window
  ADAPTIVE_WINDOW: 10, // Measure drain rate over N chunks before adjusting
  PROGRESS_THROTTLE_MS: 100, // Limit UI progress updates to 10/sec
} as const

// WebRTC Configuration with STUN/TURN (Dynamic - configured via environment variables)
export const RTC_CONFIG: RTCConfiguration = {
  iceServers: getIceServers(),
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all', // Try direct first, use TURN as fallback
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
}

// DataChannel Configuration (reliable and ordered)
export const DATA_CHANNEL_CONFIG: RTCDataChannelInit = {
  ordered: true, // Ensure packets arrive in order
  // No maxRetransmits or maxPacketLifeTime = fully reliable
}

// API Endpoints
export const API_ENDPOINTS = {
  CREATE: '/api/create',
  VALIDATE: '/api/validate',
  SIGNAL: '/api/signal',
  LISTEN: '/api/listen',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large. Maximum size is 3GB.',
  CONNECTION_FAILED: 'Failed to establish connection. Please try again.',
  TRANSFER_FAILED: 'File transfer failed. Please try again.',
  TOKEN_INVALID: 'Invalid or expired token.',
  TOKEN_EXPIRED: 'Token has expired. Please generate a new one.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSFER_COMPLETE: 'File transferred successfully!',
  TOKEN_COPIED: 'Token copied to clipboard!',
} as const
