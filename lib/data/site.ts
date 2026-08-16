export const site = {
  name: 'Mystic Soul Journey',
  tagline: 'Heal · Awaken · Transform',
  whatsappNumber: '+91 99725 02946',
  whatsappUrl: 'https://wa.me/919972502946',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  email: 'hello@mysticsouljourney.com',
  practitioner: {
    firstName: 'Soumyaa',
    fullName: 'Soumyaa Sharma',
    role: 'Spiritual Guide & Healer',
  },
}

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Courses', href: '/courses' },
  { label: 'Client Experiences', href: '/client-experiences' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
]

export function whatsappLink(message?: string) {
  const base = site.whatsappUrl
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
