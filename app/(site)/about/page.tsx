import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { site } from "@/lib/data/site"
import { Heart, Sparkles, Compass, Feather } from "lucide-react"

export const metadata: Metadata = {
  title: "About — Mystic Soul Journey",
  description:
    "Meet Soumyaa, a spiritual guide and healer devoted to helping you heal, awaken and transform through compassionate, intuitive guidance.",
}

const values = [
  { icon: Heart, title: "Compassion", text: "Every soul is met with warmth, patience and deep acceptance." },
  { icon: Sparkles, title: "Intuition", text: "Guidance is led by inner wisdom and a genuine connection to spirit." },
  { icon: Compass, title: "Alignment", text: "Helping you return to your truth and live from your highest self." },
  { icon: Feather, title: "Gentleness", text: "Healing that honours your pace, your story and your heart." },
]

const timeline = [
  { year: "The Calling", text: "A personal awakening opened the path to healing and inner work." },
  { year: "The Study", text: "Years of training in energy healing, Akashic reading and spiritual guidance." },
  { year: "The Practice", text: "Guiding hundreds of souls through sessions, readings and workshops." },
  { year: "Today", text: "Devoted to helping you heal, awaken and transform into an aligned life." },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Hi, I'm Soumyaa"
        description="A spiritual guide and healer with a deep connection to universal wisdom and a heart for healing."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-peach/40 blur-xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70">
                <Image
                  src="/practitioner-about.png"
                  alt="Soumyaa, spiritual guide and healer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <SectionHeading
                align="left"
                eyebrow="My Journey"
                title="A heart devoted to healing"
                ornament={false}
              />
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  With a deep connection to universal wisdom and a heart for healing, I help you release what no longer
                  serves you, align with your higher self and step into a life of clarity, purpose and joy.
                </p>
                <p>
                  My work is gentle, intuitive and deeply personal. Whether through a healing session, an Akashic
                  reading or a transformative course, my intention is always the same — to help you remember your inner
                  power and live a life that feels truly aligned.
                </p>
                <p>
                  I believe healing is not about fixing what is broken, but about coming home to who you have always
                  been. It would be an honour to walk beside you on that journey.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book a Session
                </Link>
                <WhatsAppButton variant="outline" label="Say Hello" message="Hi Soumyaa, I'd love to connect with you." />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="What I Stand For" title="Values that guide my work" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-border/70 bg-card p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach/50 text-terracotta">
                    <v.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-serif text-lg text-primary">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow="My Path" title="The journey so far" />
        <div className="mt-12 space-y-8">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.08}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-3 w-3 shrink-0 rounded-full bg-terracotta" />
                  {i < timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-serif text-xl text-primary">{t.year}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-border/70 bg-primary/5 p-10 text-center">
          <p className="mx-auto max-w-xl font-serif text-2xl italic leading-relaxed text-primary text-balance">
            &ldquo;Trust the process. The universe is always working for your highest good.&rdquo;
          </p>
          <p className="mt-4 text-sm text-muted-foreground">— {site.practitioner.fullName}</p>
        </div>
      </section>
    </>
  )
}
