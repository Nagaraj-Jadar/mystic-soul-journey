export type ServiceIcon =
  | 'lotus'
  | 'book'
  | 'sun'
  | 'target'
  | 'users'

export interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  durationMinutes: number
  price: number
  icon: ServiceIcon
  bookable: boolean
}

export const services: Service[] = [
  {
    id: 'svc-healing',
    slug: 'healing-sessions',
    name: 'Healing Sessions',
    shortDescription:
      'Release blocks, restore balance and experience deep healing.',
    description:
      'A gentle, personalised healing session to release emotional blocks, restore energetic balance and reconnect you with a sense of calm and wholeness.',
    durationMinutes: 60,
    price: 2500,
    icon: 'lotus',
    bookable: true,
  },
  {
    id: 'svc-akashic',
    slug: 'akashic-reading',
    name: 'Akashic Reading',
    shortDescription:
      "Access your soul's records and gain clarity on your life path.",
    description:
      'Open the Akashic Records to gain profound clarity on your soul journey, relationships, recurring patterns and life purpose.',
    durationMinutes: 90,
    price: 3500,
    icon: 'book',
    bookable: true,
  },
  {
    id: 'svc-guidance',
    slug: 'spiritual-guidance',
    name: 'Spiritual Guidance',
    shortDescription: 'Personalised guidance to align with your soul purpose.',
    description:
      'Compassionate one-on-one guidance to help you navigate life transitions, make aligned decisions and step into your highest self.',
    durationMinutes: 60,
    price: 2500,
    icon: 'sun',
    bookable: true,
  },
  {
    id: 'svc-energy',
    slug: 'energy-work',
    name: 'Energy Work',
    shortDescription: 'Clear energy, raise your vibration and awaken your light.',
    description:
      'Deep energy clearing and balancing to release heaviness, raise your vibration and awaken your inner light.',
    durationMinutes: 60,
    price: 2500,
    icon: 'target',
    bookable: true,
  },
  {
    id: 'svc-workshops',
    slug: 'workshops-courses',
    name: 'Workshops & Courses',
    shortDescription: 'Transformative learning experiences for growth and healing.',
    description:
      'Immersive group workshops and courses designed to deepen your practice, expand your awareness and support lasting transformation.',
    durationMinutes: 0,
    price: 0,
    icon: 'users',
    bookable: false,
  },
]

export const bookableServices = services.filter((s) => s.bookable)

export function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`
}
