'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { services } from '@/lib/data/services'
import { site } from '@/lib/data/site'
import { ServiceIcon } from '@/components/brand/service-icon'
import { BotanicalSprig, LotusBloom } from '@/components/brand/botanical'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

const indicators = services.slice(0, 5)

/**
 * A paper-and-pigment layer rather than a geometric background. The real
 * watercolour scan gives this artwork the irregular pigment blooms visible in
 * the supplied composition; the translucent filtered marks extend it softly.
 */
function WatercolourArtwork() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute -left-[18%] top-[-8%] h-[110%] w-[118%] opacity-[0.17]">
        <Image
          src="/watercolor-sage-pigment.png"
          alt=""
          fill
          priority
          className="object-contain object-center"
          sizes="(max-width: 1023px) 100vw, 53vw"
          style={{ transform: 'scale(1.02) rotate(-2deg)' }}
        />
      </div>

      <div className="absolute -left-[6%] top-[-4%] h-[100%] w-[110%] opacity-[0.12]">
        <Image
          src="/watercolor-wash.png"
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 1023px) 100vw, 53vw"
          style={{ transform: 'scale(1.04) rotate(-1deg)' }}
        />
      </div>

      <div className="absolute left-[24%] top-[3%] h-[78%] w-[92%] -rotate-[15deg] opacity-[0.08]">
        <Image
          src="/watercolor-wash.png"
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 1023px) 100vw, 53vw"
        />
      </div>

      <div className="absolute right-[-8%] top-[18%] h-[32%] w-[32%] rotate-[12deg] opacity-[0.05]">
        <Image
          src="/watercolor-sage-pigment.png"
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 1023px) 35vw, 20vw"
        />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf8f2]">
      <div className="relative mx-auto min-h-[660px] max-w-[1440px] px-6 pb-8 pt-7 sm:px-10 lg:h-[650px] lg:min-h-0 lg:px-[5.1rem] lg:pt-5 xl:px-[6.25rem]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-[28rem] pt-6 sm:pt-10 lg:absolute lg:left-[5.1rem] lg:top-[3.1rem] lg:w-[27rem] lg:pt-0 xl:left-[6.25rem]"
        >
          <p className="text-[.61rem] font-semibold uppercase tracking-[.24em] text-[#c27d66] sm:text-[.66rem]">
            Welcome to Mystic Soul Journey
          </p>

          <h1 className="mt-3 font-serif text-[3.65rem] font-medium leading-[.78] tracking-[-.045em] text-[#334b41] sm:text-[4.45rem] lg:text-[4.8rem] xl:text-[5.1rem]">
            <span className="block">Heal.</span>
            <span className="mt-[.11em] block text-[#798d73]">Awaken.</span>
            <span className="mt-[.11em] block text-[#bf7c63]">Transform.</span>
          </h1>

          <div className="mt-5 flex items-center justify-center gap-2 text-[#d1a17b]" aria-hidden="true">
            <span className="h-px w-9 bg-current opacity-75" />
            <LotusBloom className="h-5 w-7" />
            <span className="h-px w-9 bg-current opacity-75" />
          </div>

          <p className="mt-5 max-w-[19rem] text-[.76rem] font-medium leading-[1.75] text-[#3d403c] sm:text-[.83rem]">
            Spiritual guidance, healing and inner wisdom
            <br />
            for a balanced mind, peaceful heart
            <br />
            and a joyful life.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <WhatsAppButton label="Book a Session" size="lg" className="h-10 rounded-xl bg-[#68705a] px-4 text-[.63rem] shadow-none hover:bg-[#59614c]" />
            <Link href="/services" className="inline-flex h-10 items-center rounded-xl border border-[#849078]/55 bg-[#fdfbf7]/55 px-5 text-[.63rem] font-semibold text-[#465040] transition-colors hover:border-[#68705a] hover:bg-white">
              Explore My Work
            </Link>
          </div>

          <div className="mt-7 grid max-w-[25.5rem] grid-cols-5 pt-1 text-center">
            {indicators.map((service, index) => (
              <div key={service.id} className="relative flex min-w-0 flex-col items-center px-1 text-[#454c42]">
                {index > 0 && <span className="absolute left-0 top-0 h-12 w-px bg-[#e4dbcf]" />}
                <ServiceIcon name={service.icon} className="h-[1.45rem] w-[1.45rem] text-[#c98769]" />
                <span className="mt-1.5 text-[.51rem] font-medium leading-[1.38]">
                  {service.name === 'Healing Sessions' ? <>Healing<br />Sessions</> : service.name === 'Akashic Reading' ? <>Akashic<br />Reading</> : service.name === 'Spiritual Guidance' ? <>Spiritual<br />Guidance</> : service.name === 'Energy Work' ? <>Energy<br />Work</> : <>Workshops &amp;<br />Courses</>}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: .985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .85, ease: [0.22, 1, 0.36, 1], delay: .05 }}
          className="relative z-10 mx-auto mt-4 h-[510px] w-full max-w-[38rem] sm:h-[590px] lg:absolute lg:bottom-0 lg:left-[37.3%] lg:mt-0 lg:h-[625px] lg:w-[44.5%] lg:max-w-[40.5rem] xl:left-[38.5%] xl:w-[42.5%]"
        >
          <WatercolourArtwork />
          <BotanicalSprig className="pointer-events-none absolute bottom-[16%] left-[-5%] z-[2] h-44 w-28 -rotate-[15deg] text-[#d8b487]/45 [stroke-width:.72]" />
          <BotanicalSprig className="pointer-events-none absolute right-[3%] top-[14%] z-[2] h-32 w-24 rotate-[19deg] text-[#ddc5a4]/35 [stroke-width:.72]" />
          <div className="absolute inset-x-[2%] bottom-0 z-10 h-[103%] [mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]">
            <Image src="/maam.png" alt={`${site.practitioner.fullName}, ${site.practitioner.role}`} fill priority className="object-contain object-bottom" sizes="(max-width: 1023px) 90vw, 47vw" />
          </div>
        </motion.div>

        <aside className="relative z-20 mx-auto mt-[-4.5rem] hidden w-[9.5rem] lg:absolute lg:right-[5.7rem] lg:top-[9.4rem] lg:mt-0 lg:block xl:right-[7.6rem]">
          <span className="block font-serif text-[4.8rem] leading-[.38] text-[#7b8f75]/90" aria-hidden="true">&ldquo;</span>
          <p className="mt-5 font-serif text-[.88rem] font-medium italic leading-[1.7] text-[#46574b]">
            Trust the process.<br />
            The universe is always working<br />
            for your highest good.
          </p>
          <span className="mt-6 flex items-center gap-2 text-[#d6b07b]" aria-hidden="true"><span className="h-px w-8 bg-current opacity-65" /><Heart className="h-3.5 w-3.5" strokeWidth={1.5} /><span className="h-px w-5 bg-current opacity-65" /></span>
          <BotanicalSprig className="absolute left-[5.4rem] top-[-1.8rem] h-32 w-24 rotate-[39deg] text-[#c9a77c]/30 [stroke-width:.72]" />
        </aside>

      </div>
    </section>
  )
}
