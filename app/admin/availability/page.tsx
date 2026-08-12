"use client"

import { useEffect, useState } from "react"
import { Ban, Loader2, Plus, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, PanelHeader } from "@/components/admin/ui"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type AvailabilityRecord = {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

const DAY_OPTIONS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 0 },
] as const

const blocked = ["21 June 2025", "28 June 2025"]

function normalizeTime(value: string | null | undefined) {
  if (!value) return "09:00"
  return value.includes(":") ? value.slice(0, 5) : value
}

function createEmptyRecord(day: number): AvailabilityRecord {
  return {
    day_of_week: day,
    start_time: "09:00",
    end_time: "17:00",
    is_available: true,
  }
}

export default function AvailabilityPage() {
  const supabase = createClient()
  const [schedule, setSchedule] = useState<Record<number, AvailabilityRecord>>({})
  const [loading, setLoading] = useState(true)
  const [savingDay, setSavingDay] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function loadAvailability() {
    setLoading(true)
    setError("")

    const { data, error: fetchError } = await supabase
      .from("availability")
      .select("id, day_of_week, start_time, end_time, is_available")

    if (fetchError) {
      setSchedule({})
      setError(fetchError.message || "Unable to load availability.")
      setLoading(false)
      return
    }

    const next: Record<number, AvailabilityRecord> = {}
    for (const day of DAY_OPTIONS) {
      next[day.value] = createEmptyRecord(day.value)
    }

    for (const row of data ?? []) {
      const dayValue = Number(row.day_of_week)
      next[dayValue] = {
        id: row.id,
        day_of_week: dayValue,
        start_time: normalizeTime(row.start_time),
        end_time: normalizeTime(row.end_time),
        is_available: row.is_available !== false,
      }
    }

    setSchedule(next)
    setLoading(false)
  }

  useEffect(() => {
    loadAvailability()
  }, [])

  function toggleDay(dayValue: number) {
    setSchedule((prev) => ({
      ...prev,
      [dayValue]: {
        ...(prev[dayValue] ?? createEmptyRecord(dayValue)),
        is_available: !(prev[dayValue]?.is_available ?? true),
      },
    }))
  }

  function updateTime(dayValue: number, field: "start_time" | "end_time", value: string) {
    setSchedule((prev) => ({
      ...prev,
      [dayValue]: {
        ...(prev[dayValue] ?? createEmptyRecord(dayValue)),
        [field]: value,
      },
    }))
  }

  async function saveDay(dayValue: number) {
    const record = schedule[dayValue] ?? createEmptyRecord(dayValue)
    const start = normalizeTime(record.start_time)
    const end = normalizeTime(record.end_time)

    if (record.is_available && start >= end) {
      setError("Start time must be earlier than end time.")
      return
    }

    const payload = {
      day_of_week: dayValue,
      start_time: start,
      end_time: end,
      is_available: record.is_available,
    }

    setSavingDay(dayValue)
    setError("")
    setSuccess("")

    let result
    if (record.id) {
      result = await supabase.from("availability").update(payload).eq("id", record.id)
    } else {
      result = await supabase.from("availability").insert([payload])
    }

    setSavingDay(null)

    if (result.error) {
      const message = result.error.message || "Unable to save availability."
      setError(
        message.includes("policy") || message.includes("permission") || message.includes("RLS")
          ? "This update is not allowed by the current Supabase permissions."
          : message,
      )
      return
    }

    setSuccess(`${DAY_OPTIONS.find((day) => day.value === dayValue)?.label ?? "Day"} saved successfully.`)
    await loadAvailability()
  }

  return (
    <AdminShell title="Availability" subtitle="Set your weekly hours and block dates">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Panel>
          <PanelHeader title="Weekly Hours" />

          {error ? (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mb-4 rounded-xl border border-primary/30 bg-secondary px-3 py-2 text-sm text-primary">
              {success}
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border/60 bg-background/50 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading availability...
              </span>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {DAY_OPTIONS.map((day) => {
                const item = schedule[day.value] ?? createEmptyRecord(day.value)
                const available = item.is_available

                return (
                  <li
                    key={day.value}
                    className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={available}
                        onClick={() => toggleDay(day.value)}
                        className={cn(
                          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                          available ? "bg-primary" : "bg-border",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-card transition-transform",
                            available ? "translate-x-[22px]" : "translate-x-0.5",
                          )}
                        />
                      </button>
                      <span className="font-medium text-foreground">{day.label}</span>
                    </div>

                    {available ? (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Start</span>
                          <input
                            type="time"
                            value={item.start_time}
                            onChange={(e) => updateTime(day.value, "start_time", e.target.value)}
                            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </label>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>End</span>
                          <input
                            type="time"
                            value={item.end_time}
                            onChange={(e) => updateTime(day.value, "end_time", e.target.value)}
                            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => saveDay(day.value)}
                          disabled={savingDay === day.value}
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingDay === day.value ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Unavailable</span>
                        <button
                          type="button"
                          onClick={() => saveDay(day.value)}
                          disabled={savingDay === day.value}
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingDay === day.value ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
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
                <button type="button" aria-label={`Unblock ${b}`} className="text-muted-foreground hover:text-foreground">
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
