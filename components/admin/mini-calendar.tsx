"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Dots mark days that have appointments (demo data around 18 June 2025)
const busyDays = new Set([2, 3, 5, 9, 11, 12, 16, 18, 19, 24, 25, 26, 28])

export function MiniCalendar({
  initialMonth = 5,
  initialYear = 2025,
  selectedDay = 18,
}: {
  initialMonth?: number
  initialYear?: number
  selectedDay?: number
}) {
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)

  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const isTargetMonth = month === initialMonth && year === initialYear

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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous month"
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-base text-foreground">
          {MONTHS[month]} {year}
        </p>
        <button
          type="button"
          onClick={next}
          aria-label="Next month"
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-muted-foreground">
        {DOW.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e-${i}`} />
          const selected = isTargetMonth && d === selectedDay
          const busy = isTargetMonth && busyDays.has(d)
          return (
            <div key={d} className="flex flex-col items-center">
              <button
                type="button"
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full text-sm transition-colors",
                  selected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                {d}
              </button>
              <span
                className={cn(
                  "mt-0.5 h-1 w-1 rounded-full",
                  busy && !selected ? "bg-terracotta/70" : "bg-transparent",
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
