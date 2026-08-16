"use client"

import { useState, useEffect, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoModalProps {
  videoId: string | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ videoId, isOpen, onClose }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !videoId) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute -right-12 top-0 flex h-10 w-10 items-center justify-center rounded-full",
            "bg-white/10 text-white backdrop-blur-sm transition-colors",
            "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50",
          )}
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative aspect-video w-full bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            </div>
          )}
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}