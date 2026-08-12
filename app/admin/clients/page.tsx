"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Mail, Phone, CalendarDays } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { SearchInput } from "@/components/admin/toolbar"
import { clients } from "@/lib/data/admin"

export default function ClientsPage() {
  const [query, setQuery] = useState("")

  const rows = useMemo(
    () => clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <AdminShell title="Clients" subtitle="Your beautiful souls in one place">
      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} placeholder="Search clients…" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-4">
              <Image
                src={c.avatar || "/placeholder.svg"}
                alt={c.name}
                width={52}
                height={52}
                className="h-13 w-13 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-serif text-lg text-foreground">{c.name}</p>
                <p className="text-sm text-primary">{c.sessions} sessions</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{c.email}</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {c.phone}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0" /> Last session: {c.lastSession}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                View Profile
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
