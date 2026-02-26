import { Network } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'

export function Navbar() {
    return (
        <header className="h-12 sm:h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-border-subtle dark:border-white/5 bg-bg-surface dark:bg-transparent">
            <Link href="/" className="flex items-center gap-2 text-text-primary dark:text-zinc-100 font-medium tracking-tight hover:opacity-80 transition-opacity">
                <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-semibold">SENDME.ALT</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-text-muted dark:text-zinc-500">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-success-bg dark:bg-transparent px-2.5 py-1 rounded-md border border-success-bg dark:border-transparent text-success-text dark:text-zinc-500 font-medium">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success-text dark:bg-success"></span>
                    <span>P2P READY</span>
                </div>
                <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 mx-1"></div>
                <ThemeToggle />
            </div>
        </header>
    )
}
