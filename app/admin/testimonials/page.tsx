"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Pencil, Plus, Trash2, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { createClient } from "@/lib/supabase/client"
import type { Testimonial } from "@/lib/data/testimonials"

type FormState = { client_name: string; content: string; image_url: string; is_published: boolean }
const emptyForm: FormState = { client_name: "", content: "", image_url: "", is_published: false }
const selectFields = "id, client_name, content, image_url, is_published, created_at, updated_at"

export default function AdminTestimonialsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Testimonial[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function loadTestimonials() {
    setLoading(true)
    const { data, error: fetchError } = await supabase.from("testimonials").select(selectFields).order("created_at", { ascending: false })
    if (fetchError) {
      setItems([])
      setError(fetchError.message || "Unable to load testimonials.")
    } else {
      setItems((data ?? []) as Testimonial[])
      setError("")
    }
    setLoading(false)
  }

  useEffect(() => { loadTestimonials() }, [])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function openEdit(item: Testimonial) {
    setEditingId(item.id)
    setForm({ client_name: item.client_name ?? "", content: item.content ?? "", image_url: item.image_url ?? "", is_published: Boolean(item.is_published) })
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function save() {
    if (!form.client_name.trim() || !form.content.trim()) {
      setError("Please enter a client name and testimonial.")
      return
    }
    setSaving(true)
    setError("")
    setSuccess("")
    const payload = { client_name: form.client_name.trim(), content: form.content.trim(), image_url: form.image_url.trim() || null, is_published: form.is_published }
    const result = editingId
      ? await supabase.from("testimonials").update(payload).eq("id", editingId)
      : await supabase.from("testimonials").insert(payload)
    setSaving(false)
    if (result.error) {
      setError(result.error.message || "Unable to save testimonial.")
      return
    }
    setIsFormOpen(false)
    setSuccess(editingId ? "Testimonial updated." : "Testimonial created.")
    await loadTestimonials()
  }

  async function togglePublished(item: Testimonial) {
    const next = !Boolean(item.is_published)
    const { error: updateError } = await supabase.from("testimonials").update({ is_published: next }).eq("id", item.id)
    if (updateError) {
      setError(updateError.message || "Unable to update testimonial visibility.")
      return
    }
    setSuccess(next ? "Testimonial published." : "Testimonial unpublished.")
    await loadTestimonials()
  }

  async function remove(item: Testimonial) {
    const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", item.id)
    if (deleteError) {
      const message = deleteError.message || "Unable to delete testimonial."
      setError(message.includes("policy") || message.includes("permission") || message.includes("RLS") ? "Delete is not currently allowed by the testimonial table permissions in this database." : message)
      return
    }
    setSuccess("Testimonial deleted.")
    await loadTestimonials()
  }

  return (
    <AdminShell title="Testimonials" subtitle="Curate the words shared by beautiful souls">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {error ? <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" /><span>{error}</span></div> : null}
          {success ? <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-secondary px-3 py-2 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /><span>{success}</span></div> : null}
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"><Plus className="h-4 w-4" /> Add Testimonial</button>
      </div>
      {isFormOpen ? <div className="mb-6 rounded-2xl border border-border/70 bg-card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-lg">{editingId ? "Edit testimonial" : "Add testimonial"}</h2><button type="button" aria-label="Close form" onClick={() => setIsFormOpen(false)}><X className="h-4 w-4" /></button></div><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Client name<input value={form.client_name} onChange={(e) => updateField("client_name", e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" /></label><label className="text-sm">Image URL<input value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" /></label><label className="text-sm md:col-span-2">Testimonial<textarea value={form.content} onChange={(e) => updateField("content", e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => updateField("is_published", e.target.checked)} /> Published</label></div><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl border border-border px-4 py-2 text-sm">Cancel</button><button type="button" disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{saving ? "Saving..." : "Save testimonial"}</button></div></div> : null}
      {loading ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading testimonials...</div> : null}
      {!loading && items.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">No testimonials yet.</p> : null}
      {!loading && items.length > 0 ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <div key={item.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5"><div className="flex items-center gap-3"><img src={item.image_url || "/placeholder.svg"} alt="" className="h-11 w-11 rounded-full object-cover" /><p className="font-medium text-foreground">{item.client_name}</p></div><p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{item.content}</p><div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4"><button type="button" onClick={() => togglePublished(item)} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">{item.is_published ? "Published" : "Unpublished"}</button><span className="flex gap-1"><button type="button" aria-label="Edit testimonial" onClick={() => openEdit(item)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"><Pencil className="h-4 w-4" /></button><button type="button" aria-label="Delete testimonial" onClick={() => remove(item)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button></span></div></div>)}</div> : null}
    </AdminShell>
  )
}
