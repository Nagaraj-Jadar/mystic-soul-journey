// Courses are stored in Supabase (public.courses). This module only defines
// the shared shape + small formatting helpers used by the public + admin UI.
export interface Course {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  thumbnail_url: string | null
  price: number | null
  duration: string | null
  start_date: string | null
  end_date: string | null
  status: string
  is_featured: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export const COURSE_SELECT =
  "id, title, slug, short_description, description, thumbnail_url, price, duration, start_date, end_date, status, is_featured, created_at, updated_at"

export function formatCourseDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function courseDateBadge(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return {
    day: date.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
  }
}
