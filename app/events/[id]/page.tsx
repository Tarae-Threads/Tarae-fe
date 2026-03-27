import { redirect } from 'next/navigation'
import { getEventById, getEvents } from '@/domains/event/utils/events'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getEvents().map(e => ({ id: e.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const event = getEventById(id)
  if (!event) return { title: '일정을 찾을 수 없습니다' }

  return {
    title: `${event.title} | 타래`,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const event = getEventById(id)

  if (event) {
    redirect('/')
  }

  redirect('/')
}
