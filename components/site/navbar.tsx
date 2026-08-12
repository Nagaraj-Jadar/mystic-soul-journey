'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mainNav } from '@/lib/data/site'
import { Logo } from '@/components/brand/logo'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-[#fbf8f2] transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-background/60 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-[5.4rem] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[6.8rem] lg:px-[2.75rem]">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {mainNav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative text-sm font-medium tracking-wide transition-colors',
                  active ? 'text-primary' : 'text-foreground/70 hover:text-primary',
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-terracotta" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <WhatsAppButton label="Connect on WhatsApp" size="sm" className="rounded-xl bg-[#68705a] px-4 shadow-none" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-primary lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[5.4rem] z-40 bg-background/95 backdrop-blur-md lg:hidden"
          >
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6 sm:px-8"
            >
              {mainNav.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3.5 font-serif text-xl transition-colors',
                      active
                        ? 'bg-secondary text-primary'
                        : 'text-foreground/80 hover:bg-secondary/60',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="mt-4 px-1">
                <WhatsAppButton className="w-full" />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
