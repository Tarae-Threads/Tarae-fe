import type { PlaceCategory } from '@/lib/types'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'

interface CategoryBadgeProps {
  category: PlaceCategory
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const sizeClass = size === 'md'
    ? 'px-3 py-1 text-[10px]'
    : 'px-2.5 py-0.5 text-[9px]'

  return (
    <span
      className={`${sizeClass} rounded-full font-bold uppercase tracking-widest text-white`}
      style={{ backgroundColor: CATEGORY_COLOR[category] }}
    >
      {CATEGORY_LABEL[category]}
    </span>
  )
}
