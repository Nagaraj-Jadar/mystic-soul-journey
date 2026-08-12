import Image from 'next/image'
import Link from 'next/link'
import { Heart, Leaf, Sparkles, Sun } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { BotanicalSprig } from '@/components/brand/botanical'

const pillars = [
  {
    icon: Sun,
    title: 'My Mission',
    text: 'To help you heal, awaken and transform through guided sessions, courses and inner work.',
  },
  {
    icon: Leaf,
    title: 'My Approach',
    text: 'Compassionate, intuitive and grounded guidance for deep and lasting transformation.',
  },
  {
    icon: Sparkles,
    title: 'My Purpose',
    text: 'To empower you to remember your inner power and live a life that feels aligned.',
  },
]

export function Intro() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf8f2]">
      {/* The next paper sheet begins with a quiet hand-cut sweep rather than a hard section break. */}
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1440 690" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 690V75C155 78 308 74 456 65 623 55 759 45 887 34 1073 18 1243 11 1440 18V690H0Z" fill="#f5f0e7" />
      </svg>
      <div className="pointer-events-none absolute left-[10%] top-[1.5rem] z-[1] h-40 w-52 opacity-35" aria-hidden="true">
        <Image src="/watercolor-wash.png" alt="" fill className="object-contain" sizes="208px" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-6 pb-16 pt-24 sm:px-10 sm:pt-28 lg:grid lg:grid-cols-[18rem_1fr] lg:gap-20 lg:px-12 lg:pb-20 lg:pt-28 xl:px-0">
        <Reveal className="relative mx-auto w-fit self-center lg:mx-0">
          <div className="relative h-56 w-56 rounded-full border border-[#d5b47f]/70 bg-[#fdfbf6] p-2 sm:h-64 sm:w-64">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image src="/practitioner-about.png" alt="Soumyaa" fill className="object-cover" sizes="256px" />
            </div>
            <BotanicalSprig className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-28 rotate-[16deg] text-[#c8946b]/65" />
            <BotanicalSprig className="pointer-events-none absolute -left-12 -top-10 h-28 w-24 -rotate-[33deg] text-[#a2ad90]/45" />
          </div>
        </Reveal>

        <div className="mt-12 lg:mt-0">
          <Reveal>
            <p className="text-[.62rem] font-semibold uppercase tracking-[.24em] text-[#c4816d]">A Gentle Introduction</p>
            <h2 className="mt-3 flex items-center gap-2 font-serif text-[2.65rem] font-medium leading-none text-[#31402f] sm:text-[3.3rem]">
              Hi, I&apos;m <span className="font-script text-[#b77259]">Soumyaa</span>
              <Heart className="h-5 w-5 text-[#c58b73]" strokeWidth={1.35} />
            </h2>
            <p className="mt-5 max-w-[39rem] text-[.86rem] leading-7 text-[#596052] sm:text-[.92rem]">
              With a deep connection to universal wisdom and a heart for healing, I help you release what no longer serves you, align with your higher self and step into a life of clarity, purpose and joy.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center border-b border-[#c58b73]/60 pb-1 text-[.72rem] font-semibold text-[#a96651] transition-colors hover:border-[#a96651] hover:text-[#80503e]">
              Read My Journey <span className="ml-1.5 text-base leading-none">→</span>
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-7 border-t border-[#d9d0c3] pt-7 sm:grid-cols-3 sm:gap-6">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index + 1}>
                <div className="border-l border-[#d9d0c3] pl-4 sm:border-l-0 sm:pl-0">
                  <pillar.icon className="h-5 w-5 text-[#c58b73]" strokeWidth={1.25} />
                  <h3 className="mt-3 font-serif text-[1.25rem] text-[#41503d]">{pillar.title}</h3>
                  <p className="mt-2 text-[.74rem] leading-5 text-[#687064]">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
