'use client'

import { motion } from 'framer-motion'
import { Upload, Download } from 'lucide-react'

interface ModeToggleProps {
 mode: 'send' | 'receive'
 onChange: (mode: 'send' | 'receive') => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
 return (
 <div className="inline-flex items-center p-1 bg-bg-elevated border border-border-subtle rounded-full select-none">
 <button
 onClick={() => onChange('send')}
 className={`relative flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 ${mode === 'send' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
 }`}
 >
 {mode === 'send' && (
 <motion.div
 layoutId="active-pill"
 className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.1),_0_0_10px_rgba(139,92,246,0.15)]"
 transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
 />
 )}
 <Upload className="w-4 h-4 relative z-10" />
 <span className="relative z-10">Send</span>
 </button>

 <button
 onClick={() => onChange('receive')}
 className={`relative flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 ${mode === 'receive' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
 }`}
 >
 {mode === 'receive' && (
 <motion.div
 layoutId="active-pill"
 className="absolute inset-0 bg-accent/20 border border-accent/30 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.1),_0_0_10px_rgba(6,182,212,0.15)]"
 transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
 />
 )}
 <Download className="w-4 h-4 relative z-10" />
 <span className="relative z-10">Receive</span>
 </button>
 </div>
 )
}
