"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Loader2, Pencil, Plus, Trash2, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ServiceIcon } from "@/components/brand/service-icon"
import { createClient } from "@/lib/supabase/client"
import type { ServiceIcon as ServiceIconName } from "@/lib/data/services"

type ServiceRow = {
  id: string
  slug: string | null
  name: string | null
  description: string | null
  short_description: string | null
  duration_minutes: number | null
  price: number | null
  is_active: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

type ServiceFormState = {
  name: string
  slug: string
  short_description: string
  description: string
  duration_minutes: number
  price: number
  is_active: boolean
}

const emptyForm: ServiceFormState = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  duration_minutes: 60,
  price: 2500,
  is_active: true,
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function inferIconName(name: string | null): ServiceIconName {
  const value = (name ?? "").toLowerCase()
  if (value.includes("akashic")) return "book"
  if (value.includes("energy")) return "target"
  if (value.includes("guidance") || value.includes("spirit")) return "sun"
  if (value.includes("workshop") || value.includes("course") || value.includes("group")) return "users"
  return "lotus"
}

function formatPrice(value: number | null | undefined) {
  if (!value || value <= 0) return "Enquire"
  return `₹${value.toLocaleString("en-IN")}`
}

export default function AdminServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceFormState>(emptyForm)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function loadServices() {
    setLoading(true)
    setError("")

    const { data, error: fetchError } = await supabase
      .from("services")
      .select("id, slug, name, description, short_description, duration_minutes, price, is_active, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (fetchError) {
      setServices([])
      setError(fetchError.message || "Unable to load services.")
      setLoading(false)
      return
    }

    setServices((data ?? []) as ServiceRow[])
    setLoading(false)
  }

  useEffect(() => {
    loadServices()
  }, [])

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(false)
  }

  function openCreateForm() {
    setForm(emptyForm)
    setEditingId(null)
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function openEditForm(service: ServiceRow) {
    setEditingId(service.id)
    setForm({
      name: service.name ?? "",
      slug: service.slug ?? "",
      short_description: service.short_description ?? "",
      description: service.description ?? "",
      duration_minutes: Number(service.duration_minutes ?? 60),
      price: Number(service.price ?? 0),
      is_active: Boolean(service.is_active),
    })
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function updateField<K extends keyof ServiceFormState>(field: K, value: ServiceFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave() {
    const cleanedName = form.name.trim()
    const cleanedShort = form.short_description.trim()
    const cleanedDescription = form.description.trim()

    if (!cleanedName) {
      setError("Please enter a service name.")
      return
    }

    if (!form.slug.trim()) {
      form.slug = slugify(cleanedName)
    }

    const payload = {
      name: cleanedName,
      slug: slugify(form.slug || cleanedName),
      short_description: cleanedShort || cleanedDescription || cleanedName,
      description: cleanedDescription || cleanedShort || cleanedName,
      duration_minutes: Number(form.duration_minutes) || 60,
      price: Number(form.price) || 0,
      is_active: form.is_active,
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const { error: saveError } = editingId
      ? await supabase.from("services").update(payload).eq("id", editingId)
      : await supabase.from("services").insert([payload])

    setSaving(false)

    if (saveError) {
      setError(saveError.message || "Unable to save the service.")
      return
    }

    setSuccess(editingId ? "Service updated." : "Service created.")
    resetForm()
    await loadServices()
  }

  async function handleToggleStatus(service: ServiceRow) {
    const nextStatus = !Boolean(service.is_active)
    const { error: toggleError } = await supabase
      .from("services")
      .update({ is_active: nextStatus })
      .eq("id", service.id)

    if (toggleError) {
      setError(toggleError.message || "Unable to update the service status.")
      return
    }

    setSuccess(`Service ${nextStatus ? "activated" : "deactivated"}.`)
    await loadServices()
  }

  async function handleDelete(service: ServiceRow) {
    const confirmed = window.confirm(`Delete “${service.name ?? "this service"}”? This action cannot be undone.`)
    if (!confirmed) return

    const { error: deleteError } = await supabase.from("services").delete().eq("id", service.id)

    if (deleteError) {
      const message = deleteError.message || "Unable to delete this service."
      setError(
        message.includes("policy") || message.includes("permission") || message.includes("RLS")
          ? "Delete is not currently allowed by the service table permissions in this database."
          : message,
      )
      return
    }

    setSuccess("Service deleted.")
    await loadServices()
  }

  return (
    <AdminShell title="Services" subtitle="Manage the sessions you offer">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {error ? (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}
          {success ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-secondary px-3 py-2 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>{success}</span>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-border/70 bg-card text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading services...
          </span>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No services available yet. Add your first service to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-peach text-terracotta">
                  <ServiceIcon name={inferIconName(service.name)} className="h-6 w-6" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Edit service"
                    onClick={() => openEditForm(service)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete service"
                    onClick={() => handleDelete(service)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <h2 className="font-serif text-lg text-foreground">{service.name ?? "Untitled service"}</h2>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(service)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${
                    service.is_active ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </button>
              </div>

              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.short_description || service.description || "No summary added yet."}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {Number(service.duration_minutes) > 0 ? `${service.duration_minutes} mins` : "Varies"}
                </span>
                <span className="font-medium text-foreground">{formatPrice(service.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{editingId ? "Edit Service" : "Add Service"}</p>
                <h3 className="font-serif text-2xl text-foreground">{editingId ? "Update service" : "Create new service"}</h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close service form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Service Name</span>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Healing Sessions"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Slug</span>
                <input
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="healing-sessions"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Short Description</span>
                <input
                  value={form.short_description}
                  onChange={(e) => updateField("short_description", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Release blocks and restore balance."
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Full Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Describe the experience, client outcomes, and session details."
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Duration (minutes)</span>
                <input
                  type="number"
                  min="0"
                  value={form.duration_minutes}
                  onChange={(e) => updateField("duration_minutes", Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Price</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField("price", Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                />
              </label>

              <label className="md:col-span-2 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
                <span className="text-sm font-medium text-foreground">Active</span>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}
