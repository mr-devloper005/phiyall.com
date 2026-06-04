import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-12 text-[var(--editable-page-text,#171336)] sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1fr] lg:items-center">
          <div className="rounded-[2.4rem] border border-[var(--editable-border)] bg-[linear-gradient(135deg,#6d3bd3_0%,#5a46d6_100%)] p-7 text-white shadow-[0_26px_80px_rgba(23,19,54,0.14)] sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/72">{pagesContent.auth.signup.badge}</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.auth.signup.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/78">{pagesContent.auth.signup.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-dark-bg)]">
                {pagesContent.auth.signup.loginCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_26px_80px_rgba(23,19,54,0.1)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{pagesContent.auth.signup.formTitle}</h2>
            <EditableLocalSignupForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
