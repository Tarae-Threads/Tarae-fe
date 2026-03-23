'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Place } from '@/lib/types'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'

interface PlacePanelProps {
  place: Place | null
  open: boolean
  onClose: () => void
}

export default function PlacePanel({ place, open, onClose }: PlacePanelProps) {
  if (!place) return null

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge
          style={{ backgroundColor: CATEGORY_COLOR[place.category], color: 'white' }}
        >
          {CATEGORY_LABEL[place.category]}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground">{place.address}</p>
        <div>
          <span className="font-medium">영업시간: </span>
          {place.hours}
        </div>
        {place.closedDays.length > 0 && (
          <div>
            <span className="font-medium">휴무: </span>
            {place.closedDays.join(', ')}
          </div>
        )}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {place.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {place.links.instagram && (
          <a
            href={place.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yarn-purple hover:underline inline-block"
          >
            Instagram
          </a>
        )}
      </div>
      <Link href={`/place/${place.id}`}>
        <Button className="w-full mt-2">상세보기</Button>
      </Link>
    </div>
  )

  // Desktop: side panel
  return (
    <>
      {/* Desktop side panel */}
      <div className="hidden md:block">
        {open && (
          <div className="absolute top-0 left-0 w-80 h-full bg-background border-r z-10 p-6 overflow-y-auto shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold">{place.name}</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
                &times;
              </button>
            </div>
            {content}
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{place.name}</SheetTitle>
            </SheetHeader>
            <div className="pt-4">
              {content}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
