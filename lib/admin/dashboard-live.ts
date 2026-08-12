import { createClient } from '@/lib/supabase/client'

export type DashboardAppointment = {
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

export type DashboardPayment = {
  id: string
  client: string
  service: string
  amount: number
  status: 'Paid' | 'Pending'
  date: string
}

const appointmentDateFields = [
  'appointment_date',
  'date',
  'scheduled_date',
  'slot_date',
  'start_date',
  'appointmentDate',
  'starts_at',
  'start_at',
  'scheduled_at',
  'date_time',
  'datetime',
]

const appointmentStartFields = ['start_time', 'startTime', 'starts_at', 'start_at', 'scheduled_start']
const appointmentEndFields = ['end_time', 'endTime', 'ends_at', 'end_at', 'scheduled_end']
const appointmentClientFields = ['client', 'client_name', 'clientName', 'customer', 'customer_name', 'full_name', 'name']
const appointmentServiceFields = ['service', 'service_name', 'serviceName', 'title', 'name']
const appointmentStatusFields = ['status', 'appointment_status', 'appointmentStatus', 'state', 'booking_status']
const paymentStatusFields = ['status', 'payment_status', 'paymentStatus', 'payment_state']
const paymentAmountFields = ['amount', 'total_amount', 'paid_amount', 'amount_paid', 'price', 'fee']
const courseStatusFields = ['status', 'course_status', 'state', 'published', 'is_active', 'is_published', 'active']

function firstValue(row: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    if (row && Object.prototype.hasOwnProperty.call(row, key) && row[key] !== null && row[key] !== undefined && row[key] !== '') {
      return row[key]
    }
  }
  return undefined
}

function toDisplayDate(value: unknown) {
  if (!value) return ''
  const raw = String(value)
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toDisplayTime(value: unknown) {
  if (!value) return ''
  const raw = String(value)
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const parsed = new Date(raw)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
  }
  return raw
}

function normalizeStatus(value: unknown): DashboardAppointment['status'] {
  const s = String(value ?? '').trim().toLowerCase()
  if (!s) return 'Confirmed'
  if (s.includes('cancel')) return 'Cancelled'
  if (s.includes('pending payment') || s.includes('payment pending')) return 'Pending Payment'
  if (s.includes('pending')) return 'Pending'
  if (s.includes('confirmed') || s.includes('scheduled') || s.includes('booked')) return 'Confirmed'
  return 'Confirmed'
}

function normalizePaymentStatus(value: unknown): 'Paid' | 'Pending' {
  const s = String(value ?? '').trim().toLowerCase()
  if (!s) return 'Pending'
  if (s.includes('paid') || s.includes('complete') || s.includes('successful') || s.includes('settled')) return 'Paid'
  return 'Pending'
}

function isSameDay(dateValue: unknown, target: Date) {
  const parsed = new Date(String(dateValue))
  if (Number.isNaN(parsed.getTime())) return false
  return parsed.getFullYear() === target.getFullYear() && parsed.getMonth() === target.getMonth() && parsed.getDate() === target.getDate()
}

function isSameWeek(dateValue: unknown, target: Date) {
  const parsed = new Date(String(dateValue))
  if (Number.isNaN(parsed.getTime())) return false
  const current = new Date(target)
  const startOfWeek = new Date(current)
  const day = startOfWeek.getDay()
  const diff = day === 0 ? -6 : 1 - day
  startOfWeek.setDate(current.getDate() + diff)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return parsed >= startOfWeek && parsed <= endOfWeek
}

function isSameMonth(dateValue: unknown, target: Date) {
  const parsed = new Date(String(dateValue))
  if (Number.isNaN(parsed.getTime())) return false
  return parsed.getFullYear() === target.getFullYear() && parsed.getMonth() === target.getMonth()
}

function sortByDateTime(a: DashboardAppointment, b: DashboardAppointment) {
  const aDate = new Date(`${a.date} ${a.startTime}`)
  const bDate = new Date(`${b.date} ${b.startTime}`)
  if (Number.isNaN(aDate.getTime()) || Number.isNaN(bDate.getTime())) return 0
  return aDate.getTime() - bDate.getTime()
}

async function fetchClientName(clientId: unknown) {
  if (clientId === null || clientId === undefined || clientId === '') return 'Client'
  const supabase = createClient()
  const { data } = await supabase.from('clients').select('id, name, full_name, first_name, last_name').eq('id', String(clientId)).maybeSingle()
  if (!data) return 'Client'
  const candidate = firstValue(data, ['full_name', 'name', 'first_name'])
  if (!candidate) return 'Client'
  if (typeof candidate === 'string') return candidate
  return 'Client'
}

export async function fetchDashboardData() {
  const supabase = createClient()
  const today = new Date()

  const [appointmentsResult, paymentsResult, coursesResult] = await Promise.all([
    supabase.from('appointments').select('*').order('created_at', { ascending: false }),
    supabase.from('payments').select('*').order('created_at', { ascending: false }),
    supabase.from('courses').select('*').order('created_at', { ascending: false }),
  ])

  const appointments = Array.isArray(appointmentsResult.data) ? appointmentsResult.data : []
  const payments = Array.isArray(paymentsResult.data) ? paymentsResult.data : []
  const courses = Array.isArray(coursesResult.data) ? coursesResult.data : []

  const normalizedAppointments: DashboardAppointment[] = await Promise.all(
    appointments.map(async (row) => {
      const rawDate = firstValue(row, appointmentDateFields)
      const clientId = firstValue(row, ['client_id', 'clientId', 'customer_id', 'user_id'])
      const serviceName = String(firstValue(row, appointmentServiceFields) ?? firstValue(row, ['service_title', 'session_type']) ?? 'Service').trim() || 'Service'
      const statusValue = firstValue(row, appointmentStatusFields)
      const paymentStatusValue = firstValue(row, paymentStatusFields) ?? firstValue(row, ['payment_status'])

      let clientName = String(firstValue(row, appointmentClientFields) ?? 'Client').trim() || 'Client'
      if (clientId && clientId !== '') {
        const fetchedClientName = await fetchClientName(clientId)
        if (fetchedClientName && fetchedClientName !== 'Client') {
          clientName = fetchedClientName
        }
      }

      const start = firstValue(row, appointmentStartFields)
      const end = firstValue(row, appointmentEndFields)
      const rawDateValue = rawDate ?? start ?? end

      return {
        id: String(row.id ?? `${clientName}-${serviceName}-${String(rawDateValue ?? '')}`),
        client: clientName,
        service: serviceName,
        date: toDisplayDate(rawDateValue),
        startTime: toDisplayTime(start),
        endTime: toDisplayTime(end),
        status: normalizeStatus(statusValue),
        payment: normalizePaymentStatus(paymentStatusValue),
        avatar: typeof row.avatar === 'string' && row.avatar ? row.avatar : '/practitioner-about.png',
      }
    }),
  )

  const todayAppointments = normalizedAppointments.filter((appointment) => {
    const row = appointments.find((item) => String(item.id) === appointment.id)
    const dateValue = firstValue(row ?? {}, appointmentDateFields) ?? firstValue(row ?? {}, appointmentStartFields)
    return dateValue ? isSameDay(dateValue, today) : false
  }).length

  const thisWeek = normalizedAppointments.filter((appointment) => {
    const row = appointments.find((item) => String(item.id) === appointment.id)
    const dateValue = firstValue(row ?? {}, appointmentDateFields) ?? firstValue(row ?? {}, appointmentStartFields)
    return dateValue ? isSameWeek(dateValue, today) : false
  }).length

  const thisMonth = normalizedAppointments.filter((appointment) => {
    const row = appointments.find((item) => String(item.id) === appointment.id)
    const dateValue = firstValue(row ?? {}, appointmentDateFields) ?? firstValue(row ?? {}, appointmentStartFields)
    return dateValue ? isSameMonth(dateValue, today) : false
  }).length

  const pendingPayments = payments.filter((row) => {
    const statusValue = firstValue(row, paymentStatusFields) ?? firstValue(row, ['status'])
    return String(statusValue ?? '').trim().toLowerCase().includes('pending')
  }).length

  const activeCourses = courses.filter((row) => {
    const statusValue = firstValue(row, courseStatusFields)
    if (statusValue === undefined || statusValue === null || statusValue === '') return true
    const text = String(statusValue).trim().toLowerCase()
    if (text.includes('inactive') || text.includes('archived') || text.includes('cancelled')) return false
    return true
  }).length

  const paidThisMonth = payments.reduce((sum, row) => {
    const statusValue = firstValue(row, paymentStatusFields) ?? firstValue(row, ['status'])
    const amountValue = firstValue(row, paymentAmountFields)
    const dateValue = firstValue(row, appointmentDateFields) ?? firstValue(row, ['paid_at', 'paidAt', 'created_at'])
    const amount = Number(amountValue ?? 0)
    if (!Number.isFinite(amount) || amount <= 0) return sum
    const paymentLooksPaid = String(statusValue ?? '').trim().toLowerCase().includes('paid') || String(statusValue ?? '').trim().toLowerCase().includes('complete')
    const isSameMonthDate = dateValue ? isSameMonth(dateValue, today) : true
    return paymentLooksPaid && isSameMonthDate ? sum + amount : sum
  }, 0)

  const todaySchedule: DashboardAppointment[] = normalizedAppointments
    .filter((appointment) => {
      const row = appointments.find((item) => String(item.id) === appointment.id)
      const dateValue = firstValue(row ?? {}, appointmentDateFields) ?? firstValue(row ?? {}, appointmentStartFields)
      return dateValue ? isSameDay(dateValue, today) : false
    })
    .sort(sortByDateTime)

  const upcomingAppointments: DashboardAppointment[] = normalizedAppointments
    .filter((appointment) => {
      const row = appointments.find((item) => String(item.id) === appointment.id)
      const dateValue = firstValue(row ?? {}, appointmentDateFields) ?? firstValue(row ?? {}, appointmentStartFields)
      return dateValue ? new Date(dateValue).getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() : false
    })
    .sort(sortByDateTime)

  const recentPayments: DashboardPayment[] = payments
    .map((row) => {
      const statusValue = firstValue(row, paymentStatusFields) ?? firstValue(row, ['status'])
      const amountValue = firstValue(row, paymentAmountFields)
      const dateValue = firstValue(row, appointmentDateFields) ?? firstValue(row, ['paid_at', 'paidAt', 'created_at'])
      const clientValue = firstValue(row, appointmentClientFields) ?? firstValue(row, ['client_name', 'customer_name'])
      const serviceValue = firstValue(row, appointmentServiceFields) ?? firstValue(row, ['service_name', 'title'])

      return {
        id: String(row.id ?? `${String(serviceValue ?? 'service')}-${String(clientValue ?? 'client')}`),
        client: String(clientValue ?? 'Client').trim() || 'Client',
        service: String(serviceValue ?? 'Service').trim() || 'Service',
        amount: Number(amountValue ?? 0),
        status: normalizePaymentStatus(statusValue),
        date: toDisplayDate(dateValue),
      }
    })
    .slice(0, 5)

  return {
    stats: {
      todayAppointments,
      thisWeek,
      thisWeekChange: '',
      thisMonth,
      thisMonthChange: '',
      pendingPayments,
      upcomingCourses: activeCourses,
      totalEarnings: paidThisMonth,
      earningsChange: '',
    },
    todaySchedule,
    upcomingAppointments,
    recentPayments,
  }
}
