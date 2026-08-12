"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  User,
  MessageSquare,
  IndianRupee,
} from "lucide-react"
import { LotusMark } from "@/components/brand/logo"
import { WhatsAppButton, WhatsAppIcon } from "@/components/site/whatsapp-button"
import { ServiceIcon } from "@/components/brand/service-icon"
import { bookableServices, formatPrice, type Service } from "@/lib/data/services"
import {
  buildCalendar,
  timeSlots,
  bookedSlots,
  WEEKDAYS,
  MONTHS,
  formatLongDate,
} from "@/lib/booking"
import { site } from "@/lib/data/site"
import { cn } from "@/lib/utils"

const STEPS = ["Choose a Service", "Choose a Date", "Choose a Time", "Your Details", "Review & Confirm"]

interface Details {
  name: string
  phone: string
  email: string
  message: string
}

export function BookingWizard({ initialServiceSlug }: { initialServiceSlug?: string }) {
  const [step, setStep] = useState(0)
  const [service, setService] = useState<Service | null>(
    bookableServices.find((s) => s.slug === initialServiceSlug) ?? null,
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", message: "" })
  const [payment, setPayment] = useState<"whatsapp" | "upi">("whatsapp")
  const [confirmed, setConfirmed] = useState(false)

  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const calendar = useMemo(() => buildCalendar(view.year, view.month, now), [view])

  const canContinue =
    (step === 0 && !!service) ||
    (step === 1 && !!selectedDate) ||
    (step === 2 && !!time) ||
    (step === 3 && details.name.trim() && details.phone.trim()) ||
    step === 4

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else setConfirmed(true)
  }
  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  if (confirmed) {
    return <Confirmation service={service!} date={selectedDate!} time={time!} details={details} payment={payment} />
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-16">
      <Header />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className={cn("mx-1.5 h-px flex-1 transition-colors", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-sm font-medium text-terracotta">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_20px_60px_-40px_rgba(90,70,40,0.5)] sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="font-serif text-2xl text-primary">{STEPS[step]}</h1>
            <p className="text-sm text-muted-foreground">{stepSubtitle(step, selectedDate)}</p>
          </div>
        </div>

        {step === 0 && <StepService service={service} onSelect={setService} />}
        {step === 1 && (
          <StepDate
            calendar={calendar}
            view={view}
            setView={setView}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        )}
        {step === 2 && <StepTime time={time} onSelect={setTime} service={service} selectedDate={selectedDate} />}
        {step === 3 && <StepDetails details={details} setDetails={setDetails} />}
        {step === 4 && (
          <StepReview
            service={service!}
            date={selectedDate!}
            time={time!}
            details={details}
            payment={payment}
            setPayment={setPayment}
          />
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={next}
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? "Confirm Booking" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <Footer />
    </div>
  )
}

function Header() {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="mx-auto inline-flex flex-col items-center">
        <LotusMark className="h-9 w-9 text-terracotta" />
        <span className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{site.name}</span>
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-primary md:text-4xl">
        Book <span className="italic text-terracotta">Your</span> Session
      </h2>
      <p className="mt-1 text-sm tracking-wide text-muted-foreground">Simple. Sacred. Personal.</p>
    </div>
  )
}

function Footer() {
  return (
    <p className="mt-8 text-center text-sm leading-relaxed text-muted-foreground">
      Thank you for choosing {site.name}.
      <br />I look forward to connecting with you.
    </p>
  )
}

function stepSubtitle(step: number, date: Date | null) {
  switch (step) {
    case 0:
      return "Select the session that calls to you"
    case 1:
      return "Select a date that works for you"
    case 2:
      return date ? `Available time slots for ${formatLongDate(date)}` : "Select a time"
    case 3:
      return "Please share your details to book your session"
    case 4:
      return "Please review your booking details"
    default:
      return ""
  }
}

function StepService({ service, onSelect }: { service: Service | null; onSelect: (s: Service) => void }) {
  return (
    <div className="space-y-3">
      {bookableServices.map((s) => {
        const active = service?.id === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className={cn(
              "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
              active
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach/50 text-terracotta">
              <ServiceIcon name={s.icon} className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-medium text-primary">{s.name}</span>
              <span className="block text-sm text-muted-foreground">{s.shortDescription}</span>
            </span>
            <span className="flex flex-col items-end text-right">
              <span className="text-xs text-muted-foreground">{s.durationMinutes} mins</span>
              <span className="text-sm font-medium text-primary">{formatPrice(s.price)}</span>
            </span>
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function StepDate({
  calendar,
  view,
  setView,
  selectedDate,
  onSelect,
}: {
  calendar: ReturnType<typeof buildCalendar>
  view: { year: number; month: number }
  setView: (v: { year: number; month: number }) => void
  selectedDate: Date | null
  onSelect: (d: Date) => void
}) {
  function shift(delta: number) {
    const m = view.month + delta
    const year = view.year + Math.floor(m / 12)
    const month = ((m % 12) + 12) % 12
    setView({ year, month })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-serif text-lg text-primary">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-xs font-medium text-muted-foreground">
            {w}
          </div>
        ))}
        {calendar.map((cell, i) => {
          if (!cell.inMonth) return <div key={`b-${i}`} />
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === cell.day &&
            selectedDate.getMonth() === view.month &&
            selectedDate.getFullYear() === view.year
          return (
            <button
              key={cell.day}
              type="button"
              disabled={!cell.isAvailable}
              onClick={() => onSelect(cell.date)}
              className={cn(
                "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : cell.isAvailable
                    ? "text-foreground hover:bg-primary/10"
                    : "cursor-not-allowed text-muted-foreground/40",
              )}
            >
              {cell.day}
              {cell.isAvailable && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-sage" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-sage" />
        Dates with a dot have available sessions. Sundays are closed.
      </div>
    </div>
  )
}

function StepTime({
  time,
  onSelect,
  service,
  selectedDate,
}: {
  time: string | null
  onSelect: (t: string) => void
  service: Service | null
  selectedDate: Date | null
}) {
  return (
    <div className="space-y-6">
      {(Object.keys(timeSlots) as (keyof typeof timeSlots)[]).map((period) => (
        <div key={period}>
          <p className="mb-2.5 text-sm font-medium text-primary">{period}</p>
          <div className="grid grid-cols-3 gap-2.5">
            {timeSlots[period].map((slot) => {
              const booked = bookedSlots.includes(slot)
              const active = time === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  onClick={() => onSelect(slot)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border py-2.5 text-sm transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : booked
                        ? "cursor-not-allowed border-border bg-secondary/50 text-muted-foreground/50"
                        : "border-border hover:border-primary/50",
                  )}
                >
                  {slot}
                  {booked && <span className="text-[0.65rem]">Booked</span>}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {time && service && selectedDate && (
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/50 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peach/60 text-terracotta">
            <Clock className="h-4 w-4" />
          </span>
          <span className="text-sm">
            <span className="block font-medium text-primary">
              {service.name} ({service.durationMinutes} mins)
            </span>
            <span className="block text-muted-foreground">
              Selected: {formatLongDate(selectedDate)} at {time}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"

function StepDetails({ details, setDetails }: { details: Details; setDetails: (d: Details) => void }) {
  function update(field: keyof Details) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDetails({ ...details, [field]: e.target.value })
  }
  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">
          Full Name <span className="text-terracotta">*</span>
        </span>
        <input value={details.name} onChange={update("name")} className={inputClass} placeholder="Enter your full name" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">
          WhatsApp Number <span className="text-terracotta">*</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="flex h-[42px] items-center gap-1.5 rounded-xl border border-input bg-secondary/40 px-3 text-sm text-muted-foreground">
            🇮🇳 +91
          </span>
          <input
            value={details.phone}
            onChange={update("phone")}
            type="tel"
            className={inputClass}
            placeholder="98765 43210"
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">Email Address</span>
        <input
          value={details.email}
          onChange={update("email")}
          type="email"
          className={inputClass}
          placeholder="Enter your email address"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">
          Message <span className="font-normal text-muted-foreground">(Optional)</span>
        </span>
        <textarea
          value={details.message}
          onChange={update("message")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Anything you'd like to share with me"
        />
      </label>
      <div className="flex items-start gap-2.5 rounded-xl bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
        Your details are safe and will only be used for this booking.
      </div>
    </div>
  )
}

function StepReview({
  service,
  date,
  time,
  details,
  payment,
  setPayment,
}: {
  service: Service
  date: Date
  time: string
  details: Details
  payment: "whatsapp" | "upi"
  setPayment: (p: "whatsapp" | "upi") => void
}) {
  const rows = [
    { icon: CalendarDays, label: "Date", value: formatLongDate(date) },
    { icon: Clock, label: "Time", value: time },
    {
      icon: User,
      label: "Your Details",
      value: `${details.name || "—"}\n+91 ${details.phone}\n${details.email || ""}`,
    },
    { icon: MessageSquare, label: "Message", value: details.message || "—" },
  ]
  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-peach/60 text-terracotta">
            <ServiceIcon name={service.icon} className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-medium text-primary">{service.name}</span>
            <span className="block text-sm text-muted-foreground">{service.durationMinutes} Minutes</span>
          </span>
        </span>
        <span className="font-serif text-xl text-primary">{formatPrice(service.price)}</span>
      </div>

      <dl className="mt-5 space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-3">
            <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
            <div className="flex-1">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{r.label}</dt>
              <dd className="whitespace-pre-line text-sm text-foreground/90">{r.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-6 mb-3 text-sm font-medium text-primary">Payment / Enquiry</p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setPayment("whatsapp")}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
            payment === "whatsapp" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border",
          )}
        >
          <Radio active={payment === "whatsapp"} />
          <span className="flex-1">
            <span className="block text-sm font-medium text-primary">Enquire on WhatsApp</span>
            <span className="block text-xs text-muted-foreground">I will confirm with payment later</span>
          </span>
          <WhatsAppIcon className="h-5 w-5 text-sage" />
        </button>
        <button
          type="button"
          onClick={() => setPayment("upi")}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
            payment === "upi" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border",
          )}
        >
          <Radio active={payment === "upi"} />
          <span className="flex-1">
            <span className="block text-sm font-medium text-primary">Pay Now (UPI)</span>
            <span className="block text-xs text-muted-foreground">I will pay and confirm my booking</span>
          </span>
          <IndianRupee className="h-5 w-5 text-terracotta" />
        </button>
      </div>
    </div>
  )
}

function Radio({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        active ? "border-primary" : "border-border",
      )}
    >
      {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </span>
  )
}

function Confirmation({
  service,
  date,
  time,
  details,
  payment,
}: {
  service: Service
  date: Date
  time: string
  details: Details
  payment: "whatsapp" | "upi"
}) {
  const rows = [
    { icon: CalendarDays, label: "Date", value: formatLongDate(date) },
    { icon: Clock, label: "Time", value: time },
    { icon: User, label: "With", value: site.name },
    {
      icon: IndianRupee,
      label: "Payment Status",
      value: payment === "whatsapp" ? "Enquiry Received" : "Payment Pending",
    },
  ]
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 md:py-16">
      <div className="rounded-3xl border border-border/70 bg-card p-8 text-center shadow-[0_20px_60px_-40px_rgba(90,70,40,0.5)]">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-9 w-9" strokeWidth={2.5} />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-primary">You&apos;re All Set!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your session is successfully booked.</p>

        <div className="mt-7 rounded-2xl border border-border/70 bg-secondary/40 p-5 text-left">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach/60 text-terracotta">
              <ServiceIcon name={service.icon} className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-medium text-primary">{service.name}</span>
              <span className="block text-xs text-muted-foreground">{service.durationMinutes} Minutes</span>
            </span>
          </div>
          <dl className="mt-4 space-y-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <r.icon className="h-4 w-4 shrink-0 text-terracotta" />
                <dt className="w-28 text-xs uppercase tracking-wide text-muted-foreground">{r.label}</dt>
                <dd className="flex-1 text-sm text-foreground/90">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 rounded-xl bg-peach/30 px-4 py-3 text-sm text-foreground/80">
          You will receive a confirmation on WhatsApp shortly. Thank you, {details.name || "friend"}!
        </div>

        <div className="mt-6 space-y-3">
          <WhatsAppButton
            className="w-full"
            message={`Hi, I just booked a ${service.name} on ${formatLongDate(date)} at ${time}.`}
          />
          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/25 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <CalendarDays className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
