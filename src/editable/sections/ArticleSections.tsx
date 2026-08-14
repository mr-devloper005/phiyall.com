import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className="bg-white text-[#1a1a1a]">
      <section className="border-b border-black/[0.06] bg-[#2d5a3d] text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{voice.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{voice.headline}</h1>
          <p className="font-sans-ui mt-4 max-w-xl text-sm leading-7 text-white/65">{voice.description}</p>
          <form action={basePath} className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <select name="category" defaultValue={category || 'all'} className="font-sans-ui min-w-0 flex-1 border border-white/15 bg-white px-3 py-2 text-sm font-semibold text-[#1a1a1a] outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="font-sans-ui bg-[#c89a58] px-5 py-2 text-sm font-bold text-white">Filter</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        {posts.length ? (
          <div className="grid gap-0">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="border border-dashed border-black/[0.08] bg-[#f8f7f2] p-8 text-center">
            <h2 className="text-2xl font-bold">No articles found</h2>
            <p className="font-sans-ui mt-2 text-sm text-[#888]">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="font-sans-ui border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold">Previous</Link> : null}
          <span className="font-sans-ui bg-[#2d5a3d] px-4 py-2 text-sm font-bold text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="font-sans-ui border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="bg-white text-[#1a1a1a]">
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 border border-black/[0.06] bg-white p-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
          <div className="min-w-0">
            <Link href="/article" className="font-sans-ui inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">
              <ChevronLeft className="h-3 w-3" /> Articles
            </Link>
            <p className="font-sans-ui mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{voice.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className="min-w-0 bg-[#2d5a3d] p-5 text-white">
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Reading note</p>
            <p className="font-sans-ui mt-3 text-sm leading-7 text-white/65">{voice.secondaryNote}</p>
            <Link href="/contact" className="font-sans-ui mt-5 inline-flex items-center gap-1 bg-white px-4 py-2 text-xs font-bold text-[#2d5a3d]">
              Contact <ArrowRight className="h-3 w-3" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-20">
        <div className="border border-black/[0.06] bg-white p-5 sm:p-8">
          <p className="font-sans-ui text-sm leading-7 text-[#6b6b6b]">{post?.summary ? post.summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
