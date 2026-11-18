import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { Download, Globe, CheckCircle2, RefreshCw } from 'lucide-react'
import { APP_URLS } from '@/core/urls'

export const metadata: Metadata = {
  title: 'Send2Me was uninstalled',
  description: 'Send2Me has been removed from your device. You can reinstall anytime or transfer files online.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Send2Me was uninstalled',
    description: 'Send2Me has been removed from your device. Reinstall anytime.',
    url: `${APP_URLS.BASE_URL}/uninstalled`,
    siteName: 'Send2Me',
  },
}

export default function UninstalledPage() {
  const downloadUrl = 'https://gphost.eu.cc/raw/send2me-desktop'

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary selection:bg-purple-500/20 selection:text-purple-400">
      <Navbar variant="landing" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-bg-surface border border-border-strong flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-text-muted" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-3">
          Send2Me was uninstalled.
        </h1>

        <p className="text-sm sm:text-base text-text-secondary font-normal leading-relaxed mb-8 max-w-lg">
          The desktop app and its local cache have been removed from your computer. You can reinstall the Windows desktop app anytime or continue sending files directly in your web browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
          <a
            href={downloadUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-text-primary text-text-inverse font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="w-4 h-4" />
            Reinstall Desktop App
          </a>

          <Link
            href="/transfer?mode=send"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-bg-surface border border-border-strong text-text-primary font-semibold text-xs sm:text-sm hover:bg-bg-elevated transition-colors shadow-sm"
          >
            <Globe className="w-4 h-4" />
            Use Web Version
          </Link>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface/60 border border-border-subtle max-w-md w-full text-left">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary block font-medium mb-0.5">Zero Data Leftover Guarantee</strong>
              Your encryption keys and local transfer logs were cleared per your uninstall options. Files you already received stay safely in your Downloads folder.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
