import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16 lg:pt-20`}>
        <div className="overflow-hidden rounded-[2.6rem] border border-[var(--editable-border)] bg-[linear-gradient(135deg,#6d3bd3_0%,#5a46d6_42%,#d95ca9_100%)] p-7 text-white shadow-[0_26px_80px_rgba(23,19,54,0.18)] sm:p-10 lg:p-14">
          <p className={`${dc.type.eyebrow} text-white/70`}>{voice.eyebrow}</p>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-5xl`}>{voice.headline}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">{voice.description}</p>
          <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-black text-white">Filter</button>
          </form>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-8 text-center`}>
            <h2 className="text-3xl font-black tracking-[-0.05em]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.softMutedText}`}>Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className="grid gap-6 rounded-[2.6rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_80px_rgba(23,19,54,0.1)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-black">
              <ChevronLeft className="h-4 w-4" /> Articles
            </Link>
            <p className={`${dc.type.eyebrow} mt-8 text-[var(--slot4-accent)]`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.07em] sm:text-5xl lg:text-7xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className="min-w-0 rounded-[2rem] bg-[var(--slot4-dark-bg)] p-6 text-white">
            <p className={`${dc.type.eyebrow} text-white/65`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/72">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-dark-bg)]">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-[2.25rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_80px_rgba(23,19,54,0.1)] sm:p-8 lg:p-10">
          <p className={`text-sm leading-8 ${pal.softMutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
