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
      <div className="space-y-4">
        <div className="bg-white/20 border border-white/30 p-5 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-2xl border border-white/30 backdrop-blur-sm">
              {getFileIcon(file.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-white">{file.name}</p>
              <p className="text-sm text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Remove file"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={removeFile}
            className="py-3.5 bg-slate-800/40 hover:bg-slate-700/50 text-white font-semibold rounded-xl transition-all border border-slate-700/50"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={startSending}
            className="py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/30"
            type="button"
          >
            Generate Code
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
          className="relative group border-2 border-dashed border-white/40 hover:border-white/70 rounded-2xl p-12 text-center cursor-pointer transition-all bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileInput}
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center text-5xl border border-blue-500/20 group-hover:scale-105 transition-transform">
                📁
              </div>
            </div>
            <p className="text-lg font-semibold mb-2 text-white">
              Drop your file here
            </p>
            <p className="text-sm text-slate-400 mb-1">or click to browse</p>
            <p className="text-xs text-slate-500">Maximum file size: 3GB</p>
          </label>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}
      </div>
    )
  }

  // Connecting - generating token
  if (state === 'connecting' || isGeneratingToken) {
    return (
      <div className="space-y-6">
        {/* File information */}
        {file && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-2xl border border-blue-500/20">
                {getFileIcon(file.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-white">{file.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center text-4xl border border-blue-500/20">
              ⚙️
            </div>
          </motion.div>
          <div>
            <p className="text-white font-medium mb-1">Generating share code</p>
            <p className="text-sm text-slate-400">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  // Waiting for receiver
  if (state === 'waiting') {
    return (
      <div className="space-y-6">
        {/* File information */}
        {file && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-2xl border border-blue-500/20">
                {getFileIcon(file.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-white">{file.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400">Share this code with the receiver:</p>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border-2 border-blue-500/30 p-6 rounded-2xl"
          >
            <code className="text-3xl font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 break-all">
              {token || '...'}
            </code>
          </motion.div>
          <motion.button
            onClick={() => token && handleCopyToken(token)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              copySuccess 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50' 
                : 'bg-slate-800/40 hover:bg-slate-700/50 border-2 border-slate-700/50 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            {copySuccess ? '✓ Copied to Clipboard!' : '📋 Copy Code'}
          </motion.button>
        </div>

        <div className="text-center py-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center text-4xl border border-blue-500/20">
              ⏳
            </div>
          </motion.div>
          <p className="text-white font-medium">Waiting for receiver</p>
          <p className="text-sm text-slate-400 mt-1">The transfer will start automatically</p>
        </div>

        <button
          onClick={cancel}
          className="w-full py-3.5 bg-slate-800/40 hover:bg-slate-700/50 text-white font-semibold rounded-xl transition-all border border-slate-700/50"
          type="button"
        >
          Cancel Transfer
        </button>
      </div>
    )
  }

  // Transferring
  if (state === 'transferring' && progress) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-2xl border border-green-500/20">
              {file && getFileIcon(file.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-white">{file?.name}</p>
              <p className="text-sm text-slate-400 mt-0.5">{file && formatBytes(file.size)}</p>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
        <button
          onClick={cancel}
          className="w-full py-3.5 bg-slate-800/40 hover:bg-red-500/20 hover:border-red-500/50 text-white font-semibold rounded-xl transition-all border border-slate-700/50"
          type="button"
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
        className="text-center space-y-6 py-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/30">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-white mb-2">Transfer Complete!</p>
          <p className="text-slate-400">Your file was sent successfully</p>
        </div>
        <button
          onClick={cancel}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
          type="button"
        >
          Send Another File
        </button>
      </motion.div>
    )
  }

  // Error
  if (state === 'error') {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500/30">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-white mb-2">Transfer Failed</p>
          <p className="text-slate-400 px-4">{error}</p>
        </div>
        <button
          onClick={cancel}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
          type="button"
        >
          Try Again
        </button>
      </div>
    )
  }

  return null
}
