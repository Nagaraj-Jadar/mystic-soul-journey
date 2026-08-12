import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { ServicesSection } from '@/components/home/services-section'
import { CoursesSection } from '@/components/home/courses-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { MediaSection } from '@/components/home/media-section'
import { FinalCTA } from '@/components/home/final-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesSection />
      <CoursesSection />
      <TestimonialsSection />
      <MediaSection />
      <FinalCTA />
    </>
  )
}
