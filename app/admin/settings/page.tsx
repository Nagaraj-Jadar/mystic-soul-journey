"use client"

import { useState } from "react"
import { Bell, Globe, CreditCard, ShieldCheck, MessageCircle } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, PanelHeader } from "@/components/admin/ui"

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

function SettingRow({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-4 last:border-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Configure how your practice runs behind the scenes">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </span>
            }
          />
          <SettingRow title="New booking alerts" desc="Get notified when a client books a session.">
            <Toggle defaultOn />
          </SettingRow>
          <SettingRow title="Payment reminders" desc="Remind clients with pending payments automatically.">
            <Toggle defaultOn />
          </SettingRow>
          <SettingRow title="Daily summary" desc="Receive a morning summary of the day ahead.">
            <Toggle />
          </SettingRow>
        </Panel>

        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" /> WhatsApp
              </span>
            }
          />
          <SettingRow title="Auto-reply to enquiries" desc="Send a warm auto-reply when a new enquiry arrives.">
            <Toggle defaultOn />
          </SettingRow>
          <SettingRow title="Booking confirmations" desc="Send booking confirmations over WhatsApp.">
            <Toggle defaultOn />
          </SettingRow>
          <SettingRow title="Session reminders" desc="Remind clients 24 hours before their session.">
            <Toggle defaultOn />
          </SettingRow>
        </Panel>

        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payments
              </span>
            }
          />
          <SettingRow title="Accept UPI payments" desc="Allow clients to pay instantly via UPI.">
            <Toggle defaultOn />
          </SettingRow>
          <SettingRow title="Require advance payment" desc="Ask for payment before confirming a booking.">
            <Toggle />
          </SettingRow>
          <SettingRow title="Currency" desc="Displayed across bookings and invoices.">
            <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground">
              INR (₹)
            </span>
          </SettingRow>
        </Panel>

        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Preferences
              </span>
            }
          />
          <SettingRow title="Time zone" desc="Used for scheduling and reminders.">
            <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground">
              IST (GMT+5:30)
            </span>
          </SettingRow>
          <SettingRow title="Week starts on" desc="First day shown in your calendar.">
            <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground">
              Sunday
            </span>
          </SettingRow>
          <SettingRow title="Public booking page" desc="Allow new clients to book online.">
            <Toggle defaultOn />
          </SettingRow>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Security
              </span>
            }
          />
          <SettingRow title="Two-factor authentication" desc="Add an extra layer of protection to your account.">
            <Toggle />
          </SettingRow>
          <SettingRow title="Login alerts" desc="Get notified of sign-ins from new devices.">
            <Toggle defaultOn />
          </SettingRow>
        </Panel>
      </div>
    </AdminShell>
  )
}
