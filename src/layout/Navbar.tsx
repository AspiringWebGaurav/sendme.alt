import { Network } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Navbar() {
    return (
        <header className="h-12 sm:h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-transparent">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-medium">
                <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="tracking-tight text-sm sm:text-base">SENDME.ALT</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-100 dark:bg-transparent px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success"></span>
                    <span>P2P READY</span>
                </div>
                <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 mx-1"></div>
                <ThemeToggle />
            </div>
        </header>
    )
}
