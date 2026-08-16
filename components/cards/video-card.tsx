"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import type { MediaVideo } from "@/lib/data/media"

interface VideoCardProps {
  video: MediaVideo
  onClick: () => void
  featured?: boolean
}

export function VideoCard({ video, onClick, featured = false }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

  return (
    <div
      className={`group flex h-full cursor-pointer flex-col ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Play video: ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/70">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/85 text-terracotta shadow-md backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-0.5 fill-current" />
          </span>
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
    </div>
  )
}