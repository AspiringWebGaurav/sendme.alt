import { formatBytes } from '@/core/webrtc/transfer'

interface TransferStatsProps {
    speed: number
    transferred: number
    total: number
}

export function TransferStats({ speed, transferred, total }: TransferStatsProps) {
    const percent = total > 0 ? (transferred / total) * 100 : 0

    return (
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono w-full px-1">
            <div className="flex flex-col">
                <span>{formatBytes(transferred)} / {formatBytes(total)}</span>
                <span className="text-zinc-500 mt-0.5">{percent.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col text-right">
                <span className="text-accent">{formatBytes(speed)}/s</span>
                <span className="text-zinc-500 mt-0.5">Speed</span>
            </div>
        </div>
    )
}
