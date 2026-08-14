import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const summaryText = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || '')
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

function formatDate(post: SitePost) {
  if (!post.publishedAt) return ''
  try { return new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '' }
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="font-sans-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d] transition hover:text-[#1a1a1a]">
      <ArrowLeft className="h-3 w-3" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-12">
      <article className="min-w-0 border border-black/[0.06] bg-white">
        <div className="p-5 sm:p-8">
          <BackLink task="article" />
          <p className="font-sans-ui mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{categoryOf(post, 'Article')}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{post.title}</h1>
          <div className="font-sans-ui mt-4 flex flex-wrap gap-3 text-xs text-[#888]">
            {post.publishedAt ? <span>Published {formatDate(post)}</span> : null}
            <span>{post.tags?.[0] || 'Featured read'}</span>
          </div>
        </div>

        {images[0] ? (
          <div className="px-5 pb-4 sm:px-8">
            <img src={images[0]} alt="" className="max-h-[520px] w-full object-cover" />
          </div>
        ) : null}

        <div className="px-5 pb-6 sm:px-8">
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </div>
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <BackLink task="listing" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="border border-black/[0.06] bg-white p-5 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden bg-[#f8f7f2]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 opacity-40" />}
            </div>
            <div>
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">Business listing</p>
              <h1 className="mt-2 text-3xl font-bold leading-[1.1] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-12">
      <aside className="bg-[#2d5a3d] p-6 text-white lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="font-sans-ui mt-8 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Classified notice</p>
        <h1 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl">{post.title}</h1>
        <div className="mt-6 grid gap-2">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {phone ? <a href={`tel:${phone}`} className="font-sans-ui bg-white px-4 py-2 text-xs font-bold text-[#2d5a3d]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="font-sans-ui border border-white/25 px-4 py-2 text-xs font-bold text-white">Email</a> : null}
        </div>
      </aside>
      <article className="border border-black/[0.06] bg-white p-5 sm:p-8">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <BackLink task="image" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="columns-1 gap-4 space-y-4 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden border border-black/[0.06] bg-white">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <aside className="border border-black/[0.06] bg-white p-6 lg:sticky lg:top-24 lg:self-start">
          <span className="font-sans-ui inline-flex items-center gap-1 bg-[#2d5a3d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"><Camera className="h-3 w-3" /> Image story</span>
          <h1 className="mt-5 text-3xl font-bold leading-[1.1]">{post.title}</h1>
          <div className="mt-1 h-[2px] w-10 bg-[#c89a58]" />
          <BodyContent post={post} compact />
        </aside>
      </div>
      <div className="mt-8"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-12">
      <article className="border border-black/[0.06] bg-white p-6 sm:p-8">
        <BackLink task="sbm" />
        <div className="mt-8 flex h-16 w-16 items-center justify-center bg-[#2d5a3d] text-white"><Bookmark className="h-7 w-7" /></div>
        <h1 className="mt-5 text-3xl font-bold leading-[1.1] sm:text-4xl">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="font-sans-ui mt-6 inline-flex items-center gap-2 bg-[#2d5a3d] px-4 py-2 text-sm font-bold text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-12">
      <article className="border border-black/[0.06] bg-white p-5 sm:p-8">
        <BackLink task="pdf" />
        <div className="mt-6 grid gap-5 sm:grid-cols-[100px_1fr]">
          <div className="flex h-24 w-24 items-center justify-center bg-[#2d5a3d] text-white"><FileText className="h-10 w-10" /></div>
          <div>
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">PDF resource</p>
            <h1 className="mt-2 text-3xl font-bold leading-[1.1] sm:text-4xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-6 overflow-hidden border border-black/[0.06]">
            <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] bg-[#f8f7f2] p-4">
              <span className="font-sans-ui text-sm font-bold">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="font-sans-ui inline-flex items-center gap-2 bg-[#2d5a3d] px-3 py-1.5 text-xs font-bold text-white">Download <Download className="h-3 w-3" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8 lg:py-12">
      <aside className="border border-black/[0.06] bg-white p-6 text-center lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#f8f7f2]">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-12 w-12 opacity-40" />}
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-[1.1]">{post.title}</h1>
        {role ? <p className="font-sans-ui mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="border border-black/[0.06] bg-white p-6 sm:p-8">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-6 max-w-none font-sans-ui ${compact ? 'text-sm leading-7' : 'text-base leading-8'} text-[#4a4a4a]`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="border border-black/[0.06] bg-[#f8f7f2] p-4">
          <div className="font-sans-ui flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]"><Icon className="h-3 w-3" /> {label}</div>
          <p className="font-sans-ui mt-1 break-words text-sm font-semibold text-[#1a1a1a]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-6">
      <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{label}</p>
      <div className={`mt-3 grid gap-2 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden border border-black/[0.06] bg-white">
      <div className="font-sans-ui flex items-center gap-2 p-3 text-sm font-bold"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 border border-black/[0.06] bg-[#f8f7f2] p-4">
      <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">Quick actions</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="font-sans-ui inline-flex items-center gap-2 bg-[#2d5a3d] px-3 py-2 text-xs font-bold text-white">Website <ExternalLink className="h-3 w-3" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="font-sans-ui inline-flex items-center gap-2 border border-black/[0.08] bg-white px-3 py-2 text-xs font-bold"><Phone className="h-3 w-3" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="font-sans-ui inline-flex items-center gap-2 border border-black/[0.08] bg-white px-3 py-2 text-xs font-bold"><Mail className="h-3 w-3" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="font-sans-ui flex items-center justify-between gap-3 border border-white/15 bg-white/10 px-3 py-2 text-sm"><span className="font-bold uppercase tracking-[0.1em] text-white/55">{label}</span><span className="font-bold">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="mx-auto w-full max-w-3xl min-w-0 space-y-5">
      {!compact ? (
        <div className="border border-black/[0.06] bg-[#f8f7f2] p-5">
          <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">About this post</p>
          <div className="font-sans-ui mt-3 grid gap-2 text-sm text-[#6b6b6b]">
            <p className="inline-flex items-center gap-2"><Tag className="h-3 w-3" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {formatDate(post)}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="border border-black/[0.06] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#2d5a3d]">View all</Link>
          </div>
          <div className="mt-4 grid gap-2">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 border-b border-black/[0.06] py-3 transition hover:bg-gray-50/50">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-14 w-14 shrink-0 object-cover sm:h-16 sm:w-16" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#f8f7f2] sm:h-16 sm:w-16"><FileText className="h-5 w-5 opacity-40" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{post.title}</h3>
        <p className="font-sans-ui mt-1 line-clamp-1 text-xs text-[#888]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-8 border border-black/[0.06] bg-[#f8f7f2] p-5">
      <div className="flex items-center gap-2 text-lg font-bold"><MessageCircle className="h-4 w-4" /> Comments</div>
      <div className="mt-4 grid gap-2">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="border border-black/[0.06] bg-white p-4">
            <p className="font-sans-ui text-sm font-bold">{comment.name}</p>
            <p className="font-sans-ui mt-1 text-sm leading-6 text-[#6b6b6b]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="font-sans-ui text-sm text-[#888]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
