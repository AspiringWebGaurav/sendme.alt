import { motion } from 'framer-motion'
import { downloadFile } from '@/core/webrtc/transfer'
import { CheckCircle2, Download, RefreshCw } from 'lucide-react'

interface SuccessViewProps {
  mode: 'send' | 'receive'
  fileName?: string
  fileSize?: number
  onReset: () => void
  receivedBlob?: Blob | null
}

export function SuccessView({ mode, fileName, fileSize, onReset, receivedBlob }: SuccessViewProps) {
  const isSend = mode === 'send'

  const handleSave = () => {
    if (receivedBlob && fileName) {
      downloadFile(receivedBlob, fileName)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center p-6 sm:p-8 glass-panel border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.15, stiffness: 200, damping: 15 }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-5 relative z-10 shadow-[0_0_25px_rgba(16,185,129,0.25)] shrink-0"
      >
        <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-ping opacity-25" />
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-xl sm:text-2xl font-bold text-text-primary mb-2 text-center relative z-10"
      >
        {isSend ? 'Successfully Sent!' : 'Successfully Received!'}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs sm:text-sm text-text-secondary text-center mb-6 max-w-[280px] break-all relative z-10"
      >
        {fileName} {fileSize ? <span className="text-text-muted whitespace-nowrap font-mono ml-1">({(fileSize / 1024 / 1024).toFixed(2)} MB)</span> : ''}
      </motion.p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs relative z-10">
        {!isSend && receivedBlob && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-semibold transition-all duration-200 shadow-md shadow-emerald-500/20 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" />
            Save File
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 glass-panel hover-glass text-text-primary rounded-full font-semibold transition-all duration-200 text-xs sm:text-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isSend ? 'Send Another File' : 'Receive Another File'}
        </motion.button>
      </div>
    </motion.div>
  )
}

