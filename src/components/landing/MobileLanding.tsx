'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Shield, Download, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Navbar } from '@/layout/Navbar'
import { FeatureDetailModal, FEATURE_DETAILS, FeatureDetail } from './FeatureDetailModal'

export function MobileLanding() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null)

  const mobileFeatures = [
    { id: 'up-to-10gb', icon: Zap, title: "10GB", desc: "No Limit", color: "text-amber-500" },
    { id: 'e2e-encrypted', icon: Lock, title: "E2E", desc: "Encrypted", color: "text-emerald-500" },
    { id: 'no-cloud-storage', icon: HardDrive, title: "Zero Cloud", desc: "Direct P2P", color: "text-cyan-500" },
  ]

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated relative">
      {/* Mobile Ambient Glow Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Nav */}
      <Navbar variant="landing" />

      {/* Main Content — STRICT OVERFLOW HIDDEN & BALANCED VERTICAL SPACING */}
      <main className="flex-1 w-full flex flex-col items-center justify-around px-4 py-2 relative z-10 min-h-0 overflow-hidden">
        
        {/* Top Hero Block */}
        <div className="w-full flex flex-col items-center text-center max-w-xs">
          
          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-card text-[11px] font-semibold text-text-secondary mb-2.5 border border-purple-500/20 shadow-xs bg-bg-surface/80"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>WebRTC Encrypted P2P</span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-[32px] xs:text-4xl font-black tracking-tight text-text-primary leading-[1.1] mb-2"
          >
            Secure P2P <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
              File Transfer.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-[11px] sm:text-xs text-text-secondary mb-3 leading-relaxed px-1 font-normal max-w-[260px]"
          >
            No Signup. Zero Cloud Storage. Up to 10GB. Direct device tunneling.
          </motion.p>

          {/* Action CTA Buttons — Proportional Sizing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col gap-2 w-full max-w-[250px] mx-auto"
          >
            <Link 
              href="/transfer?mode=send" 
              className="btn-action-glow flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold transition-transform active:scale-[0.98] shadow-md shadow-purple-500/20 text-xs w-full"
            >
              Send File
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link 
              href="/transfer?mode=receive" 
              className="flex items-center justify-center gap-2 px-5 py-3 glass-panel active:bg-bg-elevated text-text-primary rounded-full font-bold transition-transform active:scale-[0.98] text-xs w-full border border-border-subtle shadow-xs"
            >
              Receive File
            </Link>

            <a 
              href="https://github.com/AspiringWebGaurav/send2me-rust-app/releases" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-1.5 px-4 py-2 glass-card active:bg-bg-elevated text-text-muted active:text-text-primary text-[10px] rounded-full font-medium transition-colors w-full border border-border-subtle/60"
            >
              <Download className="w-3.5 h-3.5 text-purple-500" />
              <span>Get Free PC App</span>
            </a>
          </motion.div>

        </div>

        {/* Compact 3-Card Mini Grid for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="w-full max-w-xs grid grid-cols-3 gap-2 shrink-0"
        >

          {mobileFeatures.map((ft) => {
            const detailObj = FEATURE_DETAILS.find((f) => f.id === ft.id)
            const IconComponent = ft.icon
            return (
              <button
                key={ft.id}
                onClick={() => detailObj && setSelectedFeature(detailObj)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl glass-panel text-center border border-border-subtle hover:border-purple-500/40 active:scale-95 transition-all shadow-xs bg-bg-surface/70"
              >
                <IconComponent className={`w-4 h-4 ${ft.color} mb-1`} />
                <span className="text-text-primary text-[11px] font-bold leading-tight">{ft.title}</span>
                <span className="text-[9px] text-text-muted leading-tight mt-0.5">{ft.desc}</span>
              </button>
            )
          })}
        </motion.div>
      </main>

      {/* Transparent Mobile Footer */}
      <footer className="w-full flex flex-col items-center gap-1.5 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shrink-0 border-t border-border-subtle/30 relative z-10 backdrop-blur-md bg-transparent">
        <div className="flex items-center justify-center gap-4 text-[11px] font-medium">
          <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted active:text-text-primary transition-colors">Privacy</Link>
          <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted active:text-text-primary transition-colors">Terms</Link>
          <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted active:text-text-primary transition-colors">Acceptable Use</Link>
        </div>
        <p className="text-[10px] text-text-muted">
          Built by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-primary active:text-purple-400">Gaurav Patil</a> · <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary">GitHub</a>
        </p>
      </footer>

      {/* Feature Detail Modal for Mobile */}
      <FeatureDetailModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  )
}
