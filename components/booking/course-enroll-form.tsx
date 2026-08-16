"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { cn } from "@/lib/utils"

interface CourseEnrollFormProps {
  courseId: string
  courseTitle: string
}

export function CourseEnrollForm({ courseId, courseTitle }: CourseEnrollFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enrollment, setEnrollment] = useState<any | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError("Please share your name and WhatsApp number.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, name, phone, email, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Unable to submit enrollment. Please try again.")
        setSubmitting(false)
        return
      }
      setEnrollment(data.enrollment)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (enrollment) {
    return (
      <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <h3 className="mt-3 font-serif text-lg text-primary">You&apos;re enrolled!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your enrollment for {courseTitle} has been received and is pending confirmation.
        </p>
        <div className="mt-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            Scan the QR code using PhonePe or your preferred UPI app to complete payment, then send your payment
            screenshot on WhatsApp for verification.
          </p>
          <div className="mx-auto max-w-[200px]">
            <img src="/phonepe-qr.jpeg" alt="PhonePe UPI QR" className="w-full rounded-xl border border-border bg-background p-3" />
          </div>
          <WhatsAppButton
            className="w-full"
            label="Send Payment Screenshot on WhatsApp"
            message={`Hi, I've enrolled in ${courseTitle}. Enrollment ID: ${enrollment?.id ?? ""}. Please find my payment screenshot attached.`}
          />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Full Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp Number</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder="98765 43210"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Email (optional)</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder="you@email.com"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Message (optional)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
          placeholder="Anything you'd like to share before enrolling."
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? "Submitting..." : "Enroll Now"}
      </button>
    </form>
  )
}
