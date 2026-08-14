import Link from 'next/link'
import { ArrowRight, FileText, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { HorizontalStoryCard, postHref } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || '')
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function formatDate(post: SitePost) {
  if (!post.publishedAt) return ''
  try { return new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '' }
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: FileText, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: FileText, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: FileText, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: FileText, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay text-light so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  const heroPost = posts[0]
  const secondaryPosts = posts.slice(1, 5)
  const gridPosts = posts.slice(5)

  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        {/* Hero banner */}
        <section className="border-b border-black/[0.06] bg-[#2d5a3d] text-white">
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{label}</p>
                <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{voice?.headline || `Browse ${label}`}</h1>
                <p className="font-sans-ui mt-4 max-w-xl text-sm leading-7 text-white/65">{voice?.description || SITE_CONFIG.description}</p>
                <div className="mt-5 flex gap-3">
                  <Link href={basePath} className="font-sans-ui bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">Browse all</Link>
                  <Link href="/search" className="font-sans-ui border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white">Search</Link>
                </div>
              </div>

              <form action={basePath} className="border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">Filter by category</p>
                <select name="category" defaultValue={category} className="font-sans-ui mt-3 h-10 w-full border border-white/15 bg-white px-3 text-sm font-semibold text-[#1a1a1a] outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="font-sans-ui mt-2 flex h-10 w-full items-center justify-center bg-[#c89a58] text-xs font-bold uppercase tracking-[0.1em] text-white">Apply</button>
                <p className="font-sans-ui mt-2 text-[11px] text-white/50">Showing: {categoryLabel}</p>
              </form>
            </div>
          </div>
        </section>

        {/* Featured + secondary */}
        <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          {heroPost ? (
            <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
              <Link href={postHref(task, heroPost, basePath)} className="group relative block overflow-hidden bg-[#1a1a1a]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={getImage(heroPost)} alt={heroPost.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="font-sans-ui inline-block bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">Featured</span>
                    <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">{heroPost.title}</h2>
                    <p className="font-sans-ui mt-2 max-w-xl text-sm leading-6 text-white/65">{getSummary(heroPost)}</p>
                  </div>
                </div>
              </Link>

              <div className="space-y-0">
                {secondaryPosts.map((post) => (
                  <HorizontalStoryCard key={post.id} post={post} href={postHref(task, post, basePath)} />
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {gridPosts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-black/[0.08] bg-[#f8f7f2] p-10 text-center">
              <Search className="mx-auto h-6 w-6 opacity-40" />
              <h2 className="mt-3 text-2xl font-bold">No posts found</h2>
              <p className="font-sans-ui mt-2 text-sm text-[#888]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="font-sans-ui border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold">Previous</Link> : null}
            <span className="font-sans-ui bg-[#2d5a3d] px-4 py-2 text-sm font-bold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="font-sans-ui border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden border border-black/[0.06] bg-white transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="font-sans-ui absolute left-3 top-3 bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{getCategory(post, 'Article')}</span>
      </div>
      <div className="p-4">
        <h2 className="line-clamp-2 text-lg font-bold leading-snug">{post.title}</h2>
        <p className="font-sans-ui mt-2 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">{getSummary(post)}</p>
        <p className="font-sans-ui mt-2 text-[11px] text-[#aaa]">{formatDate(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-4 border border-black/[0.06] bg-white p-5 transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:grid-cols-[100px_1fr]">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden bg-[#f8f7f2]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <FileText className="h-8 w-8 opacity-40" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="font-sans-ui bg-[#2d5a3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">Directory</span>
          {location ? <span className="font-sans-ui border border-black/[0.08] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]">{location}</span> : null}
        </div>
        <h2 className="mt-3 text-xl font-bold leading-snug">{post.title}</h2>
        <p className="font-sans-ui mt-2 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">{getSummary(post)}</p>
        <div className="font-sans-ui mt-3 grid gap-1 text-xs text-[#888] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group block overflow-hidden border border-black/[0.06] bg-white transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid min-h-56 sm:grid-cols-[0.65fr_1fr]">
        <div className="relative bg-[#2d5a3d] p-4 text-white">
          <span className="font-sans-ui text-[9px] font-bold uppercase tracking-[0.12em] text-white/60">Classified</span>
          <h2 className="mt-6 text-2xl font-bold leading-[1.1]">{price || 'Open offer'}</h2>
          <p className="font-sans-ui mt-3 text-sm text-white/65">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-3 right-3 h-16 w-16 object-cover opacity-70" /> : null}
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold leading-snug">{post.title}</h2>
          <p className="font-sans-ui mt-3 line-clamp-3 text-sm leading-6 text-[#6b6b6b]">{getSummary(post)}</p>
          <p className="font-sans-ui mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">View listing <ArrowRight className="h-3 w-3" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden border border-black/[0.06] bg-white transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <span className="font-sans-ui inline-block bg-[#e8f0eb] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">Visual</span>
        <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block border border-black/[0.06] bg-white p-5 transition hover:bg-[#2d5a3d] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans-ui border border-current/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">Save {String(index + 1).padStart(2, '0')}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
      <h2 className="mt-6 text-xl font-bold leading-snug">{post.title}</h2>
      <p className="font-sans-ui mt-3 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      {website ? <p className="font-sans-ui mt-4 truncate text-xs font-bold opacity-50">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group block border border-black/[0.06] bg-white p-5 transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="bg-[#2d5a3d] p-4 text-white"><FileText className="h-6 w-6" /></div>
        <span className="font-sans-ui bg-[#e8f0eb] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">{category}</span>
      </div>
      <h2 className="mt-5 text-xl font-bold leading-snug">{post.title}</h2>
      <p className="font-sans-ui mt-3 line-clamp-3 text-sm leading-6 text-[#6b6b6b]">{getSummary(post)}</p>
      <p className="font-sans-ui mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">Open document <ArrowRight className="h-3 w-3" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group block border border-black/[0.06] bg-white p-5 text-center transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#f8f7f2]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <FileText className="h-8 w-8 opacity-40" />}
      </div>
      <h2 className="mt-4 text-lg font-bold leading-snug">{post.title}</h2>
      {role ? <p className="font-sans-ui mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">{role}</p> : null}
      <p className="font-sans-ui mt-3 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">{getSummary(post)}</p>
    </Link>
  )
}
