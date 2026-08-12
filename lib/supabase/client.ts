import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}

export type AdminUser = {
  id: string
  email?: string | null
  fullName?: string | null
}

export async function getAdminDisplayUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return { id: '', email: null, fullName: null }
  }

  const fullName =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    (data.user.email?.includes('@') ? data.user.email.split('@')[0] : null) ||
    'Soumyaa'

  return {
    id: data.user.id,
    email: data.user.email,
    fullName,
  }
}