/**
 * sendme.alt - Main Page
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SendMode } from '@/components/SendMode'
import { ReceiveMode } from '@/components/ReceiveMode'

export default function HomePage() {
  const [mode, setMode] = useState<'send' | 'receive'>('send')

  return (
    <div className="h-[90vh] flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Features (Desktop) / Hidden on mobile */}
            <div className="hidden lg:block space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  sendme.alt
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Blazing fast P2P file transfer
                </p>
              </motion.div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
                      <p className="text-white/70 text-sm">
                        Direct peer-to-peer transfer. No servers, no delays.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🔒</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Private & Secure</h3>
                      <p className="text-white/70 text-sm">
                        End-to-end encrypted. Files never touch our servers.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">No Signup Required</h3>
                      <p className="text-white/70 text-sm">
                        Just share a code and transfer. Max file size: 3GB.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Transfer Interface */}
            <div className="w-full max-w-2xl mx-auto lg:mx-0">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  sendme.alt
                </h1>
                <p className="text-sm sm:text-base text-white/60">
                  Blazing fast P2P file transfer
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="relative bg-white/10 rounded-2xl p-1 mb-4 sm:mb-6">
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute top-1 bottom-1 bg-white/20 rounded-xl"
                  initial={false}
                  animate={{
                    left: mode === 'send' ? '0.25rem' : '50%',
                    right: mode === 'send' ? '50%' : '0.25rem',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                
            <div className="relative grid grid-cols-2 gap-1">
              <button
                onClick={() => setMode('send')}
                className={`py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  mode === 'send' ? 'text-white' : 'text-white/60'
                }`}
                type="button"
                aria-label="Switch to send mode"
                aria-pressed={mode === 'send'}
              >
                Send
              </button>
              <button
                onClick={() => setMode('receive')}
                className={`py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  mode === 'receive' ? 'text-white' : 'text-white/60'
                }`}
                type="button"
                aria-label="Switch to receive mode"
                aria-pressed={mode === 'receive'}
              >
                Receive
              </button>
            </div>
              </div>

              {/* Content Area */}
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] sm:min-h-[400px]"
              >
                {mode === 'send' ? <SendMode /> : <ReceiveMode />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
