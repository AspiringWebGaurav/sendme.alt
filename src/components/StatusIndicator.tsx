'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Loader2, CheckCircle2, XCircle, Radio, Clock } from 'lucide-react'
import { TransferState } from '@/types'

interface StatusIndicatorProps {
 mode: 'send' | 'receive'
 state: TransferState
}

const stateConfig: Record<string, {
 label: string;
 icon: React.ElementType;
 color: string;
 bgColor: string;
 borderColor: string;
 pulse?: boolean;
 spin?: boolean;
}> = {
 idle: {
 label: 'Ready',
 icon: Wifi,
 color: 'text-success-text ',
 bgColor: 'bg-success-bg ',
 borderColor: 'border-success-bg ',
 },
 connecting: {
 label: 'Connecting',
 icon: Loader2,
 color: 'text-cyan-600 ',
 bgColor: 'bg-cyan-500/10',
 borderColor: 'border-cyan-500/20',
 spin: true,
 },
 waiting: {
 label: 'Waiting for peer',
 icon: Clock,
 color: 'text-amber-600 ',
 bgColor: 'bg-amber-500/10',
 borderColor: 'border-amber-500/20',
 pulse: true,
 },
 transferring: {
 label: 'Transferring',
 icon: Radio,
 color: 'text-violet-600 ',
 bgColor: 'bg-violet-500/10',
 borderColor: 'border-violet-500/20',
 pulse: true,
 },
 complete: {
 label: 'Complete',
 icon: CheckCircle2,
 color: 'text-success-text ',
 bgColor: 'bg-success-bg ',
 borderColor: 'border-success-bg ',
 },
 error: {
 label: 'Error',
 icon: XCircle,
 color: 'text-error-text ',
 bgColor: 'bg-error-bg ',
 borderColor: 'border-error-bg ',
 },
}

export function StatusIndicator({ mode, state }: StatusIndicatorProps) {
 const config = stateConfig[state] || stateConfig.idle

 // Override label for connecting based on mode
 const label = state === 'connecting'
 ? (mode === 'send' ? 'Generating Token' : 'Connecting')
 : config.label

 const Icon = config.icon

 return (
 <AnimatePresence mode="wait">
  <motion.div
  key={state}
  initial={{ opacity: 0, scale: 0.9, y: -8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 4 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm ${config.bgColor} ${config.borderColor} max-w-[calc(100vw-8rem)] sm:max-w-none shrink`}
  >
  <div className={`relative shrink-0 ${config.color}`}>
  <Icon className={`w-3.5 h-3.5 ${config.spin ? 'animate-spin' : ''}`} />
  {config.pulse && (
  <span className={`absolute inset-0 rounded-full ${config.color} animate-ping opacity-30`} />
  )}
  </div>
  <span className={`text-xs font-medium ${config.color} truncate`}>{label}</span>
  </motion.div>
 </AnimatePresence>
 )
}
