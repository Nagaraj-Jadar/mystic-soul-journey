export interface CourseModule {
  title: string
  description: string
}

export interface Course {
  id: string
  slug: string
  name: string
  shortDescription: string
  intro: string
  image: string
  startDate: string // display
  dateBadge: { day: string; month: string }
  durationLabel: string
  mode: 'Online' | 'In Person' | 'Hybrid'
  price: number
  seats: number
  status: 'Published' | 'Draft'
  learn: string[]
  modules: CourseModule[]
  forWhom: string[]
  included: string[]
  faq: { q: string; a: string }[]
}

export const courses: Course[] = [
  {
    id: 'course-inner-healing',
    slug: 'inner-healing-program',
    name: 'Inner Healing Program',
    shortDescription: 'Heal your emotions and reconnect with yourself.',
    intro:
      'A guided journey to gently release emotional wounds, reconnect with your inner self and cultivate lasting peace and self-compassion.',
    image: '/course-inner-healing.png',
    startDate: '25 June 2025',
    dateBadge: { day: '25', month: 'JUN' },
    durationLabel: '4 Weeks · Weekly Live Sessions',
    mode: 'Online',
    price: 12500,
    seats: 20,
    status: 'Published',
    learn: [
      'Identify and release stored emotional patterns',
      'Simple daily practices for emotional balance',
      'Reconnect with your inner self and intuition',
      'Build lasting habits of self-compassion',
    ],
    modules: [
      { title: 'Week 1 · Meeting Yourself', description: 'Grounding, awareness and creating a safe inner space.' },
      { title: 'Week 2 · Releasing the Past', description: 'Gentle release of stored emotions and old patterns.' },
      { title: 'Week 3 · Restoring Balance', description: 'Energy practices to restore calm and balance.' },
      { title: 'Week 4 · Living Aligned', description: 'Integrating your healing into everyday life.' },
    ],
    forWhom: [
      'Anyone feeling emotionally stuck or overwhelmed',
      'Those beginning their healing journey',
      'People seeking more peace and self-connection',
    ],
    included: [
      '4 live guided sessions',
      'Recorded replays of every session',
      'Guided meditations & workbook (PDF)',
      'Private community support',
    ],
    faq: [
      { q: 'Do I need prior experience?', a: 'Not at all. This program is gentle and beginner friendly.' },
      { q: 'Will sessions be recorded?', a: 'Yes, every live session is recorded and shared with you.' },
    ],
  },
  {
    id: 'course-akashic-foundations',
    slug: 'akashic-reading-foundations',
    name: 'Akashic Reading Foundations',
    shortDescription: 'Learn to access the Akashic Records with clarity and confidence.',
    intro:
      'A foundational course to open, read and work with the Akashic Records for yourself and others, with clarity and confidence.',
    image: '/course-akashic.png',
    startDate: '10 August 2025',
    dateBadge: { day: '10', month: 'AUG' },
    durationLabel: '6 Weeks · Weekly Live Sessions',
    mode: 'Online',
    price: 18500,
    seats: 15,
    status: 'Published',
    learn: [
      'Understand what the Akashic Records are',
      'A sacred prayer and protocol to open the Records',
      'Read your own records with clarity',
      'Ethics and best practices for reading others',
    ],
    modules: [
      { title: 'Module 1 · Foundations', description: 'What the Records are and how they work.' },
      { title: 'Module 2 · Opening the Records', description: 'The sacred prayer and energetic protection.' },
      { title: 'Module 3 · Reading for Yourself', description: 'Practising accurate self-readings.' },
      { title: 'Module 4 · Reading for Others', description: 'Ethics, boundaries and practice sessions.' },
    ],
    forWhom: [
      'Aspiring intuitive readers and healers',
      'Anyone drawn to the Akashic Records',
      'Practitioners wanting to add a new modality',
    ],
    included: [
      '6 live teaching sessions',
      'Recorded replays & practice prompts',
      'Certificate of completion',
      'Practice partner matching',
    ],
    faq: [
      { q: 'Is this beginner friendly?', a: 'Yes — we start from the very foundations.' },
      { q: 'Do I receive a certificate?', a: 'Yes, a certificate of completion is included.' },
    ],
  },
  {
    id: 'course-spiritual-awakening',
    slug: 'spiritual-awakening-workshop',
    name: 'Spiritual Awakening Workshop',
    shortDescription: 'Awaken your higher self and live a more conscious, fulfilling life.',
    intro:
      'An immersive weekend workshop to awaken your higher self, expand your awareness and step into a more conscious and fulfilling life.',
    image: '/course-awakening.png',
    startDate: '05 September 2025',
    dateBadge: { day: '05', month: 'SEP' },
    durationLabel: '2 Days · Live Immersive',
    mode: 'Hybrid',
    price: 9500,
    seats: 25,
    status: 'Published',
    learn: [
      'Understand the stages of spiritual awakening',
      'Practices to raise your vibration',
      'Connect with your higher guidance',
      'Live from alignment and presence',
    ],
    modules: [
      { title: 'Day 1 · Awakening', description: 'Understanding awakening and clearing resistance.' },
      { title: 'Day 2 · Embodiment', description: 'Integrating awareness into daily living.' },
    ],
    forWhom: [
      'Anyone feeling a call for something deeper',
      'Those navigating a spiritual awakening',
      'Seekers wanting community and guidance',
    ],
    included: [
      '2 full days of live teaching',
      'Guided meditations & workbook',
      'Community circle & sharing',
      'Lifetime access to replays',
    ],
    faq: [
      { q: 'Can I attend online?', a: 'Yes, this workshop is offered in a hybrid format.' },
      { q: 'What should I bring?', a: 'An open heart, a journal and a comfortable space.' },
    ],
  },
]

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug)
}
