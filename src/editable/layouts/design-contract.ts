import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--editable-container': '1040px',
  '--slot4-page-bg': '#f1f0fb',
  '--slot4-page-text': '#171336',
  '--slot4-panel-bg': '#f7f6ff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#514f72',
  '--slot4-soft-muted-text': '#6e6a8d',
  '--slot4-accent': '#6d3bd3',
  '--slot4-accent-fill': '#6d3bd3',
  '--slot4-accent-soft': '#f3c6e5',
  '--slot4-dark-bg': '#171336',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#d8d6ea',
  '--slot4-cream': '#f8f6ff',
  '--slot4-warm': '#f1f0fb',
  '--slot4-lavender': '#dcd4fb',
  '--slot4-gray': '#f6f7fb',
  '--slot4-body-gradient': 'radial-gradient(circle at top left, rgba(208, 91, 174, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(84, 120, 245, 0.22), transparent 28%), linear-gradient(180deg, #ece8ff 0%, #f6f4ff 34%, #eef0ff 64%, #f7f8fc 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/[0.08]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_18px_50px_rgba(23,19,54,0.08)]',
  shadowStrong: 'shadow-[0_26px_80px_rgba(23,19,54,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(13,11,31,0.02),rgba(13,11,31,0.62))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1040px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[160px] shrink-0 snap-start sm:w-[178px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.26em]',
    heroTitle: 'text-4xl font-black leading-[0.96] tracking-[-0.07em] sm:text-5xl lg:text-[4.4rem]',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.75rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full ${editablePalette.darkBg} px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-6 py-3 text-sm font-black ${editablePalette.surfaceText} transition hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.6rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(23,19,54,0.16)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like the MysteryCoder reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
