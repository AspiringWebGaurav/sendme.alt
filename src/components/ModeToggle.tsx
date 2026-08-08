'use client'

import { motion } from 'framer-motion'
import { Upload, Download } from 'lucide-react'

interface ModeToggleProps {
  mode: 'send' | 'receive'
  onChange: (mode: 'send' | 'receive') => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center p-1.5 glass-panel rounded-full select-none shadow-sm border border-border-subtle/60 backdrop-blur-xl">
      <button
        onClick={() => onChange('send')}
        className={`relative flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
          mode === 'send' ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {mode === 'send' && (
          <motion.div
            layoutId="active-mode-pill"
            className="absolute inset-0 bg-purple-600/20 dark:bg-purple-500/25 border border-purple-500/40 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.25)]"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <Upload className={`w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 ${mode === 'send' ? 'text-purple-400' : ''}`} />
        <span className="relative z-10">Send</span>
      </button>

      <button
        onClick={() => onChange('receive')}
        className={`relative flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
          mode === 'receive' ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {mode === 'receive' && (
          <motion.div
            layoutId="active-mode-pill"
            className="absolute inset-0 bg-cyan-600/20 dark:bg-cyan-500/25 border border-cyan-500/40 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 ${mode === 'receive' ? 'text-cyan-400' : ''}`} />
        <span className="relative z-10">Receive</span>
      </button>
    </div>
  )
}
