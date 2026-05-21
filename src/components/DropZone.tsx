'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, X } from 'lucide-react'
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
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 className="w-full flex flex-col gap-4"
 >
 <div className="relative w-full h-32 sm:h-40 lg:h-48 rounded-2xl border border-primary/20 bg-bg-surface flex flex-col items-center justify-center p-4 sm:p-6 text-center group transition-all animate-breathe">
 <button
 onClick={onFileRemove}
 className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 p-1.5 sm:p-2 rounded-full bg-bg-surface hover:bg-error-bg text-text-secondary hover:text-error-text transition-all duration-300 hover:scale-110 active:scale-90 border border-border-subtle hover:border-error-text/30 shadow-md backdrop-blur-md z-10 opacity-100 scale-100"
 >
 <X className="w-4 h-4 sm:w-5 sm:h-5" />
 </button>

 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-3 sm:mb-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
 <span className="text-xl sm:text-2xl">📄</span>
 </div>
 <h3 className="text-sm font-medium text-text-primary truncate w-full max-w-[90%] px-2" title={file.name}>{file.name}</h3>
 <p className="text-xs text-text-secondary mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
 </div>
 </motion.div>
 ) : (
 <motion.div
 key="empty-state"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 className="w-full flex flex-col gap-2"
 >
 <div
 className={`relative w-full h-32 sm:h-40 lg:h-48 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-6 text-center cursor-pointer group hover-lift overflow-hidden ${isDragging
 ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_40px_rgba(139,92,246,0.2)] border-solid scale-[1.02]'
 : error
 ? 'border-error-bg bg-error-bg/50 border-solid'
 : 'border-border-subtle border-dashed bg-bg-surface/50 hover:bg-bg-elevated hover:border-border-strong'
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
 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-bg-elevated flex items-center justify-center text-text-secondary mb-3 sm:mb-4 group-hover:scale-110 group-hover:text-text-primary transition-all">
 <FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
 </div>
 <h3 className="text-[15px] font-medium text-text-primary text-text-primary mb-1">Select or drop file</h3>
 <p className="text-[13px] text-text-muted">Up to {formatMaxFileSize()}</p>
 </div>

 {error && (
 <p className="text-xs text-error text-center mt-2 break-words px-2 sm:px-0 w-full">{error}</p>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 )
}
