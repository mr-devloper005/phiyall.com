'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'font-sans-ui h-10 w-full border border-black/[0.1] bg-white px-3 text-sm outline-none transition focus:border-[#2d5a3d] placeholder:text-[#aaa]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-white text-[#1a1a1a]">
          <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-8 border border-black/[0.06] bg-white p-6 md:grid-cols-2 md:p-10">
              <div className="flex min-h-56 items-center justify-center bg-[#2d5a3d] text-white">
                <Lock className="h-16 w-16 opacity-70" />
              </div>
              <div className="self-center">
                <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{pagesContent.create.locked.badge}</p>
                <h1 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl">{pagesContent.create.locked.title}</h1>
                <p className="font-sans-ui mt-4 max-w-md text-sm leading-7 text-[#6b6b6b]">{pagesContent.create.locked.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/login" className="font-sans-ui inline-flex items-center gap-2 bg-[#2d5a3d] px-5 py-2.5 text-sm font-bold text-white">Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="font-sans-ui inline-flex items-center gap-2 border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-bold">Sign up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 border border-black/[0.06] bg-white p-5 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
            <aside>
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl">{pagesContent.create.hero.title}</h1>
              <p className="font-sans-ui mt-4 max-w-md text-sm leading-7 text-[#6b6b6b]">{pagesContent.create.hero.description}</p>
            </aside>

            <form onSubmit={submit} className="border border-black/[0.06] bg-[#f8f7f2] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-2xl font-bold">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="font-sans-ui bg-white px-3 py-1.5 text-xs font-bold text-[#1a1a1a]">{session.name}</span>
              </div>

              <div className="mt-5 grid gap-3">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-20 py-2`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-40 py-2`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-4 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="font-sans-ui flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}</p>
                  <p className="font-sans-ui mt-1 text-sm opacity-75">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="font-sans-ui mt-4 flex h-10 w-full items-center justify-center gap-2 bg-[#2d5a3d] text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#234a31]">
                <Send className="h-3 w-3" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
