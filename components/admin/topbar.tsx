"use client"

import Image from "next/image"
import { Bell, MessageSquare, ChevronDown, Menu } from "lucide-react"

interface TopbarProps {
  title: React.ReactNode
  subtitle?: string
  onMenuClick?: () => void
}

export function AdminTopbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="font-serif text-xl text-foreground md:text-2xl">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications, 3 unread"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-terracotta text-[10px] font-semibold text-primary-foreground">
            3
          </span>
        </button>
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Messages, 2 unread"
        >
          <MessageSquare className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-terracotta text-[10px] font-semibold text-primary-foreground">
            2
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-border py-1.5 pl-1.5 pr-2 md:pr-3">
          <Image
            src="/practitioner-about.png"
            alt="Soumyaa"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-foreground">Soumyaa</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" strokeWidth={1.75} />
        </div>
      </div>
    </header>
  )
}
