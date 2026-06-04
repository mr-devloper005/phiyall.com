import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-12 text-[var(--editable-page-text,#171336)] sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <article className="rounded-[2.6rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_26px_80px_rgba(23,19,54,0.1)] sm:p-10 lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 opacity-70">{pagesContent.about.description}</p>
            <div className="mt-8 space-y-4 text-sm leading-8 opacity-75">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="grid gap-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className={`rounded-[2rem] border border-[var(--editable-border)] p-6 shadow-sm ${index === 0 ? 'bg-[linear-gradient(135deg,#6d3bd3_0%,#5a46d6_100%)] text-white' : 'bg-white'}`}>
                <h2 className="text-xl font-black tracking-[-0.04em]">{value.title}</h2>
                <p className={`mt-3 text-sm leading-7 ${index === 0 ? 'text-white/80' : 'opacity-70'}`}>{value.description}</p>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
