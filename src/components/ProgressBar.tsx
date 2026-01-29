/**
 * sendme.alt - Progress Bar Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useEffect, useRef } from 'react'
import { formatBytes, formatSpeed, formatTime } from '@/lib/transfer'
import type { ProgressInfo } from '@/types'

interface ProgressBarProps {
  progress: ProgressInfo
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  // 60 FPS progress animation using requestAnimationFrame
  useEffect(() => {
    if (!barRef.current) return

    let animationFrameId: number
    const animate = () => {
      if (barRef.current) {
        const percentage = Math.min(progress.percentage, 100)
        barRef.current.style.transform = `scaleX(${percentage / 100})`
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [progress.percentage])

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
        <div
          ref={barRef}
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-pink-300 origin-left will-change-transform shadow-lg shadow-pink-500/50"
          style={{ transform: 'scaleX(0)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white/20 rounded-lg px-3 py-2 border border-white/30 backdrop-blur-sm">
          <div className="text-white/80 text-[10px] mb-0.5">Progress</div>
          <div className="font-semibold text-white">{Math.round(progress.percentage)}%</div>
        </div>
        <div className="bg-white/20 rounded-lg px-3 py-2 border border-white/30 backdrop-blur-sm">
          <div className="text-white/80 text-[10px] mb-0.5">Speed</div>
          <div className="font-semibold text-white">{formatSpeed(progress.speed)}</div>
        </div>
        <div className="bg-white/20 rounded-lg px-3 py-2 border border-white/30 backdrop-blur-sm">
          <div className="text-white/80 text-[10px] mb-0.5">Transferred</div>
          <div className="font-semibold text-white truncate">
            {formatBytes(progress.bytesTransferred)}
          </div>
        </div>
        <div className="bg-white/20 rounded-lg px-3 py-2 border border-white/30 backdrop-blur-sm">
          <div className="text-white/80 text-[10px] mb-0.5">ETA</div>
          <div className="font-semibold text-white">{formatTime(progress.eta)}</div>
        </div>
      </div>
    </div>
  )
}
