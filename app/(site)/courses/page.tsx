import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { CourseCard } from "@/components/cards/course-card"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { createServerClient } from "@/lib/supabase/server"
import { COURSE_SELECT, type Course } from "@/lib/data/courses"

export const metadata: Metadata = {
  title: "Courses & Workshops — Mystic Soul Journey",
  description:
    "Transformative courses in Akashic Records reading, tarot, Vedic numerology and Lama Fera healing to support your growth and practice.",
}

export const revalidate = 0

export default async function CoursesPage() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("start_date", { ascending: true, nullsFirst: false })

  const courses = (data ?? []) as Course[]

  return (
    <>
      <PageHero
        eyebrow="Learn & Grow"
        title="Courses & Workshops"
        description="Immersive learning experiences designed to deepen your practice, expand your awareness and support lasting transformation."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Unable to load courses right now. Please try again shortly.
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            New courses are being prepared. Please check back soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={i * 0.08}>
                <CourseCard course={course} variant="full" />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading title="Have a question about a course?" />
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Reach out on WhatsApp and I&apos;ll personally help you choose the experience that best supports where you
            are right now.
          </p>
          <div className="mt-7 flex justify-center">
            <WhatsAppButton message="Hi Soumyaa, I have a question about your courses." />
          </div>
        </div>
      </section>
    </>
  )
}
