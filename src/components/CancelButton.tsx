import { XCircle } from 'lucide-react'

interface CancelButtonProps {
 onCancel: () => void
 label?: string
}

export function CancelButton({ onCancel, label = 'Cancel' }: CancelButtonProps) {
 return (
  <button
  onClick={onCancel}
  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-bg-elevated hover:bg-bg-surface text-text-secondary hover:text-text-primary transition-colors text-xs font-medium border border-border-subtle shadow-sm backdrop-blur-md shrink-0"
  title={label}
  >
  <XCircle className="w-3.5 h-3.5 shrink-0" />
  <span className="hidden sm:inline">Cancel</span>
  </button>
 )
}
