"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { CalendarDays, Loader2, Mail, Phone, Plus, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { SearchInput } from "@/components/admin/toolbar"
import { createClient } from "@/lib/supabase/client"

type ClientRow = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  city: string | null
  country: string | null
  notes: string | null
  source: string | null
  created_at?: string | null
  updated_at?: string | null
}

type ClientForm = {
  full_name: string
  email: string
  phone: string
  city: string
  country: string
  notes: string
  source: string
}

const emptyForm: ClientForm = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  notes: "",
  source: "",
}

export default function ClientsPage() {
  const supabase = createClient()
  const [query, setQuery] = useState("")
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ClientForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadClients() {
    setLoading(true)
    setError("")
    const { data, error: fetchError } = await supabase
      .from("clients")
      .select("id, full_name, email, phone, city, country, notes, source, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (fetchError) {
      setClients([])
      setError(fetchError.message || "Unable to load clients.")
      setLoading(false)
      return
    }

    setClients((data ?? []) as ClientRow[])
    setLoading(false)
  }

  useEffect(() => {
    loadClients()
  }, [])

  const rows = useMemo(
    () =>
      clients.filter((c) => {
        const haystack = `${c.full_name} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase()
        return haystack.includes(query.toLowerCase())
      }),
    [clients, query],
  )

  function resetForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
    setError("")
    setSuccess("")
  }

  function openEditForm(client: ClientRow) {
    setEditingId(client.id)
    setForm({
      full_name: client.full_name ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
      city: client.city ?? "",
      country: client.country ?? "",
      notes: client.notes ?? "",
      source: client.source ?? "",
    })
    setIsFormOpen(true)
    setError("")
    setSuccess("")
  }

  function updateField(field: keyof ClientForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave() {
    if (!form.full_name.trim()) {
      setError("Please enter the client's full name.")
      return
    }

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      country: form.country.trim() || null,
      notes: form.notes.trim() || null,
      source: form.source.trim() || null,
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const { error: saveError } = editingId
      ? await supabase.from("clients").update(payload).eq("id", editingId)
      : await supabase.from("clients").insert([payload])

    setSaving(false)

    if (saveError) {
      setError(saveError.message || "Unable to save client.")
      return
    }

    setSuccess(editingId ? "Client updated." : "Client created.")
    resetForm()
    await loadClients()
  }

  async function handleDelete(client: ClientRow) {
    const hasAppointments = await supabase
      .from("appointments")
      .select("id")
      .eq("client_id", client.id)
      .limit(1)

    if ((hasAppointments.data ?? []).length > 0) {
      setError("This client cannot be deleted because they already have appointment records.")
      return
    }

    const confirmed = window.confirm(`Delete ${client.full_name}? This cannot be undone.`)
    if (!confirmed) return

    const { error: deleteError } = await supabase.from("clients").delete().eq("id", client.id)

    if (deleteError) {
      setError(deleteError.message || "Unable to delete client.")
      return
    }

    setSuccess("Client deleted.")
    await loadClients()
  }

  return (
    <AdminShell title="Clients" subtitle="Your beautiful souls in one place">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex-1">
          <SearchInput value={query} onChange={setQuery} placeholder="Search clients…" />
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}
      {success ? <div className="mb-4 rounded-xl border border-primary/30 bg-secondary px-3 py-2 text-sm text-primary">{success}</div> : null}

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading clients...</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No clients found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg"
                  alt={c.full_name}
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg text-foreground">{c.full_name}</p>
                  <p className="text-sm text-primary">{c.source || "Website"}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{c.email || "—"}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" /> {c.phone || "—"}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0" /> {c.city || c.country ? `${c.city || ""}${c.city && c.country ? ", " : ""}${c.country || ""}` : "Location not set"}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(c)}
                  className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl text-foreground">{editingId ? "Edit client" : "Add client"}</h3>
              <button
                type="button"
                onClick={resetForm}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Full name</span>
                <input value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Phone</span>
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">City</span>
                <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Country</span>
                <input value={form.country} onChange={(e) => updateField("country", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Source</span>
                <input value={form.source} onChange={(e) => updateField("source", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Notes</span>
                <textarea rows={4} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">Cancel</button>
              <button type="button" disabled={saving} onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Client"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}
