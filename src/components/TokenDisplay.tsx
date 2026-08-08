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
      <div className="w-full flex flex-col items-center justify-center p-6 border border-dashed border-border-subtle/70 rounded-2xl glass-panel">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-text-secondary">Generating secure relay token...</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-2.5">
      <p className="text-xs font-semibold text-text-muted">Share this code with receiver</p>
      <div className="w-full flex items-center justify-between glass-panel border border-purple-500/30 p-2 pl-4 sm:pl-6 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <span className="text-3xl sm:text-4xl font-mono tracking-[0.25em] text-text-primary font-bold uppercase ml-2">
          {token}
        </span>
        <button
          onClick={onCopy}
          className={`p-3 sm:p-3.5 rounded-xl transition-all duration-300 shrink-0 ${
            copySuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm'
          }`}
          title="Copy Token"
        >
          {copySuccess ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  )
}
