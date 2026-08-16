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
    id: 'course-akashic-records-reading',
    slug: 'akashic-records-reading',
    name: 'Akashic Records Reading',
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
    id: 'course-tarot-reading',
    slug: 'tarot-reading-course',
    name: 'Tarot Reading',
    shortDescription: 'Learn to read tarot with confidence, intuition and care.',
    intro:
      'A guided course to learn the language of the tarot and develop an intuitive, grounded reading practice for yourself and others.',
    image: '/service-tarot-reading.jpg',
    startDate: '15 September 2025',
    dateBadge: { day: '15', month: 'SEP' },
    durationLabel: '5 Weeks · Weekly Live Sessions',
    mode: 'Online',
    price: 15500,
    seats: 20,
    status: 'Published',
    learn: [
      'Understand the meaning of each card',
      'Simple, intuitive spreads for everyday questions',
      'How to read for yourself with clarity',
      'Ethics and care when reading for others',
    ],
    modules: [
      { title: 'Week 1 · The Language of Tarot', description: 'Getting familiar with the deck and its structure.' },
      { title: 'Week 2 · Major Arcana', description: 'Understanding the core life themes and archetypes.' },
      { title: 'Week 3 · Minor Arcana', description: 'Everyday situations, emotions and outcomes.' },
      { title: 'Week 4 · Spreads & Practice', description: 'Reading with simple, practical spreads.' },
      { title: 'Week 5 · Reading for Others', description: 'Ethics, boundaries and confident delivery.' },
    ],
    forWhom: [
      'Anyone curious about learning tarot',
      'Aspiring intuitive readers',
      'Practitioners wanting to add a new modality',
    ],
    included: [
      '5 live teaching sessions',
      'Recorded replays & practice prompts',
      'Certificate of completion',
      'Ongoing community support',
    ],
    faq: [
      { q: 'Do I need my own deck?', a: 'Yes, a recommended beginner-friendly deck will be shared before we begin.' },
      { q: 'Is this beginner friendly?', a: 'Yes — no prior experience is required.' },
    ],
  },
  {
    id: 'course-vedic-numerology',
    slug: 'vedic-numerology-course',
    name: 'Vedic Numerology',
    shortDescription: 'Understand the foundations of Vedic numerology and your own numbers.',
    intro:
      'An introductory course to the principles of Vedic numerology, helping you understand your core numbers and how to apply them thoughtfully.',
    image: '/course-awakening.png',
    startDate: '20 October 2025',
    dateBadge: { day: '20', month: 'OCT' },
    durationLabel: '4 Weeks · Weekly Live Sessions',
    mode: 'Online',
    price: 14500,
    seats: 20,
    status: 'Published',
    learn: [
      'The foundations of Vedic numerology',
      'How to calculate and understand your core numbers',
      'Applying numerology to daily life and timing',
      'Introductory principles for reading for others',
    ],
    modules: [
      { title: 'Week 1 · Foundations', description: 'The principles and history of Vedic numerology.' },
      { title: 'Week 2 · Your Core Numbers', description: 'Calculating and understanding your key numbers.' },
      { title: 'Week 3 · Patterns & Timing', description: 'Applying numerology to decisions and timing.' },
      { title: 'Week 4 · Practice & Application', description: 'Bringing numerology into everyday reflection.' },
    ],
    forWhom: [
      'Anyone curious about numerology',
      'Those wanting to understand their own patterns',
      'Practitioners wanting to add a new modality',
    ],
    included: [
      '4 live teaching sessions',
      'Recorded replays & workbook',
      'Certificate of completion',
      'Ongoing community support',
    ],
    faq: [
      { q: 'Do I need any prior knowledge?', a: 'Not at all. This course starts from the very basics.' },
      { q: 'Will sessions be recorded?', a: 'Yes, every live session is recorded and shared with you.' },
    ],
  },
  {
    id: 'course-lama-fera-level-1',
    slug: 'lama-fera-level-1',
    name: 'Lama Fera Level 1',
    shortDescription: 'Learn the foundations of this traditional energy healing technique.',
    intro:
      'A foundational training in Lama Fera healing, a traditional energy technique for clearing stagnant energy and supporting balance in yourself and others.',
    image: '/service-energy-work.jpg',
    startDate: '05 November 2025',
    dateBadge: { day: '05', month: 'NOV' },
    durationLabel: '2 Days · Live Immersive',
    mode: 'Hybrid',
    price: 16500,
    seats: 15,
    status: 'Published',
    learn: [
      'The foundations and history of Lama Fera healing',
      'Techniques to clear and balance energy',
      'A simple, repeatable healing protocol',
      'How to hold safe, grounded healing space',
    ],
    modules: [
      { title: 'Day 1 · Foundations', description: 'Understanding the technique and its origins.' },
      { title: 'Day 2 · Practice & Application', description: 'Guided practice and integration.' },
    ],
    forWhom: [
      'Anyone drawn to energy healing work',
      'Practitioners wanting to add a new modality',
      'Those on their own healing journey',
    ],
    included: [
      '2 full days of live teaching',
      'Guided practice sessions',
      'Certificate of completion',
      'Lifetime access to replays',
    ],
    faq: [
      { q: 'Do I need prior healing experience?', a: 'No prior experience is required for Level 1.' },
      { q: 'Can I attend online?', a: 'Yes, this training is offered in a hybrid format.' },
    ],
  },
]

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug)
}
