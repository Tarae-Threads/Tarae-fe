import type { PlaceStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  status: PlaceStatus
}

export default function StatusBadge({ status }: Props) {
  if (status === 'open') return null

  return (
    <ColorBadge
      label={STATUS_LABEL[status]}
      bg={STATUS_COLOR[status]}
      color="#ffffff"
      dot
    />
  )
}
