import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#2d5a3d]">{pagesContent.auth.login.badge}</p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl">{pagesContent.auth.login.title}</h1>
              <p className="font-sans-ui mt-4 max-w-md text-sm leading-7 text-[#6b6b6b]">{pagesContent.auth.login.description}</p>
              <Link href="/signup" className="font-sans-ui mt-6 inline-flex w-fit bg-[#2d5a3d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#234a31]">
                {pagesContent.auth.login.createCta}
              </Link>
            </div>
            <div className="border border-black/[0.06] bg-[#f8f7f2] p-6 sm:p-8">
              <h2 className="text-xl font-bold">{pagesContent.auth.login.formTitle}</h2>
              <div className="mt-1 h-[2px] w-8 bg-[#c89a58]" />
              <div className="mt-5">
                <EditableLocalLoginForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
