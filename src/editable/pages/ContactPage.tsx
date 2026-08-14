'use client'

import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { pagesContent } from '@/editable/content/pages.content'
import { getProductKind } from '@/design/factory/get-product-kind'
import { getFactoryState } from '@/design/factory/get-factory-state'

const lanes = {
  directory: [
    { title: 'Listing inquiries', desc: 'Questions about submitting or updating a business listing.' },
    { title: 'Partnership requests', desc: 'Collaboration opportunities and featured placements.' },
    { title: 'Technical support', desc: 'Report issues or request help with site features.' },
  ],
  editorial: [
    { title: 'Guest contributions', desc: 'Pitch an article or editorial piece for publication.' },
    { title: 'Content corrections', desc: 'Report factual errors or suggest improvements.' },
    { title: 'Advertising', desc: 'Sponsored content and display advertising options.' },
  ],
  visual: [
    { title: 'Image submissions', desc: 'Share your visual work for consideration in our gallery.' },
    { title: 'Portfolio features', desc: 'Apply for a featured portfolio spotlight.' },
    { title: 'Technical issues', desc: 'Report problems with image display or uploads.' },
  ],
  default: [
    { title: 'General inquiries', desc: 'Ask questions about our platform and services.' },
    { title: 'Content submissions', desc: 'Submit content for review and publication.' },
    { title: 'Feedback', desc: 'Share your thoughts on how we can improve.' },
  ],
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const contextLanes = lanes[productKind as keyof typeof lanes] || lanes.default

  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        <section className="border-b border-black/[0.06] bg-[#2d5a3d] text-white">
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-3xl font-bold leading-[1.1] sm:text-4xl">{pagesContent.contact.title}</h1>
            <p className="font-sans-ui mt-4 max-w-lg text-sm leading-7 text-white/65">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="grid gap-4 sm:grid-cols-3">
                {contextLanes.map((lane, i) => (
                  <div key={i} className="border border-black/[0.06] bg-[#f8f7f2] p-5">
                    <h3 className="text-base font-bold">{lane.title}</h3>
                    <p className="font-sans-ui mt-2 text-sm leading-6 text-[#6b6b6b]">{lane.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-black/[0.06] bg-white p-6">
              <h2 className="text-xl font-bold">{pagesContent.contact.formTitle}</h2>
              <div className="mt-1 h-[2px] w-8 bg-[#c89a58]" />
              <div className="mt-5">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
