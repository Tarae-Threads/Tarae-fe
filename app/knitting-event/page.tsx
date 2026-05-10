import type { Metadata } from 'next'
import EventLandingPage, {
  buildEventLandingMetadata,
} from '@/domains/seo/components/EventLandingPage'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return await buildEventLandingMetadata()
}

export default function Page() {
  return <EventLandingPage />
}
