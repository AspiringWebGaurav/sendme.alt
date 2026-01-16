/**
 * sendme.alt - Receive Mode Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { motion } from 'framer-motion'
import { useReceive } from '@/hooks/useReceive'
import { ProgressBar } from './ProgressBar'
import { formatBytes, getFileIcon, downloadFile } from '@/lib/transfer'

export function ReceiveMode() {
  const { state, token, setToken, fileInfo, progress, error, receivedFileName, startReceiving, cancel } = useReceive()

  // Idle state - token input
  if (state === 'idle') {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <label htmlFor="token-input" className="block text-xs sm:text-sm text-white/60 mb-2">
            Enter share code:
          </label>
          <input
            id="token-input"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toLowerCase())}
            placeholder="e.g., oceanriver"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors text-sm sm:text-base"
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>

        <button
          onClick={startReceiving}
          disabled={!token.trim()}
          className="w-full py-3 sm:py-4 bg-accent hover:bg-accent-light disabled:bg-white/10 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Start receiving file"
        >
          Receive File
        </button>

        {error && (
          <div className="bg-error/20 border border-error/50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-error">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Connecting
  if (state === 'connecting') {
    return (
      <div className="text-center space-y-4 sm:space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-5xl sm:text-6xl"
        >
          🔄
        </motion.div>
        <p className="text-white/80 text-sm sm:text-base">Connecting to sender...</p>
        {fileInfo && (
          <div className="glass-card p-3 sm:p-4 rounded-xl">
            <p className="text-xs sm:text-sm text-white/60">Preparing to receive:</p>
            <p className="font-medium mt-1 text-sm sm:text-base truncate">{fileInfo.name}</p>
            <p className="text-xs sm:text-sm text-white/60 mt-1">{formatBytes(fileInfo.size)}</p>
          </div>
        )}
      </div>
    )
  }

  // Transferring
  if (state === 'transferring' && progress && fileInfo) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="text-3xl sm:text-4xl">{getFileIcon(fileInfo.name)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm sm:text-base">{fileInfo.name}</p>
              <p className="text-xs sm:text-sm text-white/60">{formatBytes(fileInfo.size)}</p>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
        <button
          onClick={cancel}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Cancel transfer"
        >
          Cancel Transfer
        </button>
      </div>
    )
  }

  // Complete
  if (state === 'complete') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4 sm:space-y-6"
      >
        <div className="text-5xl sm:text-6xl">✓</div>
        <div>
          <p className="text-lg sm:text-xl font-medium text-success mb-2">Download Complete!</p>
          <p className="text-xs sm:text-sm text-white/60 truncate px-4">{receivedFileName}</p>
        </div>
        <button
          onClick={cancel}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent-light rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Receive another file"
        >
          Receive Another
        </button>
      </motion.div>
    )
  }

  // Error
  if (state === 'error') {
    const hasManualDownload = typeof window !== 'undefined' && 
      window.lastReceivedBlob && 
      window.lastReceivedFileName
    
    return (
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="text-5xl sm:text-6xl" role="img" aria-label="Warning">⚠️</div>
        <div>
          <p className="text-lg sm:text-xl font-medium text-error mb-2">Transfer Failed</p>
          <p className="text-xs sm:text-sm text-white/60 px-2">{error}</p>
          {hasManualDownload && (
            <p className="text-xs sm:text-sm text-white/80 mt-2 px-2">
              File was received but download failed. Click below to download manually.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
          {hasManualDownload && (
            <button
              onClick={async () => {
                try {
                  const blob = window.lastReceivedBlob!
                  const filename = window.lastReceivedFileName!
                  await downloadFile(blob, filename)
                  // Clear stored blob after successful download
                  delete window.lastReceivedBlob
                  delete window.lastReceivedFileName
                } catch (err) {
                  // Silent fail - user can try again
                }
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-success hover:bg-success/80 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
              type="button"
              aria-label="Download file manually"
            >
              Download File
            </button>
          )}
          <button
            onClick={cancel}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
            type="button"
            aria-label={hasManualDownload ? 'Close' : 'Try again'}
          >
            {hasManualDownload ? 'Close' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  return null
}
