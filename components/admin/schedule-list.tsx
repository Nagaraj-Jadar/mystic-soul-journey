import Image from "next/image"
import { MoreVertical } from "lucide-react"
import type { Appointment } from "@/lib/data/admin"
import { StatusBadge } from "@/components/admin/ui"

export function ScheduleList({ items }: { items: Appointment[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:bg-background"
        >
          <div className="hidden shrink-0 flex-col text-sm leading-tight text-muted-foreground sm:flex">
            <span className="font-medium text-foreground">{a.startTime}</span>
            <span>{a.endTime}</span>
          </div>
          <Image
            src={a.avatar || "/placeholder.svg"}
            alt={a.client}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{a.service}</p>
            <p className="truncate text-sm text-muted-foreground">{a.client}</p>
          </div>
          <StatusBadge status={a.status} />
          <button
            type="button"
            aria-label="Appointment options"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  )
}
