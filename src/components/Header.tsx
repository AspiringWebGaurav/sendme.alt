/**
 * sendme.alt - Header Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

export function Header() {
  return (
    <header className="text-center mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        sendme.alt
      </h1>
      <p className="text-sm sm:text-base text-white/60">
        Blazing fast P2P file transfer
      </p>
    </header>
  )
}
