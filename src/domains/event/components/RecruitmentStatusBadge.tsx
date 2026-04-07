import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  status: string
}

const STATUS_LABEL: Record<string, string> = {
  open: '모집중',
  closed: '모집마감',
  in_progress: '진행중',
  completed: '완료',
}

export default function RecruitmentStatusBadge({ status }: Props) {
  if (status === 'hidden' || !STATUS_LABEL[status]) return null

  return (
    <ColorBadge
      label={STATUS_LABEL[status]}
      bg="var(--primary-fixed)"
      color="var(--primary)"
    />
  )
}
