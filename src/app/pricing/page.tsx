import { Pricing2 } from '@/components/landing/pricing2'
import { Cta11 } from '@/components/landing/cta11'
import { Faq1 } from '@/components/landing/faq1'

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-16 md:px-8">
      <Pricing2
        heading="Pricing"
        description="Fair, transparent pricing. Pay only for what you translate."
        plans={[
          {
            id: 'starter',
            name: 'Starter',
            description: 'For individuals & casual users',
            monthlyPrice: '$9.99',
            yearlyPrice: '$99.90',
            yearlySavingsText: 'save $20',
            features: [
              { text: 'Up to 480,000 words / month' },
              { text: 'Translate PDF, EPUB, DOCX, TXT' },
              { text: 'Standard processing speed' },
              { text: 'Community support' },
            ],
            button: { text: 'Purchase', url: '/auth/sign-up' },
          },
          {
            id: 'pro',
            name: 'Pro',
            description: 'For professionals & researchers',
            monthlyPrice: '$29.99',
            yearlyPrice: '$299',
            yearlySavingsText: 'save $60',
            isPopular: true,
            features: [
              { text: 'Up to 1,560,000 words / month' },
              { text: 'Priority translation speed' },
              { text: 'Advanced file handling (large files)' },
              { text: 'Email support' },
            ],
            button: { text: 'Purchase', url: '/auth/sign-up' },
          },
          {
            id: 'business',
            name: 'Business',
            description: 'For teams & heavy users',
            monthlyPrice: '$99.90',
            yearlyPrice: '$999',
            yearlySavingsText: 'save $200',
            features: [
              { text: 'Up to 5,350,000 words / month' },
              { text: 'Team accounts & API access' },
              { text: 'Bulk uploads & custom dictionaries' },
              { text: 'Priority support' },
            ],
            button: { text: 'Purchase', url: '/auth/sign-up' },
          },
        ]}
      />

      <Cta11
        heading="Ready to learn faster?"
        description="Join thousands improving their language skills with Fliplingo."
        imageSrc="/window.svg"
        imageAlt="Fliplingo CTA"
      />

      <Faq1 heading="Pricing FAQs" />
    </main>
  )
}


