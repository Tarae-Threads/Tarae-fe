import { CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_BG } from '../constants'
import ColorBadge from '@/shared/components/ui/ColorBadge'

interface Props {
  category: string
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  return (
    <ColorBadge
      label={CATEGORY_LABEL[category] ?? category}
      bg={CATEGORY_BG[category] ?? '#e0e0e0'}
      color={CATEGORY_COLOR[category] ?? '#666666'}
      size={size}
    />
  )
}
