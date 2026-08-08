'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Cpu, Zap, Lock, HardDrive, Trash2, Globe, Shield, CheckCircle2, Sparkles } from 'lucide-react'

export interface FeatureDetail {
  id: string
  title: string
  subtitle: string
  icon: any
  tagline: string
  color: string
  metrics: { label: string; value: string }[]
  highlights: string[]
  description: string
  techDetails: string
}

export const FEATURE_DETAILS: FeatureDetail[] = [
  {
    id: 'up-to-10gb',
    title: 'Up to 10GB Transfers',
    subtitle: 'High-Throughput Chunked Streaming',
    icon: Zap,
    tagline: 'Stream gigabytes of data directly from browser RAM to browser RAM.',
    color: 'from-amber-500 via-purple-500 to-indigo-500',
    metrics: [
      { label: 'Max File Size', value: '10 GB' },
      { label: 'Chunk Size', value: '64 KB' },
      { label: 'RAM Pressure', value: '< 50 MB' },
    ],
    highlights: [
      'Zero local storage degradation during transfer',
      'Dynamic WebRTC backpressure flow control',
      'Automatic array buffer chunking & assembly',
      'High-speed throughput reaching LAN speeds'
    ],
    description: 'Sendme.alt utilizes modern browser FileSystemWritableFileStream and WebRTC DataChannels. Instead of buffering entire files in browser memory, files are sliced into binary 64KB micro-chunks that stream continuously to the receiver without crashing low-memory devices.',
    techDetails: 'WebSockets are only used for peer discovery signaling. Once the RTCDataChannel is opened with ordered binary streaming, data bypasses the server entirely.'
  },
  {
    id: 'e2e-encrypted',
    title: 'End-to-End Encrypted',
    subtitle: 'DTLS 1.2 / AES-256 Bit Security',
    icon: Lock,
    tagline: 'Cryptographically locked peer channels. Nobody in between can read your files.',
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    metrics: [
      { label: 'Cipher Suite', value: 'AES-256' },
      { label: 'Handshake', value: 'DTLS 1.2' },
      { label: 'Key Exchange', value: 'ECDHE' },
    ],
    highlights: [
      'Standard WebRTC mandatory encrypted channels',
      'Ephemeral peer keys generated per session',
      'Zero unencrypted server relay paths',
      'Protection against MITM network sniffing'
    ],
    description: 'Every transfer uses WebRTC’s mandatory Datagram Transport Layer Security (DTLS). Session keys are negotiated directly between your browser and the recipient browser using Elliptic-curve Diffie-Hellman (ECDHE key exchange).',
    techDetails: 'Even if signaling traffic was intercepted by a malicious node, the session payload cannot be decrypted without the private DTLS keys generated inside the client browser.'
  },
  {
    id: 'no-cloud-storage',
    title: 'No Cloud Storage',
    subtitle: 'Zero-Byte Persistence Architecture',
    icon: HardDrive,
    tagline: 'Your files never touch a server disk or database.',
    color: 'from-blue-500 via-indigo-500 to-purple-500',
    metrics: [
      { label: 'Server Disk Use', value: '0 Bytes' },
      { label: 'Database Logs', value: 'None' },
      { label: 'Privacy Grade', value: '100%' },
    ],
    highlights: [
      'Direct peer-to-peer byte stream',
      'No data upload to S3 or cloud buckets',
      'No account registration or email requirement',
      'Zero server maintenance or storage fees'
    ],
    description: 'Traditional file sharing uploads your sensitive files to cloud storage buckets (S3, GCP) where they linger for days. Sendme.alt creates a direct real-time pipe between two browsers.',
    techDetails: 'The backend WebSocket server only relays lightweight SDP (Session Description Protocol) offer/answer JSON payloads and ICE candidates.'
  },
  {
    id: 'auto-cleanup',
    title: 'Auto Cleanup',
    subtitle: 'Instant Ephemeral Token Revocation',
    icon: Trash2,
    tagline: 'Tokens and signaling channels self-destruct upon disconnect.',
    color: 'from-rose-500 via-purple-500 to-indigo-500',
    metrics: [
      { label: 'Token TTL', value: '10 Mins' },
      { label: 'Post Cleanup', value: 'Immediate' },
      { label: 'Memory Retention', value: '0 Seconds' },
    ],
    highlights: [
      'Short-lived 6-word human readable tokens',
      'Automatic garbage collection upon disconnect',
      'Single-use session pair matching',
      'Immediate socket room teardown'
    ],
    description: 'Once a transfer completes or a session is canceled, the signaling room and pairing tokens are immediately purged from memory. Attempting to reuse a past token will result in an immediate invalid token error.',
    techDetails: 'In-memory token registries trigger automated TTL sweeps every 60 seconds, ensuring abandoned or idle tokens are scrubbed automatically.'
  },
  {
    id: 'cross-browser',
    title: 'Cross Browser Support',
    subtitle: 'Universal WebRTC Standard Compatibility',
    icon: Globe,
    tagline: 'Works seamlessly across modern Chrome, Firefox, Safari, Edge, & mobile browsers.',
    color: 'from-purple-500 via-indigo-500 to-cyan-500',
    metrics: [
      { label: 'Chromium', value: 'Supported' },
      { label: 'Firefox', value: 'Supported' },
      { label: 'WebKit (Safari)', value: 'Supported' },
    ],
    highlights: [
      'Zero browser extensions or plugins required',
      'Mobile web & desktop web interoperability',
      'Standardized HTML5 File APIs',
      'Polyfilled RTCConfiguration setup'
    ],
    description: 'Built entirely on standard W3C HTML5 APIs and standard WebRTC specifications, Sendme.alt allows a Linux user on Firefox to seamlessly send files to an iPhone user on Safari or a Windows user on Chrome.',
    techDetails: 'Includes STUN fallback servers to navigate complex dual-stack IPv4/IPv6 networks across mobile cellular and Wi-Fi networks.'
  },
  {
    id: 'direct-tunneling',
    title: 'Direct P2P Tunneling',
    subtitle: 'ICE NAT Traversal & Hole Punching',
    icon: Shield,
    tagline: 'Bypasses server bandwidth bottlenecks for maximum speed.',
    color: 'from-cyan-500 via-blue-500 to-indigo-500',
    metrics: [
      { label: 'P2P Success Rate', value: '98.5%' },
      { label: 'Latency', value: '< 15 ms (LAN)' },
      { label: 'Server Bandwidth', value: '0 Mbps' },
    ],
    highlights: [
      'Automated ICE candidate gathering',
      'STUN server NAT hole punching',
      'LAN peer auto-discovery optimization',
      'Full speed unthrottled bandwidth'
    ],
    description: 'Using Interactive Connectivity Establishment (ICE), browsers discover the shortest and fastest path to reach each other—whether over the local Wi-Fi network or across global ISPs.',
    techDetails: 'If both peers are on the same local network, bytes travel directly through the local router at gigabit speeds without leaving the local subnetwork.'
  }
]

interface FeatureDetailModalProps {
  feature: FeatureDetail | null
  onClose: () => void
}

export function FeatureDetailModal({ feature, onClose }: FeatureDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!feature) return null

  const IconComp = feature.icon

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xl"
        />

        {/* Compact Glass Card Overlay - Bounded to fit 100vh with zero scroll and no edge touching */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] glass-panel p-5 sm:p-6 rounded-3xl border border-purple-500/25 shadow-2xl z-10 overflow-hidden text-left bg-bg-surface/95 dark:bg-[#12101a]/95 text-text-primary backdrop-blur-2xl flex flex-col justify-between my-auto"
        >
          {/* Ambient Glowing Background Accents */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-md shadow-purple-500/20 shrink-0`}>
                <div className="w-full h-full bg-bg-surface dark:bg-[#181524] rounded-[14px] flex items-center justify-center">
                  <IconComp className="w-5.5 h-5.5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">{feature.title}</h2>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{feature.subtitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full glass-card hover:bg-purple-500/15 text-text-muted hover:text-text-primary transition-all border border-border-subtle shadow-xs active:scale-95 shrink-0"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tagline Callout Banner */}
          <div className="mb-3.5 p-3 rounded-2xl glass-card border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 text-xs font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2.5 shadow-xs relative z-10 shrink-0">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="leading-snug">{feature.tagline}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-3.5 relative z-10 shrink-0">
            {feature.metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl glass-card text-center border border-border-subtle hover:border-purple-500/30 transition-all bg-bg-surface/80 dark:bg-[#1a1728]/80 shadow-xs">
                <p className="text-[9px] sm:text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-0.5">{m.label}</p>
                <p className="text-sm sm:text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono tracking-tight">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Description & Tech Details */}
          <div className="space-y-2.5 mb-3.5 relative z-10 shrink-0">
            <div className="glass-card p-3 rounded-2xl border border-border-subtle/80 bg-bg-surface/50 dark:bg-bg-elevated/30">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-text-primary mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> How It Works
              </h3>
              <p className="text-xs text-text-primary dark:text-text-secondary leading-relaxed font-normal">{feature.description}</p>
            </div>

            <div className="p-3 rounded-2xl glass-card border border-emerald-500/25 bg-emerald-500/5">
              <h4 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Technical Under the Hood
              </h4>
              <p className="text-xs text-text-secondary dark:text-text-muted leading-relaxed font-normal">{feature.techDetails}</p>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="mb-3.5 relative z-10 shrink-0">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">Key Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {feature.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 glass-card p-2 px-2.5 rounded-xl border border-border-subtle text-xs font-medium text-text-primary dark:text-text-secondary">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="truncate">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-3 border-t border-border-subtle/60 relative z-10 shrink-0">
            <button
              onClick={onClose}
              className="btn-action-glow font-bold px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs transition-all shadow-md shadow-purple-500/25 active:scale-95"
            >
              Got It
            </button>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  )
}
