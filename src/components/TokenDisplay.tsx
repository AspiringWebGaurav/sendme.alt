import { Copy, Check } from 'lucide-react'

interface TokenDisplayProps {
 token: string | null
 isGenerating: boolean
 onCopy: () => void
 copySuccess: boolean
}

export function TokenDisplay({ token, isGenerating, onCopy, copySuccess }: TokenDisplayProps) {
 if (isGenerating || !token) {
 return (
 <div className="w-full flex flex-col items-center justify-center p-6 sm:p-8 border border-dashed border-border-subtle rounded-2xl bg-bg-surface/30">
 <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
 <p className="text-xs sm:text-sm text-text-secondary">Negotiating secure relay...</p>
 </div>
 )
 }

 return (
 <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
 <p className="text-xs sm:text-sm font-medium text-text-secondary">Share this code with receiver</p>
 <div className="w-full flex items-center justify-between bg-bg-surface border border-primary/30 p-2 pl-4 sm:pl-6 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.1)]">
 <span className="text-xl sm:text-2xl lg:text-3xl font-mono tracking-widest text-text-primary font-medium">{token}</span>
 <button
 onClick={onCopy}
 className={`p-3 sm:p-4 rounded-xl transition-all shrink-0 ${copySuccess
 ? 'bg-success/20 text-success'
 : 'bg-primary hover:bg-primary-dark text-text-primary'
 }`}
 title="Copy Token"
 >
 {copySuccess ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
 </button>
 </div>
 </div>
 )
}
