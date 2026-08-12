import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredTestimonials } from '@/lib/data/testimonials'
import { SectionHeading } from '@/components/site/section-heading'
import { TestimonialCard } from '@/components/cards/testimonial-card'
import { Stagger, StaggerItem, Reveal } from '@/components/motion/reveal'

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading title="Words From Beautiful Souls" />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {featuredTestimonials.map((t) => (
            <StaggerItem key={t.id}>
              <TestimonialCard testimonial={t} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/client-experiences"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta transition-colors hover:text-primary"
          >
            View All Experiences
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
