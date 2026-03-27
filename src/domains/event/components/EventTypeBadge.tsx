import type { EventType } from '../types'
import { EVENT_TYPE_LABEL, EVENT_TYPE_COLOR, EVENT_TYPE_BG } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  type: EventType
  size?: 'sm' | 'md'
}

export default function EventTypeBadge({ type, size = 'sm' }: Props) {
  return (
    <ColorBadge
      label={EVENT_TYPE_LABEL[type]}
      bg={EVENT_TYPE_BG[type]}
      color={EVENT_TYPE_COLOR[type]}
      size={size}
    />
  )
}
