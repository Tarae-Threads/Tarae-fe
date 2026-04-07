import type { Event } from '../types'

export function isTesterRecruitment(event: Event | undefined | null): boolean {
  return event?.eventType === 'TESTER_RECRUIT'
}
