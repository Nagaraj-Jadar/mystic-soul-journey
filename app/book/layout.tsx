import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Book Your Session — Mystic Soul Journey",
  description: "Simple. Sacred. Personal. Book a healing session, Akashic reading or spiritual guidance in a few gentle steps.",
}

export default function BookLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}
