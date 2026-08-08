import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-border-subtle/60 py-3 sm:py-4 px-4 sm:px-8 text-xs text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-2.5 z-10 relative backdrop-blur-xl bg-bg-surface/50 shrink-0">
      <div className="flex items-center gap-1.5 text-[12px] sm:text-xs text-text-muted">
        <span>&copy; {new Date().getFullYear()} Sendme.alt.</span>
        <span className="hidden sm:inline">Secure P2P File Transfer.</span>
        <span className="hidden sm:inline"> · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-primary hover:text-color-primary transition-colors">Gaurav Patil</a></span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
        <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Privacy</Link>
        <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Terms</Link>
        <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Acceptable Use</Link>
        <div className="flex items-center gap-2 sm:pl-3 sm:border-l border-border-subtle/60">
          <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors p-1" title="GitHub">
            <Github className="w-3.5 h-3.5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors p-1" title="Portfolio">
            <Globe className="w-3.5 h-3.5" />
            <span className="sr-only">Portfolio</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
