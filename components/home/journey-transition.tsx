import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** A quiet bridge between the art-directed hero and the fuller home content. */
export function JourneyTransition() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf8f2] py-16 sm:py-20 lg:py-[5.5rem]">
      <div className="pointer-events-none absolute inset-y-0 right-[-8%] w-[32rem] opacity-70" aria-hidden="true">
        <Image
          src="/watercolor-wash.png"
          alt=""
          fill
          className="object-contain object-right opacity-70"
          sizes="(max-width: 1024px) 0px, 512px"
        />
        <Image
          src="/watercolor-sage-pigment.png"
          alt=""
          fill
          className="translate-x-10 translate-y-3 rotate-[19deg] object-contain object-right opacity-55"
          sizes="(max-width: 1024px) 0px, 512px"
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[6.25rem]">
        <div className="max-w-[35rem]">
          <p className="text-[.62rem] font-semibold uppercase tracking-[.25em] text-[#c4816d]">
            Your Journey Within
          </p>
          <h2 className="mt-4 max-w-[31rem] font-serif text-[2.55rem] font-medium leading-[.94] tracking-[-.025em] text-[#31402f] sm:text-[3.35rem]">
            True transformation begins with a deeper understanding of yourself.
          </h2>
          <p className="mt-5 max-w-[28rem] text-[.84rem] leading-7 text-[#596052] sm:text-[.9rem]">
            Through gentle healing, inner wisdom and intentional practice, you can return to the part of you that already knows the way forward.
          </p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-[.74rem] font-semibold text-[#b77259] transition-colors hover:text-[#8f5c49]">
            Discover My Approach <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
