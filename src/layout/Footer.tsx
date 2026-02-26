import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

export function Footer() {
    return (
        <footer className="w-full mt-auto border-t border-border-subtle dark:border-white/5 py-4 sm:py-6 px-4 sm:px-8 text-xs text-text-secondary dark:text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative bg-bg-surface dark:bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-[13px] text-text-muted dark:text-zinc-500 dark:text-xs">
                <span>&copy; {new Date().getFullYear()} Sendme.alt.</span>
                <span className="hidden sm:inline">Secure P2P File Transfer.</span>
                <span className="hidden sm:inline"> · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary dark:text-zinc-400 hover:text-accent-primary dark:hover:text-zinc-300 transition-colors">Gaurav Patil</a></span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-primary dark:text-zinc-500 font-medium dark:font-normal hover:text-accent-primary dark:hover:text-zinc-300 transition-colors">Privacy</Link>
                <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-primary dark:text-zinc-500 font-medium dark:font-normal hover:text-accent-primary dark:hover:text-zinc-300 transition-colors">Terms</Link>
                <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-primary dark:text-zinc-500 font-medium dark:font-normal hover:text-accent-primary dark:hover:text-zinc-300 transition-colors">Acceptable Use</Link>
                <div className="flex items-center gap-3 sm:gap-4 sm:ml-2 sm:border-l border-border-subtle dark:border-white/10 sm:pl-6">
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors flex items-center gap-1.5" title="GitHub">
                        <Github className="w-4 h-4" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-primary dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors flex items-center gap-1.5" title="Portfolio">
                        <Globe className="w-4 h-4" />
                        <span className="sr-only">Portfolio</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
