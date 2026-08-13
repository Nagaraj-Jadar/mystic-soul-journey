export type AppointmentStatus = 'Confirmed' | 'Pending Payment' | 'Pending' | 'Cancelled'
export type PaymentStatus = 'Paid' | 'Pending'

export interface Appointment {
  id: string
  client: string
  service: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  payment: PaymentStatus
  avatar: string
}

export const todaySchedule: Appointment[] = [
  {
    id: 'a1',
    client: 'Priya Sharma',
    service: 'Healing Session',
    date: '18 Jun 2025',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-1.png',
  },
  {
    id: 'a2',
    client: 'Rahul Verma',
    service: 'Akashic Reading',
    date: '18 Jun 2025',
    startTime: '12:00 PM',
    endTime: '01:30 PM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-2.png',
  },
  {
    id: 'a3',
    client: 'Ananya Iyer',
    service: 'Spiritual Guidance',
    date: '18 Jun 2025',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    status: 'Pending Payment',
    payment: 'Pending',
    avatar: '/avatar-3.png',
  },
  {
    id: 'a4',
    client: 'Meera Nair',
    service: 'Energy Healing',
    date: '18 Jun 2025',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-1.png',
  },
]

export const upcomingAppointments: Appointment[] = [
  {
    id: 'u1',
    client: 'Kavya Rao',
    service: 'Energy Healing',
    date: '19 Jun 2025',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-3.png',
  },
  {
    id: 'u2',
    client: 'Sneha Patel',
    service: 'Healing Session',
    date: '20 Jun 2025',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-1.png',
  },
  {
    id: 'u3',
    client: 'Vikram Joshi',
    service: 'Akashic Reading',
    date: '21 Jun 2025',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    status: 'Pending',
    payment: 'Pending',
    avatar: '/avatar-2.png',
  },
  {
    id: 'u4',
    client: 'Neha Kapoor',
    service: 'Spiritual Guidance',
    date: '22 Jun 2025',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    status: 'Confirmed',
    payment: 'Paid',
    avatar: '/avatar-3.png',
  },
]

export const allAppointments: Appointment[] = [...todaySchedule, ...upcomingAppointments]

export interface Payment {
  id: string
  client: string
  service: string
  amount: number
  status: PaymentStatus
  date: string
}

export const recentPayments: Payment[] = [
  { id: 'p1', client: 'Priya Sharma', service: 'Healing Session', amount: 2500, status: 'Paid', date: '18 Jun 2025' },
  { id: 'p2', client: 'Rahul Verma', service: 'Akashic Reading', amount: 3500, status: 'Paid', date: '18 Jun 2025' },
  { id: 'p3', client: 'Ananya Iyer', service: 'Spiritual Guidance', amount: 2500, status: 'Pending', date: '18 Jun 2025' },
  { id: 'p4', client: 'Meera Nair', service: 'Energy Healing', amount: 2500, status: 'Paid', date: '17 Jun 2025' },
  { id: 'p5', client: 'Sneha Patel', service: 'Healing Session', amount: 2500, status: 'Paid', date: '16 Jun 2025' },
]

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  sessions: number
  lastSession: string
  avatar: string
}

export const clients: Client[] = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 97310 55222', sessions: 8, lastSession: '18 Jun 2025', avatar: '/avatar-1.png' },
  { id: 'c2', name: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91 98220 11234', sessions: 4, lastSession: '18 Jun 2025', avatar: '/avatar-2.png' },
  { id: 'c3', name: 'Ananya Iyer', email: 'ananya.iyer@email.com', phone: '+91 90000 55221', sessions: 2, lastSession: '18 Jun 2025', avatar: '/avatar-3.png' },
  { id: 'c4', name: 'Meera Nair', email: 'meera.nair@email.com', phone: '+91 98111 22233', sessions: 6, lastSession: '17 Jun 2025', avatar: '/avatar-1.png' },
  { id: 'c5', name: 'Kavya Rao', email: 'kavya.rao@email.com', phone: '+91 97400 88123', sessions: 3, lastSession: '15 Jun 2025', avatar: '/avatar-3.png' },
  { id: 'c6', name: 'Vikram Joshi', email: 'vikram.joshi@email.com', phone: '+91 99887 66554', sessions: 1, lastSession: '10 Jun 2025', avatar: '/avatar-2.png' },
]

export const dashboardStats = {
  todayAppointments: 3,
  thisWeek: 12,
  thisWeekChange: '20% from last week',
  thisMonth: 32,
  thisMonthChange: '15% from last month',
  pendingPayments: 2,
  upcomingCourses: 3,
  totalEarnings: 78450,
  earningsChange: '18% from last month',
}

// Earnings chart series (June)
export const earningsSeries = [
  { label: '1 Jun', value: 12000 },
  { label: '5 Jun', value: 18000 },
  { label: '8 Jun', value: 26000 },
  { label: '12 Jun', value: 34000 },
  { label: '15 Jun', value: 41000 },
  { label: '18 Jun', value: 52000 },
  { label: '22 Jun', value: 61000 },
  { label: '25 Jun', value: 70000 },
  { label: '29 Jun', value: 84000 },
]

export interface DaySchedule {
  day: string
  available: boolean
  slots: string[]
}

export const weeklyAvailability: DaySchedule[] = [
  { day: 'Monday', available: true, slots: ['10:00 AM – 1:00 PM', '4:00 PM – 7:00 PM'] },
  { day: 'Tuesday', available: true, slots: ['10:00 AM – 2:00 PM'] },
  { day: 'Wednesday', available: false, slots: [] },
  { day: 'Thursday', available: true, slots: ['11:00 AM – 2:00 PM', '4:00 PM – 6:00 PM'] },
  { day: 'Friday', available: true, slots: ['10:00 AM – 1:00 PM'] },
  { day: 'Saturday', available: true, slots: ['10:00 AM – 12:00 PM'] },
  { day: 'Sunday', available: false, slots: [] },
]

export interface AdminDocument {
  id: string
  name: string
  type: 'PDF' | 'JPG' | 'PNG' | 'WEBP'
  related: string
  date: string
  status: 'Published' | 'Draft'
}

export const adminDocuments: AdminDocument[] = [
  { id: 'd1', name: 'Inner Healing Program — Details.pdf', type: 'PDF', related: 'Inner Healing Program', date: '02 Jun 2025', status: 'Published' },
  { id: 'd2', name: 'Akashic Foundations — Syllabus.pdf', type: 'PDF', related: 'Akashic Reading Foundations', date: '28 May 2025', status: 'Published' },
  { id: 'd3', name: 'Healing Session — Preparation Guide.pdf', type: 'PDF', related: 'Healing Sessions', date: '20 May 2025', status: 'Draft' },
  { id: 'd4', name: 'Workshop Poster.png', type: 'PNG', related: 'Spiritual Awakening Workshop', date: '15 May 2025', status: 'Published' },
]
