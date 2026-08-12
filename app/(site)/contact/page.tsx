"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, MessageCircle, Check } from "lucide-react"
import { InstagramIcon, YouTubeIcon } from "@/components/brand/social-icons"
import { PageHero } from "@/components/site/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { WhatsAppButton, WhatsAppIcon } from "@/components/site/whatsapp-button"
import { site } from "@/lib/data/site"
import { bookableServices } from "@/lib/data/services"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  const channels = [
    { icon: MessageCircle, label: "WhatsApp", value: site.whatsappNumber, href: site.whatsappUrl },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: InstagramIcon, label: "Instagram", value: "@mysticsouljourney", href: site.instagramUrl },
    { icon: YouTubeIcon, label: "YouTube", value: "Mystic Soul Journey", href: site.youtubeUrl },
  ]

  return (
    <>
      <PageHero
        eyebrow="Let's Connect"
        title="Get in Touch"
        description="Have a question or feel ready to begin? Send a message and I'll get back to you with love and care."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-primary">Reach me directly</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The quickest way to connect is on WhatsApp. I personally read and reply to every message.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {channels.map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-terracotta/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach/50 text-terracotta">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-muted-foreground">{c.label}</span>
                      <span className="block text-sm font-medium text-primary">{c.value}</span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="rounded-2xl border border-border/70 bg-primary/5 p-6">
                <p className="font-serif text-lg italic leading-relaxed text-primary">
                  &ldquo;I look forward to connecting with you and walking beside you on your journey.&rdquo;
                </p>
                <p className="mt-3 text-sm text-muted-foreground">— {site.practitioner.fullName}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border/70 bg-card p-7 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-7 w-7" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl text-primary">Message received</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Thank you for reaching out. I&apos;ll get back to you soon. For a faster reply, message me on
                    WhatsApp.
                  </p>
                  <div className="mt-6">
                    <WhatsAppButton message="Hi Soumyaa, I just sent you a message through your website." />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-serif text-2xl text-primary">Send a message</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" required>
                      <input required type="text" name="name" className={inputClass} placeholder="Your name" />
                    </Field>
                    <Field label="WhatsApp Number" required>
                      <input required type="tel" name="phone" className={inputClass} placeholder="+91 98765 43210" />
                    </Field>
                  </div>
                  <Field label="Email Address">
                    <input type="email" name="email" className={inputClass} placeholder="you@email.com" />
                  </Field>
                  <Field label="I'm interested in">
                    <select name="interest" className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select an option
                      </option>
                      {bookableServices.map((s) => (
                        <option key={s.id} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                      <option value="course">A Course or Workshop</option>
                      <option value="other">Something else</option>
                    </select>
                  </Field>
                  <Field label="Your Message" required>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Share a little about what brings you here..."
                    />
                  </Field>
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <WhatsAppIcon /> Send Message
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your details are safe and only used to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </span>
      {children}
    </label>
  )
}
