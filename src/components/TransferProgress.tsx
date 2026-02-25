export function TransferProgress({ progress }: { progress: number }) {
    return (
        <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out flex items-center justify-end pr-1"
                style={{ width: `${progress}%` }}
            >
                <div className="w-1 h-1 rounded-full bg-white/50" />
            </div>
        </div>
    )
}
