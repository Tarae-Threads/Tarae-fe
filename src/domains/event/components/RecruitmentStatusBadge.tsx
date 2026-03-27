import type { RecruitmentStatus } from '../types'
import { RECRUITMENT_STATUS_LABEL } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  status: RecruitmentStatus
}

export default function RecruitmentStatusBadge({ status }: Props) {
  if (status === 'hidden') return null

  return (
    <ColorBadge
      label={RECRUITMENT_STATUS_LABEL[status]}
      bg="var(--primary-fixed)"
      color="var(--primary)"
    />
  )
}
