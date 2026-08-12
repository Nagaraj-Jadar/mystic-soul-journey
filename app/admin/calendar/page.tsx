"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel } from "@/components/admin/ui"
import { allAppointments } from "@/lib/data/admin"
import { cn } from "@/lib/utils"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Map demo appointments to specific June 2025 days
const dayAppointments: Record<number, { label: string; tone: "sage" | "peach" }[]> = {
  18: [
    { label: "Healing · 10:00", tone: "sage" },
    { label: "Akashic · 12:00", tone: "sage" },
    { label: "Guidance · 16:00", tone: "peach" },
  ],
  19: [{ label: "Energy · 11:00", tone: "sage" }],
  20: [{ label: "Healing · 10:00", tone: "sage" }],
  21: [{ label: "Akashic · 16:00", tone: "peach" }],
  22: [{ label: "Guidance · 14:00", tone: "sage" }],
  25: [{ label: "Course starts", tone: "peach" }],
}

export default function CalendarPage() {
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2025)

  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const isJune2025 = month === 5 && year === 2025

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function prev() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  function next() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }

  return (
    <AdminShell title="Calendar" subtitle="See your month at a glance">
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous month"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next month"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border/60 pb-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (d === null) return <div key={`e-${i}`} className="min-h-24 border-b border-r border-border/40" />
            const appts = isJune2025 ? dayAppointments[d] ?? [] : []
            const isToday = isJune2025 && d === 18
            return (
              <div
                key={d}
                className="min-h-24 border-b border-r border-border/40 p-1.5 [&:nth-child(7n)]:border-r-0"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-sm",
                    isToday ? "bg-primary font-semibold text-primary-foreground" : "text-foreground",
                  )}
                >
                  {d}
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {appts.map((a) => (
                    <span
                      key={a.label}
                      className={cn(
                        "truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        a.tone === "sage" ? "bg-secondary text-primary" : "bg-peach text-terracotta",
                      )}
                    >
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </AdminShell>
  )
}
