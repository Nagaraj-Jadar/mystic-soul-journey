"use client"

import { useMemo, useState } from "react"
import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { TestimonialCard } from "@/components/cards/testimonial-card"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { testimonials } from "@/lib/data/testimonials"
import { cn } from "@/lib/utils"

export default function ClientExperiencesPage() {
  const services = useMemo(() => ["All", ...Array.from(new Set(testimonials.map((t) => t.service)))], [])
  const [active, setActive] = useState("All")

  const filtered = active === "All" ? testimonials : testimonials.filter((t) => t.service === active)

  return (
    <>
      <PageHero
        eyebrow="Words From Beautiful Souls"
        title="Client Experiences"
        description="Real reflections from the hearts I've had the honour of supporting on their healing journeys."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {filtered.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl text-primary text-balance">Ready to write your own story?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Every journey begins with a single, gentle step. I&apos;d be honoured to walk beside you.
          </p>
          <div className="mt-7 flex justify-center">
            <WhatsAppButton message="Hi Soumyaa, I'd love to begin my healing journey." />
          </div>
        </div>
      </section>
    </>
  )
}
