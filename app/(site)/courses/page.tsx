import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { CourseCard } from "@/components/cards/course-card"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { courses } from "@/lib/data/courses"

export const metadata: Metadata = {
  title: "Courses & Workshops — Mystic Soul Journey",
  description:
    "Transformative courses in Akashic Records reading, tarot, Vedic numerology and Lama Fera healing to support your growth and practice.",
}

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn & Grow"
        title="Courses & Workshops"
        description="Immersive learning experiences designed to deepen your practice, expand your awareness and support lasting transformation."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Reveal key={course.id} delay={i * 0.08}>
              <CourseCard course={course} variant="full" />
            </Reveal>
          ))}
        </div>
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
