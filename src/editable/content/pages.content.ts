import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Creative portfolio discovery',
      description: 'Browse a polished home for articles, images, profiles, and useful curated pages.',
      openGraphTitle: 'Creative portfolio discovery',
      openGraphDescription: 'Browse stories, visuals, and professional profiles through a bold editorial layout.',
      keywords: ['portfolio site', 'creative directory', 'image gallery', 'profile discovery'],
    },
    hero: {
      badge: 'Featured work and fresh profiles',
      title: ['Make your presence', 'feel bigger in minutes.'],
      description: 'Discover polished stories, image-led posts, and professional pages in a striking layout that keeps browsing easy.',
      primaryCta: { label: 'Browse highlights', href: '/article' },
      secondaryCta: { label: 'Explore images', href: '/image' },
      searchPlaceholder: 'Search by name, topic, skill, or category',
      focusLabel: 'Focus',
      featureCardBadge: 'curated spotlight',
      featureCardTitle: 'A homepage that feels more like a launch screen than a feed.',
      featureCardDescription: 'Strong visuals, clean type, and flexible sections keep the experience polished on every device.',
    },
    intro: {
      badge: 'About this space',
      title: 'Built for browsing creative work with a clear visual rhythm.',
      paragraphs: [
        'This site combines stories, image-led posts, profiles, and practical resources so visitors can move between sections without losing momentum.',
        'The layout keeps strong imagery, clear labels, and readable spacing in focus so the browsing experience stays elegant and fast.',
        'Whether someone arrives for inspiration, a portfolio, or a professional profile, the next useful page is always close by.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Magazine-style homepage with bold hero treatment and layered visual cards.',
        'Archives and details keep the same visual language across every route.',
        'Multiple post card styles create rhythm instead of repeating one layout.',
        'Responsive spacing keeps the site polished on phones and large screens.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Move through stories, visuals, and profiles in one connected flow.',
      description: 'Everything is arranged to feel premium, calm, and easy to scan without losing the energy of the reference layout.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A clearer way to present work and ideas.',
    description: `${slot4BrandConfig.siteName} is designed to give creative work, profiles, and useful content a refined and memorable presentation.`,
    paragraphs: [
      'Instead of splitting everything into disconnected pages, the platform keeps related content easy to move through and easy to understand.',
      'Whether someone starts with an article, listing, image post, or resource page, they can continue exploring without losing context.',
    ],
    values: [
      {
        title: 'Reading-first experience',
        description: 'We prioritize clarity, pacing, and structure so people can read, browse, and discover without noise.',
      },
      {
        title: 'Connected content surfaces',
        description: 'Articles, visual posts, listings, resources, and profiles stay connected so discovery feels natural across the site.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'We focus on clean navigation and clear page structure to help visitors find useful content faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A contact page with a sharper first impression.',
    description: 'Tell us what you want to publish, adjust, or launch. We’ll keep the process simple and route the message to the right place.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, visuals, profiles, and resources faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your workspace.',
      description: 'Log in to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
