import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ScrollIndicator } from './ScrollIndicator'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
 return (
 <div id="legal-scroll-container" className="min-h-screen bg-bg-primary text-text-secondary py-12 px-4 sm:px-6 lg:px-12 xl:px-24 overflow-y-auto scrollbar-hide w-full absolute inset-0 transition-colors duration-300">
 <ScrollIndicator />
 <div className="max-w-[1400px] mx-auto w-full">
 <nav className="mb-12 flex items-center justify-between border-b border-border-subtle pb-6">
 <Link
 href="/"
 className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
 >
 <ArrowLeft className="w-4 h-4 mr-2" />
 Back to Transfer
 </Link>
 <div className="flex gap-4 sm:gap-6 text-sm">
 <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
 <Link href="/legal/terms" className="hover:text-text-primary transition-colors">Terms</Link>
 <Link href="/legal/aup" className="hover:text-text-primary transition-colors">AUP</Link>
 </div>
 </nav>
 <main className="w-full">
 {children}
 </main>
 <footer className="mt-20 border-t border-border-subtle pt-8 text-center text-xs text-text-muted">
 <p>&copy; {new Date().getFullYear()} Sendme.alt. All rights reserved.</p>
 </footer>
 </div>
 </div>
 )
}
