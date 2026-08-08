import { useState } from 'react'
import { ArrowRight, KeyRound } from 'lucide-react'

interface TokenInputProps {
  token: string
  onChange: (token: string) => void
  onSubmit: () => void
  error?: string | null
  isLoading?: boolean
}

export function TokenInput({ token, onChange, onSubmit, error, isLoading }: TokenInputProps) {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <KeyRound className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">Enter Transfer Code</h3>

      <div className="relative w-full max-w-sm">
        <input
          type="text"
          value={token}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          placeholder="e.g. abcd"
          className="w-full glass-panel border border-cyan-500/30 rounded-2xl py-3 pl-4 pr-14 text-3xl font-mono tracking-[0.25em] text-center text-text-primary focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 shadow-sm placeholder:text-text-muted/40 uppercase font-bold"
          maxLength={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && token.trim().length > 0) {
              onSubmit()
            }
          }}
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={!token.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1 text-center px-4 break-words w-full font-medium">{error}</p>
      )}
    </div>
  )
}
