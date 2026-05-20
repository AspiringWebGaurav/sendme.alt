'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
 const { theme, setTheme } = useTheme()
 const [mounted, setMounted] = React.useState(false)

 // Ensure it only renders on client to prevent hydration mismatch
 React.useEffect(() => {
 setMounted(true)
 }, [])

 if (!mounted) {
 return (
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center animate-pulse" />
 )
 }

 const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

 return (
 <button
 onClick={() => setTheme(isDark ? 'light' : 'dark')}
 className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-surface hover:bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors overflow-hidden"
 aria-label="Toggle theme"
 title="Toggle Theme"
 >
 <Sun className={`absolute w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
 <Moon className={`absolute w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
 </button>
 )
}
