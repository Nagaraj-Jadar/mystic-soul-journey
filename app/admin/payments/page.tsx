"use client"

import { useMemo, useState } from "react"
import { Wallet, TrendingUp, Clock } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, StatCard, StatusBadge, formatINR } from "@/components/admin/ui"
import { SearchInput, FilterChips } from "@/components/admin/toolbar"
import { recentPayments } from "@/lib/data/admin"

const FILTERS = ["All", "Paid", "Pending"] as const
type Filter = (typeof FILTERS)[number]

export default function PaymentsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")

  const totalPaid = recentPayments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0)
  const totalPending = recentPayments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0)

  const rows = useMemo(
    () =>
      recentPayments.filter((p) => {
        const q =
          p.client.toLowerCase().includes(query.toLowerCase()) ||
          p.service.toLowerCase().includes(query.toLowerCase())
        const f = filter === "All" || p.status === filter
        return q && f
      }),
    [query, filter],
  )

  return (
    <AdminShell title="Payments" subtitle="Track earnings and pending payments">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Total Received" value={formatINR(totalPaid)} tone="sage" />
        <StatCard icon={Clock} label="Pending" value={formatINR(totalPending)} tone="peach" />
        <StatCard icon={Wallet} label="This Month" value={formatINR(78450)} change="18% from last month" tone="terracotta" />
      </div>

      <div className="mb-5 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search payments…" />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium">Service</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-background/60">
                  <td className="px-5 py-4 font-medium text-foreground">{p.client}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.service}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.date}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{formatINR(p.amount)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminShell>
  )
}
