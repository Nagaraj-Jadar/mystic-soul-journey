export interface CalendarDay {
  date: Date
  day: number
  inMonth: boolean
  isPast: boolean
  isAvailable: boolean
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export { WEEKDAYS, MONTHS }

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function buildCalendar(
  viewYear: number,
  viewMonth: number,
  today = new Date(),
  availabilityMap?: Record<number, { start_time?: string; end_time?: string; is_available?: boolean }>,
): CalendarDay[] {
  const first = new Date(viewYear, viewMonth, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayStripped = stripTime(today)

  const cells: CalendarDay[] = []
  // leading blanks from previous month
  for (let i = 0; i < startWeekday; i++) {
    const date = new Date(viewYear, viewMonth, i - startWeekday + 1)
    cells.push({ date, day: date.getDate(), inMonth: false, isPast: true, isAvailable: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d)
    const isPast = stripTime(date) < todayStripped
    const weekday = date.getDay()
    // availability is determined by availabilityMap if provided, otherwise Sundays closed
    const availableRecord = availabilityMap?.[weekday]
    const isAvailableFromMap = availableRecord ? Boolean(availableRecord.is_available) : weekday !== 0
    const isAvailable = !isPast && isAvailableFromMap
    cells.push({ date, day: d, inMonth: true, isPast, isAvailable })
  }
  return cells
}

export const timeSlots = {
  Morning: ["10:00 AM", "11:00 AM", "12:00 PM"],
  Afternoon: ["01:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
  Evening: ["07:00 PM", "08:00 PM"],
}

// Slots that are pre-booked (demo)
export const bookedSlots = ["12:00 PM"]

export function formatLongDate(date: Date) {
  const weekday = WEEKDAYS[date.getDay()]
  return `${weekday}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

// Helpers for dynamic slot generation
export function parseHHMMToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map((n) => Number(n))
  return h * 60 + m
}

export function minutesToHHMM(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatHHMMto12h(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr12 = ((h + 11) % 12) + 1
  return `${String(hr12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function generateTimeSlots(startHHMM: string, endHHMM: string, durationMinutes: number) {
  const start = parseHHMMToMinutes(startHHMM)
  const end = parseHHMMToMinutes(endHHMM)
  const slots: string[] = []
  for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
    slots.push(minutesToHHMM(t))
  }
  return slots
}

export function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const aS = parseHHMMToMinutes(aStart)
  const aE = parseHHMMToMinutes(aEnd)
  const bS = parseHHMMToMinutes(bStart)
  const bE = parseHHMMToMinutes(bEnd)
  return Math.max(aS, bS) < Math.min(aE, bE)
}

export function groupSlotsByPeriod(slots24: string[]) {
  const periods: Record<string, string[]> = { Morning: [], Afternoon: [], Evening: [] }
  for (const s of slots24) {
    const h = Number(s.split(':')[0])
    if (h < 12) periods.Morning.push(s)
    else if (h < 17) periods.Afternoon.push(s)
    else periods.Evening.push(s)
  }
  return periods
}
