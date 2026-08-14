import Link from 'next/link'
import { Search, CheckCircle2 } from 'lucide-react'

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Content will appear once posts are published.',
  actionLabel,
  actionHref,
  className = '',
}: {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}) {
  return (
    <div className={`border border-dashed border-black/[0.08] bg-[#f8f7f2] p-10 text-center ${className}`}>
      <Search className="mx-auto h-6 w-6 text-[#888]" />
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="font-sans-ui mt-2 text-sm text-[#6b6b6b]">{description}</p>
      {actionLabel ? (
        <Link href={actionHref || '/'} className="font-sans-ui mt-4 inline-flex bg-[#2d5a3d] px-5 py-2.5 text-sm font-bold text-white">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}

export function TaskEmptyState({ taskLabel, className = '' }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      title={taskLabel ? `No ${taskLabel} available yet` : 'No posts yet'}
      description="New content will appear here once published. Check back soon."
      actionLabel="Browse home"
      actionHref="/"
      className={className}
    />
  )
}

export function ContactSuccessState({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-black/[0.06] bg-[#e8f0eb] p-8 text-center ${className}`}>
      <CheckCircle2 className="mx-auto h-8 w-8 text-[#2d5a3d]" />
      <h2 className="mt-4 text-xl font-bold text-[#2d5a3d]">Message received</h2>
      <p className="font-sans-ui mt-2 text-sm text-[#6b6b6b]">We&apos;ll get back to you as soon as possible.</p>
    </div>
  )
}
