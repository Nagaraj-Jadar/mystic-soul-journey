export interface Testimonial {
  id: string
  client_name: string | null
  content: string | null
  image_url: string | null
  is_published: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
