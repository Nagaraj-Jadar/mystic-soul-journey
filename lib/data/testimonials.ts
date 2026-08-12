export interface Testimonial {
  id: string
  name: string
  service: string
  message: string
  time: string
  avatar: string
  featured: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya S.',
    service: 'Healing Session',
    message:
      'Thank you so much ma’am. Your healing session brought me so much clarity and peace. I feel lighter and calmer now. Truly grateful!',
    time: '10:32 AM',
    avatar: '/avatar-1.png',
    featured: true,
  },
  {
    id: 't2',
    name: 'Neha K.',
    service: 'Akashic Reading',
    message:
      'Ma’am, after the session I feel so positive and full of energy. So many answers came during the reading. Thank you from the bottom of my heart!',
    time: '4:45 PM',
    avatar: '/avatar-3.png',
    featured: true,
  },
  {
    id: 't3',
    name: 'Rahul M.',
    service: 'Akashic Reading',
    message:
      'The Akashic reading was so powerful! I got clarity on things I was confused about for years. Thank you for your guidance.',
    time: '6:20 PM',
    avatar: '/avatar-2.png',
    featured: true,
  },
  {
    id: 't4',
    name: 'Ananya P.',
    service: 'Spiritual Guidance',
    message:
      'Your guidance is a blessing ma’am. I feel more confident and aligned with my purpose now. Grateful for your support always.',
    time: '9:11 AM',
    avatar: '/avatar-1.png',
    featured: true,
  },
  {
    id: 't5',
    name: 'Kavya R.',
    service: 'Workshop',
    message:
      'I attended your workshop and it completely shifted my perspective towards life. Such deep learnings. Thank you!',
    time: '8:35 PM',
    avatar: '/avatar-3.png',
    featured: true,
  },
  {
    id: 't6',
    name: 'Sneha P.',
    service: 'Inner Healing Program',
    message:
      'The Inner Healing Program helped me release so much that I had been carrying. I feel like a new person. Highly recommend.',
    time: '2:15 PM',
    avatar: '/avatar-1.png',
    featured: false,
  },
  {
    id: 't7',
    name: 'Vikram J.',
    service: 'Energy Work',
    message:
      'After the energy work session I slept better than I have in months. Something really shifted. Thank you so much.',
    time: '11:02 AM',
    avatar: '/avatar-2.png',
    featured: false,
  },
  {
    id: 't8',
    name: 'Meera N.',
    service: 'Spiritual Guidance',
    message:
      'Every conversation feels so safe and healing. I always leave feeling seen, supported and more at peace with myself.',
    time: '5:48 PM',
    avatar: '/avatar-3.png',
    featured: false,
  },
]

export const featuredTestimonials = testimonials.filter((t) => t.featured)
