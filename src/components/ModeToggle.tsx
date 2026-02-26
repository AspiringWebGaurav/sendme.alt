'use client'

import { motion } from 'framer-motion'
import { Upload, Download } from 'lucide-react'

interface ModeToggleProps {
    mode: 'send' | 'receive'
    onChange: (mode: 'send' | 'receive') => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
        <div className="inline-flex items-center p-1 bg-bg-elevated dark:bg-zinc-900 border border-border-subtle dark:border-white/10 rounded-full select-none">
            <button
                onClick={() => onChange('send')}
                className={`relative flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full transition-colors ${mode === 'send' ? 'text-text-primary dark:text-zinc-50' : 'text-text-secondary dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-text-primary'
                    }`}
            >
                {mode === 'send' && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
                <Upload className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Send</span>
            </button>

            <button
                onClick={() => onChange('receive')}
                className={`relative flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full transition-colors ${mode === 'receive' ? 'text-text-primary dark:text-zinc-50' : 'text-text-secondary dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-text-primary'
                    }`}
            >
                {mode === 'receive' && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-accent/20 border border-accent/30 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Receive</span>
            </button>
        </div>
    )
}
