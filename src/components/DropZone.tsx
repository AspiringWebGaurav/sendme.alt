'use client'

import { useCallback, useState } from 'react'
import { FileUp, X } from 'lucide-react'

interface DropZoneProps {
    file: File | null
    onFileSelect: (file: File) => void
    onFileRemove: () => void
    error?: string | null
}

export function DropZone({ file, onFileSelect, onFileRemove, error }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false)

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
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0])
        }
    }, [onFileSelect])

    if (file) {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="relative w-full h-32 sm:h-40 lg:h-48 rounded-2xl border border-border-subtle dark:border-primary/20 bg-bg-surface dark:bg-primary/5 shadow-light-elevated dark:shadow-none flex flex-col items-center justify-center p-4 sm:p-6 text-center group transition-all">
                    <button
                        onClick={onFileRemove}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-bg-elevated hover:bg-border-subtle dark:bg-zinc-900/50 dark:hover:bg-zinc-800 text-text-muted hover:text-text-primary dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent-primary/10 dark:bg-primary/20 flex items-center justify-center text-accent-primary dark:text-primary mb-3 sm:mb-4 shadow-[0_0_30px_rgba(108,71,255,0.15)] dark:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        <span className="text-xl sm:text-2xl">📄</span>
                    </div>
                    <h3 className="text-sm font-medium text-text-primary dark:text-zinc-100 truncate w-full max-w-[200px]">{file.name}</h3>
                    <p className="text-xs text-text-secondary mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <div
                className={`relative w-full h-32 sm:h-40 lg:h-48 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-6 text-center cursor-pointer group ${isDragging
                    ? 'border-accent-primary bg-accent-primary/5 shadow-light-elevated dark:border-primary dark:bg-primary/10 dark:shadow-[0_0_40px_rgba(139,92,246,0.15)] border-solid'
                    : error
                        ? 'border-error-bg bg-error-bg/50 dark:border-error dark:bg-error/5 border-solid'
                        : 'border-border-subtle bg-bg-elevated hover:bg-bg-surface hover:border-border-strong hover:shadow-light-elevated dark:border-white/10 dark:bg-transparent dark:border-dashed dark:hover:border-white/20 dark:hover:bg-zinc-900/50 border-solid dark:border-dashed'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                />
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-bg-surface dark:bg-zinc-800 shadow-sm dark:shadow-none flex items-center justify-center text-text-muted dark:text-zinc-400 mb-3 sm:mb-4 group-hover:scale-110 group-hover:text-text-primary dark:group-hover:text-zinc-300 transition-all">
                    <FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-[15px] font-medium text-text-primary dark:text-zinc-200 mb-1">Select or drop file</h3>
                <p className="text-[13px] text-text-muted">Up to 3GB</p>
            </div>

            {error && (
                <p className="text-xs text-error text-center mt-2">{error}</p>
            )}
        </div>
    )
}
