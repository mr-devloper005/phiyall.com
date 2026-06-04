import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent reading platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Creative portfolio and discovery space',
    primaryLinks: [
      { label: 'Discover', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: 'Images', href: '/image-sharing' },
      { label: 'Profiles', href: '/profiles' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Sign up', href: '/signup' },
      secondary: { label: 'Log in', href: '/login' },
    },
  },
  footer: {
    tagline: 'Stories, visuals, and professional profiles',
    description: 'A polished discovery space for creative work, useful references, and professional pages that need a strong visual stage.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' },
          { label: 'Listings', href: '/listings' },
          { label: 'Images', href: '/image-sharing' },
          { label: 'Profiles', href: '/profiles' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Designed for smooth browsing on every screen.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
