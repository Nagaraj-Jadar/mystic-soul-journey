"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
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
import { formatPrice, type Service as LocalService } from "@/lib/data/services"
import { createClient } from "@/lib/supabase/client"
import {
  buildCalendar,
  WEEKDAYS,
  MONTHS,
  formatLongDate,
  generateTimeSlots,
  formatHHMMto12h,
  groupSlotsByPeriod,
  timesOverlap,
  parseHHMMToMinutes,
  minutesToHHMM,
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
  const [service, setService] = useState<LocalService | null>(null)
  const [services, setServices] = useState<LocalService[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", message: "" })
  const [payment, setPayment] = useState<"whatsapp" | "upi">("whatsapp")
  const [confirmed, setConfirmed] = useState(false)
  const [confirmedAppointment, setConfirmedAppointment] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, { start_time?: string; end_time?: string; is_available?: boolean }>>({})
  const [slots24, setSlots24] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [dateAvailable, setDateAvailable] = useState<boolean | null>(null)
  const [dateAvailableLoading, setDateAvailableLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const calendar = useMemo(() => buildCalendar(view.year, view.month, now, availabilityMap), [view, availabilityMap])

  // Load active services from Supabase
  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    supabase
      .from("services")
      .select(
        "id, slug, name, short_description, description, duration_minutes, price, is_active",
      )
      .eq("is_active", true)
      .then((res) => {
        if (!mounted) return
        if (res.error) return console.error(res.error)
        const rows = (res.data ?? []) as any[]
        const mapped = rows.map((r) => ({
          id: r.id,
          slug: r.slug ?? r.id,
          name: r.name ?? "Service",
          shortDescription: r.short_description ?? "",
          description: r.description ?? "",
          durationMinutes: Number(r.duration_minutes ?? 60),
          price: Number(r.price ?? 0),
          icon: "lotus",
          bookable: true,
        }))
        setServices(mapped as unknown as LocalService[])
        if (initialServiceSlug) {
          const found = mapped.find((s) => s.slug === initialServiceSlug)
          if (found) setService(found as unknown as LocalService)
        }
      })

    return () => {
      mounted = false
    }
  }, [initialServiceSlug])

  // Load weekly availability map
  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    supabase
      .from('availability')
      .select('day_of_week, start_time, end_time, is_available')
      .then((res) => {
        if (!mounted) return
        if (res.error) {
          console.error(res.error)
          return
        }
        const map: Record<number, any> = {}
        for (const r of res.data ?? []) {
          map[Number(r.day_of_week)] = {
            start_time: (r.start_time ?? '09:00').slice(0,5),
            end_time: (r.end_time ?? '17:00').slice(0,5),
            is_available: r.is_available !== false,
          }
        }
        setAvailabilityMap(map)
      })

    return () => { mounted = false }
  }, [])

  // Load time slots when service or selectedDate changes
  useEffect(() => {
    let mounted = true
    async function loadSlots() {
      setSlotsError(null)
      setSlots24([])
      setDateAvailable(null)
      if (!service || !selectedDate) return
      setDateAvailableLoading(true)
      setSlotsLoading(true)
      try {
        const supabase = createClient()
        const appointment_date = selectedDate.toISOString().slice(0,10)
        const weekday = selectedDate.getDay()
        let avail = availabilityMap[weekday]
        // If availability map is not yet populated for this weekday, fetch it directly
        if (!avail) {
          const { data: singleAvail } = await supabase
            .from('availability')
            .select('day_of_week, start_time, end_time, is_available')
            .eq('day_of_week', weekday)
            .maybeSingle()
          if (singleAvail) {
            avail = {
              start_time: (singleAvail.start_time ?? '09:00').slice(0,5),
              end_time: (singleAvail.end_time ?? '17:00').slice(0,5),
              is_available: singleAvail.is_available !== false,
            }
          }
        }

        if (!avail || !avail.is_available) {
          if (mounted) {
            setSlots24([])
            setDateAvailable(false)
          }
          return
        }

        if (mounted) setDateAvailable(true)

        const generated = generateTimeSlots(avail.start_time || '09:00', avail.end_time || '17:00', service.durationMinutes)

        // fetch existing appointments for the date
        const { data: existingAppts, error: apptErr } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('appointment_date', appointment_date)

        if (apptErr) {
          console.error(apptErr)
          if (mounted) setSlotsError('Unable to load bookings')
          return
        }

        // filter out generated slots that overlap existing appointments
        const available = generated.filter((slot24) => {
          const slotStart = slot24
          const slotEnd = minutesToHHMM(parseHHMMToMinutes(slot24) + Number(service.durationMinutes))
          // don't offer past times for today
          if (selectedDate.toDateString() === new Date().toDateString()) {
            const nowMin = new Date()
            const nowMinutes = nowMin.getHours() * 60 + nowMin.getMinutes()
            if (parseHHMMToMinutes(slotStart) <= nowMinutes) return false
          }

          for (const appt of existingAppts ?? []) {
            const apptStart = (appt.start_time ?? '').slice(0,5)
            const apptEnd = (appt.end_time ?? '').slice(0,5)
            if (!apptStart || !apptEnd) continue
            if (timesOverlap(slotStart, slotEnd, apptStart, apptEnd)) return false
          }
          return true
        })

        if (mounted) setSlots24(available)
      } catch (err) {
        console.error(err)
        if (mounted) setSlotsError('Unable to load slots')
      } finally {
        if (mounted) {
          setSlotsLoading(false)
          setDateAvailableLoading(false)
        }
      }
    }
    loadSlots()
    return () => { mounted = false }
  }, [service, selectedDate, availabilityMap])

  const canContinue =
    (step === 0 && !!service) ||
    (step === 1 && !!selectedDate && dateAvailable === true) ||
    (step === 2 && !!time && (() => {
      // ensure selected time is still present in generated slots
      if (!time) return false
      // convert time like '09:00 AM' to '09:00'
      const to24 = (label: string) => {
        const m = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (!m) return null
        let hh = Number(m[1])
        const mm = m[2]
        const ampm = m[3].toUpperCase()
        if (ampm === 'PM' && hh < 12) hh += 12
        if (ampm === 'AM' && hh === 12) hh = 0
        return `${String(hh).padStart(2, '0')}:${mm}`
      }
      const t24 = to24(time)
      return Boolean(t24 && slots24.includes(t24))
    })()) ||
    (step === 3 && details.name.trim() && details.phone.trim()) ||
    step === 4

  async function next() {
    setBookingError(null)
    if (step < STEPS.length - 1) return setStep((s) => s + 1)

    // final step: submit booking to server
    if (!service || !selectedDate || !time) return
    setSubmitting(true)
    try {
      const payload = {
        service_id: service.id,
        appointment_date: selectedDate.toISOString().slice(0, 10),
        time_slot: time,
        name: details.name.trim(),
        phone: details.phone.trim(),
        email: details.email.trim() || null,
        city: (details as any).city || null,
        country: (details as any).country || null,
        notes: details.message.trim() || null,
        payment_method: payment,
      }

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || json?.message || "Unable to create booking.")
      setConfirmedAppointment(json.appointment ?? json)
      setConfirmed(true)
    } catch (err) {
      console.error(err)
      setBookingError((err as Error).message || "Booking failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }
  function back() {
    setBookingError(null)
    if (step > 0) setStep((s) => s - 1)
  }

  if (confirmed) {
    return <Confirmation service={service!} date={selectedDate!} time={time!} details={details} payment={payment} appointment={confirmedAppointment} />
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
        {bookingError ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{bookingError}</div>
        ) : null}
        <div className="mb-6 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
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

        {step === 0 && <StepService services={services} service={service} onSelect={setService} />}
        {step === 3 && <StepDetails details={details} setDetails={setDetails} />}
        {step === 1 && (
          <StepDate
            calendar={calendar}
            view={view}
            setView={setView}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        )}
        {step === 2 && (
          <StepTime
            time={time}
            onSelect={setTime}
            service={service}
            selectedDate={selectedDate}
            slots24={slots24}
            slotsLoading={slotsLoading}
            slotsError={slotsError}
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

function StepService({
  services,
  service,
  onSelect,
}: {
  services: LocalService[]
  service: LocalService | null
  onSelect: (s: LocalService) => void
}) {
  return (
    <div className="space-y-3">
      {services.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">Loading services...</div>
      ) : (
        services.map((s) => {
          const active = service?.id === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach/50 text-terracotta">
                <ServiceIcon name={s.icon as any} className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-primary">{s.name}</span>
                <span className="block text-sm text-muted-foreground">{(s as any).shortDescription || ""}</span>
              </span>
              <span className="flex flex-col items-end text-right">
                <span className="text-xs text-muted-foreground">{(s as any).durationMinutes} mins</span>
                <span className="text-sm font-medium text-primary">{formatPrice((s as any).price)}</span>
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
        })
      )}
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
  slots24,
  slotsLoading,
  slotsError,
}: {
  time: string | null
  onSelect: (t: string) => void
  service: LocalService | null
  selectedDate: Date | null
  slots24: string[]
  slotsLoading: boolean
  slotsError: string | null
}) {
  const periods = groupSlotsByPeriod(slots24)
  return (
    <div className="space-y-6">
      {slotsLoading ? (
        <div className="rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">Loading available times…</div>
      ) : slotsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {slotsError}
        </div>
      ) : slots24.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">No sessions are available on this date. Please choose another date.</div>
      ) : (
        Object.keys(periods).map((period) => (
          <div key={period}>
            <p className="mb-2.5 text-sm font-medium text-primary">{period}</p>
            <div className="grid grid-cols-3 gap-2.5">
              {periods[period].map((slot24) => {
                const slotLabel = formatHHMMto12h(slot24)
                const active = time === slotLabel
                return (
                  <button
                    key={slot24}
                    type="button"
                    onClick={() => onSelect(slotLabel)}
                    className={cn(
                      "flex flex-col items-center rounded-xl border py-2.5 text-sm transition-all",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                    )}
                  >
                    {slotLabel}
                  </button>
                )
              })}
            </div>
          </div>
        ))
      )}

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
  service: LocalService
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
  appointment,
}: {
  service: LocalService
  date: Date
  time: string
  details: Details
  payment: "whatsapp" | "upi"
  appointment?: any
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

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-primary">Complete Your Payment</h3>
          <p className="text-sm text-muted-foreground">Scan the QR code using PhonePe or your preferred UPI app.</p>
          <div className="mx-auto max-w-xs">
            <img src="/phonepe-qr.jpeg" alt="PhonePe UPI QR" className="w-full rounded-xl border border-border p-4 bg-background" />
          </div>
          <p className="text-sm text-muted-foreground">After completing the payment, please send the payment screenshot to us on WhatsApp for verification.</p>
          <WhatsAppButton
            className="w-full"
            label="Send Payment Screenshot on WhatsApp"
            message={`Hi, I completed payment for ${service.name} on ${formatLongDate(date)} at ${time}. Appointment ID: ${appointment?.id ?? ''}. Please find my payment screenshot attached.`}
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
