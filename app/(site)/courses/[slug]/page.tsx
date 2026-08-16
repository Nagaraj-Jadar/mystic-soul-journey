import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Clock, MonitorPlay, Users } from "lucide-react"
import { courses, getCourse } from "@/lib/data/courses"
import { Reveal } from "@/components/motion/reveal"
import { WhatsAppButton } from "@/components/site/whatsapp-button"

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) return { title: "Course — Mystic Soul Journey" }
  return {
    title: `${course.name} — Mystic Soul Journey`,
    description: course.shortDescription,
  }
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()

  const meta = [
    { icon: Clock, label: course.durationLabel },
    { icon: MonitorPlay, label: course.mode },
    { icon: Users, label: `${course.seats} seats` },
  ]

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All Courses
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
                Starts {course.startDate}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-primary text-balance md:text-5xl">
                {course.name}
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{course.intro}</p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {meta.map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-1.5">
                    <m.icon className="h-4 w-4 text-terracotta" /> {m.label}
                  </span>
                ))}
              </div>

              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border/70">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-border/70 bg-card p-7">
                <p className="text-sm text-muted-foreground">Course Duration</p>
                <p className="mt-1 font-serif text-2xl text-primary">{course.durationLabel}</p>

                <div className="mt-6 space-y-3">
                  <WhatsAppButton
                    className="w-full"
                    label="Enquire on WhatsApp"
                    message={`Hi, I'd like to enrol in the ${course.name}.`}
                  />
                  <Link
                    href={`/contact?course=${course.slug}`}
                    className="flex h-11 w-full items-center justify-center rounded-full border border-primary/25 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                    Request a Callback
                  </Link>
                </div>

                <div className="mt-7 border-t border-border/60 pt-6">
                  <h3 className="font-serif text-lg text-primary">What&apos;s included</h3>
                  <ul className="mt-3 space-y-2.5">
                    {course.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-12">
            <Reveal>
              <div>
                <h2 className="font-serif text-2xl text-primary">What you&apos;ll learn</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.learn.map((l) => (
                    <li key={l} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card p-4 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="font-serif text-2xl text-primary">Course modules</h2>
                <div className="mt-5 space-y-4">
                  {course.modules.map((m, i) => (
                    <div key={m.title} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-peach/50 font-serif text-sm text-terracotta">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-primary">{m.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="font-serif text-2xl text-primary">Frequently asked</h2>
                <div className="mt-5 space-y-3">
                  {course.faq.map((f) => (
                    <details key={f.q} className="group rounded-2xl border border-border/60 bg-card p-5">
                      <summary className="cursor-pointer list-none font-medium text-primary marker:hidden">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border/70 bg-secondary/40 p-7 lg:sticky lg:top-28 lg:self-start">
              <h3 className="font-serif text-xl text-primary">Who this is for</h3>
              <ul className="mt-4 space-y-3">
                {course.forWhom.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
