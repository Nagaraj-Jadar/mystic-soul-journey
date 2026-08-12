"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { testimonials as seed } from "@/lib/data/testimonials"
import { cn } from "@/lib/utils"

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState(seed)

  function toggleFeatured(id: string) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)))
  }

  return (
    <AdminShell title="Testimonials" subtitle="Curate the words shared by beautiful souls">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-3">
              <Image
                src={t.avatar || "/placeholder.svg"}
                alt={t.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.service}</p>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{t.message}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={() => toggleFeatured(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  t.featured
                    ? "bg-peach text-terracotta"
                    : "border border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Star className={cn("h-3.5 w-3.5", t.featured && "fill-current")} />
                {t.featured ? "Featured" : "Feature"}
              </button>
              <button
                type="button"
                aria-label="Delete testimonial"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
