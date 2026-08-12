"use client"

import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { StatusBadge, formatINR } from "@/components/admin/ui"
import { courses } from "@/lib/data/courses"

export default function AdminCoursesPage() {
  return (
    <AdminShell title="Courses" subtitle="Create and manage your courses & workshops">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="relative h-40 w-full">
              <Image src={c.image || "/placeholder.svg"} alt={c.name} fill className="object-cover" />
              <div className="absolute left-3 top-3">
                <StatusBadge status={c.status} />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-serif text-lg text-foreground">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.durationLabel}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span>
                  Starts <span className="text-foreground">{c.startDate}</span>
                </span>
                <span>
                  Seats <span className="text-foreground">{c.seats}</span>
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-medium text-foreground">{formatINR(c.price)}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Edit course"
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete course"
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
    </AdminShell>
  )
}
