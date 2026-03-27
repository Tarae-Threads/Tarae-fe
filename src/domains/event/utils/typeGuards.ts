import type { AnyEvent, TesterRecruitment } from '../types'

export function isTesterRecruitment(event: AnyEvent | undefined | null): event is TesterRecruitment {
  return event?.type === 'tester_recruitment'
}
