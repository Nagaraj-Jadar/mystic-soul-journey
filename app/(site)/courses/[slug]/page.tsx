import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock, Sparkles } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { COURSE_SELECT, formatCourseDate, type Course } from "@/lib/data/courses"
import { Reveal } from "@/components/motion/reveal"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { CourseEnrollForm } from "@/components/booking/course-enroll-form"

export const revalidate = 0

async function getPublicCourse(slug: string) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  return (data ?? null) as Course | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getPublicCourse(slug)
  if (!course) return { title: "Course — Mystic Soul Journey" }
  return {
    title: `${course.title} — Mystic Soul Journey`,
    description: course.short_description ?? undefined,
  }
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getPublicCourse(slug)
  if (!course) notFound()

  const meta = [
    course.duration ? { icon: Clock, label: course.duration } : null,
    formatCourseDate(course.start_date) ? { icon: CalendarDays, label: `Starts ${formatCourseDate(course.start_date)}` } : null,
  ].filter(Boolean) as { icon: typeof Clock; label: string }[]

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
              {course.is_featured && (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
                  <Sparkles className="h-3.5 w-3.5" /> Featured
                </p>
              )}
              <h1 className="mt-3 font-serif text-4xl leading-tight text-primary text-balance md:text-5xl">
                {course.title}
              </h1>
              {course.short_description && (
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{course.short_description}</p>
              )}

              {meta.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {meta.map((m) => (
                    <span key={m.label} className="inline-flex items-center gap-1.5">
                      <m.icon className="h-4 w-4 text-terracotta" /> {m.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border/70">
                <Image
                  src={course.thumbnail_url || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>

              {course.description && (
                <div className="mt-10">
                  <h2 className="font-serif text-2xl text-primary">About this course</h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{course.description}</p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-border/70 bg-card p-7">
                <p className="text-sm text-muted-foreground">Course Details</p>
                {course.duration && <p className="mt-1 font-serif text-2xl text-primary">{course.duration}</p>}
                {(formatCourseDate(course.start_date) || formatCourseDate(course.end_date)) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCourseDate(course.start_date)}
                    {formatCourseDate(course.end_date) ? ` – ${formatCourseDate(course.end_date)}` : ""}
                  </p>
                )}

                <div className="mt-6 border-t border-border/60 pt-6">
                  <h3 className="font-serif text-lg text-primary">Enroll</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your details and we&apos;ll confirm your spot along with payment instructions.
                  </p>
                  <div className="mt-4">
                    <CourseEnrollForm courseId={course.id} courseTitle={course.title} />
                  </div>
                </div>

                <div className="mt-6 border-t border-border/60 pt-6">
                  <WhatsAppButton
                    className="w-full"
                    variant="outline"
                    label="Enquire on WhatsApp"
                    message={`Hi, I'd like to know more about the ${course.title}.`}
                  />
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  )
}
