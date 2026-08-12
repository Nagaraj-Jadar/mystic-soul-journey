import { BookOpen, Flower2, Sun, Target, Users, type LucideIcon } from 'lucide-react'
import type { ServiceIcon as ServiceIconName } from '@/lib/data/services'
import { cn } from '@/lib/utils'

const iconMap: Record<ServiceIconName, LucideIcon> = {
  lotus: Flower2,
  book: BookOpen,
  sun: Sun,
  target: Target,
  users: Users,
}

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconName
  className?: string
}) {
  const Icon = iconMap[name]
  return <Icon className={cn('h-5 w-5', className)} strokeWidth={1.5} />
}
