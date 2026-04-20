import { MDXRemote } from "next-mdx-remote/rsc"
import { YouTubeEmbed } from "@next/third-parties/google"
import Image from "next/image"
import Link from "next/link"
import type { ComponentProps } from "react"
import {
  EventSteps,
  EventStep,
  PrizeGrid,
  Prize,
  EventCTA,
  EventCTAGroup,
} from "./EventBlocks"

const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1
      {...props}
      className="font-display font-extrabold text-headline-md text-on-surface mt-10 mb-4 leading-tight"
    />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2
      {...props}
      className="font-display font-bold text-title-lg text-on-surface mt-8 mb-3 leading-snug"
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3
      {...props}
      className="font-display font-bold text-title-md text-on-surface mt-6 mb-2"
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p
      {...props}
      className="text-body-lg leading-relaxed text-on-surface mb-4"
    />
  ),
  a: ({ href = "#", ...props }: ComponentProps<"a">) => {
    const isExternal = /^https?:\/\//.test(href)
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
          className="text-primary underline underline-offset-2 hover:no-underline"
        />
      )
    }
    return (
      <Link
        href={href}
        {...props}
        className="text-primary underline underline-offset-2 hover:no-underline"
      />
    )
  },
  ul: (props: ComponentProps<"ul">) => (
    <ul
      {...props}
      className="list-disc pl-6 space-y-1.5 text-body-lg text-on-surface mb-4 marker:text-outline"
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      {...props}
      className="list-decimal pl-6 space-y-1.5 text-body-lg text-on-surface mb-4 marker:text-outline"
    />
  ),
  li: (props: ComponentProps<"li">) => <li {...props} className="leading-relaxed" />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="border-l-4 border-primary pl-4 italic text-on-surface-variant my-5"
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      {...props}
      className="bg-surface-container text-on-surface rounded px-1.5 py-0.5 text-[0.85em] font-mono"
    />
  ),
  hr: () => <hr className="my-8 border-outline-variant/40" />,
  img: ({ src = "", alt = "", ...props }: ComponentProps<"img">) => (
    <span className="block my-6 overflow-hidden rounded-xl">
      <Image
        src={src as string}
        alt={alt as string}
        width={1600}
        height={900}
        sizes="(max-width: 767px) 100vw, 760px"
        className="w-full h-auto object-cover"
        {...(props as object)}
      />
    </span>
  ),
  // MDX 에서 <YouTubeEmbed videoid="..." /> 로 바로 사용
  YouTubeEmbed,
  // 이벤트 전용 블록
  EventSteps,
  EventStep,
  PrizeGrid,
  Prize,
  EventCTA,
  EventCTAGroup,
}

export default function NewsArticleBody({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
