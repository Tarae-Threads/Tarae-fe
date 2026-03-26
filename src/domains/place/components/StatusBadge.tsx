import type { PlaceStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR } from '../constants'

interface StatusBadgeProps {
  status: PlaceStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'open') return null

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
      style={{ backgroundColor: STATUS_COLOR[status] }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-white/60"
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
