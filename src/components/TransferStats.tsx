import { formatBytes } from '@/core/webrtc/transfer'

interface TransferStatsProps {
  speed: number
  transferred: number
  total: number
  connectionType?: 'Direct P2P' | 'STUN' | 'TURN'
}

export function TransferStats({ speed, transferred, total, connectionType }: TransferStatsProps) {
  const percent = total > 0 ? (transferred / total) * 100 : 0

  return (
    <div className="flex items-center justify-between text-xs text-text-secondary font-mono w-full px-1">
      <div className="flex flex-col">
        <span>{formatBytes(transferred)} / {formatBytes(total)}</span>
        <span className="text-text-muted mt-0.5">{percent.toFixed(1)}%</span>
      </div>
      
      {connectionType && (
        <div className="flex flex-col items-center justify-center">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            connectionType === 'Direct P2P' ? 'bg-green-500/10 text-green-500' :
            connectionType === 'STUN' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-orange-500/10 text-orange-500'
          }`}>
            {connectionType}
          </span>
        </div>
      )}

      <div className="flex flex-col text-right">
        <span className="text-accent">{formatBytes(speed)}/s</span>
        <span className="text-text-muted mt-0.5">Speed</span>
      </div>
    </div>
  )
}
