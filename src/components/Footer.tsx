/**
 * sendme.alt - Footer Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-white/20 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <span>Built with</span>
            <span className="text-pink-300">♥</span>
            <span>by</span>
            <a
              href="https://gauravpatil.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 font-medium transition-colors"
            >
              Gaurav Patil
            </a>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
