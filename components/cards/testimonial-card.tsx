import Image from 'next/image'
import type { Testimonial } from '@/lib/data/testimonials'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_10px_30px_-26px_rgba(90,70,40,0.4)]">
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80">
        {testimonial.content}
      </blockquote>
      <p className="mt-4 text-xs font-medium text-primary">— {testimonial.client_name}</p>
      <figcaption className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="flex items-center gap-2">
          <span className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src={testimonial.image_url || '/placeholder.svg'} alt="" fill className="object-cover" sizes="28px" />
          </span>
          <span className="text-[0.7rem] text-muted-foreground">Client experience</span>
        </span>
      </figcaption>
    </figure>
  )
}
