import { STATUS_LABEL, STATUS_COLOR } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  if (status === 'OPEN') return null

  return (
    <ColorBadge
      label={STATUS_LABEL[status] ?? status}
      bg={STATUS_COLOR[status] ?? '#87736c'}
      color="#ffffff"
      dot
    />
  )
}
