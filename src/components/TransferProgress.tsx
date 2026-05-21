export function TransferProgress({ progress }: { progress: number }) {
 return (
 <div className="w-full h-3 bg-bg-surface rounded-full overflow-hidden border border-border-subtle shadow-inner">
 <div
 className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out flex items-center justify-end pr-1"
 style={{ width: `${progress}%` }}
 >
 <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
 </div>
 </div>
 )
}
