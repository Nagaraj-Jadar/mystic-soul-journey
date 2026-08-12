import { cn } from '@/lib/utils'

function Ornament() {
  return (
    <span className="mt-4 flex items-center justify-center gap-2 text-terracotta/70" aria-hidden="true">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-terracotta/50" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 3c1 2 1 4 0 6-1-2-1-4 0-6Zm0 6c2-1 4-1 6 0-2 1-4 1-6 0Zm0 0c-2-1-4-1-6 0 2 1 4 1 6 0Zm0 0c1 2 1 4 0 6-1-2-1-4 0-6Z" />
      </svg>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-terracotta/50" />
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  ornament = true,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: 'center' | 'left'
  className?: string
  ornament?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-medium text-primary sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
        {title}
      </h2>
      {ornament && align === 'center' && <Ornament />}
      {description && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground',
            align === 'center' ? 'mx-auto' : '',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
