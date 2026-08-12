import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { MediaVideo } from '@/lib/data/media'

export function VideoCard({ video }: { video: MediaVideo }) {
  return (
    <Link
      href={video.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col"
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/70">
        <Image
          src={video.thumbnail || '/placeholder.svg'}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/85 text-terracotta shadow-md backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-0.5 fill-current" />
          </span>
        </span>
        <span className="absolute bottom-2 right-2 rounded-md bg-foreground/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-background">
          {video.duration}
        </span>
      </div>
      <div className="mt-3">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
          {video.category}
        </span>
        <h3 className="mt-1 text-sm font-medium leading-snug text-primary transition-colors group-hover:text-terracotta">
          {video.title}
        </h3>
      </div>
    </Link>
  )
}
