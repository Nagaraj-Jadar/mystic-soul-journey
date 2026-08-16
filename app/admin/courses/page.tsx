"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { SearchInput } from "@/components/admin/toolbar"
import { StatusBadge } from "@/components/admin/ui"
import { createClient } from "@/lib/supabase/client"
import { COURSE_SELECT, formatCourseDate } from "@/lib/data/courses"

type CourseRow = {
  id: string
  title: string | null
  slug: string | null
  short_description: string | null
  description: string | null
  thumbnail_url: string | null
  price: number | null
  duration: string | null
  start_date: string | null
  end_date: string | null
  status: string | null
  is_featured: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

type CourseFormState = {
  title: string
  slug: string
  short_description: string
  description: string
  thumbnail_url: string
  price: number
  duration: string
  start_date: string
  end_date: string
  status: "draft" | "published"
  is_featured: boolean
}

type EnrollmentRow = {
  id: string
  course_id: string
  client_id: string
  status: string | null
  enrolled_at: string | null
  completed_at: string | null
  courses?: { title?: string | null } | null
  clients?: { full_name?: string | null; email?: string | null; phone?: string | null } | null
}

const emptyForm: CourseFormState = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  thumbnail_url: "",
  price: 0,
  duration: "",
  start_date: "",
  end_date: "",
  status: "draft",
  is_featured: false,
}

const ENROLLMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function formatPrice(value: number | null | undefined) {
  if (!value || value <= 0) return "Enquire"
  return `₹${value.toLocaleString("en-IN")}`
}

function toStatusLabel(status: string | null) {
  const value = (status ?? "").trim().toLowerCase()
  if (!value) return "Draft"
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function AdminCoursesPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<"courses" | "enrollments">("courses")

  const [query, setQuery] = useState("")
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseFormState>(emptyForm)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [enrollmentsError, setEnrollmentsError] = useState("")

  async function loadCourses() {
    setLoading(true)
    setError("")

    const { data, error: fetchError } = await supabase
      .from("courses")
      .select(`${COURSE_SELECT}`)
      .order("created_at", { ascending: false })

    if (fetchError) {
      setCourses([])
      setError(fetchError.message || "Unable to load courses.")
      setLoading(false)
      return
    }

    setCourses((data ?? []) as CourseRow[])
    setLoading(false)
  }

  async function loadEnrollments() {
    setEnrollmentsLoading(true)
    setEnrollmentsError("")

    const { data, error: fetchError } = await supabase
      .from("course_enrollments")
      .select("id, course_id, client_id, status, enrolled_at, completed_at, courses(title), clients(full_name, email, phone)")
      .order("enrolled_at", { ascending: false })

    if (fetchError) {
      setEnrollments([])
      setEnrollmentsError(fetchError.message || "Unable to load enrollments.")
      setEnrollmentsLoading(false)
      return
    }

    setEnrollments((data ?? []) as unknown as EnrollmentRow[])
    setEnrollmentsLoading(false)
  }

  useEffect(() => {
    loadCourses()
    loadEnrollments()
  }, [])

  const rows = useMemo(
    () =>
      courses.filter((c) => {
        const haystack = `${c.title ?? ""} ${c.slug ?? ""}`.toLowerCase()
        return haystack.includes(query.toLowerCase())
      }),
    [courses, query],
  )

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

  function openEditForm(course: CourseRow) {
    setEditingId(course.id)
    setForm({
      title: course.title ?? "",
      slug: course.slug ?? "",
      short_description: course.short_description ?? "",
      description: course.description ?? "",
      thumbnail_url: course.thumbnail_url ?? "",
      price: Number(course.price ?? 0),
      duration: course.duration ?? "",
      start_date: course.start_date ?? "",
      end_date: course.end_date ?? "",
      status: course.status === "published" ? "published" : "draft",
      is_featured: Boolean(course.is_featured),
    })
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  function updateField<K extends keyof CourseFormState>(field: K, value: CourseFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave() {
    const cleanedTitle = form.title.trim()

    if (!cleanedTitle) {
      setError("Please enter a course title.")
      return
    }

    const cleanedSlug = slugify(form.slug || cleanedTitle)
    if (!cleanedSlug) {
      setError("Please enter a valid slug.")
      return
    }

    const payload = {
      title: cleanedTitle,
      slug: cleanedSlug,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      price: Number(form.price) || 0,
      duration: form.duration.trim() || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      is_featured: form.is_featured,
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const { error: saveError } = editingId
      ? await supabase.from("courses").update(payload).eq("id", editingId)
      : await supabase.from("courses").insert([payload])

    setSaving(false)

    if (saveError) {
      setError(saveError.message || "Unable to save the course.")
      return
    }

    setSuccess(editingId ? "Course updated." : "Course created.")
    resetForm()
    await loadCourses()
  }

  async function handleToggleFeatured(course: CourseRow) {
    const nextFeatured = !Boolean(course.is_featured)
    const { error: toggleError } = await supabase
      .from("courses")
      .update({ is_featured: nextFeatured })
      .eq("id", course.id)

    if (toggleError) {
      setError(toggleError.message || "Unable to update featured status.")
      return
    }

    setSuccess(nextFeatured ? "Course marked as featured." : "Course unfeatured.")
    await loadCourses()
  }

  async function handleTogglePublish(course: CourseRow) {
    const nextStatus = course.status === "published" ? "draft" : "published"
    const { error: toggleError } = await supabase
      .from("courses")
      .update({ status: nextStatus })
      .eq("id", course.id)

    if (toggleError) {
      setError(toggleError.message || "Unable to update the course status.")
      return
    }

    setSuccess(nextStatus === "published" ? "Course published." : "Course moved to draft.")
    await loadCourses()
  }

  async function handleDelete(course: CourseRow) {
    setError("")
    setSuccess("")

    const { data: linked, error: linkedError } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", course.id)
      .limit(1)

    if (linkedError) {
      setError(linkedError.message || "Unable to verify enrollments for this course.")
      return
    }

    if ((linked ?? []).length > 0) {
      setError("This course has enrollments and cannot be deleted.")
      return
    }

    const confirmed = window.confirm(`Delete “${course.title ?? "this course"}”? This action cannot be undone.`)
    if (!confirmed) return

    const { error: deleteError } = await supabase.from("courses").delete().eq("id", course.id)

    if (deleteError) {
      const message = deleteError.message || "Unable to delete this course."
      setError(
        message.includes("policy") || message.includes("permission") || message.includes("RLS")
          ? "Delete is not currently allowed by the course table permissions in this database."
          : message,
      )
      return
    }

    setSuccess("Course deleted.")
    await loadCourses()
  }

  async function handleUpdateEnrollmentStatus(enrollment: EnrollmentRow, status: string) {
    setEnrollmentsError("")

    const payload: { status: string; completed_at?: string | null } = { status }
    if (status === "completed") payload.completed_at = new Date().toISOString()

    const { error: updateError } = await supabase
      .from("course_enrollments")
      .update(payload)
      .eq("id", enrollment.id)

    if (updateError) {
      setEnrollmentsError(updateError.message || "Unable to update enrollment status.")
      return
    }

    await loadEnrollments()
  }

  return (
    <AdminShell title="Courses" subtitle="Create and manage your courses & workshops">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("courses")}
          className={
            tab === "courses"
              ? "rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              : "rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          Courses
        </button>
        <button
          type="button"
          onClick={() => setTab("enrollments")}
          className={
            tab === "enrollments"
              ? "rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              : "rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          Enrollments
        </button>
      </div>

      {tab === "courses" ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <SearchInput value={query} onChange={setQuery} placeholder="Search courses…" />
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
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Add New Course
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-border/70 bg-card text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading courses...
              </span>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {courses.length === 0 ? "No courses yet. Add your first course to begin." : "No courses match your search."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {rows.map((c) => (
                <div key={c.id} className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <div className="relative h-40 w-full">
                    <Image src={c.thumbnail_url || "/placeholder.svg"} alt={c.title ?? "Course"} fill className="object-cover" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <StatusBadge status={toStatusLabel(c.status)} />
                      {c.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                          <Sparkles className="h-3 w-3" /> Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-serif text-lg text-foreground">{c.title ?? "Untitled course"}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{c.duration || "Duration not set"}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatCourseDate(c.start_date) ?? "No start date"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                      <span className="font-medium text-foreground">{formatPrice(c.price)}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(c)}
                        className="ml-auto rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {c.is_featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(c)}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {c.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="Edit course"
                          onClick={() => openEditForm(c)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete course"
                          onClick={() => handleDelete(c)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          {enrollmentsError ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{enrollmentsError}</span>
            </div>
          ) : null}

          {enrollmentsLoading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-border/70 bg-card text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading enrollments...
              </span>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No course enrollments yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Enrolled</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id} className="border-b border-border/40 last:border-none">
                      <td className="px-4 py-3 text-foreground">{e.courses?.title ?? "—"}</td>
                      <td className="px-4 py-3">
                        <p className="text-foreground">{e.clients?.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{e.clients?.phone ?? e.clients?.email ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString("en-IN") : "—"}
                        {e.completed_at ? (
                          <p className="text-xs">Completed {new Date(e.completed_at).toLocaleDateString("en-IN")}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={(e.status ?? "pending").toLowerCase()}
                          onChange={(ev) => handleUpdateEnrollmentStatus(e, ev.target.value)}
                          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none transition focus:border-primary"
                        >
                          {ENROLLMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-[2px]">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/70 bg-card p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{editingId ? "Edit Course" : "Add Course"}</p>
                <h3 className="font-serif text-2xl text-foreground">{editingId ? "Update course" : "Create new course"}</h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close course form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Title</span>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Akashic Records Reading"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Slug</span>
                <input
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="akashic-records-reading"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Short Description</span>
                <input
                  value={form.short_description}
                  onChange={(e) => updateField("short_description", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Learn to access the Akashic Records with clarity."
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Full Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="Describe what students will experience and learn."
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Thumbnail URL</span>
                <input
                  value={form.thumbnail_url}
                  onChange={(e) => updateField("thumbnail_url", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="/course-akashic.png"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Duration</span>
                <input
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="6 Weeks · Weekly Live Sessions"
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

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Start Date</span>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateField("start_date", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">End Date</span>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateField("end_date", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-sm font-medium text-foreground">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value as "draft" | "published")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
                <span className="text-sm font-medium text-foreground">Featured</span>
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => updateField("is_featured", e.target.checked)}
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
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}
