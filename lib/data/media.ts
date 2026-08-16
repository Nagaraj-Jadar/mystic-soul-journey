export type MediaCategory =
  | 'Healing'
  | 'Spirituality'
  | 'Akashic Reading'
  | 'Podcasts'
  | 'Conversations'

export interface MediaVideo {
  id: string
  title: string
  category: MediaCategory
  duration: string
  thumbnail: string
  youtubeUrl: string
  videoId: string
  featured: boolean
}

export const mediaCategories: ('All' | MediaCategory)[] = [
  'All',
  'Healing',
  'Spirituality',
  'Akashic Reading',
  'Podcasts',
  'Conversations',
]

export const mediaVideos: MediaVideo[] = [
  {
    id: 'v1',
    title: 'Featured Video - Wisdom & Insights',
    category: 'Spirituality',
    duration: '',
    thumbnail: 'https://img.youtube.com/vi/9E7hYNaKkpY/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=9E7hYNaKkpY',
    videoId: '9E7hYNaKkpY',
    featured: true,
  },
  {
    id: 'v2',
    title: 'Healing & Spiritual Growth',
    category: 'Healing',
    duration: '',
    thumbnail: 'https://img.youtube.com/vi/qSJXjBtwW7o/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=qSJXjBtwW7o',
    videoId: 'qSJXjBtwW7o',
    featured: false,
  },
  {
    id: 'v3',
    title: 'Spiritual Journey Insights',
    category: 'Spirituality',
    duration: '',
    thumbnail: 'https://img.youtube.com/vi/LLuBeJsaF2Y/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=LLuBeJsaF2Y',
    videoId: 'LLuBeJsaF2Y',
    featured: false,
  },
  {
    id: 'v4',
    title: 'Conversations on Healing',
    category: 'Conversations',
    duration: '',
    thumbnail: 'https://img.youtube.com/vi/EIVFV80Lmxo/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=EIVFV80Lmxo',
    videoId: 'EIVFV80Lmxo',
    featured: false,
  },
  {
    id: 'v5',
    title: 'Meditation & Inner Peace',
    category: 'Healing',
    duration: '',
    thumbnail: 'https://img.youtube.com/vi/Hpy55_kJpi4/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=Hpy55_kJpi4',
    videoId: 'Hpy55_kJpi4',
    featured: false,
  },
]