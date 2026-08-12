"use client"

import { Upload, FileText, Download, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, StatusBadge } from "@/components/admin/ui"
import { adminDocuments } from "@/lib/data/admin"

export default function AdminDocumentsPage() {
  return (
    <AdminShell title="Documents" subtitle="Guides, syllabi and files for your offerings">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      <Panel className="p-0">
        <ul className="divide-y divide-border/60">
          {adminDocuments.map((d) => (
            <li key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-background/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <FileText className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{d.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {d.related} · {d.date} · {d.type}
                </p>
              </div>
              <StatusBadge status={d.status} />
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Download document"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete document"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminShell>
  )
}
