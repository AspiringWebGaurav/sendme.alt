'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModeToggle } from './ModeToggle'
import { SendPanel } from './SendPanel'
import { ReceivePanel } from './ReceivePanel'

type AppMode = 'send' | 'receive'

export function MainEngine({ initialMode = 'send' }: { initialMode?: AppMode }) {
 const [mode, setMode] = useState<AppMode>(initialMode)

 return (
 <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 sm:gap-6 h-full max-h-full">
 <div className="flex justify-center shrink-0">
 <ModeToggle mode={mode} onChange={setMode} />
 </div>

 <div className="relative w-full flex-1 min-h-0 rounded-2xl glass-panel overflow-hidden shadow-light-card dark:shadow-dark-card transition-shadow duration-300">
 <AnimatePresence mode="wait">
 {mode === 'send' ? (
 <motion.div
 key="send"
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 1.02, y: -10 }}
 transition={{ type: 'spring', stiffness: 300, damping: 25 }}
 className="absolute inset-0"
 >
 <SendPanel />
 </motion.div>
 ) : (
 <motion.div
 key="receive"
 initial={{ opacity: 0, scale: 0.95, y: -10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 1.02, y: 10 }}
 transition={{ type: 'spring', stiffness: 300, damping: 25 }}
 className="absolute inset-0"
 >
 <ReceivePanel />
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 )
}
