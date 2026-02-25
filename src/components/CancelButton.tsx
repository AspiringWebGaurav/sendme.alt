import { XCircle } from 'lucide-react'

interface CancelButtonProps {
    onCancel: () => void
    label?: string
}

export function CancelButton({ onCancel, label = 'Cancel' }: CancelButtonProps) {
    return (
        <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-zinc-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors text-xs font-medium border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur-md"
            title={label}
        >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
        </button>
    )
}
