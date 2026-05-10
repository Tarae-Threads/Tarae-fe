import type { Metadata } from 'next'
import CategoryLandingPage, {
  buildCategoryMetadata,
} from '@/domains/seo/components/CategoryLandingPage'
import { CATEGORY_BY_SLUG } from '@/domains/seo/constants'

export const revalidate = 3600

const SLUG = 'knitting-supplies'

export async function generateMetadata(): Promise<Metadata> {
  return (await buildCategoryMetadata(SLUG)) ?? {}
}

export default function Page() {
  return <CategoryLandingPage meta={CATEGORY_BY_SLUG[SLUG]} />
}
