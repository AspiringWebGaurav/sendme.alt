'use client'

import { motion } from 'framer-motion'

import { useReceive } from '@/hooks/useReceive'
import { TokenInput } from './TokenInput'
import { TransferProgress } from './TransferProgress'
import { TransferStats } from './TransferStats'
import { CancelButton } from './CancelButton'
import { StatusIndicator } from './StatusIndicator'
import { SuccessView } from './SuccessView'
import { XCircle } from 'lucide-react'

export function ReceivePanel() {
  const {
    state,
    token,
    setToken,
    fileInfo,
    progress,
    error,
    receivedFileName,
    receivedBlob,
    startReceiving,
    cancel,
  } = useReceive()

  // Safely check if we are in connection phase without strict typescript overlap errors
  const isConnecting = state === 'connecting';

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-2 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex justify-between items-start z-10">
        <StatusIndicator mode="receive" state={state} />
        {(state === 'connecting' || state === 'waiting') && (
          <CancelButton onCancel={cancel} label="Cancel Receive" />
        )}
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-6">
        {state === 'idle' || state === 'error' ? (
          <motion.div
            className="w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } }}>
              <TokenInput
                token={token}
                onChange={setToken}
                onSubmit={startReceiving}
                error={error}
                isLoading={isConnecting}
              />
            </motion.div>
          </motion.div>
        ) : state === 'complete' ? (
          <SuccessView
            mode="receive"
            fileName={receivedFileName || fileInfo?.name}
            fileSize={fileInfo?.size}
            onReset={cancel}
            receivedBlob={receivedBlob}
          />
        ) : (
          <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
            {fileInfo && (
              <div className="w-full glass-panel p-3.5 rounded-2xl flex items-center gap-3.5 shadow-xs border border-cyan-500/20">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                  📄
                </div>
                <div className="overflow-hidden min-w-0 flex-1 text-left">
                  <p className="text-sm font-semibold truncate" title={receivedFileName || fileInfo.name}>{receivedFileName || fileInfo.name}</p>
                  <p className="text-xs text-text-muted">{(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            )}

            {state === 'transferring' && progress && fileInfo ? (
              <div className="w-full space-y-3 sm:space-y-4">
                <TransferProgress progress={progress.percentage} />
                <TransferStats
                  speed={progress.speed}
                  transferred={progress.bytesTransferred}
                  total={fileInfo.size}
                  connectionType={progress.connectionType}
                />
                <button
                  onClick={cancel}
                  className="w-full mt-4 py-3 min-h-[44px] bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-semibold transition-colors border border-red-500/20 flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Transfer
                </button>
              </div>
            ) : null}

            {state === 'connecting' && !fileInfo && (
              <div className="w-full flex items-center justify-center h-20">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
