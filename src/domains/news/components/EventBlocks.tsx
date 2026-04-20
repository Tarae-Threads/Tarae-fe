import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gift } from "lucide-react"
import { cn } from "@/shared/lib/utils"

// ---------------------------------------------------------------------------
// EventSteps — 단계 카드 그리드 (children 에 <EventStep> 들을 넣는다)
// ---------------------------------------------------------------------------

export function EventSteps({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  )
}

interface EventStepProps {
  num: string
  title: string
  desc: string
  href?: string
  cta?: string
}

export function EventStep({ num, title, desc, href, cta }: EventStepProps) {
  const body = (
    <div className="relative h-full rounded-2xl bg-surface-container-high p-6 editorial-shadow transition-all group-hover:shadow-xl">
      <span className="inline-block font-display font-extrabold text-title-lg text-primary tracking-tight mb-3">
        {num}
      </span>
      <h3 className="font-display font-bold text-title-md text-on-surface mb-1.5">
        {title}
      </h3>
      <p className="text-body-md text-on-surface-variant leading-relaxed">
        {desc}
      </p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1 text-label-md font-bold text-primary group-hover:gap-2 transition-all">
          {cta ?? "바로가기"}
          <ArrowRight className="w-4 h-4" />
        </span>
      )}
    </div>
  )

  if (!href) return <div>{body}</div>

  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {body}
      </a>
    )
  }
  return (
    <Link href={href} className="group block">
      {body}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// PrizeGrid — 경품 그리드 (children 에 <Prize> 들을 넣는다)
// ---------------------------------------------------------------------------

export function PrizeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  )
}

interface PrizeProps {
  name: string
  detail?: string
  count?: number
  image?: string
}

export function Prize({ name, detail, count, image }: PrizeProps) {
  return (
    <div className="relative rounded-2xl bg-surface-container-high overflow-hidden editorial-shadow">
      {image ? (
        <div className="relative aspect-[4/3] w-full bg-surface-container">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-primary-fixed/40 flex items-center justify-center">
          <Gift className="w-10 h-10 text-primary" aria-hidden="true" />
        </div>
      )}
      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display font-bold text-title-sm text-on-surface line-clamp-2">
            {name}
          </h4>
          {count != null && (
            <span className="shrink-0 bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-label-xs font-bold">
              {count}분
            </span>
          )}
        </div>
        {detail && (
          <p className="text-body-sm text-on-surface-variant line-clamp-2">
            {detail}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EventCTA — 큰 액션 버튼
// ---------------------------------------------------------------------------

interface EventCTAProps {
  href: string
  label: string
  variant?: "primary" | "secondary"
  external?: boolean
}

export function EventCTA({
  href,
  label,
  variant = "primary",
  external,
}: EventCTAProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold text-label-lg px-7 py-4 rounded-2xl transition-all active:scale-95 flex-1"
  const styles =
    variant === "primary"
      ? "signature-gradient text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
      : "bg-surface-container-high text-on-surface hover:bg-surface-container"

  const className = cn(base, styles, "my-2")

  const isExternal = external ?? /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}

/** EventCTA 를 가로로 배치할 때 감싸는 래퍼. */
export function EventCTAGroup({ children }: { children: React.ReactNode }) {
  return <div className="my-8 flex flex-col sm:flex-row gap-3">{children}</div>
}
