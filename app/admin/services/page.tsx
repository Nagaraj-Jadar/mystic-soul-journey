"use client"

import { Plus, Pencil, Trash2, Clock } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ServiceIcon } from "@/components/brand/service-icon"
import { services, formatPrice } from "@/lib/data/services"

export default function AdminServicesPage() {
  return (
    <AdminShell title="Services" subtitle="Manage the sessions you offer">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-peach text-terracotta">
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Edit service"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete service"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h2 className="mt-4 font-serif text-lg text-foreground">{s.name}</h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{s.shortDescription}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {s.durationMinutes > 0 ? `${s.durationMinutes} mins` : "Varies"}
              </span>
              <span className="font-medium text-foreground">
                {s.price > 0 ? formatPrice(s.price) : "Enquire"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
