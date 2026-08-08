import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-border-subtle/30 py-4 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-3 z-30 relative backdrop-blur-md bg-transparent shrink-0">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">



        <span>&copy; {new Date().getFullYear()} Sendme.alt.</span>
        <span className="hidden sm:inline">Secure P2P File Transfer.</span>
        <span className="hidden sm:inline"> · Built by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-primary hover:text-purple-400 transition-colors">Gaurav Patil</a></span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
        <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Privacy</Link>
        <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Terms</Link>
        <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Acceptable Use</Link>
        <div className="flex items-center gap-2.5 sm:pl-3.5 sm:border-l border-border-subtle/60">
          <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-full hover:bg-bg-elevated/60" title="GitHub">
            <Github className="w-4 h-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-full hover:bg-bg-elevated/60" title="Portfolio">
            <Globe className="w-4 h-4" />
            <span className="sr-only">Portfolio</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

