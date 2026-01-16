/**
 * sendme.alt - Navigation Bar Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity"
        >
          sendme.alt
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/privacy"
            className={`text-sm sm:text-base transition-colors ${
              pathname === '/privacy'
                ? 'text-accent font-medium'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className={`text-sm sm:text-base transition-colors ${
              pathname === '/terms'
                ? 'text-accent font-medium'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Terms
          </Link>
        </div>
      </div>
    </nav>
  )
}
