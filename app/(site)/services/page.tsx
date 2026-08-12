import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { ServiceIcon } from "@/components/brand/service-icon"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { services, formatPrice } from "@/lib/data/services"
import { Clock, IndianRupee, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Services — Mystic Soul Journey",
  description:
    "Healing sessions, Akashic readings, spiritual guidance, energy work and transformative workshops to help you heal, awaken and transform.",
}

const benefits: Record<string, string[]> = {
  "healing-sessions": [
    "Release stored emotional blocks",
    "Restore energetic balance",
    "Deep relaxation and calm",
    "Reconnect with your inner self",
  ],
  "akashic-reading": [
    "Clarity on your soul journey",
    "Insight into recurring patterns",
    "Guidance on relationships & purpose",
    "A sacred, supportive space",
  ],
  "spiritual-guidance": [
    "Navigate life transitions",
    "Make aligned decisions",
    "Reconnect with your purpose",
    "Practical spiritual tools",
  ],
  "energy-work": [
    "Clear heavy or stuck energy",
    "Raise your vibration",
    "Balance your energy centres",
    "Awaken your inner light",
  ],
  "workshops-courses": [
    "Immersive group learning",
    "Deepen your practice",
    "Community and support",
    "Lasting transformation",
  ],
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ways I Can Support You"
        title="Services & Offerings"
        description="Each offering is a gentle invitation to heal, awaken and reconnect with your truest self."
      />

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6 md:space-y-24 md:py-24">
        {services.map((service, i) => (
          <section key={service.id} id={service.slug} className="scroll-mt-28">
            <Reveal>
              <div className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-secondary/40 p-10 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-peach/50 text-terracotta">
                    <ServiceIcon name={service.icon} className="h-9 w-9" />
                  </span>
                  <h2 className="mt-5 font-serif text-2xl text-primary">{service.name}</h2>
                  {service.bookable && (
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-terracotta" /> {service.durationMinutes} mins
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-primary">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {formatPrice(service.price).replace("₹", "")}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {benefits[service.slug]?.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {service.bookable ? (
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Book a Session
                      </Link>
                    ) : (
                      <Link
                        href="/courses"
                        className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Explore Courses
                      </Link>
                    )}
                    <WhatsAppButton
                      variant="outline"
                      label="Enquire"
                      message={`Hi, I'd like to know more about ${service.name}.`}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading title="Not sure where to begin?" ornament />
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            If you feel called but aren&apos;t sure which offering is right for you, reach out. We&apos;ll find the path
            that best supports your journey.
          </p>
          <div className="mt-7 flex justify-center">
            <WhatsAppButton label="Chat on WhatsApp" message="Hi Soumyaa, I'd love guidance on which service is right for me." />
          </div>
        </div>
      </section>
    </>
  )
}
