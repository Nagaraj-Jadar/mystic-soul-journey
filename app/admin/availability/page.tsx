"use client"

import { useState } from "react"
import { Plus, X, Ban } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, PanelHeader } from "@/components/admin/ui"
import { weeklyAvailability } from "@/lib/data/admin"
import { cn } from "@/lib/utils"

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState(weeklyAvailability)
  const [blocked, setBlocked] = useState<string[]>(["21 June 2025", "28 June 2025"])

  function toggleDay(day: string) {
    setSchedule((prev) => prev.map((d) => (d.day === day ? { ...d, available: !d.available } : d)))
  }

  return (
    <AdminShell title="Availability" subtitle="Set your weekly hours and block dates">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Panel>
          <PanelHeader title="Weekly Hours" />
          <ul className="flex flex-col gap-3">
            {schedule.map((d) => (
              <li
                key={d.day}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={d.available}
                    onClick={() => toggleDay(d.day)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      d.available ? "bg-primary" : "bg-border",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-card transition-transform",
                        d.available ? "translate-x-[22px]" : "translate-x-0.5",
                      )}
                    />
                  </button>
                  <span className="font-medium text-foreground">{d.day}</span>
                </div>

                {d.available ? (
                  <div className="flex flex-wrap gap-2">
                    {d.slots.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        {s}
                        <button type="button" aria-label={`Remove ${s}`} className="text-primary/60 hover:text-primary">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" /> Add slot
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="h-fit">
          <PanelHeader title="Blocked Dates" />
          <ul className="flex flex-col gap-2">
            {blocked.map((b) => (
              <li
                key={b}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Ban className="h-4 w-4 text-terracotta" /> {b}
                </span>
                <button
                  type="button"
                  aria-label={`Unblock ${b}`}
                  onClick={() => setBlocked((prev) => prev.filter((x) => x !== b))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" /> Block a Date
          </button>
        </Panel>
      </div>
    </AdminShell>
  )
}
