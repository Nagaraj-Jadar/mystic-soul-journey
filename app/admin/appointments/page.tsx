"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Loader2, MoreVertical, Plus, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, StatusBadge } from "@/components/admin/ui"
import { SearchInput, FilterChips } from "@/components/admin/toolbar"
import { createClient } from "@/lib/supabase/client"

type AppointmentRow = {
  id: string
  client_id: string
  service_id: string
  appointment_date: string | null
  start_time: string | null
  end_time: string | null
  status: string | null
  payment_status: string | null
  notes: string | null
  created_at?: string | null
  updated_at?: string | null
  clients?: { full_name?: string | null } | null
  services?: { name?: string | null } | null
}

type AppointmentForm = {
  client_id: string
  service_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: string
  payment_status: string
  notes: string
}

const FILTERS = ["All", "confirmed", "pending", "cancelled"] as const

type Filter = (typeof FILTERS)[number]

const EMPTY_FORM: AppointmentForm = {
  client_id: "",
  service_id: "",
  appointment_date: "",
  start_time: "09:00",
  end_time: "10:00",
  status: "confirmed",
  payment_status: "pending",
  notes: "",
}

function normalizeStatus(value: string | null | undefined) {
  const text = (value ?? "").trim().toLowerCase()
  if (!text) return "Pending"
  if (text.includes("cancel")) return "Cancelled"
  if (text.includes("confirm")) return "Confirmed"
  if (text.includes("pending")) return "Pending"
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function normalizePayment(value: string | null | undefined) {
  const text = (value ?? "").trim().toLowerCase()
  if (!text) return "Pending"
  if (text.includes("paid")) return "Paid"
  return "Pending"
}

export default function AppointmentsPage() {
  const supabase = createClient()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([])
  const [services, setServices] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AppointmentForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function loadLists() {
    const [clientsRes, servicesRes, appointmentsRes] = await Promise.all([
      supabase.from("clients").select("id, full_name").order("full_name", { ascending: true }),
      supabase.from("services").select("id, name").eq("is_active", true).order("name", { ascending: true }),
      supabase.from("appointments").select("*, clients(full_name), services(name)").order("appointment_date", { ascending: true }),
    ])

    if (clientsRes.error) throw clientsRes.error
    if (servicesRes.error) throw servicesRes.error
    if (appointmentsRes.error) throw appointmentsRes.error

    setClients((clientsRes.data ?? []) as { id: string; full_name: string }[])
    setServices((servicesRes.data ?? []) as { id: string; name: string }[])
    setAppointments((appointmentsRes.data ?? []) as AppointmentRow[])
  }

  async function loadData() {
    setLoading(true)
    setError("")
    try {
      await loadLists()
    } catch (loadError) {
      setError((loadError as Error).message || "Unable to load appointments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const rows = useMemo(() => {
    return appointments.filter((a) => {
      const clientName = a.clients?.full_name ?? ""
      const serviceName = a.services?.name ?? ""
      const matchesQuery =
        clientName.toLowerCase().includes(query.toLowerCase()) ||
        serviceName.toLowerCase().includes(query.toLowerCase())
      const statusValue = normalizeStatus(a.status).toLowerCase()
      const matchesFilter = filter === "All" || statusValue === filter
      return matchesQuery && matchesFilter
    })
  }, [appointments, query, filter])

  function resetForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function openCreateForm() {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      client_id: clients[0]?.id ?? "",
      service_id: services[0]?.id ?? "",
    })
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function openEditForm(appointment: AppointmentRow) {
    setEditingId(appointment.id)
    setForm({
      client_id: appointment.client_id,
      service_id: appointment.service_id,
      appointment_date: appointment.appointment_date ?? "",
      start_time: appointment.start_time ?? "09:00",
      end_time: appointment.end_time ?? "10:00",
      status: appointment.status ?? "confirmed",
      payment_status: appointment.payment_status ?? "pending",
      notes: appointment.notes ?? "",
    })
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function updateField<K extends keyof AppointmentForm>(field: K, value: AppointmentForm[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave() {
    if (!form.client_id || !form.service_id || !form.appointment_date) {
      setError("Please select a client, service, and appointment date.")
      return
    }

    if (form.start_time >= form.end_time) {
      setError("Start time must be earlier than end time.")
      return
    }

    const payload = {
      client_id: form.client_id,
      service_id: form.service_id,
      appointment_date: form.appointment_date,
      start_time: form.start_time,
      end_time: form.end_time,
      status: form.status,
      payment_status: form.payment_status,
      notes: form.notes.trim() || null,
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const { error: saveError } = editingId
      ? await supabase.from("appointments").update(payload).eq("id", editingId)
      : await supabase.from("appointments").insert([payload])

    setSaving(false)

    if (saveError) {
      setError(saveError.message || "Unable to save appointment.")
      return
    }

    setSuccess(editingId ? "Appointment updated." : "Appointment created.")
    resetForm()
    await loadData()
  }

  async function updateStatus(appointmentId: string, nextStatus: string) {
    const { error } = await supabase.from("appointments").update({ status: nextStatus }).eq("id", appointmentId)
    if (error) {
      setError(error.message || "Unable to update status.")
      return
    }
    setSuccess("Appointment status updated.")
    await loadData()
  }

  async function cancelAppointment(appointmentId: string) {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)
    if (error) {
      setError(error.message || "Unable to cancel appointment.")
      return
    }
    setSuccess("Appointment cancelled.")
    await loadData()
  }

  return (
    <AdminShell title="Appointments" subtitle="Manage all your sessions in one place">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by client or service…" />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Appointment
          </button>
          <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
        </div>
      </div>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}
      {success ? <div className="mb-4 rounded-xl border border-primary/30 bg-secondary px-3 py-2 text-sm text-primary">{success}</div> : null}

      <Panel className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center p-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading appointments...</span>
            </div>
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
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
                        <Image src="/placeholder.svg" alt={a.clients?.full_name ?? "Client"} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                        <span className="font-medium text-foreground">{a.clients?.full_name ?? "Client"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{a.services?.name ?? "Service"}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <div className="leading-tight">
                        <p className="text-foreground">{a.appointment_date}</p>
                        <p className="text-xs">{a.start_time} – {a.end_time}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={normalizeStatus(a.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={normalizePayment(a.payment_status)} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(a)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          aria-label="Edit appointment"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(a.id, "confirmed")}
                          className="rounded-lg border border-border px-2 py-1 text-[10px] font-medium text-foreground hover:bg-secondary"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelAppointment(a.id)}
                          className="rounded-lg border border-border px-2 py-1 text-[10px] font-medium text-foreground hover:bg-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No appointments found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </Panel>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl text-foreground">{editingId ? "Edit appointment" : "Add appointment"}</h3>
              <button type="button" onClick={resetForm} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Client</span>
                <select value={form.client_id} onChange={(e) => updateField("client_id", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary">
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.full_name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Service</span>
                <select value={form.service_id} onChange={(e) => updateField("service_id", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary">
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Date</span>
                <input type="date" value={form.appointment_date} onChange={(e) => updateField("appointment_date", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
                <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary">
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Start time</span>
                <input type="time" value={form.start_time} onChange={(e) => updateField("start_time", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">End time</span>
                <input type="time" value={form.end_time} onChange={(e) => updateField("end_time", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Payment status</span>
                <select value={form.payment_status} onChange={(e) => updateField("payment_status", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Notes</span>
                <textarea rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">Cancel</button>
              <button type="button" disabled={saving} onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Appointment"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}
