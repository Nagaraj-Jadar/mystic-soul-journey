"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"

interface AdminShellProps {
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
}

export function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border/60 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg text-muted-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={title} subtitle={subtitle} onMenuClick={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        <footer className="flex flex-col items-center justify-between gap-1 border-t border-border/60 px-8 py-4 text-xs text-muted-foreground md:flex-row">
          <span>© 2025 Mystic Soul Journey. All rights reserved.</span>
          <span>Crafted with care for healing &amp; transformation</span>
        </footer>
      </div>
    </div>
  )
}
