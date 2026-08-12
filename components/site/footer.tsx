import Link from 'next/link'
import { Mail } from 'lucide-react'
import { LotusMark } from '@/components/brand/logo'
import { InstagramIcon, YouTubeIcon } from '@/components/brand/social-icons'
import { WhatsAppIcon } from '@/components/site/whatsapp-button'
import { site } from '@/lib/data/site'

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Courses', href: '/courses' },
  { label: 'Client Experiences', href: '/client-experiences' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
]

const resources = [
  { label: 'Book a Session', href: '/book' },
  { label: 'Media', href: '/media' },
  { label: 'Courses', href: '/courses' },
  { label: 'FAQs', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LotusMark className="h-8 w-8 text-terracotta" />
            <span className="font-serif text-lg font-semibold text-primary">
              Mystic Soul Journey
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Supporting you with compassion, clarity and consciousness on your
            path of healing and transformation.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Quick Links
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-terracotta">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Resources
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {resources.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-terracotta">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Connect
          </h4>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Link href={site.whatsappUrl} target="_blank" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-terracotta">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </Link>
            </li>
            <li>
              <Link href={site.instagramUrl} target="_blank" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-terracotta">
                <InstagramIcon className="h-4 w-4" /> Instagram
              </Link>
            </li>
            <li>
              <Link href={site.youtubeUrl} target="_blank" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-terracotta">
                <YouTubeIcon className="h-4 w-4" /> YouTube
              </Link>
            </li>
            <li>
              <Link href={`mailto:${site.email}`} className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-terracotta">
                <Mail className="h-4 w-4" strokeWidth={1.5} /> Email
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-8 sm:text-left">
          <p>© 2025 Mystic Soul Journey. All rights reserved.</p>
          <p>Crafted with care for healing &amp; transformation.</p>
        </div>
      </div>
    </footer>
  )
}
