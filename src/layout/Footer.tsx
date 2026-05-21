import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

export function Footer() {
 return (
 <footer className="w-full mt-auto border-t border-border-subtle pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:py-6 px-4 sm:px-8 text-xs text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative bg-bg-surface/50 backdrop-blur-sm">
 <div className="flex items-center gap-1 text-[13px] text-text-muted text-text-muted ">
 <span>&copy; {new Date().getFullYear()} Sendme.alt.</span>
 <span className="hidden sm:inline">Secure P2P File Transfer.</span>
 <span className="hidden sm:inline"> · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="relative font-semibold text-text-primary hover:text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-gradient-to-r after:from-color-primary after:to-color-accent after:transition-transform after:duration-300 after:ease-in-out">Gaurav Patil</a></span>
 </div>
 <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
 <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-color-primary transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200">Privacy</Link>
 <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-color-primary transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200">Terms</Link>
 <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted font-medium hover:text-color-primary transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200">Acceptable Use</Link>
 <div className="flex items-center gap-3 sm:gap-4 sm:ml-2 sm:border-l border-border-subtle sm:pl-6">
 <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-all hover:scale-110 active:scale-95 duration-200 flex items-center gap-1.5" title="GitHub">
 <Github className="w-4 h-4" />
 <span className="sr-only">GitHub</span>
 </a>
 <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-all hover:scale-110 active:scale-95 duration-200 flex items-center gap-1.5" title="Portfolio">
 <Globe className="w-4 h-4" />
 <span className="sr-only">Portfolio</span>
 </a>
 </div>
 </div>
 </footer>
 )
}
