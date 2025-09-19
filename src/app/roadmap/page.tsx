import { RoadmapBoard } from '@/components/roadmap-board'

const defaultColumns = [
  {
    id: 'new',
    title: 'New',
    items: [
      { id: 'support-txt-docx', title: 'Support for TXT & DOCX translations' },
      { id: 'dark-mode-ui', title: 'Dark mode UI', date: 'Nov 2025' },
    ],
  },
  { id: 'blocked', title: 'Blocked by API limitation', items: [] },
  {
    id: 'exploring',
    title: 'Exploring',
    items: [
      {
        id: 'ai-voiceover-ebooks',
        title: 'AI voiceover for translated eBooks (turn into audiobooks)',
      },
      { id: 'mobile-apps', title: 'Mobile app (iOS & Android)' },
      {
        id: 'drive-dropbox',
        title: 'Integration with Google Drive & Dropbox',
      },
    ],
  },
  {
    id: 'on-hold',
    title: 'On hold for now',
    items: [
      { id: 'offline-desktop', title: 'Offline desktop version (Windows/Mac)', date: 'On hold since Oct 2025' },
      { id: 'wordpress-plugin', title: 'WordPress plugin' },
    ],
  },
  {
    id: 'planned',
    title: 'Planned',
    items: [
      {
        id: 'bulk-file-uploads',
        title: 'Bulk file uploads (multiple docs at once)',
        date: 'Planned Q1 2026',
      },
      { id: 'team-accounts-credits', title: 'Team accounts & shared credits', date: 'Planned Q2 2026' },
      { id: 'yearly-subscription', title: 'Yearly subscription option', date: 'Dec 2025' },
      {
        id: 'translation-progress-tracker',
        title: 'Translation progress tracker (word/page counter)',
        date: 'Planned Q1 2026',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      {
        id: 'pdf-translation-engine',
        title: 'PDF translation engine (preserve original layout)',
        date: 'In progress — ETA Nov 2025',
      },
      {
        id: 'dashboard-usage-billing',
        title: 'Dashboard with word usage & billing history',
        date: 'In progress — ETA Dec 2025',
      },
      { id: 'stripe-integration', title: 'Stripe integration for payments', date: 'In progress' },
    ],
  },
  {
    id: 'beta',
    title: 'Beta',
    items: [
      {
        id: 'api-access',
        title: 'API Access (developers can integrate Fliplingo into their apps)',
        date: 'Beta — Jan 2026',
      },
      {
        id: 'custom-dictionaries',
        title: 'Custom dictionaries & glossary support (better terminology consistency)',
        date: 'Beta — Jan 2026',
      },
    ],
  },
  {
    id: 'released',
    title: 'Released',
    items: [
      { id: 'website-live', title: 'Full website live 🎉', date: 'Sep 2025' },
      {
        id: 'epub-translation',
        title: 'EPUB translation (maintains structure & formatting)',
        date: 'Oct 2025',
      },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-16 md:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Roadmap</h1>
        <p className="mt-2 text-base text-muted-foreground">
          See what we’re exploring, building, and shipping.
        </p>
      </header>

      <RoadmapBoard columns={defaultColumns} />
    </main>
  )
}


