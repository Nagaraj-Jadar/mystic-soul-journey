import { Reveal } from "@/components/motion/reveal"

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <section className="relative overflow-hidden bg-secondary/40">
      <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28">
        <Reveal>
          {eyebrow ? (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          ) : null}
          <h1 className="font-serif text-4xl leading-tight text-foreground text-balance md:text-5xl">{title}</h1>
          {description ? (
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">{description}</p>
          ) : null}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3 text-primary/60">
            <span className="h-px w-10 bg-primary/30" />
            <span aria-hidden className="font-serif text-lg">
              &#10047;
            </span>
            <span className="h-px w-10 bg-primary/30" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
