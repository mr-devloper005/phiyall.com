'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const topLinks = globalContent.nav.topLinks || []

  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      ...SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile').map((task) => ({ label: task.label, href: task.route })),
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  const menuLinks = session
    ? [...navItems, { label: 'Create', href: '/create' }]
    : [...navItems, { label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#2d5a3d] text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-6 px-4 py-2 sm:px-6">
          {topLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href} className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-black/[0.08] bg-white">
        <div className="mx-auto grid min-h-[72px] max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/[0.08] text-[#1a1a1a] transition hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="justify-self-center">
            <span className="flex items-center gap-3">
              <img src="/favicon.png" alt={`${SITE_CONFIG.name} logo`} className="h-9 w-9 object-contain" />
              <span className="flex flex-col items-start">
                <span className="text-2xl font-bold tracking-[-0.02em] text-[#1a1a1a] sm:text-3xl">{SITE_CONFIG.name}</span>
                <span className="font-sans-ui text-[9px] font-semibold uppercase tracking-[0.28em] text-[#888]">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 justify-self-end">
            <Link href="/search" className="inline-flex h-10 w-10 items-center justify-center border border-black/[0.08] transition hover:bg-gray-50">
              <Search className="h-4 w-4" />
            </Link>
            {session ? (
              <button type="button" onClick={logout} className="font-sans-ui hidden border border-[#2d5a3d] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2d5a3d] transition hover:bg-[#2d5a3d] hover:text-white sm:inline-flex">
                Logout
              </button>
            ) : (
              <Link href="/signup" className="font-sans-ui hidden border border-[#2d5a3d] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2d5a3d] transition hover:bg-[#2d5a3d] hover:text-white sm:inline-flex">
                Subscribe
              </Link>
            )}
          </div>
        </div>

        {/* Center tab nav */}
        <div className="mx-auto flex max-w-[1200px] items-center justify-center px-4 sm:px-6">
          <div className="flex items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-sans-ui px-4 py-3 text-sm font-semibold transition ${
                    active ? 'border-b-[3px] border-[#c89a58] text-[#1a1a1a]' : 'border-b-[3px] border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open ? (
        <div className="border-b border-black/[0.08] bg-white px-4 py-4">
          <div className="mx-auto grid max-w-[1200px] gap-1">
            {menuLinks.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`font-sans-ui px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-[#2d5a3d] text-white' : 'text-[#1a1a1a] hover:bg-gray-50'
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
