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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
            {/* Left side - Hero & Features */}
            <div className="space-y-8 lg:space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse shadow-lg shadow-green-300/50"></span>
                  <span className="text-sm font-medium text-white">WebRTC Powered</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  <span className="block">Share files</span>
                  <span className="block text-gradient">instantly</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
                  Transfer files up to 10GB directly between devices with military-grade encryption. No cloud storage, no registration required.
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    End-to-end encrypted
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No file size limits*
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    P2P connection
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards - Desktop Only */}
              <div className="hidden lg:grid grid-cols-1 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group glass-card p-5 rounded-2xl hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-2xl border border-blue-500/20">
                      ⚡
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1.5 text-white">Direct Peer Transfer</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Files travel directly from sender to receiver. No intermediary servers means maximum speed.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group glass-card p-5 rounded-2xl hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-2xl border border-green-500/20">
                      🔒
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1.5 text-white">Zero Knowledge Architecture</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Your files never touch our servers. Complete privacy guaranteed by WebRTC encryption.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group glass-card p-5 rounded-2xl hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-2xl border border-purple-500/20">
                      🚀
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1.5 text-white">Simple & Instant</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        No accounts, no downloads. Just pick a file, share a code, and transfer.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Transfer Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl">
                {/* Mode Toggle */}
                <div className="relative bg-white/20 rounded-2xl p-1.5 mb-6 border border-white/30 backdrop-blur-sm">
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-y-1.5 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl shadow-lg"
                    initial={false}
                    animate={{
                      left: mode === 'send' ? '0.375rem' : '50%',
                      right: mode === 'send' ? '50%' : '0.375rem',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                  />
                  
                  <div className="relative grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setMode('send')}
                      className={`relative py-3.5 px-4 rounded-xl font-semibold transition-colors text-base ${
                        mode === 'send' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                      }`}
                      type="button"
                    >
                      📤 Send
                    </button>
                    <button
                      onClick={() => setMode('receive')}
                      className={`relative py-3.5 px-4 rounded-xl font-semibold transition-colors text-base ${
                        mode === 'receive' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                      }`}
                      type="button"
                    >
                      📥 Receive
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="min-h-[400px] sm:min-h-[450px]"
                >
                  {mode === 'send' ? <SendMode /> : <ReceiveMode />}
                </motion.div>
              </div>
              
              <p className="text-center text-xs text-white/70 mt-4">
                * Up to 10GB per transfer. Files expire after 10 minutes.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
