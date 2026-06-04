'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': 'linear-gradient(180deg, rgba(243,241,255,0.96) 0%, rgba(236,238,252,0.96) 100%)', '--editable-footer-text': 'var(--slot4-page-text)' } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const siteLinks: Array<[string, string]> = session
    ? [['About', '/about'], ['Contact', '/contact'], ['Create', '/create']]
    : [['About', '/about'], ['Contact', '/contact'], ['Login', '/login'], ['Sign up', '/signup']]

  return (
    <footer style={footerVars} className="relative overflow-hidden border-t border-[rgba(23,19,54,0.08)] text-[var(--editable-footer-text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,59,211,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,92,169,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.45),rgba(255,255,255,0))]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.5rem] border border-[rgba(23,19,54,0.10)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(23,19,54,0.06)] backdrop-blur-md lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:p-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-page-bg)] text-[var(--slot4-dark-bg)] shadow-sm">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              </span>
              <span>
                <span className="block text-lg font-black tracking-[-0.04em]">{SITE_CONFIG.name}</span>
                <span className="block text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">{globalContent.footer?.tagline || SITE_CONFIG.tagline}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5">
                Sign up
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,19,54,0.14)] bg-white px-4 py-2 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-page-bg)]">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">Explore</h3>
            <div className="mt-4 grid gap-2">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center justify-between gap-3 rounded-2xl border border-[rgba(23,19,54,0.10)] bg-white px-4 py-3 text-sm font-bold text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-bg)]">
                  <span>{task.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">Stay in touch</h3>
            <div className="mt-4 grid gap-2">
              {siteLinks.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-2xl border border-[rgba(23,19,54,0.10)] bg-white px-4 py-3 text-sm font-bold text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-bg)]">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="rounded-2xl border border-[rgba(23,19,54,0.10)] bg-white px-4 py-3 text-left text-sm font-bold text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-bg)]">
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[rgba(23,19,54,0.08)] px-1 pt-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {SITE_CONFIG.name}</span>
        </div>
      </div>
    </footer>
  )
}
