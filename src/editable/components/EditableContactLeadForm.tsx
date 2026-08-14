'use client'

import { useState } from 'react'

function Field({ label, name, type = 'text', required = false, rows }: { label: string; name: string; type?: string; required?: boolean; rows?: number }) {
  const base = 'font-sans-ui h-10 w-full border border-black/[0.1] bg-white px-3 text-sm outline-none transition focus:border-[#2d5a3d] placeholder:text-[#aaa]'
  return (
    <div>
      <label className="font-sans-ui block text-xs font-semibold text-[#1a1a1a]">{label}</label>
      {rows ? (
        <textarea name={name} required={required} rows={rows} className={`${base} mt-1 h-auto py-2`} />
      ) : (
        <input name={name} type={type} required={required} className={`${base} mt-1`} />
      )}
    </div>
  )
}

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-black/[0.06] bg-[#e8f0eb] p-6 text-center">
        <p className="text-lg font-bold text-[#2d5a3d]">Message sent</p>
        <p className="font-sans-ui mt-1 text-sm text-[#6b6b6b]">We&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="hidden"><input name="company" tabIndex={-1} autoComplete="off" /></div>
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />
      <Field label="Subject" name="subject" required />
      <Field label="Message" name="message" required rows={4} />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="font-sans-ui mt-2 flex h-10 w-full items-center justify-center bg-[#2d5a3d] text-sm font-bold text-white transition hover:bg-[#234a31] disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>
      {status === 'error' ? <p className="font-sans-ui text-sm text-red-600">Something went wrong. Please try again.</p> : null}
    </form>
  )
}
