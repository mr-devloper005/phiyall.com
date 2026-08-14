export function PageLoadingState({ label, className = '' }: { label?: string; className?: string }) {
  return (
    <div aria-busy="true" className={`mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
      {label ? <p className="font-sans-ui mb-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">{label}</p> : null}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse border border-black/[0.06] bg-white">
            <div className="aspect-[4/3] bg-[#e8e6df]" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-16 bg-[#e8e6df]" />
              <div className="h-5 w-3/4 bg-[#e8e6df]" />
              <div className="h-3 w-full bg-[#e8e6df]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, label, className = '' }: { count?: number; label?: string; className?: string }) {
  return (
    <div aria-busy="true" className={className}>
      {label ? <p className="font-sans-ui mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">{label}</p> : null}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse border border-black/[0.06] bg-white p-4">
            <div className="h-4 w-20 bg-[#e8e6df]" />
            <div className="mt-3 h-5 w-3/4 bg-[#e8e6df]" />
            <div className="mt-2 h-3 w-full bg-[#e8e6df]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetailLoadingState({ label, className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
      {label ? <p className="font-sans-ui mb-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">{label}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="animate-pulse border border-black/[0.06] bg-white p-6">
          <div className="h-4 w-24 bg-[#e8e6df]" />
          <div className="mt-4 h-8 w-3/4 bg-[#e8e6df]" />
          <div className="mt-6 aspect-[16/9] bg-[#e8e6df]" />
          <div className="mt-6 space-y-3">
            <div className="h-3 w-full bg-[#e8e6df]" />
            <div className="h-3 w-5/6 bg-[#e8e6df]" />
            <div className="h-3 w-4/5 bg-[#e8e6df]" />
          </div>
        </div>
        <div className="animate-pulse border border-black/[0.06] bg-[#f8f7f2] p-5">
          <div className="h-4 w-20 bg-[#e8e6df]" />
          <div className="mt-4 space-y-3">
            <div className="h-12 bg-[#e8e6df]" />
            <div className="h-12 bg-[#e8e6df]" />
          </div>
        </div>
      </div>
    </div>
  )
}
