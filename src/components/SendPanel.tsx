'use client'

import { useSend } from '@/hooks/useSend'
import { DropZone } from './DropZone'
import { TokenDisplay } from './TokenDisplay'
import { TransferProgress } from './TransferProgress'
import { TransferStats } from './TransferStats'
import { CancelButton } from './CancelButton'
import { StatusIndicator } from './StatusIndicator'
import { SuccessView } from './SuccessView'
import { XCircle } from 'lucide-react'

export function SendPanel() {
    const {
        state,
        file,
        token,
        progress,
        error,
        isGeneratingToken,
        copySuccess,
        selectFile,
        cancel,
        removeFile,
        handleCopyToken,
        startSending,
    } = useSend()

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex justify-between items-start z-10">
                <StatusIndicator mode="send" state={state} />
                {(state === 'connecting' || state === 'waiting') && (
                    <CancelButton onCancel={cancel} label="Cancel Send" />
                )}
            </div>

            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-4 sm:gap-8 mt-10 sm:mt-8">
                {state === 'idle' || state === 'error' ? (
                    <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
                        <DropZone
                            file={file}
                            onFileSelect={selectFile}
                            onFileRemove={removeFile}
                            error={error}
                        />
                        {file && (
                            <button
                                onClick={startSending}
                                disabled={isGeneratingToken}
                                className="w-full max-w-[200px] py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                            >
                                {isGeneratingToken ? 'Generating Token...' : 'Start Transfer'}
                            </button>
                        )}
                    </div>
                ) : state === 'complete' ? (
                    <SuccessView
                        mode="send"
                        fileName={file?.name}
                        fileSize={file?.size}
                        onReset={cancel}
                    />
                ) : (
                    <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
                        <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 shadow-sm dark:shadow-none">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                📄
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <p className="text-sm font-medium truncate">{file?.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                            </div>
                        </div>

                        {state === 'connecting' || state === 'waiting' ? (
                            <TokenDisplay
                                token={token}
                                isGenerating={isGeneratingToken}
                                onCopy={() => token && handleCopyToken(token)}
                                copySuccess={copySuccess}
                            />
                        ) : null}

                        {state === 'transferring' && progress ? (
                            <div className="w-full space-y-3 sm:space-y-4">
                                <TransferProgress progress={progress.percentage} />
                                <TransferStats
                                    speed={progress.speed}
                                    transferred={progress.bytesTransferred}
                                    total={file?.size || 0}
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
                    </div>
                )}
            </div>
        </div>
    )
}
