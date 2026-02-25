/**
 * sendme.alt - File Transfer Utilities
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Format speed to human-readable string
 */
export function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`
}

/**
 * Format time (seconds) to human-readable string
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '...'
  
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  
  if (minutes < 60) {
    return `${minutes}m ${secs}s`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  return `${hours}h ${mins}m`
}

/**
 * Trigger browser download
 * Improved version that handles large files and prevents network errors
 */
export function downloadFile(blob: Blob, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Download is only available in browser environment'))
      return
    }

    try {
      // Validate blob
      if (!blob || blob.size === 0) {
        reject(new Error('Invalid file: empty or corrupted'))
        return
      }

      // Create object URL
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      a.setAttribute('aria-label', `Download ${filename}`)
      
      // Add to DOM (required for some browsers)
      document.body.appendChild(a)
      
      // Trigger download
      a.click()
      
      // Clean up after a delay to ensure download starts
      // Don't revoke immediately - browser needs time to start download
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a)
        }
        // Revoke URL after download has started (browser handles the download)
        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 100)
        resolve()
      }, 100)
      
    } catch (error) {
      reject(new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  try {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    // Fallback for older browsers or when clipboard API fails
    if (typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.top = '0'
        textarea.style.left = '0'
        textarea.style.opacity = '0'
        textarea.setAttribute('aria-hidden', 'true')
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand('copy')
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea)
        }
        return success
      } catch (fallbackError) {
        return false
      }
    }
  }
  
  return false
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size > 0 && size <= maxSize
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

/**
 * Get file icon based on type
 */
export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename)
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return '🖼️'
  }
  
  // Videos
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) {
    return '🎥'
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext)) {
    return '🎵'
  }
  
  // Documents
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
    return '📄'
  }
  
  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return '📊'
  }
  
  // Presentations
  if (['ppt', 'pptx', 'odp'].includes(ext)) {
    return '📽️'
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return '📦'
  }
  
  // Code
  if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'php', 'rb', 'swift'].includes(ext)) {
    return '💻'
  }
  
  // Default
  return '📁'
}
