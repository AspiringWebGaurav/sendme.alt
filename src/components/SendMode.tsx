/**
 * sendme.alt - Send Mode Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSend } from '@/hooks/useSend'
import { ProgressBar } from './ProgressBar'
import { formatBytes, getFileIcon } from '@/lib/transfer'

export function SendMode() {
  const { state, file, token, progress, error, isGeneratingToken, copySuccess, selectFile, startSending, cancel, removeFile, handleCopyToken } = useSend()

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        selectFile(droppedFile)
      }
    },
    [selectFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        selectFile(selectedFile)
      }
    },
    [selectFile]
  )


  // File selected - show details and send button (check this FIRST before the idle state)
  if (state === 'idle' && file) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-3xl sm:text-4xl flex-shrink-0">{getFileIcon(file.name)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
              <p className="text-xs sm:text-sm text-white/60">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Remove file"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={removeFile}
            className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
            type="button"
            aria-label="Cancel and remove file"
          >
            Cancel
          </button>
          <button
            onClick={startSending}
            className="flex-1 py-2.5 sm:py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
            type="button"
            aria-label="Generate share code"
          >
            Generate Share Code
          </button>
        </div>
      </div>
    )
  }

  // Idle state - file selection (no file selected)
  if (state === 'idle') {
    return (
      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-white/30 rounded-2xl p-8 sm:p-12 text-center cursor-pointer hover:border-accent transition-colors"
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileInput}
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-5xl sm:text-6xl mb-4">📁</div>
            <p className="text-base sm:text-lg font-medium mb-2">
              Drop file here or tap to browse
            </p>
            <p className="text-xs sm:text-sm text-white/60">Max size: 3GB</p>
          </label>
        </div>

        {error && (
          <div className="bg-error/20 border border-error/50 rounded-xl p-4 text-sm text-error">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Connecting - generating token
  if (state === 'connecting' || isGeneratingToken) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* File information */}
        {file && (
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{getFileIcon(file.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
                <p className="text-xs sm:text-sm text-white/60">{formatBytes(file.size)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="text-5xl sm:text-6xl">⚙️</div>
          </motion.div>
          <p className="text-white/80 text-sm sm:text-base">Generating share code...</p>
        </div>
      </div>
    )
  }

  // Waiting for receiver
  if (state === 'waiting') {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* File information */}
        {file && (
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{getFileIcon(file.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
                <p className="text-xs sm:text-sm text-white/60">{formatBytes(file.size)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">Share this code:</p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-4 sm:p-6 rounded-2xl"
          >
            <code className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold tracking-wider break-all">
              {token || '...'}
            </code>
          </motion.div>
          <motion.button
            onClick={() => token && handleCopyToken(token)}
            className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
              copySuccess 
                ? 'bg-success/20 text-success border border-success/50' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            aria-label={copySuccess ? 'Token copied' : 'Copy token to clipboard'}
          >
            {copySuccess ? '✓ Copied!' : 'Copy Code'}
          </motion.button>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⏳</div>
          <p className="text-white/80 text-sm sm:text-base">Waiting for receiver...</p>
        </motion.div>

        <button
          onClick={cancel}
          className="w-full py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Cancel transfer"
        >
          Cancel
        </button>
      </div>
    )
  }

  // Transferring
  if (state === 'transferring' && progress) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="glass-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="text-3xl sm:text-4xl">{file && getFileIcon(file.name)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm sm:text-base">{file?.name}</p>
              <p className="text-xs sm:text-sm text-white/60">{file && formatBytes(file.size)}</p>
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
          <p className="text-lg sm:text-xl font-medium text-success mb-2">Transfer Complete!</p>
          <p className="text-xs sm:text-sm text-white/60">File sent successfully</p>
        </div>
        <button
          onClick={cancel}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent-light rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Send another file"
        >
          Send Another
        </button>
      </motion.div>
    )
  }

  // Error
  if (state === 'error') {
    return (
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="text-5xl sm:text-6xl">⚠️</div>
        <div>
          <p className="text-lg sm:text-xl font-medium text-error mb-2">Transfer Failed</p>
          <p className="text-xs sm:text-sm text-white/60 px-2">{error}</p>
        </div>
        <button
          onClick={cancel}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent-light rounded-xl transition-colors text-sm sm:text-base"
          type="button"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    )
  }

  return null
}
