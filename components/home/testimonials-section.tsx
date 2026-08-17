'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SectionHeading } from '@/components/site/section-heading'
import { TestimonialCard } from '@/components/cards/testimonial-card'
import { Stagger, StaggerItem, Reveal } from '@/components/motion/reveal'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/data/testimonials'

export function TestimonialsSection() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, client_name, content, image_url, is_published, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials((data ?? []) as Testimonial[])
        setLoading(false)
      })
  }, [])

  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading title="Words From Beautiful Souls" />

        {loading ? <p className="mt-12 text-center text-sm text-muted-foreground">Loading experiences...</p> : null}
        {!loading && testimonials.length === 0 ? <p className="mt-12 text-center text-sm text-muted-foreground">No client experiences yet.</p> : null}
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {testimonials.map((t) => (
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
