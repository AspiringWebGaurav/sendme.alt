import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto w-full absolute inset-0 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <nav className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Transfer
                    </Link>
                    <div className="flex gap-4 sm:gap-6 text-sm">
                        <Link href="/legal/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link href="/legal/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link href="/legal/aup" className="hover:text-zinc-900 dark:hover:text-white transition-colors">AUP</Link>
                    </div>
                </nav>
                <main className="prose dark:prose-invert prose-zinc max-w-none">
                    {children}
                </main>
                <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} Sendme.alt. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}
