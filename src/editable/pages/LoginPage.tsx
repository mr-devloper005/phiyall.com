import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-12 text-[var(--editable-page-text,#171336)] sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 opacity-70">{pagesContent.auth.login.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">
                {pagesContent.auth.login.createCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_80px_rgba(23,19,54,0.1)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
