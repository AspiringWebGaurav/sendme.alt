'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, X, FileCheck } from 'lucide-react'
import { formatMaxFileSize } from '@/core/constants'

interface DropZoneProps {
  file: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  error?: string | null
}

export function DropZone({ file, onFileSelect, onFileRemove, error }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }, [onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div
          key="file-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-full flex flex-col gap-3"
        >
          <div className="relative w-full h-36 sm:h-44 rounded-2xl glass-panel border border-purple-500/30 flex flex-col items-center justify-center p-4 text-center group shadow-md animate-breathe">
            <button
              onClick={onFileRemove}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-bg-surface/80 hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-all duration-200 hover:scale-110 active:scale-95 border border-border-subtle shadow-xs backdrop-blur-md z-10"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0">
              <FileCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary truncate w-full max-w-[90%] px-2" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {file.size > 2 * 1024 * 1024 * 1024 && (
              <p className="text-[11px] text-amber-400 mt-1 font-medium">⚠️ Large file — ensure target device browser RAM is available</p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-full flex flex-col gap-2"
        >
          <div
            className={`relative w-full h-36 sm:h-44 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer group overflow-hidden ${
              isDragging
                ? 'border-purple-500 bg-purple-500/15 shadow-[0_0_30px_rgba(168,85,247,0.25)] border-solid scale-[1.01]'
                : error
                ? 'border-red-500/50 bg-red-500/10 border-solid'
                : 'border-border-subtle/70 border-dashed glass-panel hover-glass'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Select a file to send"
          >
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              onChange={handleChange}
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-110 transition-transform">
              <FileUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-0.5">Select or drop file</h3>
            <p className="text-xs text-text-muted">Up to {formatMaxFileSize()}</p>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center mt-1 break-words px-2 w-full font-medium">{error}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
