import Link from 'next/link'
import { cn } from '@/lib/utils'
import { whatsappLink } from '@/lib/data/site'

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn('h-4 w-4', className)} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.65.3c-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

export function WhatsAppButton({
  label = 'Chat on WhatsApp',
  message,
  className,
  variant = 'solid',
  size = 'default',
}: {
  label?: string
  message?: string
  className?: string
  variant?: 'solid' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}) {
  const sizeClasses = {
    sm: 'h-9 px-4 text-xs',
    default: 'h-11 px-6 text-sm',
    lg: 'h-12 px-7 text-sm',
  }[size]

  const variantClasses =
    variant === 'solid'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
      : 'border border-primary/25 bg-transparent text-primary hover:bg-primary/5'

  return (
    <Link
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors',
        sizeClasses,
        variantClasses,
        className,
      )}
    >
      <WhatsAppIcon />
      {label}
    </Link>
  )
}
