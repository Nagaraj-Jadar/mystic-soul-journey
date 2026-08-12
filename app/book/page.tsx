import type { Metadata } from "next"
import { BookingWizard } from "@/components/booking/booking-wizard"

export const metadata: Metadata = {
  title: "Book Your Session",
  description: "Simple. Sacred. Personal. Book a healing session, reading, or guidance in a few gentle steps.",
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  return <BookingWizard initialServiceSlug={service} />
}
