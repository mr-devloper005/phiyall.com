import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--editable-container': '1200px',
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#1a1a1a',
  '--slot4-panel-bg': '#f8f7f2',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6b6b6b',
  '--slot4-soft-muted-text': '#888888',
  '--slot4-accent': '#2d5a3d',
  '--slot4-accent-fill': '#2d5a3d',
  '--slot4-accent-soft': '#e8f0eb',
  '--slot4-dark-bg': '#2d5a3d',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#e8e6df',
  '--slot4-cream': '#f8f7f2',
  '--slot4-warm': '#f5f4ef',
  '--slot4-lavender': '#e8f0eb',
  '--slot4-gray': '#f2f2f0',
  '--slot4-body-gradient': 'none',
  '--editable-border': 'rgba(0,0,0,0.08)',
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
  shadow: 'shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
  shadowStrong: 'shadow-[0_4px_24px_rgba(0,0,0,0.10)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.55))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-10 sm:py-12 lg:py-16',
  },
  layout: {
    safeGrid: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[160px] shrink-0 snap-start sm:w-[178px]',
  },
  type: {
    eyebrow: 'text-[10px] font-bold uppercase tracking-[0.14em]',
    heroTitle: 'text-3xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl',
    sectionTitle: 'text-2xl font-bold tracking-[-0.02em] sm:text-3xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: `inline-flex items-center justify-center bg-[#2d5a3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#234a31]`,
    secondary: `inline-flex items-center justify-center border ${editablePalette.border} ${editablePalette.surfaceBg} px-5 py-2.5 text-sm font-semibold ${editablePalette.surfaceText} transition hover:bg-gray-50`,
    accent: `inline-flex items-center justify-center bg-[#2d5a3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#234a31]`,
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]',
    fade: 'transition duration-200 hover:opacity-80',
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
