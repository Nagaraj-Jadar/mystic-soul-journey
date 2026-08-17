"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Wallet, TrendingUp, Clock } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, StatCard, StatusBadge, formatINR } from "@/components/admin/ui"
import { SearchInput, FilterChips } from "@/components/admin/toolbar"
import { createClient } from "@/lib/supabase/client"

type PaymentRow = {
  id: string
  appointment_date: string | null
  payment_status: string | null
  clients?: { full_name?: string | null } | null
  services?: { name?: string | null; price?: number | null } | null
}

const FILTERS = ["All", "Paid", "Pending"] as const
type Filter = (typeof FILTERS)[number]

export default function PaymentsPage() {
  const supabase = createClient()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadPayments() {
    setLoading(true)
    setError("")
    const { data, error: loadError } = await supabase
      .from("appointments")
      .select("id, appointment_date, payment_status, clients(full_name), services(name, price)")
      .order("appointment_date", { ascending: false })

    if (loadError) {
      setError(loadError.message || "Unable to load payments.")
    } else {
      setPayments((data ?? []) as PaymentRow[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPayments()
  }, [])

  function paymentStatus(payment: PaymentRow) {
    return (payment.payment_status ?? "pending").trim().toLowerCase()
  }

  function amount(payment: PaymentRow) {
    return Number(payment.services?.price ?? 0)
  }

  function statusLabel(payment: PaymentRow) {
    const status = paymentStatus(payment)
    return status === "paid" ? "Paid" : status === "pending" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1)
  }

  const totalPaid = payments.filter((p) => paymentStatus(p) === "paid").reduce((sum, p) => sum + amount(p), 0)
  const totalPending = payments.filter((p) => paymentStatus(p) === "pending").reduce((sum, p) => sum + amount(p), 0)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonth = payments
    .filter((p) => paymentStatus(p) === "paid" && p.appointment_date?.slice(0, 7) === currentMonth)
    .reduce((sum, p) => sum + amount(p), 0)

  const rows = useMemo(
    () =>
      payments.filter((p) => {
        const clientName = p.clients?.full_name ?? ""
        const serviceName = p.services?.name ?? ""
        const q = clientName.toLowerCase().includes(query.toLowerCase()) || serviceName.toLowerCase().includes(query.toLowerCase())
        const f = filter === "All" || statusLabel(p) === filter
        return q && f
      }),
    [payments, query, filter],
  )

  async function markAsPaid(paymentId: string) {
    setUpdatingId(paymentId)
    setError("")
    const { error: updateError } = await supabase.from("appointments").update({ payment_status: "paid" }).eq("id", paymentId)
    if (updateError) {
      setError(updateError.message || "Unable to update payment status.")
    } else {
      await loadPayments()
    }
    setUpdatingId(null)
  }

  return (
    <AdminShell title="Payments" subtitle="Track earnings and pending payments">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Total Received" value={formatINR(totalPaid)} tone="sage" />
        <StatCard icon={Clock} label="Pending" value={formatINR(totalPending)} tone="peach" />
        <StatCard icon={Wallet} label="This Month" value={formatINR(thisMonth)} tone="terracotta" />
      </div>

      <div className="mb-5 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search payments…" />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}

      <Panel className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center p-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading payments...</span>
            </div>
          ) : (
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
                  <td className="px-5 py-4 font-medium text-foreground">{p.clients?.full_name ?? "Client"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.services?.name ?? "Service"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.appointment_date ?? "—"}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{formatINR(amount(p))}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={statusLabel(p)} />
                      {paymentStatus(p) === "pending" ? (
                        <button
                          type="button"
                          onClick={() => markAsPaid(p.id)}
                          disabled={updatingId === p.id}
                          className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          {updatingId === p.id ? "Updating…" : "Mark paid"}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </Panel>
    </AdminShell>
  )
}
