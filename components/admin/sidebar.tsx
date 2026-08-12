"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { adminNav } from "@/lib/admin-nav"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border/60 px-6 py-5">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <ul className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/admin/login"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          Logout
        </Link>
      </div>

      <div className="m-3 mt-0 rounded-2xl bg-gradient-to-br from-peach/50 to-secondary p-4">
        <p className="font-serif text-sm leading-relaxed text-foreground/80">
          Stay aligned
          <br />
          Stay present
          <br />
          Keep shining
        </p>
      </div>
    </div>
  )
}
