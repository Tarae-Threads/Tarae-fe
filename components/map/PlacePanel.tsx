'use client'

import Link from 'next/link'
import type { Place } from '@/lib/types'
import CategoryBadge from '@/components/ui/CategoryBadge'
import { X, Clock, MapPin, ExternalLink } from 'lucide-react'

interface PlacePanelProps {
  place: Place | null
  open: boolean
  onClose: () => void
}

export default function PlacePanel({ place, open, onClose }: PlacePanelProps) {
  if (!place || !open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-on-surface/10 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 w-full z-40">
        <div className="bg-surface-container-low rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(29,27,22,0.12)] pt-6 pb-32 px-6">
          {/* Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-on-surface">
                    {place.name}
                  </h2>
                  <CategoryBadge category={place.category} size="md" />
                </div>
                <p className="text-on-surface-variant text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {place.address}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Clock className="w-5 h-5 text-outline" />
                <span className="text-sm">{place.hours}</span>
              </div>

              {place.closedDays.length > 0 && (
                <p className="text-sm text-on-surface-variant pl-8">
                  휴무: {place.closedDays.join(', ')}
                </p>
              )}
            </div>

            {/* Tags */}
            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {place.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {place.links.instagram && (
              <a
                href={place.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline decoration-2 underline-offset-4 mb-6"
              >
                <ExternalLink className="w-4 h-4" />
                Instagram
              </a>
            )}

            {/* CTA */}
            <Link
              href={`/place/${place.id}`}
              className="signature-gradient text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full"
            >
              상세보기
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
