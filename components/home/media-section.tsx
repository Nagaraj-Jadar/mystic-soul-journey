import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { mediaVideos } from '@/lib/data/media'
import { SectionHeading } from '@/components/site/section-heading'
import { VideoCard } from '@/components/cards/video-card'
import { YouTubeIcon } from '@/components/brand/social-icons'
import { site } from '@/lib/data/site'
import { Stagger, StaggerItem } from '@/components/motion/reveal'

export function MediaSection() {
  const videos = mediaVideos.slice(0, 4)
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="flex flex-col items-center">
        <SectionHeading title="Wisdom & Insights" />
      </div>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v) => (
          <StaggerItem key={v.id}>
            <VideoCard video={v} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href={site.youtubeUrl}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <YouTubeIcon className="h-4 w-4 text-terracotta" />
          More Videos on YouTube
        </Link>
        <Link
          href="/media"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta transition-colors hover:text-primary"
        >
          View All Videos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
