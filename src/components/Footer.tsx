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
    <footer className="w-full py-3 sm:py-4 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-white/40">
          <p className="text-center sm:text-left">
            Created by{' '}
            <a
              href="https://gauravpatil.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors"
            >
              Gaurav Patil
            </a>
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="hover:text-white/60 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/terms"
              className="hover:text-white/60 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
