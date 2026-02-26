'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModeToggle } from './ModeToggle'
import { SendPanel } from './SendPanel'
import { ReceivePanel } from './ReceivePanel'

type AppMode = 'send' | 'receive'

export function MainEngine() {
    const [mode, setMode] = useState<AppMode>('send')

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 sm:gap-6 h-full max-h-full">
            <div className="flex justify-center shrink-0">
                <ModeToggle mode={mode} onChange={setMode} />
            </div>

            <div className="relative w-full flex-1 min-h-0 rounded-2xl bg-bg-surface dark:bg-zinc-900/50 border border-border-subtle dark:border-white/5 overflow-hidden backdrop-blur-xl shadow-light-card dark:shadow-2xl">
                <AnimatePresence mode="wait">
                    {mode === 'send' ? (
                        <motion.div
                            key="send"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute inset-0"
                        >
                            <SendPanel />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="receive"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
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
