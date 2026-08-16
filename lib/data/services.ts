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
  image: string
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
    image: '/course-inner-healing.png',
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
    image: '/course-akashic.png',
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
    image: '/course-awakening.png',
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
    image: '/service-energy-work.jpg',
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
    image: '/service-workshops.jpg',
    bookable: false,
  },
]

export const bookableServices = services.filter((s) => s.bookable)

export function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`
}

// The actual public-facing offerings, organised by category for the Services page.
// Slugs marked bookable correspond to existing active records in the Supabase
// `services` table; the rest are enquiry-only until they are configured there.
export interface PublicServiceOffering {
  id: string
  slug: string
  name: string
  description: string
  benefits: string[]
  image: string
  bookable: boolean
}

export const serviceCategories: { title: string; items: PublicServiceOffering[] }[] = [
  {
    title: 'Akashic & Spiritual Readings',
    items: [
      {
        id: 'off-akashic-record-readings',
        slug: 'akashic-reading',
        name: 'Akashic Record Readings',
        description:
          'An intuitive session designed to explore patterns, questions and themes that may be shaping your current life journey.',
        benefits: [
          'Gain clarity around recurring patterns',
          'Explore deeper personal questions',
          'Reflect on relationships and life direction',
          'Connect with your inner wisdom',
        ],
        image: '/course-akashic.png',
        bookable: true,
      },
      {
        id: 'off-tarot-reading',
        slug: 'tarot-reading',
        name: 'Tarot Reading',
        description:
          'A reflective card reading that offers gentle insight into your current path, choices and the energies around you.',
        benefits: [
          'Gain perspective on present situations',
          'Explore possible paths forward',
          'Receive intuitive guidance',
          'A calm space for self-reflection',
        ],
        image: '/service-tarot-reading.jpg',
        bookable: false,
      },
      {
        id: 'off-vedic-numerology',
        slug: 'vedic-numerology',
        name: 'Vedic Numerology',
        description:
          'A consultation rooted in Vedic numerology to reflect on your numbers, tendencies and life patterns.',
        benefits: [
          'Understand your core numbers',
          'Reflect on natural strengths and tendencies',
          'Explore favourable timing for decisions',
          'Gain a fresh perspective on your path',
        ],
        image: '/course-awakening.png',
        bookable: false,
      },
    ],
  },
  {
    title: 'Energy & Healing',
    items: [
      {
        id: 'off-akashic-healings',
        slug: 'healing-sessions',
        name: 'Akashic Healings',
        description:
          'A gentle energetic healing session to release stored emotional blocks and restore a sense of balance and calm.',
        benefits: [
          'Release stored emotional patterns',
          'Restore energetic balance',
          'Deep relaxation and calm',
          'Reconnect with your inner self',
        ],
        image: '/course-inner-healing.png',
        bookable: true,
      },
      {
        id: 'off-lama-fera-healing',
        slug: 'energy-work',
        name: 'Lama Fera Healing',
        description:
          'A traditional energy healing technique used to clear stagnant energy and support a renewed sense of lightness.',
        benefits: [
          'Clear heavy or stuck energy',
          'Support inner balance',
          'Encourage deep relaxation',
          'Feel refreshed and renewed',
        ],
        image: '/service-energy-work.jpg',
        bookable: true,
      },
      {
        id: 'off-bandan-moksha-kriya-healing',
        slug: 'bandan-moksha-kriya-healing',
        name: 'Bandan Moksha Kriya Healing',
        description:
          'A guided energetic release practice designed to help you gently let go of what no longer serves you.',
        benefits: [
          'Release long-held tension',
          'Support emotional cleansing',
          'Create space for renewal',
          'A calming, guided practice',
        ],
        image: '/service-bandan-moksha.jpg',
        bookable: false,
      },
      {
        id: 'off-karmic-healing',
        slug: 'spiritual-guidance',
        name: 'Karmic Healing',
        description:
          'A reflective healing session to explore karmic patterns and support you in moving forward with greater ease.',
        benefits: [
          'Navigate life transitions',
          'Explore recurring life patterns',
          'Make aligned decisions',
          'Reconnect with your purpose',
        ],
        image: '/service-karmic-healing.jpg',
        bookable: true,
      },
      {
        id: 'off-ancestral-healing',
        slug: 'ancestral-healing',
        name: 'Ancestral Healing',
        description:
          'A gentle practice to explore inherited patterns and support a greater sense of connection and peace with your lineage.',
        benefits: [
          'Explore inherited patterns',
          'Support a sense of closure',
          'Reconnect with your roots',
          'Cultivate inner peace',
        ],
        image: '/service-ancestral-healing.jpg',
        bookable: false,
      },
    ],
  },
  {
    title: 'Life & Personal Healing',
    items: [
      {
        id: 'off-money-blockage-healing',
        slug: 'money-blockage-healing',
        name: 'Money Blockage Healing',
        description:
          'A mindful session to explore limiting beliefs around money and support a calmer, more open relationship with abundance.',
        benefits: [
          'Explore limiting money beliefs',
          'Cultivate a calmer money mindset',
          'Support openness to opportunity',
          'Encourage mindful decision-making',
        ],
        image: '/service-money-blockage.jpg',
        bookable: false,
      },
      {
        id: 'off-relationship-healing',
        slug: 'relationship-healing',
        name: 'Relationship Healing',
        description:
          'A supportive session to explore relationship patterns and encourage healthier, more peaceful connections.',
        benefits: [
          'Explore relationship patterns',
          'Encourage open, honest communication',
          'Support emotional healing',
          'Cultivate healthier connections',
        ],
        image: '/service-relationship-healing.jpg',
        bookable: false,
      },
    ],
  },
  {
    title: 'Wellness Rituals',
    items: [
      {
        id: 'off-intention-bath-salts',
        slug: 'intention-bath-salts',
        name: 'Intention Bath Salts',
        description:
          'A hand-blended ritual bath salt infused with intention, designed to support relaxation and gentle energetic cleansing at home.',
        benefits: [
          'Supports relaxation',
          'Encourages a mindful ritual',
          'Gentle energetic cleansing',
          'A calming addition to your self-care routine',
        ],
        image: '/service-bath-salts.jpg',
        bookable: false,
      },
    ],
  },
]
