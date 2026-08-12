import { Heart, Leaf } from 'lucide-react'
import { WhatsAppButton } from '@/components/site/whatsapp-button'
import { Reveal } from '@/components/motion/reveal'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-peach/40 to-secondary/50">
      <Leaf className="pointer-events-none absolute left-6 top-8 h-16 w-16 rotate-12 text-sage/30" aria-hidden="true" strokeWidth={1} />
      <Leaf className="pointer-events-none absolute bottom-8 right-10 h-20 w-20 -rotate-45 text-sage/25" aria-hidden="true" strokeWidth={1} />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center sm:px-8 lg:flex-row lg:justify-between lg:text-left">
        <Reveal>
          <h2 className="text-balance font-serif text-3xl leading-tight text-primary sm:text-4xl">
            Ready to begin
            <br className="hidden sm:block" /> your inner journey?
          </h2>
        </Reveal>
        <Reveal delay={1} className="lg:max-w-xs">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Connect with me and take the first step towards your transformation.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="flex items-center gap-3">
            <WhatsAppButton size="lg" message="Hi Soumyaa, I'd love to begin my journey." />
            <Heart className="hidden h-6 w-6 text-terracotta/50 sm:block" strokeWidth={1.5} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
