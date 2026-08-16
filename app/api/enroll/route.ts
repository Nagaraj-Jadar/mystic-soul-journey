import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient as createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const { course_id, name, phone, email, message } = body

  if (!course_id || !name || !phone) {
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

  // Validate course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, status')
    .eq('id', course_id)
    .maybeSingle()

  if (courseErr || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  if (course.status !== 'published') return NextResponse.json({ error: 'Course is not available' }, { status: 400 })

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
    const { data: insertClient, error: clientErr } = await supabase
      .from('clients')
      .insert([
        {
          full_name: String(name).trim(),
          email: emailClean || null,
          phone: phoneClean || null,
          notes: message || null,
          source: 'website',
        },
      ])
      .select('id')
      .maybeSingle()

    if (clientErr) return NextResponse.json({ error: 'Unable to create client' }, { status: 500 })
    clientId = insertClient?.id ?? null
  }

  if (!clientId) return NextResponse.json({ error: 'Unable to determine client' }, { status: 500 })

  // Prevent duplicate pending/active enrollment for the same client + course
  const { data: existing, error: existErr } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', course_id)
    .eq('client_id', clientId)
    .neq('status', 'cancelled')

  if (existErr) return NextResponse.json({ error: 'Unable to check existing enrollments' }, { status: 500 })
  if ((existing ?? []).length > 0) {
    return NextResponse.json({ error: 'You already have an active enrollment for this course.' }, { status: 409 })
  }

  const { data: enrollment, error: insertErr } = await supabase
    .from('course_enrollments')
    .insert([{ course_id, client_id: clientId, status: 'pending' }])
    .select()
    .maybeSingle()

  if (insertErr) return NextResponse.json({ error: 'Unable to create enrollment' }, { status: 500 })

  return NextResponse.json({ enrollment, course })
}
