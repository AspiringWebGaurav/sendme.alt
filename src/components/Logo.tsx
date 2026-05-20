import Link from 'next/link'

const SIZE_CONFIG = {
  sm: { container: 'w-7 h-7 rounded-md', text: 'text-xs', font: 'text-xs' },
  md: { container: 'w-8 h-8 rounded-lg', text: 'text-sm', font: 'text-sm' },
  lg: { container: 'w-10 h-10 rounded-xl', text: 'text-lg', font: 'text-lg' },
} as const

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  withLink?: boolean
}

export function Logo({ size = 'sm', withLink = false }: LogoProps) {
  const s = SIZE_CONFIG[size]

  const content = (
    <div className="flex items-center gap-2.5">
      <div className={`${s.container} bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold ${s.font} text-white`}>
        S
      </div>
      <span className={`font-semibold ${s.text} tracking-tight text-white`}>
        sendme.alt
      </span>
    </div>
  )

  if (withLink) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}