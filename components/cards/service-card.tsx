import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/data/services'
import { ServiceIcon } from '@/components/brand/service-icon'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex h-full flex-col border border-[#ded6ca] bg-[#fdfbf7]/75 px-5 py-7 text-center transition-colors hover:border-[#cfa485]">
      <ServiceIcon name={service.icon} className="mx-auto h-6 w-6 text-[#c58b73]" />
      <h3 className="mt-4 font-serif text-[1.3rem] text-primary">{service.name}</h3>
      <p className="mt-2 flex-1 text-[.74rem] leading-5 text-muted-foreground">
        {service.shortDescription}
      </p>
      <Link
        href={`/services#${service.slug}`}
        className="mt-5 inline-flex items-center justify-center gap-1 text-[.72rem] font-semibold text-terracotta transition-colors hover:text-primary"
      >
        Know More
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
