'use client'

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
        startReceiving,
        cancel,
    } = useReceive()

    // Safely check if we are in connection phase without strict typescript overlap errors
    const isConnecting = state === 'connecting' as any;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex justify-between items-start z-10">
                <StatusIndicator mode="receive" state={state} />
                {(state === 'connecting' || state === 'waiting') && (
                    <CancelButton onCancel={cancel} label="Cancel Receive" />
                )}
            </div>

            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-4 sm:gap-8 mt-10 sm:mt-8">
                {state === 'idle' || state === 'error' ? (
                    <TokenInput
                        token={token}
                        onChange={setToken}
                        onSubmit={startReceiving}
                        error={error}
                        isLoading={isConnecting}
                    />
                ) : state === 'complete' ? (
                    <SuccessView
                        mode="receive"
                        fileName={receivedFileName || fileInfo?.name}
                        fileSize={fileInfo?.size}
                        onReset={cancel}
                    />
                ) : (
                    <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
                        {fileInfo && (
                            <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 shadow-sm dark:shadow-none">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                    📄
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-sm font-medium truncate">{receivedFileName || fileInfo.name}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
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
                                />
                                <button
                                    onClick={cancel}
                                    className="w-full mt-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-xl font-medium transition-colors border border-red-500/20 flex items-center justify-center gap-2 group"
                                >
                                    <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Cancel Transfer
                                </button>
                            </div>
                        ) : null}

                        {state === 'connecting' && !fileInfo && (
                            <div className="w-full flex items-center justify-center h-20 sm:h-24">
                                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
