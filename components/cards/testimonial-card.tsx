import Image from 'next/image'
import type { Testimonial } from '@/lib/data/testimonials'
import { WhatsAppIcon } from '@/components/site/whatsapp-button'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_10px_30px_-26px_rgba(90,70,40,0.4)]">
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80">
        {testimonial.message}
      </blockquote>
      <p className="mt-4 text-xs font-medium text-primary">— {testimonial.name}</p>
      <figcaption className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="flex items-center gap-2">
          <span className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src={testimonial.avatar || '/placeholder.svg'} alt="" fill className="object-cover" sizes="28px" />
          </span>
          <span className="text-[0.7rem] text-muted-foreground">{testimonial.service}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
          {testimonial.time}
          <WhatsAppIcon className="h-3.5 w-3.5 text-sage" />
        </span>
      </figcaption>
    </figure>
  )
}
