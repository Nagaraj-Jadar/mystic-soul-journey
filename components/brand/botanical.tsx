import { cn } from '@/lib/utils'

/** Delicate single leafed sprig — used as a subtle decorative accent. */
export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      className={cn('h-40 w-32', className)}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M92 8C70 40 52 78 44 150" />
        <path d="M78 44c-14-2-24 4-30 16 14 2 24-4 30-16Z" />
        <path d="M84 30c8-10 20-13 30-11-3 11-12 18-24 18" />
        <path d="M66 78c-14-1-24 6-29 18 14 1 24-6 29-18Z" />
        <path d="M72 66c8-11 20-14 30-12-3 11-13 19-25 18" />
        <path d="M54 112c-12 0-21 6-25 17 12 0 21-6 25-17Z" />
        <path d="M60 102c7-10 18-13 27-11-3 10-12 17-23 17" />
      </g>
    </svg>
  )
}

/** Small lotus bloom line mark. */
export function LotusBloom({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      className={cn('h-6 w-8', className)}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 42c-2-10-2-20 0-28 2 8 2 18 0 28Z" />
        <path d="M32 42c-6-8-9-17-9-25 6 4 10 12 9 25Z" />
        <path d="M32 42c6-8 9-17 9-25-6 4-10 12-9 25Z" />
        <path d="M32 42c-10-4-17-11-20-19 8 0 17 6 20 19Z" />
        <path d="M32 42c10-4 17-11 20-19-8 0-17 6-20 19Z" />
      </g>
    </svg>
  )
}
