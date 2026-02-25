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
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
    },
    connecting: {
        label: 'Connecting',
        icon: Loader2,
        color: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
        spin: true,
    },
    waiting: {
        label: 'Waiting for peer',
        icon: Clock,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        pulse: true,
    },
    transferring: {
        label: 'Transferring',
        icon: Radio,
        color: 'text-violet-600 dark:text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/20',
        pulse: true,
    },
    complete: {
        label: 'Complete',
        icon: CheckCircle2,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
    },
    error: {
        label: 'Error',
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
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
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm ${config.bgColor} ${config.borderColor}`}
            >
                <div className={`relative ${config.color}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.spin ? 'animate-spin' : ''}`} />
                    {config.pulse && (
                        <span className={`absolute inset-0 rounded-full ${config.color} animate-ping opacity-30`} />
                    )}
                </div>
                <span className={`text-xs font-medium ${config.color}`}>{label}</span>
            </motion.div>
        </AnimatePresence>
    )
}
