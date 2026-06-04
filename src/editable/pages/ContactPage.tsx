'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f4f3ff] text-[#171336]',
      panel: 'border border-[var(--editable-border)] bg-white',
      soft: 'border border-[var(--editable-border)] bg-[var(--slot4-gray)]',
      muted: 'text-[var(--slot4-soft-muted-text)]',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[#f4f3ff] text-[#171336]',
      panel: 'border border-[var(--editable-border)] bg-white',
      soft: 'border border-[var(--editable-border)] bg-[var(--slot4-gray)]',
      muted: 'text-[var(--slot4-soft-muted-text)]',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[#f4f3ff] text-[#171336]',
      panel: 'border border-[var(--editable-border)] bg-white',
      soft: 'border border-[var(--editable-border)] bg-[var(--slot4-gray)]',
      muted: 'text-[var(--slot4-soft-muted-text)]',
    }
  }
  return {
    shell: 'bg-[#f4f3ff] text-[#171336]',
    panel: 'border border-[var(--editable-border)] bg-white',
    soft: 'border border-[var(--editable-border)] bg-[var(--slot4-gray)]',
    muted: 'text-[var(--slot4-soft-muted-text)]',
  }
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const tone = getTone(productKind)

  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and launch quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through publishing, growth, and launch questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape it.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships and collaborations.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights and commercial requests.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects and reference pages.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves or connected boards?' },
            ]

  return (
    <EditableSiteShell className={tone.shell}>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl">{pagesContent.contact.title}</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${tone.muted}`}>{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.7rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5" />
                  <h2 className="mt-3 text-xl font-black">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2.4rem] p-6 shadow-[0_26px_80px_rgba(23,19,54,0.1)] ${tone.panel}`}>
            <h2 className="text-2xl font-black tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
