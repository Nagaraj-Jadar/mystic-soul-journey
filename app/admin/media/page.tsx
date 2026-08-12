"use client"

import Image from "next/image"
import { Plus, Pencil, Trash2, Play } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { mediaVideos } from "@/lib/data/media"

export default function AdminMediaPage() {
  return (
    <AdminShell title="Media" subtitle="Manage your videos, podcasts and gallery">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Media
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mediaVideos.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="relative aspect-video w-full">
              <Image src={v.thumbnail || "/placeholder.svg"} alt={v.title} fill className="object-cover" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-background/85 text-terracotta backdrop-blur">
                  <Play className="h-5 w-5 fill-current" />
                </span>
              </span>
              <span className="absolute bottom-2 right-2 rounded-md bg-foreground/80 px-1.5 py-0.5 text-xs font-medium text-background">
                {v.duration}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-terracotta">{v.category}</span>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{v.title}</p>
              <div className="mt-3 flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Edit media"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete media"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
