/**
 * sendme.alt - Dynamic URL Configuration
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 * 
 * Centralized URL management - No hardcoded URLs
 * All URLs are configurable via environment variables
 */

// ============================================================================
// APP URLS - Main application URLs
// ============================================================================

/**
 * Base URL of the application
 * Used for: metadata, canonical URLs, OG tags
 */
export const APP_URLS = {
  /**
   * Main application base URL
   * Env: NEXT_PUBLIC_BASE_URL
   */
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.send2me.site',
  
  /**
   * App name for display purposes
   * Env: NEXT_PUBLIC_APP_NAME
   */
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'sendme.alt',
  
  /**
   * App description for SEO
   * Env: NEXT_PUBLIC_APP_DESCRIPTION
   */
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 
    'Blazing fast peer-to-peer file transfer. Send files up to 3GB directly between devices.',
} as const

// ============================================================================
// DEVELOPER/CONTACT URLS - Personal/Portfolio links
// ============================================================================

export const DEVELOPER_URLS = {
  /**
   * Developer's portfolio website
   * Env: NEXT_PUBLIC_DEVELOPER_URL
   */
  PORTFOLIO: process.env.NEXT_PUBLIC_DEVELOPER_URL || 'https://www.gauravpatil.online',
  
  /**
   * Developer's GitHub profile
   * Env: NEXT_PUBLIC_DEVELOPER_GITHUB
   */
  GITHUB: process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || 'https://github.com/AspiringWebGaurav',
  
  /**
   * Developer's Twitter handle (without @)
   * Env: NEXT_PUBLIC_DEVELOPER_TWITTER
   */
  TWITTER_HANDLE: process.env.NEXT_PUBLIC_DEVELOPER_TWITTER || 'gauravpatil',
  
  /**
   * Developer's name for display
   * Env: NEXT_PUBLIC_DEVELOPER_NAME
   */
  NAME: process.env.NEXT_PUBLIC_DEVELOPER_NAME || 'Gaurav Patil',
} as const

// ============================================================================
// WEBRTC/STUN/TURN SERVER URLS - Connection infrastructure
// ============================================================================

export const WEBRTC_URLS = {
  /**
   * STUN servers for NAT traversal
   * Env: NEXT_PUBLIC_STUN_SERVERS (comma-separated)
   */
  STUN_SERVERS: (process.env.NEXT_PUBLIC_STUN_SERVERS || 
    'stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302,stun:stun2.l.google.com:19302,stun:stun3.l.google.com:19302,stun:stun4.l.google.com:19302,stun:stun.stunprotocol.org:3478'
  ).split(',').map(url => url.trim()),
  
  /**
   * TURN server URL (primary)
   * Env: NEXT_PUBLIC_TURN_URL
   */
  TURN_URL: process.env.NEXT_PUBLIC_TURN_URL || null,
  
  /**
   * TURN server username
   * Env: NEXT_PUBLIC_TURN_USERNAME
   */
  TURN_USERNAME: process.env.NEXT_PUBLIC_TURN_USERNAME || null,
  
  /**
   * TURN server credential
   * Env: NEXT_PUBLIC_TURN_CREDENTIAL
   */
  TURN_CREDENTIAL: process.env.NEXT_PUBLIC_TURN_CREDENTIAL || null,
  
  /**
   * Fallback TURN servers (used when primary TURN is not configured)
   * Env: NEXT_PUBLIC_FALLBACK_TURN_URLS (comma-separated)
   * Env: NEXT_PUBLIC_FALLBACK_TURN_USERNAME
   * Env: NEXT_PUBLIC_FALLBACK_TURN_CREDENTIAL
   */
  FALLBACK_TURN: {
    URLS: (process.env.NEXT_PUBLIC_FALLBACK_TURN_URLS || 
      'turn:a.relay.metered.ca:443,turn:a.relay.metered.ca:443?transport=tcp'
    ).split(',').map(url => url.trim()),
    USERNAME: process.env.NEXT_PUBLIC_FALLBACK_TURN_USERNAME || 'e8dd65b92c62d5e98c3b8d4b',
    CREDENTIAL: process.env.NEXT_PUBLIC_FALLBACK_TURN_CREDENTIAL || 'uWdWNmkhvyqTmFRr',
  },
} as const

// ============================================================================
// SOCIAL/SHARING URLS - Social media and sharing
// ============================================================================

export const SOCIAL_URLS = {
  /**
   * Twitter share intent URL (base)
   */
  TWITTER_SHARE: 'https://twitter.com/intent/tweet',
  
  /**
   * LinkedIn share URL (base)
   */
  LINKEDIN_SHARE: 'https://www.linkedin.com/sharing/share-offsite/',
  
  /**
   * Get Twitter profile URL
   */
  getTwitterProfile: (handle?: string) => 
    `https://twitter.com/${handle || DEVELOPER_URLS.TWITTER_HANDLE}`,
  
  /**
   * Get GitHub profile URL
   */
  getGitHubProfile: (username?: string) => 
    username || DEVELOPER_URLS.GITHUB,
} as const

// ============================================================================
// HELPER FUNCTIONS - URL utilities
// ============================================================================

/**
 * Get the full URL for a given path
 */
export function getFullUrl(path: string = ''): string {
  const base = APP_URLS.BASE_URL
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * Get the OG image URL
 */
export function getOgImageUrl(): string {
  return getFullUrl('/og-image.png')
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string = ''): string {
  return getFullUrl(path)
}

/**
 * Get Twitter profile URL
 */
export function getTwitterUrl(): string {
  return SOCIAL_URLS.getTwitterProfile()
}

/**
 * Get GitHub profile URL
 */
export function getGitHubUrl(): string {
  return SOCIAL_URLS.getGitHubProfile()
}

/**
 * Get portfolio URL
 */
export function getPortfolioUrl(): string {
  return DEVELOPER_URLS.PORTFOLIO
}

/**
 * Generate ICE servers configuration for WebRTC
 */
export function getIceServers(): RTCIceServer[] {
  const iceServers: RTCIceServer[] = []
  
  // Add STUN servers
  for (const stunUrl of WEBRTC_URLS.STUN_SERVERS) {
    iceServers.push({ urls: stunUrl })
  }
  
  // Add primary TURN server if configured
  if (WEBRTC_URLS.TURN_URL && WEBRTC_URLS.TURN_USERNAME && WEBRTC_URLS.TURN_CREDENTIAL) {
    iceServers.push({
      urls: WEBRTC_URLS.TURN_URL,
      username: WEBRTC_URLS.TURN_USERNAME,
      credential: WEBRTC_URLS.TURN_CREDENTIAL,
    })
  } else {
    // Add fallback TURN servers
    for (const turnUrl of WEBRTC_URLS.FALLBACK_TURN.URLS) {
      iceServers.push({
        urls: turnUrl,
        username: WEBRTC_URLS.FALLBACK_TURN.USERNAME,
        credential: WEBRTC_URLS.FALLBACK_TURN.CREDENTIAL,
      })
    }
  }
  
  return iceServers
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AppUrls = typeof APP_URLS
export type DeveloperUrls = typeof DEVELOPER_URLS
export type WebRtcUrls = typeof WEBRTC_URLS
export type SocialUrls = typeof SOCIAL_URLS