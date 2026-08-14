import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent reading platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Independent Reading Platform',
    topLinks: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Write For Us', href: '/create' },
      { label: 'Guest Post', href: '/create' },
      { label: 'About Us', href: '/about' },
      { label: 'Search', href: '/search' },
      { label: 'Join Us', href: '/signup' },
    ],
    primaryLinks: [
      { label: 'Discover', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: 'Images', href: '/image-sharing' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Subscribe', href: '/signup' },
      secondary: { label: 'Log in', href: '/login' },
    },
  },
  footer: {
    tagline: 'Independent Reading Platform',
    description: 'A curated space for stories, visual features, and quality content. Discover articles and images across multiple categories.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' },
          { label: 'Listings', href: '/listings' },
          { label: 'Images', href: '/image-sharing' },
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
    bottomNote: 'Quality content, curated with care.',
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
