import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export default function AboutPage() {
  const { badge, title, description, paragraphs, values } = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#1a1a1a]">
        <section className="border-b border-black/[0.06] bg-[#2d5a3d] text-white">
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <p className="font-sans-ui text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">{badge}</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="font-sans-ui mt-4 max-w-xl text-sm leading-7 text-white/65">{description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <article>
              {paragraphs.map((p, i) => (
                <p key={i} className="font-sans-ui mt-4 text-base leading-8 text-[#4a4a4a] first:mt-0">{p}</p>
              ))}
            </article>
            <aside className="space-y-4">
              {values.map((v, i) => (
                <div key={i} className={`border p-5 ${i === 0 ? 'border-[#2d5a3d] bg-[#2d5a3d] text-white' : 'border-black/[0.06] bg-[#f8f7f2]'}`}>
                  <h3 className="text-lg font-bold">{v.title}</h3>
                  <p className={`font-sans-ui mt-2 text-sm leading-6 ${i === 0 ? 'text-white/70' : 'text-[#6b6b6b]'}`}>{v.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
