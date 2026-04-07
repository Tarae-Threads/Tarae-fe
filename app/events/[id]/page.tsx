import { redirect } from 'next/navigation'
import { getEvent } from '@/domains/event/queries/eventApi'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const event = await getEvent(Number(id))
    return {
      title: `${event.title} | 타래`,
      description: event.description ?? '',
    }
  } catch {
    return { title: '일정을 찾을 수 없습니다' }
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  try {
    await getEvent(Number(id))
    redirect('/')
  } catch {
    redirect('/')
  }
}
