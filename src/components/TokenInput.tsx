import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface TokenInputProps {
 token: string
 onChange: (token: string) => void
 onSubmit: () => void
 error?: string | null
 isLoading?: boolean
}

export function TokenInput({ token, onChange, onSubmit, error, isLoading }: TokenInputProps) {
 return (
 <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-1 sm:mb-2">
 <span className="text-xl sm:text-2xl">🔑</span>
 </div>
 <h3 className="text-base sm:text-lg font-medium text-text-primary mb-1 sm:mb-2">Enter Transfer Code</h3>

 <div className="relative w-full max-w-sm">
 <input
 type="text"
 value={token}
 onChange={(e) => onChange(e.target.value.toLowerCase())}
 placeholder="E.g. abcd"
 className="w-full bg-bg-surface border border-border-subtle rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-14 sm:pr-16 text-3xl sm:text-4xl font-mono tracking-[0.25em] text-center text-text-primary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 focus:scale-[1.01] transition-all duration-300 shadow-sm placeholder:text-text-secondary/40 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] uppercase"
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
 className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-accent hover:bg-accent-dark text-text-inverse flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 {isLoading ? (
 <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin" />
 ) : (
 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
 )}
 </button>
 </div>

 {error && (
 <p className="text-xs text-error mt-1 sm:mt-2 text-center px-4 break-words w-full">{error}</p>
 )}
 </div>
 )
}
