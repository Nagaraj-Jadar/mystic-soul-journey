"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { VideoCard } from "@/components/cards/video-card"
import { VideoModal } from "@/components/ui/video-modal"
import { YouTubeIcon } from "@/components/brand/social-icons"
import { mediaVideos, mediaCategories } from "@/lib/data/media"
import { site } from "@/lib/data/site"
import { cn } from "@/lib/utils"

export default function MediaPage() {
  const [active, setActive] = useState<(typeof mediaCategories)[number]>("All")
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = active === "All" ? mediaVideos : mediaVideos.filter((v) => v.category === active)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVideoId(null)
  }

  return (
    <>
      <PageHero
        eyebrow="Wisdom & Insights"
        title="Media & Videos"
        description="Talks, guided practices and conversations to support you between sessions — watch, reflect and grow."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {mediaCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  active === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <Link
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-primary"
          >
            <YouTubeIcon className="h-4 w-4" /> Visit YouTube
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.06}>
              <VideoCard
                video={v}
                onClick={() => handleVideoClick(v.videoId)}
                featured={v.featured}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl text-primary text-balance">Never miss a new video</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Subscribe on YouTube for weekly wisdom, guided meditations and heartfelt conversations.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href={site.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <YouTubeIcon className="h-4 w-4" /> Subscribe on YouTube
            </Link>
          </div>
        </div>
      </section>

      <VideoModal
        videoId={selectedVideoId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}