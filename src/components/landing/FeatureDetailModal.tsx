'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Cpu, Zap, Lock, HardDrive, Trash2, Globe, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Glass Card Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-border-subtle shadow-2xl z-10 overflow-hidden text-left bg-bg-surface/95 dark:bg-bg-surface/90"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-md shadow-purple-500/20 shrink-0`}>
                <div className="w-full h-full bg-bg-surface rounded-[14px] flex items-center justify-center">
                  <IconComp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{feature.title}</h2>
                <p className="text-xs sm:text-sm font-semibold text-text-secondary">{feature.subtitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full glass-card hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors border border-border-subtle"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tagline Pill */}
          <div className="mb-6 p-3 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{feature.tagline}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {feature.metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl glass-panel text-center border border-border-subtle bg-bg-surface/80 dark:bg-bg-elevated/40">
                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">{m.label}</p>
                <p className="text-base sm:text-lg font-extrabold text-text-primary">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Description & Tech Details */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> How It Works
              </h3>
              <p className="text-xs sm:text-sm text-text-primary dark:text-text-secondary leading-relaxed font-normal">{feature.description}</p>
            </div>

            <div className="p-3.5 rounded-xl glass-card border border-border-subtle bg-bg-elevated/60 dark:bg-bg-elevated/40">
              <h4 className="text-xs font-bold text-text-primary mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Technical Under the Hood
              </h4>
              <p className="text-xs text-text-secondary dark:text-text-muted leading-relaxed">{feature.techDetails}</p>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5">Key Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {feature.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-text-primary dark:text-text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-4 border-t border-border-subtle/60">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-[0.98]"
            >
              Got It
            </button>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  )
}
