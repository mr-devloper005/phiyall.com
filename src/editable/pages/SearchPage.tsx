import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => stripHtml(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '').replace(/\s+/g, ' ').trim()

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const featured = index % 6 === 0

  if (featured && image) {
    return (
      <Link href={href} className="group block overflow-hidden border border-black/[0.06] bg-white transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:col-span-2">
        <div className="relative aspect-[16/8] overflow-hidden bg-[#1a1a1a]">
          <img src={image} alt="" className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <span className="font-sans-ui absolute left-3 top-3 bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{taskLabel}</span>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h2 className="max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">{post.title}</h2>
            {summary ? <p className="font-sans-ui mt-2 max-w-xl text-sm leading-6 text-white/65">{summary}</p> : null}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block overflow-hidden border border-black/[0.06] bg-white transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[#e8e6df]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="font-sans-ui absolute left-3 top-3 bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{taskLabel}</span>
        </div>
      ) : (
        <div className="bg-[#2d5a3d] p-5 text-white">
          <span className="font-sans-ui text-[9px] font-bold uppercase tracking-[0.12em] text-white/60">{taskLabel}</span>
          <h2 className="mt-8 text-xl font-bold leading-snug">{post.title}</h2>
        </div>
      )}
      <div className="p-4">
        <h2 className="line-clamp-2 text-lg font-bold leading-snug text-[#1a1a1a]">{post.title}</h2>
        {summary ? <p className="font-sans-ui mt-2 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">{summary}</p> : null}
        <span className="font-sans-ui mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2d5a3d] opacity-0 transition group-hover:opacity-100">Open result <ArrowRight className="h-3 w-3" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const allowedTasks = new Set(['image', 'profile'])
  const results = posts.filter((post) => {
    const postTask = getPostTaskKey(post) || compactText(getContent(post).type)
    if (!allowedTasks.has(postTask)) return false
    return matches(post, normalized, category, task)
  }).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#1a1a1a]">
        {/* Search hero */}
        <section className="border-b border-black/[0.06] bg-[#2d5a3d] text-white">
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{pagesContent.search.hero.badge}</p>
                <h1 className="mt-3 max-w-xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{pagesContent.search.hero.title}</h1>
                <p className="font-sans-ui mt-4 max-w-lg text-sm leading-7 text-white/65">{pagesContent.search.hero.description}</p>
              </div>

              <form action="/search" className="border border-white/15 bg-white/10 p-4 backdrop-blur">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-2 border border-white/15 bg-white px-3 py-2.5">
                  <Search className="h-4 w-4 opacity-40" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="font-sans-ui min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#1a1a1a] outline-none placeholder:text-[#aaa]" />
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 border border-white/15 bg-white px-3 py-2.5">
                    <Filter className="h-3 w-3 opacity-40" />
                    <input name="category" defaultValue={category} placeholder="Category" className="font-sans-ui min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#1a1a1a] outline-none placeholder:text-[#aaa]" />
                  </label>
                  <select name="task" defaultValue={task} className="font-sans-ui border border-white/15 bg-white px-3 py-2.5 text-sm font-semibold text-[#1a1a1a] outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button className="font-sans-ui mt-2 flex h-10 w-full items-center justify-center bg-[#c89a58] text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#b8894d]" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">{results.length} results</p>
              <h2 className="mt-1 text-2xl font-bold">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              <div className="mt-1 h-[3px] w-10 bg-[#c89a58]" />
            </div>
            <Link href="/article" className="font-sans-ui inline-flex items-center gap-1 border border-black/[0.08] px-4 py-2 text-xs font-semibold transition hover:bg-gray-50">
              Browse latest <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['All', 'Editorial', 'Visuals', 'Resources'].map((chip) => (
              <span key={chip} className="font-sans-ui border border-black/[0.08] px-3 py-1.5 text-[11px] font-semibold">{chip}</span>
            ))}
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-black/[0.08] bg-[#f8f7f2] p-10 text-center">
              <p className="text-xl font-bold">No matching posts found.</p>
              <p className="font-sans-ui mt-2 text-sm text-[#888]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
