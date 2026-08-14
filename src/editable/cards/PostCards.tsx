import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function formatDate(post: SitePost) {
  if (!post.publishedAt) return ''
  try {
    return new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

/* Large featured hero card — full-bleed image with title overlay */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  const date = formatDate(post)
  return (
    <Link href={href} className="group relative block overflow-hidden bg-[#1a1a1a]">
      <div className="relative min-h-[420px] lg:min-h-[520px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
          <span className="font-sans-ui inline-block bg-[#2d5a3d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">{label}</span>
          <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-[1.15] sm:text-3xl lg:text-4xl">{post.title}</h3>
          <div className="font-sans-ui mt-3 flex items-center gap-2 text-xs text-white/60">
            {date ? <span>{date}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* Compact sidebar card — small image with title */
export function RailPostCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden bg-white ${dc.layout.minRailCard}">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="font-sans-ui absolute left-2 top-2 bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{getEditableCategory(post)}</span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[#1a1a1a]">{post.title}</h3>
        <p className="font-sans-ui mt-1 text-[11px] text-[#888]">{formatDate(post)}</p>
      </div>
    </Link>
  )
}

/* Numbered compact card with icon */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-start gap-3 border-b border-black/[0.06] py-4 transition hover:bg-gray-50/50">
      <span className="font-sans-ui flex h-8 w-8 shrink-0 items-center justify-center bg-[#2d5a3d] text-xs font-bold text-white">{index + 1}</span>
      <div className="min-w-0">
        <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#2d5a3d]">{getEditableCategory(post)}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#1a1a1a]">{post.title}</h3>
        <p className="font-sans-ui mt-1 line-clamp-2 text-xs leading-5 text-[#888]">{getEditableExcerpt(post, 90)}</p>
      </div>
    </Link>
  )
}

/* Horizontal editorial list card — image left, content right */
export function ArticleListCard({ post, href }: { post: SitePost; href: string; index: number }) {
  const date = formatDate(post)
  return (
    <Link href={href} className="group grid gap-5 border-b border-black/[0.06] py-5 sm:grid-cols-[200px_minmax(0,1fr)]">
      <div className="relative aspect-[16/12] overflow-hidden bg-[#e8e6df] sm:aspect-auto sm:min-h-[140px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{getEditableCategory(post)}</p>
        <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-snug text-[#1a1a1a]">{post.title}</h2>
        <p className="font-sans-ui mt-2 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">{getEditableExcerpt(post, 160)}</p>
        <div className="font-sans-ui mt-3 flex items-center gap-3 text-xs text-[#888]">
          {date ? <span>{date}</span> : null}
          <span className="inline-flex items-center gap-1 font-semibold text-[#2d5a3d] opacity-0 transition group-hover:opacity-100">Open story <ArrowRight className="h-3 w-3" /></span>
        </div>
      </div>
    </Link>
  )
}

/* Portrait image-first card */
export function ImageForwardCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e6df]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Visual</p>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

/* Small horizontal card with thumbnail */
export function HorizontalStoryCard({ post, href }: { post: SitePost; href: string }) {
  const date = formatDate(post)
  return (
    <Link href={href} className="group grid gap-3 py-3 transition sm:grid-cols-[100px_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden bg-[#e8e6df]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#2d5a3d]">{getEditableCategory(post)}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#1a1a1a]">{post.title}</h3>
        <p className="font-sans-ui mt-1 text-[11px] text-[#888]">{date}</p>
      </div>
    </Link>
  )
}

/* Compact tag/pill card */
export function CompactTagCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 border-b border-black/[0.06] px-2 py-3 transition hover:bg-gray-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e8f0eb] text-[#2d5a3d]">
        <ImageIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#2d5a3d]">{getEditableCategory(post)}</p>
        <h3 className="line-clamp-1 text-sm font-bold text-[#1a1a1a]">{post.title}</h3>
      </div>
    </Link>
  )
}
