import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { courses } from '@/lib/data/courses'
import { CourseCard } from '@/components/cards/course-card'
import { Stagger, StaggerItem } from '@/components/motion/reveal'

export function CoursesSection() {
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
