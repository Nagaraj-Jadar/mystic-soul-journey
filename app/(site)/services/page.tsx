import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { serviceCategories } from "@/lib/data/services"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Services — Mystic Soul Journey",
  description:
    "Akashic readings, tarot, numerology, energy healing and personal healing sessions to help you heal, awaken and transform.",
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ways I Can Support You"
        title="Services & Offerings"
        description="Each offering is a gentle invitation to heal, awaken and reconnect with your truest self."
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        {serviceCategories.map((category, categoryIndex) => (
          <section key={category.title} className={categoryIndex > 0 ? "mt-16 md:mt-24" : ""}>
            <SectionHeading eyebrow={`Category ${categoryIndex + 1}`} title={category.title} />

            <div className="mt-10 space-y-16 md:space-y-20">
              {category.items.map((service, i) => (
                <div key={service.id} id={service.slug} className="scroll-mt-28">
                  <Reveal>
                    <div className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                      <div className="relative h-72 overflow-hidden rounded-3xl border border-border/70 shadow-sm sm:h-80 md:h-[26rem]">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <h2 className="absolute inset-x-0 bottom-0 p-6 font-serif text-2xl text-white">{service.name}</h2>
                      </div>

                      <div>
                        <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                        <ul className="mt-5 space-y-2.5">
                          {service.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-7 flex flex-wrap gap-3">
                          {service.bookable && (
                            <Link
                              href={`/book?service=${service.slug}`}
                              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              Book a Session
                            </Link>
                          )}
                          <WhatsAppButton
                            variant={service.bookable ? "outline" : "solid"}
                            label="Enquire"
                            message={`Hi, I'd like to know more about ${service.name}.`}
                          />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
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
