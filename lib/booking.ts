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

export function buildCalendar(viewYear: number, viewMonth: number, today = new Date()): CalendarDay[] {
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
    const isSunday = date.getDay() === 0
    // Sundays closed; otherwise available if not in the past
    const isAvailable = !isPast && !isSunday
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
