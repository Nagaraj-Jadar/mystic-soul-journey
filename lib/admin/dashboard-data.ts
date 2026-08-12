import { createServerClient } from '@/lib/supabase/server'

export type DashboardAppointmentRow = {
  id: string
  client: string
  service: string
  date: string
  startTime: string
  endTime: string
  status: 'Confirmed' | 'Pending Payment' | 'Pending' | 'Cancelled'
  payment: 'Paid' | 'Pending'
  avatar: string
}

export type DashboardPaymentRow = {
  id: string
  client: string
  service: string
  amount: number
  status: 'Paid' | 'Pending'
  date: string
}

const baseCandidateDateKeys = [
  'appointment_date',
  'date',
  'scheduled_date',
  'slot_date',
  'start_date',
  'appointmentDate',
  'date_time',
  'datetime',
  'scheduled_at',
  'start_at',
  'starts_at',
]

const baseCandidateTimeKeys = [
  'start_time',
  'startTime',
  'time_start',
  'scheduled_start',
  'start_at',
  'starts_at',
]

const baseCandidateEndTimeKeys = [
  'end_time',
  'endTime',
  'time_end',
  'scheduled_end',
  'end_at',
  'ends_at',
]

const baseCandidateClientKeys = [
  'client',
  'client_name',
  'clientName',
  'customer',
  'customer_name',
  'full_name',
  'name',
  'user_name',
  'client_full_name',
  'contact_name',
]

const baseCandidateServiceKeys = [
  'service',
  'service_name',
  'serviceName',
  'title',
  'name',
  'course_name',
  'program_name',
  'session_type',
]

const baseCandidateStatusKeys = [
  'status',
  'appointment_status',
  'appointmentStatus',
  'state',
  'booking_status',
]

const baseCandidatePaymentStatusKeys = [
  'payment_status',
  'paymentStatus',
  'status',
  'payment_state',
  'paid_status',
]

const baseCandidateAmountKeys = [
  'amount',
  'total_amount',
  'amount_paid',
  'paid_amount',
  'price',
  'fee',
]

const baseCandidateCourseStatusKeys = [
  'status',
  'course_status',
  'state',
  'published',
  'is_active',
  'is_published',
  'active',
]

function normalizeStatus(value: unknown): string {
  const text = String(value ?? '').trim().toLowerCase()
  if (!text) return 'Confirmed'
  if (text.includes('cancel')) return 'Cancelled'
  if (text.includes('pending payment') || text.includes('payment pending') || text.includes('pending_payment')) return 'Pending Payment'
  if (text.includes('pending')) return 'Pending'
  if (text.includes('confirmed') || text.includes('scheduled') || text.includes('booked') || text.includes('accepted')) return 'Confirmed'
  return 'Confirmed'
}

function normalizePaymentStatus(value: unknown): 'Paid' | 'Pending' {
  const text = String(value ?? '').trim().toLowerCase()
  if (!text) return 'Pending'
  if (text.includes('paid') || text.includes('complete') || text.includes('successful') || text.includes('settled')) return 'Paid'
  if (text.includes('pending') || text.includes('due') || text.includes('unpaid')) return 'Pending'
  return 'Pending'
}

function getFirstAvailableValue(row: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    if (key in row && row[key] !== null && row[key] !== undefined && row[key] !== '') {
      return row[key]
    }
  }
  return null
}

function parseDateValue(value: unknown): Date | null {
  if (!value) return null
  const raw = String(value).trim()
  if (!raw) return null

  const iso = new Date(raw)
  if (!Number.isNaN(iso.getTime())) return iso

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const isoDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`)
    if (!Number.isNaN(isoDate.getTime())) return isoDate
  }

  return null
}

function formatAppointmentDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDisplayTime(value: unknown): string {
  if (!value) return ''
  const raw = String(value).trim()
  if (!raw) return ''

  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const time = new Date(raw)
    if (!Number.isNaN(time.getTime())) {
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  return raw
}

function getDateOnly(dateValue: unknown) {
  const parsed = parseDateValue(dateValue)
  if (!parsed) return null
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
}

function isSameDay(dateValue: unknown, targetDate: Date) {
  const parsed = getDateOnly(dateValue)
  if (!parsed) return false
  return parsed.getTime() === new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime()
}

function isInCurrentWeek(dateValue: unknown, targetDate: Date) {
  const parsed = getDateOnly(dateValue)
  if (!parsed) return false

  const current = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  const start = new Date(current)
  const day = current.getDay()
  const diffToMonday = (day === 0 ? -6 : 1 - day)
  start.setDate(current.getDate() + diffToMonday)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return parsed >= start && parsed <= end
}

function isInCurrentMonth(dateValue: unknown, targetDate: Date) {
  const parsed = getDateOnly(dateValue)
  if (!parsed) return false
  return parsed.getFullYear() === targetDate.getFullYear() && parsed.getMonth() === targetDate.getMonth()
}

function getFutureSortValue(dateValue: unknown, startValue: unknown) {
  const timeDate = parseDateValue(dateValue)
  const timeDateOnly = getDateOnly(dateValue)
  const time = startValue ? formatDisplayTime(startValue) : ''

  if (!timeDate && !time) return Number.MAX_SAFE_INTEGER

  if (timeDate) {
    const [hour, minute] = time && time.includes(':')
      ? time.match(/(\d+):(\d+)/)?.slice(1,3).map(Number) ?? [0, 0]
      : [0, 0]

    const ts = new Date(timeDate)
    ts.setHours(hour || 0, minute || 0, 0, 0)
    return ts.getTime()
  }

  return Number.MAX_SAFE_INTEGER
}

async function selectAllRows(table: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from(table).select('*')
  if (error) return []
  return Array.isArray(data) ? data : []
}

export async function getDashboardData() {
  const today = new Date()
  const appointments = await selectAllRows('appointments')
  const payments = await selectAllRows('payments')
  const courses = await selectAllRows('courses')

  const normalizedAppointments: DashboardAppointmentRow[] = appointments
    .map((row) => {
      const dateValue = getFirstAvailableValue(row, baseCandidateDateKeys)
      const startValue = getFirstAvailableValue(row, baseCandidateTimeKeys)
      const endValue = getFirstAvailableValue(row, baseCandidateEndTimeKeys)
      const clientValue = getFirstAvailableValue(row, baseCandidateClientKeys)
      const serviceValue = getFirstAvailableValue(row, baseCandidateServiceKeys)
      const statusValue = getFirstAvailableValue(row, baseCandidateStatusKeys)
      const paymentStatusValue = getFirstAvailableValue(row, baseCandidatePaymentStatusKeys)

      const clientName = String(clientValue ?? row.client ?? row.name ?? 'Client').trim() || 'Client'
      const serviceName = String(serviceValue ?? row.service ?? row.title ?? 'Service').trim() || 'Service'

      return {
        id: String(row.id ?? `${clientName}-${serviceName}-${String(dateValue ?? '')}`),
        client: clientName,
        service: serviceName,
        date: dateValue ? formatAppointmentDate(parseDateValue(dateValue) ?? today) : '',
        startTime: formatDisplayTime(startValue),
        endTime: formatDisplayTime(endValue),
        status: normalizeStatus(statusValue) as DashboardAppointmentRow['status'],
        payment: normalizePaymentStatus(paymentStatusValue),
        avatar: typeof row.avatar === 'string' && row.avatar ? row.avatar : '/practitioner-about.png',
      }
    })
    .filter((row) => !!row.date || !!row.startTime || !!row.service || !!row.client)

  const todayAppointments = normalizedAppointments.filter((appointment) => {
    const dateValue = getFirstAvailableValue(
      appointments.find((row) => String(row.id ?? row.client ?? row.service) === appointment.id) ?? {},
      baseCandidateDateKeys,
    )
    return isSameDay(dateValue, today)
  }).length

  const thisWeekAppointments = normalizedAppointments.filter((appointment) => {
    const dateValue = getFirstAvailableValue(
      appointments.find((row) => String(row.id ?? row.client ?? row.service) === appointment.id) ?? {},
      baseCandidateDateKeys,
    )
    return isInCurrentWeek(dateValue, today)
  }).length

  const thisMonthAppointments = normalizedAppointments.filter((appointment) => {
    const dateValue = getFirstAvailableValue(
      appointments.find((row) => String(row.id ?? row.client ?? row.service) === appointment.id) ?? {},
      baseCandidateDateKeys,
    )
    return isInCurrentMonth(dateValue, today)
  }).length

  const pendingPayments = payments.filter((row) => {
    const statusValue = getFirstAvailableValue(row, baseCandidatePaymentStatusKeys) ?? getFirstAvailableValue(row, ['status'])
    return String(statusValue ?? '').trim().toLowerCase().includes('pending')
  }).length

  const normalizedCourses = courses.filter((row) => {
    const courseStatus = getFirstAvailableValue(row, baseCandidateCourseStatusKeys)
    const activeValue = String(courseStatus ?? '').trim().toLowerCase()
    if (!activeValue) return true
    if (activeValue.includes('inactive') || activeValue.includes('archived') || activeValue.includes('cancelled')) return false
    return true
  })

  const upcomingCourses = normalizedCourses.length

  const totalEarnings = payments.reduce((sum, row) => {
    const amountValue = getFirstAvailableValue(row, baseCandidateAmountKeys)
    const paymentStatusValue = getFirstAvailableValue(row, baseCandidatePaymentStatusKeys) ?? getFirstAvailableValue(row, ['status'])
    const paidStatus = String(paymentStatusValue ?? '').trim().toLowerCase()
    const amount = Number(amountValue ?? 0)

    if (!Number.isFinite(amount) || amount <= 0) return sum
    if (paidStatus.includes('paid') || paidStatus.includes('complete') || paidStatus.includes('successful')) {
      return sum + amount
    }
    return sum
  }, 0)

  const filteredTodaySchedule = normalizedAppointments
    .filter((appointment) => {
      const original = appointments.find((row) => String(row.id ?? row.client ?? row.service) === appointment.id)
      const dateValue = getFirstAvailableValue(original ?? {}, baseCandidateDateKeys)
      return isSameDay(dateValue, today)
    })
    .sort((a, b) => {
      const aDate = getFirstAvailableValue(
        appointments.find((row) => String(row.id ?? row.client ?? row.service) === a.id) ?? {},
        baseCandidateDateKeys,
      )
      const bDate = getFirstAvailableValue(
        appointments.find((row) => String(row.id ?? row.client ?? row.service) === b.id) ?? {},
        baseCandidateDateKeys,
      )
      return (getFutureSortValue(aDate, a.startTime) || Number.MAX_SAFE_INTEGER) - (getFutureSortValue(bDate, b.startTime) || Number.MAX_SAFE_INTEGER)
    })

  const futureAppointments = normalizedAppointments
    .filter((appointment) => {
      const original = appointments.find((row) => String(row.id ?? row.client ?? row.service) === appointment.id)
      const dateValue = getFirstAvailableValue(original ?? {}, baseCandidateDateKeys)
      return parseDateValue(dateValue) ? new Date(parseDateValue(dateValue) as Date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()) : false
    })
    .sort((a, b) => {
      const aRow = appointments.find((row) => String(row.id ?? row.client ?? row.service) === a.id)
      const bRow = appointments.find((row) => String(row.id ?? row.client ?? row.service) === b.id)
      const aDate = getFirstAvailableValue(aRow ?? {}, baseCandidateDateKeys)
      const bDate = getFirstAvailableValue(bRow ?? {}, baseCandidateDateKeys)
      return (getFutureSortValue(aDate, a.startTime) || Number.MAX_SAFE_INTEGER) - (getFutureSortValue(bDate, b.startTime) || Number.MAX_SAFE_INTEGER)
    })

  return {
    stats: {
      todayAppointments,
      thisWeek: thisWeekAppointments,
      thisWeekChange: '',
      thisMonth: thisMonthAppointments,
      thisMonthChange: '',
      pendingPayments,
      upcomingCourses,
      totalEarnings,
      earningsChange: '',
    },
    todaySchedule: filteredTodaySchedule.slice(0, 10),
    upcomingAppointments: futureAppointments.slice(0, 10),
    recentPayments: payments
      .map((row) => {
        const statusValue = getFirstAvailableValue(row, baseCandidatePaymentStatusKeys) ?? getFirstAvailableValue(row, ['status'])
        const amountValue = getFirstAvailableValue(row, baseCandidateAmountKeys)
        const dateValue = getFirstAvailableValue(row, baseCandidateDateKeys)
        const clientValue = getFirstAvailableValue(row, baseCandidateClientKeys)
        const serviceValue = getFirstAvailableValue(row, baseCandidateServiceKeys)

        return {
          id: String(row.id ?? `${serviceValue ?? 'payment'}-${clientValue ?? 'client'}`),
          client: String(clientValue ?? row.client ?? 'Client').trim() || 'Client',
          service: String(serviceValue ?? row.service ?? 'Service').trim() || 'Service',
          amount: Number(amountValue ?? 0),
          status: normalizePaymentStatus(statusValue) as 'Paid' | 'Pending',
          date: dateValue ? formatAppointmentDate(parseDateValue(dateValue) ?? today) : '',
        }
      })
      .slice(0, 5),
  }
}
