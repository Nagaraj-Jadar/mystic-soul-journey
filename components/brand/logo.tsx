import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn('h-9 w-9', className)}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 40c-8 0-14-4-14-4s3-9 14-9 14 9 14 9-6 4-14 4Z" />
        <path d="M24 27c-4-2-6-7-6-11 0 0 4 2 6 6 2-4 6-6 6-6 0 4-2 9-6 11Z" />
        <path d="M24 27c-6 0-11-3-13-7 0 0 5-1 9 1M24 27c6 0 11-3 13-7 0 0-5-1-9 1" />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)}>
      <LotusMark className="h-11 w-11 text-[#caa06e] lg:h-16 lg:w-16" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.45rem] font-semibold leading-none tracking-tight text-primary lg:text-[2.25rem]">
          Mystic Soul
        </span>
        <span className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.42em] text-primary/80 lg:text-[0.72rem]">
          Journey
        </span>
        {!compact && (
          <span className="mt-1 text-[0.48rem] font-medium uppercase tracking-[0.22em] text-muted-foreground lg:text-[0.56rem]">
            Heal &middot; Awaken &middot; Transform
          </span>
        )}
      </span>
    </Link>
  )
}
