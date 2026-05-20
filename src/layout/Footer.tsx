import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

export function Footer() {
 return (
 <footer className="w-full mt-auto border-t border-border-subtle py-4 sm:py-6 px-4 sm:px-8 text-xs text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative bg-bg-surface/50 backdrop-blur-sm">
 <div className="flex items-center gap-1 text-[13px] text-text-muted text-text-muted ">
 <span>&copy; {new Date().getFullYear()} Sendme.alt.</span>
 <span className="hidden sm:inline">Secure P2P File Transfer.</span>
 <span className="hidden sm:inline"> · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary text-text-secondary hover:text-accent-primary transition-colors">Gaurav Patil</a></span>
 </div>
 <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
 <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-accent-primary transition-colors">Privacy</Link>
 <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-accent-primary transition-colors">Terms</Link>
 <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-accent-primary transition-colors">Acceptable Use</Link>
 <div className="flex items-center gap-3 sm:gap-4 sm:ml-2 sm:border-l border-border-subtle sm:pl-6">
 <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5" title="GitHub">
 <Github className="w-4 h-4" />
 <span className="sr-only">GitHub</span>
 </a>
 <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5" title="Portfolio">
 <Globe className="w-4 h-4" />
 <span className="sr-only">Portfolio</span>
 </a>
 </div>
 </div>
 </footer>
 )
}
