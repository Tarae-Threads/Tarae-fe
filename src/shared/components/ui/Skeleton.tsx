interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-surface-container rounded ${className}`} />
}

export function PlaceCardSkeleton() {
  return (
    <div className="w-full bg-surface-container-high rounded-2xl overflow-hidden p-4 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}
