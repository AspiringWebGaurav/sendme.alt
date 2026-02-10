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
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="token-input" className="block text-sm font-medium text-slate-300">
            Enter share code
          </label>
          <input
            id="token-input"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toLowerCase())}
            placeholder="e.g., oceanriver"
            className="w-full px-4 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all font-mono text-lg backdrop-blur-sm"
            autoComplete="off"
            autoCapitalize="off"
          />
          <p className="text-xs text-slate-500">
            Enter the code shared by the sender
          </p>
        </div>

        <button
          onClick={startReceiving}
          disabled={!token.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/30 disabled:shadow-none"
          type="button"
        >
          {token.trim() ? '🚀 Start Receiving' : '⌨️ Enter Code Above'}
        </button>

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

  // Connecting
  if (state === 'connecting') {
    return (
      <div className="text-center space-y-6 py-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center text-4xl border border-blue-500/20">
            🔄
          </div>
        </motion.div>
        <div>
          <p className="text-white font-semibold mb-1">Connecting to sender</p>
          <p className="text-sm text-slate-400">Establishing secure connection...</p>
        </div>
        {fileInfo && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl max-w-sm mx-auto">
            <p className="text-xs text-slate-400 mb-2">Preparing to receive:</p>
            <p className="font-semibold truncate text-white">{fileInfo.name}</p>
            <p className="text-sm text-slate-400 mt-1">{formatBytes(fileInfo.size)}</p>
          </div>
        )}
      </div>
    )
  }

  // Transferring
  if (state === 'transferring' && progress && fileInfo) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-2xl border border-green-500/20">
              {getFileIcon(fileInfo.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-white">{fileInfo.name}</p>
              <p className="text-sm text-slate-400 mt-0.5">{formatBytes(fileInfo.size)}</p>
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
          <p className="text-2xl font-bold text-white mb-2">Download Complete!</p>
          <p className="text-slate-400 truncate px-4">{receivedFileName}</p>
        </div>
        <button
          onClick={cancel}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
          type="button"
        >
          Receive Another File
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
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500/30">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-white mb-2">
            {error?.toLowerCase().includes('cancelled') ? 'Transfer Cancelled' : 'Transfer Failed'}
          </p>
          <p className="text-slate-400 px-4">{error}</p>
          {hasManualDownload && (
            <p className="text-sm text-green-400 mt-3 px-4">
              File was received! Use the button below to download.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
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
              className="px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
              type="button"
              aria-label="Download file manually"
            >
              📥 Download File
            </button>
          )}
          <button
            onClick={cancel}
            className="px-6 py-3.5 bg-slate-800/40 hover:bg-slate-700/50 text-white font-semibold rounded-xl transition-all border border-slate-700/50"
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
