import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Clock,
  Sparkles,
  BookOpen,
  Users,
  Wallet,
  MessageSquareQuote,
  ImageIcon,
  FileText,
  Settings,
  UserCircle,
} from "lucide-react"

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Availability", href: "/admin/availability", icon: Clock },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
]
