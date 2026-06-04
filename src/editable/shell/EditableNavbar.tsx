'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = { '--editable-nav-bg': 'rgba(243, 241, 255, 0.84)', '--editable-nav-text': 'var(--slot4-page-text)', '--editable-nav-active': 'var(--slot4-dark-bg)', '--editable-nav-active-text': '#ffffff', '--editable-cta-bg': 'var(--slot4-accent-fill)', '--editable-cta-text': '#ffffff', '--editable-search-bg': 'rgba(255,255,255,0.88)', '--editable-border': 'rgba(23, 19, 54, 0.12)', '--editable-container': '1040px' } as CSSProperties
  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      ...SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  const menuLinks = session
    ? [...navItems.filter((item) => item.label !== 'Profile'), { label: 'Create', href: '/create' }]
    : [...navItems.filter((item) => item.label !== 'Profile'), { label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <nav className="mx-auto grid min-h-[74px] w-full max-w-[var(--editable-container)] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white/70 shadow-sm transition hover:-translate-y-0.5" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="justify-self-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/80 px-4 py-2 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-dark-bg)]">
              <img src="/favicon.png" alt={`${SITE_CONFIG.name} logo`} className="h-6 w-6 object-contain" />
            </span>
            <span className="text-sm font-black tracking-[-0.03em]">{SITE_CONFIG.name}</span>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] opacity-55 sm:inline">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 justify-self-end">
          {session ? (
            <>
              <Link href="/create" className="hidden rounded-full border border-[var(--editable-border)] bg-white/80 px-4 py-2 text-sm font-black shadow-sm sm:inline-flex">Create</Link>
              <button type="button" onClick={logout} className="hidden rounded-full border border-[var(--editable-border)] bg-white/80 px-4 py-2 text-sm font-black shadow-sm sm:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signup" className="hidden rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-sm font-black text-[var(--editable-cta-text)] shadow-sm sm:inline-flex">Sign up</Link>
              <Link href="/login" className="hidden rounded-full border border-[var(--editable-border)] bg-white/80 px-4 py-2 text-sm font-black shadow-sm sm:inline-flex">Log in</Link>
            </>
          )}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[rgba(249,248,255,0.96)] px-4 py-4 backdrop-blur-xl">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {menuLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[1.2rem] border px-4 py-3 text-sm font-black transition ${
                    active ? 'border-transparent bg-[var(--slot4-dark-bg)] text-white' : 'border-[var(--editable-border)] bg-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
