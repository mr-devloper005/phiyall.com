import Link from 'next/link'
import type { ReactNode } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  ArticleListCard,
  getEditablePostImage,
  getEditableCategory,
  getEditableExcerpt,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function Carousel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

function formatDate(post: SitePost) {
  if (!post.publishedAt) return ''
  try {
    return new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

/* ── Hero: magazine grid with large featured + sidebar cards ── */
export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = posts[0]
  const sidebarTop = posts[1]
  const sidebarMid = posts.slice(2, 4)

  if (!hero) return null

  return (
    <section className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Main featured */}
          <Link href={postHref(primaryTask, hero, primaryRoute)} className="group relative block overflow-hidden bg-[#1a1a1a]">
            <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[520px]">
              <img src={getEditablePostImage(hero)} alt={hero.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-8">
                <span className="font-sans-ui inline-block bg-[#2d5a3d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">{getEditableCategory(hero)}</span>
                <h2 className="mt-4 max-w-2xl text-2xl font-bold leading-[1.12] sm:text-3xl lg:text-[2.6rem] lg:leading-[1.1]">{hero.title}</h2>
                <div className="font-sans-ui mt-3 text-xs text-white/60">
                  <span>{SITE_CONFIG.name}</span>
                  {hero.publishedAt ? <span> &mdash; {formatDate(hero)}</span> : null}
                </div>
              </div>
            </div>
          </Link>

          {/* Sidebar stack */}
          <div className="grid gap-4">
            {/* Top sidebar card */}
            {sidebarTop ? (
              <Link href={postHref(primaryTask, sidebarTop, primaryRoute)} className="group relative block overflow-hidden bg-[#1a1a1a]">
                <div className="relative min-h-[200px] lg:min-h-[254px]">
                  <img src={getEditablePostImage(sidebarTop)} alt={sidebarTop.title} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="font-sans-ui inline-block bg-[#c89a58] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">{getEditableCategory(sidebarTop)}</span>
                    <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug">{sidebarTop.title}</h3>
                    <p className="font-sans-ui mt-1 text-[11px] text-white/50">{SITE_CONFIG.name} &mdash; {formatDate(sidebarTop)}</p>
                  </div>
                </div>
              </Link>
            ) : null}

            {/* Bottom two sidebar cards */}
            <div className="grid grid-cols-2 gap-4">
              {sidebarMid.map((post) => (
                <Link key={post.id} href={postHref(primaryTask, post, primaryRoute)} className="group relative block overflow-hidden bg-[#1a1a1a]">
                  <div className="relative min-h-[180px] lg:min-h-[254px]">
                    <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-65" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <span className="font-sans-ui inline-block bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">{getEditableCategory(post)}</span>
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug">{post.title}</h3>
                      <p className="font-sans-ui mt-1 text-[10px] text-white/50">{SITE_CONFIG.name} &mdash; {formatDate(post)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Story Rail: horizontal scrolling latest picks ── */
export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <section className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">Featured in</p>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em]">Fresh picks from the archive</h2>
          </div>
          <Link href={primaryRoute} className="font-sans-ui inline-flex items-center gap-1 border border-black/[0.08] px-4 py-2 text-xs font-semibold text-[#1a1a1a] transition hover:bg-gray-50">
            View all
          </Link>
        </div>

        <Carousel className="mt-6">
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </Carousel>
      </div>
    </section>
  )
}

/* ── Mixed List: editorial article list with sidebar ── */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const listPosts = posts.slice(4, 12)
  if (!listPosts.length) return null

  return (
    <section className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em]">Mixed <span className="italic text-[#2d5a3d]">List</span></h2>
          <div className="mt-2 h-[3px] w-12 bg-[#c89a58]" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Article list */}
          <div>
            {listPosts.map((post, index) => (
              <ArticleListCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Subscribe widget */}
            <div className="border border-black/[0.06] bg-[#f8f7f2] p-6">
              <h3 className="text-xl font-bold">Subscribe to Updates</h3>
              <p className="font-sans-ui mt-2 text-sm leading-6 text-[#6b6b6b]">Get practical reading picks, visual features, and new discoveries from {SITE_CONFIG.name}.</p>
              <div className="mt-4">
                <input type="email" placeholder="Your email address.." className="font-sans-ui h-10 w-full border border-black/[0.1] bg-white px-3 text-sm outline-none placeholder:text-[#aaa]" />
                <Link href="/signup" className="font-sans-ui mt-3 flex h-10 w-full items-center justify-center bg-[#2d5a3d] text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#234a31]">
                  Subscribe
                </Link>
              </div>
              <p className="font-sans-ui mt-3 text-[11px] text-[#aaa]">By signing up, you agree to our terms and privacy policy agreement.</p>
            </div>

            {/* Search the archive */}
            <div className="border border-black/[0.06] bg-[#e8f0eb]/40 p-6">
              <h3 className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">Search the Archive</h3>
              <form action="/search" className="mt-3 flex gap-0">
                <input name="q" placeholder="Search by topic" className="font-sans-ui h-9 min-w-0 flex-1 border border-black/[0.1] bg-white px-3 text-sm outline-none placeholder:text-[#aaa]" />
                <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#2d5a3d] text-white">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Explore widget */}
            <div className="border border-black/[0.06] bg-white p-6">
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">Quick Access</p>
              <h3 className="mt-2 text-lg font-bold">Explore what matters this week</h3>
              <p className="font-sans-ui mt-2 text-sm leading-6 text-[#6b6b6b]">Find stories, images, and curated listings across every section.</p>
              <Link href={primaryRoute} className="font-sans-ui mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">
                Explore more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ── Latest Stories: full-width article grid ── */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts.slice(8)
  const latestPosts = timePosts.slice(0, 12)

  if (!latestPosts.length) return null

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em]">Latest <span className="italic text-[#2d5a3d]">Stories</span></h2>
          <div className="mt-2 h-[3px] w-12 bg-[#c89a58]" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {latestPosts.map((post) => {
              const href = postHref(primaryTask, post, primaryRoute)
              return (
                <Link key={post.id} href={href} className="group grid gap-4 border-b border-black/[0.06] py-5 sm:grid-cols-[90px_minmax(0,1fr)]">
                  <div className="relative aspect-square overflow-hidden bg-[#e8e6df] sm:aspect-auto sm:min-h-[80px]">
                    <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#2d5a3d]">{getEditableCategory(post)}</p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#1a1a1a]">{post.title}</h3>
                    <p className="font-sans-ui mt-1 line-clamp-2 text-xs leading-5 text-[#888]">{getEditableExcerpt(post, 120)}</p>
                    <span className="font-sans-ui mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2d5a3d]">Open story <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              )
            })}
          </div>

          <aside className="space-y-6">
            {/* Reading Now */}
            <div className="border border-black/[0.06] bg-[#f8f7f2] p-5">
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">Reading Now</p>
              <h3 className="mt-2 text-lg font-bold">Discover curated content</h3>
              <p className="font-sans-ui mt-2 text-sm leading-6 text-[#6b6b6b]">Browse through our carefully curated collection of articles and visual stories.</p>
              <Link href="/search" className="font-sans-ui mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">
                Search now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Category chips */}
            <div className="border border-black/[0.06] p-5">
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">Browse Topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['All', 'Business', 'Health', 'Education', 'Arts', 'Tech'].map((chip) => (
                  <Link key={chip} href={`/search?category=${chip.toLowerCase()}`} className="font-sans-ui border border-black/[0.08] px-3 py-1.5 text-[11px] font-semibold text-[#1a1a1a] transition hover:bg-[#2d5a3d] hover:text-white">
                    {chip}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ── CTA section ── */
export function EditableHomeCta() {
  return (
    <section className="bg-[#2d5a3d] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Start exploring</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] sm:text-4xl">A curated reading experience for stories, visuals, and ideas.</h2>
            <p className="font-sans-ui mt-4 max-w-xl text-sm leading-7 text-white/65">Browse through our growing collection of articles, images, and useful resources — all in one connected platform.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="font-sans-ui inline-flex bg-white px-5 py-3 text-sm font-bold text-[#2d5a3d] transition hover:bg-white/90">
              Contact us
            </Link>
            <Link href="/signup" className="font-sans-ui inline-flex border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
