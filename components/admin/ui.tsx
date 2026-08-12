import type { LucideIcon } from "lucide-react"
import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-2xl border border-border/70 bg-card p-5 md:p-6", className)}>{children}</section>
  )
}

export function PanelHeader({
  title,
  action,
  className,
}: {
  title: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 className="font-serif text-lg text-foreground">{title}</h2>
      {action}
    </div>
  )
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  change?: string
  tone?: "sage" | "peach" | "terracotta" | "muted"
}

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  sage: "bg-secondary text-primary",
  peach: "bg-peach text-terracotta",
  terracotta: "bg-terracotta/15 text-terracotta",
  muted: "bg-muted text-muted-foreground",
}

export function StatCard({ icon: Icon, label, value, change, tone = "sage" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-start gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 font-serif text-2xl text-foreground">{value}</p>
        </div>
      </div>
      {change ? (
        <p className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
          <TrendingUp className="h-3.5 w-3.5" /> {change}
        </p>
      ) : null}
    </div>
  )
}

const statusStyles: Record<string, string> = {
  Confirmed: "bg-secondary text-primary",
  Paid: "bg-secondary text-primary",
  Published: "bg-secondary text-primary",
  "Pending Payment": "bg-peach text-terracotta",
  Pending: "bg-peach text-terracotta",
  Draft: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  )
}

export function formatINR(n: number) {
  return `₹ ${n.toLocaleString("en-IN")}`
}
