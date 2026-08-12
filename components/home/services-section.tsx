import Link from 'next/link'
import { services } from '@/lib/data/services'
import { SectionHeading } from '@/components/site/section-heading'
import { ServiceCard } from '@/components/cards/service-card'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal'

export function ServicesSection() {
  return (
    <section className="bg-[#fbf8f2] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Offerings" title="Ways I Can Support You" />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-9 flex justify-center">
          <Link
            href="/book"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Book a Session
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
