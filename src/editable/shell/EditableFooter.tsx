'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const siteLinks: Array<[string, string]> = session
    ? [['About', '/about'], ['Contact', '/contact'], ['Create', '/create']]
    : [['About', '/about'], ['Contact', '/contact'], ['Login', '/login'], ['Sign up', '/signup']]

  return (
    <footer className="border-t border-black/[0.08] bg-[#2d5a3d] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="font-sans-ui mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{globalContent.footer?.tagline || SITE_CONFIG.tagline}</p>
            <p className="font-sans-ui mt-4 max-w-sm text-sm leading-7 text-white/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Explore</h3>
            <div className="mt-4 grid gap-1">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="font-sans-ui py-1.5 text-sm font-medium text-white/80 transition hover:text-white">
                  {task.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Site</h3>
            <div className="mt-4 grid gap-1">
              {siteLinks.map(([label, href]) => (
                <Link key={href} href={href} className="font-sans-ui py-1.5 text-sm font-medium text-white/80 transition hover:text-white">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="font-sans-ui py-1.5 text-left text-sm font-medium text-white/80 transition hover:text-white">
                  Logout
                </button>
              ) : null}
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-lg font-bold">Subscribe to Updates</h3>
            <p className="font-sans-ui mt-2 text-sm leading-6 text-white/60">Get practical reading picks, visual features, and new discoveries.</p>
            <div className="mt-4">
              <Link href="/signup" className="font-sans-ui inline-flex bg-[#c89a58] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#b8894d]">
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        <div className="font-sans-ui mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>{globalContent.footer?.bottomNote}</span>
        </div>
      </div>
    </footer>
  )
}
