import Link from 'next/link'
import type { ReactNode } from 'react'
import { Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  getEditablePostImage,
  HorizontalStoryCard,
  ImageForwardCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function Carousel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

function FloatingCard({ post, href, rotate = 0, variant = 'image', taskLabelText }: { post: SitePost; href: string; rotate?: number; variant?: 'image' | 'feature'; taskLabelText: string }) {
  return (
    <Link href={href} className="group block">
      <article
        style={{ transform: `rotate(${rotate}deg)` }}
        className={`relative overflow-hidden rounded-[1.8rem] border border-white/25 bg-white/80 shadow-[0_18px_55px_rgba(23,19,54,0.18)] transition duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_22px_70px_rgba(23,19,54,0.22)]`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(11,11,25,0.68)_100%)]" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
            {variant === 'feature' ? 'Spotlight' : 'Preview'}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/65">{taskLabelText}</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em]">{post.title}</h3>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ')
  const heroPosts = posts.slice(0, 6)

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#7b35db_0%,#6b36d8_48%,#5f6ee7_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%)] opacity-95" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="pt-10 lg:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/85 backdrop-blur">
              <Sparkles className="h-4 w-4" /> {pagesContent.home.hero.badge}
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-[5.8rem]">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{pagesContent.home.hero.description}</p>

            <div className="mt-8 rounded-[1.8rem] border border-white/15 bg-white/10 p-3 shadow-[0_18px_60px_rgba(14,13,38,0.22)] backdrop-blur-xl">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <input className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm font-black text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]" placeholder="First name" />
                <input className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm font-black text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]" placeholder="Email" />
                <input className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm font-black text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]" placeholder="Create password" />
                <Link href={primaryRoute} className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#b7de2f] px-6 text-sm font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)] transition hover:-translate-y-0.5">
                  Get started
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-white/72">
                <span className="opacity-80">By continuing, you agree to the site terms and privacy policy.</span>
                <span className="rounded-full border border-white/15 px-3 py-1 font-black uppercase tracking-[0.18em]">Or</span>
                <Link href="/signup" className="rounded-full bg-white/15 px-4 py-2 font-black uppercase tracking-[0.16em] text-white">
                  Sign up with email
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="uppercase tracking-[0.24em] text-white/55">Trusted by creators and teams</span>
              <span className="h-px w-20 bg-white/25" />
              <span>Clean navigation, visual cards, and responsive pages.</span>
            </div>
          </div>

          <div className="relative pt-6 lg:pt-14">
            <div className="relative grid grid-cols-2 gap-4">
              {heroPosts.slice(0, 6).map((post, index) => (
              <FloatingCard
                  key={post.id}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  rotate={index % 2 === 0 ? 6 : -5}
                  variant={index === 0 ? 'feature' : 'image'}
                  taskLabelText={taskLabel(primaryTask)}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-[90%] -translate-x-1/2 rounded-full bg-black/15 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="relative -mb-1 h-16 bg-[var(--slot4-page-bg)] [clip-path:polygon(0_0,100%_58%,100%_100%,0_100%)]" />
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <section className="border-t border-black/5 bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Featured in</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] sm:text-3xl">Fresh picks from the archive</h2>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5">
            View all {taskLabel(primaryTask)}
          </Link>
        </div>

        <Carousel className="mt-8">
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 8)
  if (!featured.length) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <EditorialFeatureCard post={featured[0]} href={postHref(primaryTask, featured[0], primaryRoute)} label={pagesContent.home.hero.featureCardBadge} />
          <div className="grid gap-4">
            {featured.slice(1, 4).map((post) => (
              <HorizontalStoryCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.slice(4, 8).map((post, index) => (
                <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts.slice(6)
  const feature = timePosts[0] || posts[0]
  const gridPosts = timePosts.slice(1, 9)
  const imagePosts = posts.slice(10, 16)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_22px_70px_rgba(23,19,54,0.08)]">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Search by mood</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">Use filters, not friction.</h2>
          <p className={`mt-4 max-w-xl text-base leading-8 ${pal.mutedText}`}>The archive, detail pages, and discovery surfaces all keep the same visual energy while still being easy to browse and read.</p>
          <form action="/search" className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-gray)] p-3">
            <Search className="h-5 w-5 shrink-0 opacity-55" />
            <input name="q" placeholder="Search stories, people, images, or topics" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
            <button className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-2">
            {['All', 'Images', 'Articles', 'Listings'].map((chip) => (
              <span key={chip} className="rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em]">
                {chip}
              </span>
            ))}
          </div>

          {feature ? (
            <Link href={postHref(primaryTask, feature, primaryRoute)} className="group mt-8 block overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] text-white shadow-[0_22px_70px_rgba(23,19,54,0.18)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={getEditablePostImage(feature)} alt={feature.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(11,11,25,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/65">Featured stream</p>
                  <h3 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.07em] sm:text-4xl">{feature.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">{getExcerpt(feature, 160)}</p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {gridPosts.map((post, index) => (
            <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {imagePosts.map((post, index) => (
            <ImageForwardCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
        <div className="grid gap-4">
          {timePosts.slice(8, 12).map((post, index) => (
            <ArticleListCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[linear-gradient(180deg,#6d3bd3_0%,#4a2bb7_100%)] text-white">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[2.6rem] border border-white/10 bg-white/8 p-7 backdrop-blur-md lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/65">Start exploring</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl">A cleaner way to showcase work, links, and profiles.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">Strong visuals, flexible layouts, and fast navigation make the site feel complete from the first scroll to the final card.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-dark-bg)]">
              Contact us
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
