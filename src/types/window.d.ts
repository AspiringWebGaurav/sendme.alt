/**
 * Window type extensions for manual download fallback
 */

interface Window {
  lastReceivedBlob?: Blob
  lastReceivedFileName?: string
}
