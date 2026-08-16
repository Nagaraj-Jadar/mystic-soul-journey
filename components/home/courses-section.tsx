import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { COURSE_SELECT, type Course } from '@/lib/data/courses'
import { CourseCard } from '@/components/cards/course-card'
import { Stagger, StaggerItem } from '@/components/motion/reveal'

export async function CoursesSection() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('courses')
    .select(COURSE_SELECT)
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: true, nullsFirst: false })
    .limit(3)

  const courses = (data ?? []) as Course[]

  if (courses.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">Upcoming Courses</h2>
        <Link
          href="/courses"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-terracotta transition-colors hover:text-primary"
        >
          View All Courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <StaggerItem key={course.id}>
            <CourseCard course={course} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
