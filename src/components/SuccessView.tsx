import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface SuccessViewProps {
    mode: 'send' | 'receive'
    fileName?: string
    fileSize?: number
    onReset: () => void
}

export function SuccessView({ mode, fileName, fileSize, onReset }: SuccessViewProps) {
    const isSend = mode === 'send'
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col items-center justify-center p-8 sm:p-10 bg-success/5 border border-success/20 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.1)] relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-success/20 blur-[50px] rounded-full point-events-none" />

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.15, stiffness: 200, damping: 15 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-success/20 rounded-full flex items-center justify-center text-success mb-6 relative z-10"
            >
                <div className="absolute inset-0 border-2 border-success/30 rounded-full animate-ping opacity-20" />
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3 text-center relative z-10"
            >
                {isSend ? 'Successfully Sent!' : 'Successfully Received!'}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 text-center mb-8 max-w-[280px] break-all relative z-10"
            >
                {fileName} {fileSize ? <span className="text-zinc-400 dark:text-zinc-500 whitespace-nowrap ml-1">({(fileSize / 1024 / 1024).toFixed(2)} MB)</span> : ''}
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onReset}
                className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white dark:text-zinc-100 rounded-full font-medium transition-colors shadow-sm relative z-10"
            >
                {isSend ? 'Send Another File' : 'Receive Another File'}
            </motion.button>
        </motion.div>
    )
}
