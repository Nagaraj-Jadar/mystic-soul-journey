import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient as createSupabaseServerClient } from '@/lib/supabase/server'

function parseTimeSlot(slot: string) {
  // expect formats like '10:00 AM' or '01:00 PM' -> return 'HH:MM' 24h
  const m = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return null
  let hh = Number(m[1])
  const mm = m[2]
  const ampm = m[3].toUpperCase()
  if (ampm === 'PM' && hh < 12) hh += 12
  if (ampm === 'AM' && hh === 12) hh = 0
  return `${String(hh).padStart(2, '0')}:${mm}`
}

function addMinutesToTime(time: string, minutes: number) {
  const [hh, mm] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(hh)
  d.setMinutes(mm + minutes)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const {
    service_id,
    appointment_date,
    time_slot,
    name,
    phone,
    email,
    city,
    country,
    notes,
  } = body

  if (!service_id || !appointment_date || !time_slot || !name || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY

  let supabase: any
  if (SERVICE_ROLE) {
    supabase = createSupabaseClient(SUPABASE_URL, SERVICE_ROLE)
  } else {
    // fallback to server client (publishable key) - may be limited by RLS
    supabase = await createSupabaseServerClient()
  }

  // Validate service
  const { data: svc, error: svcErr } = await supabase
    .from('services')
    .select('id, price, duration_minutes, is_active')
    .eq('id', service_id)
    .maybeSingle()

  if (svcErr || !svc) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  if (!svc.is_active) return NextResponse.json({ error: 'Service is not available' }, { status: 400 })

  const start_time = parseTimeSlot(time_slot)
  if (!start_time) return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
  const end_time = addMinutesToTime(start_time, Number(svc.duration_minutes ?? 60))

  // Validate date and availability
  const dateObj = new Date(appointment_date + 'T00:00:00')
  if (isNaN(dateObj.getTime())) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  const day_of_week = dateObj.getDay()

  const { data: availData, error: availErr } = await supabase
    .from('availability')
    .select('day_of_week, start_time, end_time, is_available')
    .eq('day_of_week', day_of_week)
    .maybeSingle()

  if (availErr) return NextResponse.json({ error: 'Unable to check availability' }, { status: 500 })
  if (!availData || availData.is_available === false) return NextResponse.json({ error: 'Selected day is unavailable' }, { status: 400 })

  // ensure slot within availability window
  const availStart = (availData.start_time ?? '00:00').slice(0, 5)
  const availEnd = (availData.end_time ?? '23:59').slice(0, 5)
  if (!(start_time >= availStart && end_time <= availEnd)) {
    return NextResponse.json({ error: 'Selected time is outside available hours' }, { status: 400 })
  }

  // Prevent double booking: check existing appointment at same date/time
  const { data: existing, error: existErr } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_date', appointment_date)
    .eq('start_time', start_time)

  if (existErr) return NextResponse.json({ error: 'Unable to check existing appointments' }, { status: 500 })
  if ((existing ?? []).length > 0) return NextResponse.json({ error: 'Selected slot is already booked' }, { status: 409 })

  // Find or create client
  let clientId: string | null = null
  const phoneClean = String(phone).trim()
  const emailClean = email ? String(email).trim() : null

  const phoneQuery = await supabase.from('clients').select('id').eq('phone', phoneClean).maybeSingle()
  if (phoneQuery && phoneQuery.data && phoneQuery.data.id) clientId = phoneQuery.data.id

  if (!clientId && emailClean) {
    const emailQuery = await supabase.from('clients').select('id').eq('email', emailClean).maybeSingle()
    if (emailQuery && emailQuery.data && emailQuery.data.id) clientId = emailQuery.data.id
  }

  if (!clientId) {
    const { data: insertClient, error: clientErr } = await supabase.from('clients').insert([
      {
        full_name: name.trim(),
        email: emailClean || null,
        phone: phoneClean || null,
        city: city || null,
        country: country || null,
        notes: notes || null,
        source: 'website',
      },
    ]).select('id').maybeSingle()

    if (clientErr) return NextResponse.json({ error: 'Unable to create client' }, { status: 500 })
    clientId = insertClient?.id ?? null
  }

  if (!clientId) return NextResponse.json({ error: 'Unable to determine client' }, { status: 500 })

  // Create appointment
  const appointmentPayload = {
    client_id: clientId,
    service_id: svc.id,
    appointment_date,
    start_time,
    end_time,
    status: 'pending',
    payment_status: 'pending',
    notes: notes || null,
  }

  const { data: inserted, error: insertErr } = await supabase.from('appointments').insert([appointmentPayload]).select().maybeSingle()
  if (insertErr) return NextResponse.json({ error: 'Unable to create appointment' }, { status: 500 })

  return NextResponse.json({ appointment: inserted })
}
