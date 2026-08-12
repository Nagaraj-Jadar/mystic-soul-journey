"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { MoreVertical } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, StatusBadge } from "@/components/admin/ui"
import { SearchInput, FilterChips } from "@/components/admin/toolbar"
import { allAppointments, type AppointmentStatus } from "@/lib/data/admin"

const FILTERS = ["All", "Confirmed", "Pending", "Pending Payment", "Cancelled"] as const
type Filter = (typeof FILTERS)[number]

export default function AppointmentsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")

  const rows = useMemo(() => {
    return allAppointments.filter((a) => {
      const matchesQuery =
        a.client.toLowerCase().includes(query.toLowerCase()) ||
        a.service.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === "All" || a.status === (filter as AppointmentStatus)
      return matchesQuery && matchesFilter
    })
  }, [query, filter])

  return (
    <AdminShell title="Appointments" subtitle="Manage all your sessions in one place">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by client or service…" />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium">Service</th>
                <th className="px-5 py-4 font-medium">Date &amp; Time</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={a.avatar || "/placeholder.svg"}
                        alt={a.client}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span className="font-medium text-foreground">{a.client}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{a.service}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <div className="leading-tight">
                      <p className="text-foreground">{a.date}</p>
                      <p className="text-xs">
                        {a.startTime} – {a.endTime}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={a.payment} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      aria-label="Options"
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No appointments found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminShell>
  )
}
