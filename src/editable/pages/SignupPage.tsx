import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center bg-[#2d5a3d] p-8 text-white">
              <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{pagesContent.auth.signup.badge}</p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl">{pagesContent.auth.signup.title}</h1>
              <p className="font-sans-ui mt-4 max-w-md text-sm leading-7 text-white/65">{pagesContent.auth.signup.description}</p>
              <Link href="/login" className="font-sans-ui mt-6 inline-flex w-fit bg-white px-5 py-2.5 text-sm font-bold text-[#2d5a3d]">
                {pagesContent.auth.signup.loginCta}
              </Link>
            </div>
            <div className="border border-black/[0.06] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">{pagesContent.auth.signup.formTitle}</h2>
              <div className="mt-1 h-[2px] w-8 bg-[#c89a58]" />
              <div className="mt-5">
                <EditableLocalSignupForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
