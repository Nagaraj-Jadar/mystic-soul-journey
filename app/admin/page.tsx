"use client"

import Link from "next/link"
import {
  CalendarCheck,
  CalendarDays,
  Users,
  IndianRupee,
  BookOpen,
  Plus,
  Ban,
  Sparkles,
  Users as UsersIcon,
  Send,
} from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, PanelHeader, StatCard, StatusBadge, formatINR } from "@/components/admin/ui"
import { ScheduleList } from "@/components/admin/schedule-list"
import { MiniCalendar } from "@/components/admin/mini-calendar"
import { EarningsChart } from "@/components/admin/earnings-chart"
import {
  dashboardStats as s,
  todaySchedule,
  upcomingAppointments,
  recentPayments,
} from "@/lib/data/admin"

const quickActions = [
  { label: "Add Availability", icon: Plus, href: "/admin/availability" },
  { label: "Block Date / Time", icon: Ban, href: "/admin/availability" },
  { label: "Add New Service", icon: Sparkles, href: "/admin/services" },
  { label: "View New Course", icon: BookOpen, href: "/admin/courses" },
  { label: "View All Clients", icon: UsersIcon, href: "/admin/clients" },
  { label: "Send Reminder", icon: Send, href: "/admin/appointments" },
]

export default function AdminDashboard() {
  return (
    <AdminShell
      title={
        <span>
          Good Morning, <span className="text-terracotta">Soumyaa</span>
        </span>
      }
      subtitle="Welcome back to your dashboard"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={CalendarCheck} label="Today's Appointments" value={s.todayAppointments} tone="sage" />
        <StatCard icon={CalendarDays} label="This Week" value={s.thisWeek} change={s.thisWeekChange} tone="peach" />
        <StatCard icon={Users} label="This Month" value={s.thisMonth} change={s.thisMonthChange} tone="sage" />
        <StatCard icon={IndianRupee} label="Pending Payments" value={s.pendingPayments} tone="terracotta" />
        <StatCard icon={BookOpen} label="Upcoming Courses" value={s.upcomingCourses} tone="peach" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <Panel>
            <PanelHeader
              title="Today's Schedule"
              action={
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-muted-foreground sm:inline">18 June 2025</span>
                  <Link
                    href="/admin/calendar"
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    View Calendar
                  </Link>
                </div>
              }
            />
            <ScheduleList items={todaySchedule} />
          </Panel>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel>
              <PanelHeader
                title="Upcoming Appointments"
                action={
                  <Link href="/admin/appointments" className="text-sm font-medium text-terracotta hover:underline">
                    View All
                  </Link>
                }
              />
              <ul className="flex flex-col divide-y divide-border/60">
                {upcomingAppointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {a.date.replace(" 2025", "")}, {a.startTime}
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">{a.service}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.client}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel>
              <PanelHeader
                title="Earnings Overview"
                action={
                  <span className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    This Month
                  </span>
                }
              />
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <div className="mb-4 flex items-center gap-2">
                <span className="font-serif text-3xl text-foreground">{formatINR(s.totalEarnings)}</span>
                <span className="text-xs font-medium text-primary">↑ {s.earningsChange}</span>
              </div>
              <EarningsChart />
            </Panel>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <Panel>
            <MiniCalendar />
          </Panel>

          <Panel>
            <PanelHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => {
                const Icon = qa.icon
                return (
                  <Link
                    key={qa.label}
                    href={qa.href}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-terracotta" strokeWidth={1.75} />
                    <span className="leading-tight">{qa.label}</span>
                  </Link>
                )
              })}
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Recent Payments"
              action={
                <Link href="/admin/payments" className="text-sm font-medium text-terracotta hover:underline">
                  View All
                </Link>
              }
            />
            <ul className="flex flex-col divide-y divide-border/60">
              {recentPayments.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{p.client}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.service}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{formatINR(p.amount)}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AdminShell>
  )
}
