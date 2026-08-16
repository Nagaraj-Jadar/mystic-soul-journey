import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import type { Course } from '@/lib/data/courses'
import { courseDateBadge } from '@/lib/data/courses'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export function CourseCard({ course, variant = 'compact' }: { course: Course; variant?: 'compact' | 'full' }) {
  const badge = courseDateBadge(course.start_date)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-26px_rgba(90,70,40,0.4)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.thumbnail_url || '/placeholder.svg'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {badge && (
          <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-background/90 px-3 py-1.5 text-center backdrop-blur-sm">
            <span className="font-serif text-lg leading-none text-primary">{badge.day}</span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-terracotta">
              {badge.month}
            </span>
          </div>
        )}
        {course.is_featured && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-primary-foreground">
            <Sparkles className="h-3 w-3" /> Featured
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl text-primary">{course.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {course.short_description}
        </p>

        {variant === 'full' && course.duration && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-terracotta" /> {course.duration}
            </span>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 pt-1">
          {variant === 'compact' ? (
            <WhatsAppButton
              size="sm"
              label="Enquire on WhatsApp"
              message={`Hi, I'd like to know more about the ${course.title}.`}
            />
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-terracotta transition-colors hover:text-primary"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
