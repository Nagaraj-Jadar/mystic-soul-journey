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
    title: 'What is Akashic Reading? Everything You Need to Know',
    category: 'Akashic Reading',
    duration: '12:45',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v2',
    title: 'How to Heal Emotional Wounds & Find Inner Peace',
    category: 'Healing',
    duration: '15:10',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v3',
    title: "Signs You're On Your Soul Path",
    category: 'Spirituality',
    duration: '10:30',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v4',
    title: 'Q&A with Soumyaa — Healing, Spirituality & Life',
    category: 'Conversations',
    duration: '18:22',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v5',
    title: 'Morning Rituals to Raise Your Vibration',
    category: 'Healing',
    duration: '08:54',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v6',
    title: 'The Soul Journey Podcast — Ep 01: Trusting the Process',
    category: 'Podcasts',
    duration: '42:16',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v7',
    title: 'Understanding Energy & Protection',
    category: 'Spirituality',
    duration: '14:07',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'v8',
    title: 'A Conversation on Purpose & Alignment',
    category: 'Conversations',
    duration: '21:39',
    thumbnail: '/video-thumb.png',
    youtubeUrl: 'https://youtube.com',
  },
]
