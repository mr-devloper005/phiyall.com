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
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

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
      <Link href={href} className="group block overflow-hidden rounded-[2.2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(23,19,54,0.14)] md:col-span-2">
        <div className="relative aspect-[16/8] overflow-hidden bg-black">
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,25,0.06),rgba(11,11,25,0.74))]" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h2 className="max-w-3xl text-3xl font-black leading-[0.94] tracking-[-0.06em]">{post.title}</h2>
            {summary ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">{summary}</p> : null}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(23,19,54,0.14)]">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span>
        </div>
      ) : (
        <div className="rounded-t-[2rem] bg-[linear-gradient(135deg,#6d3bd3_0%,#d95ca9_100%)] p-5 text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{taskLabel}</span>
          <h2 className="mt-12 text-2xl font-black leading-[0.96] tracking-[-0.06em]">{post.title}</h2>
        </div>
      )}
      <div className="p-5 sm:p-6">
        <h2 className="line-clamp-3 text-2xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-[var(--slot4-soft-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] opacity-65 group-hover:opacity-100">Open result <ArrowRight className="h-4 w-4" /></span>
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
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg,#f4f3ff)] text-[var(--editable-page-text,#171336)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="overflow-hidden rounded-[2.6rem] border border-[var(--editable-border)] bg-[linear-gradient(135deg,#6d3bd3_0%,#5a46d6_44%,#d95ca9_100%)] p-7 text-white shadow-[0_26px_80px_rgba(23,19,54,0.18)] lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/72">{pagesContent.search.hero.badge}</p>
                <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/78">{pagesContent.search.hero.description}</p>
              </div>

              <form action="/search" className="rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-[1.5rem] border border-white/15 bg-white px-4 py-3">
                  <Search className="h-5 w-5 opacity-45" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-black text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-[1.4rem] border border-white/15 bg-white px-4 py-3">
                    <Filter className="h-4 w-4 opacity-45" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-black text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-[1.4rem] border border-white/15 bg-white px-4 py-3 text-sm font-black text-[var(--slot4-page-text)] outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[1.4rem] bg-[var(--slot4-dark-bg)] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] opacity-50">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black shadow-sm">
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['All', 'Editorial', 'Visuals', 'Profiles', 'Resources'].map((chip) => (
              <span key={chip} className="rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] shadow-sm">{chip}</span>
            ))}
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white/75 p-10 text-center shadow-sm">
              <p className="text-2xl font-black tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm font-medium opacity-60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
