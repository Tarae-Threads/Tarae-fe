import type { PlaceCategory } from '../types'
import { CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_BG } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  category: PlaceCategory
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  return (
    <ColorBadge
      label={CATEGORY_LABEL[category]}
      bg={CATEGORY_BG[category]}
      color={CATEGORY_COLOR[category]}
      size={size}
    />
  )
}
