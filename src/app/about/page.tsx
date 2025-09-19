import { About3 } from '@/components/landing/about3'
import { Team1 } from '@/components/landing/team1'
import { Cta11 } from '@/components/landing/cta11'
import { Faq1 } from '@/components/landing/faq1'

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-16 md:px-8">
      <About3
        title="About Fliplingo"
        description="We craft focused, intuitive experiences that help learners translate, practice, and improve with clarity."
        mainImage={{ src: '/window.svg', alt: 'Fliplingo product preview' }}
        secondaryImage={{ src: '/globe.svg', alt: 'Global languages illustration' }}
        breakout={{
          src: 'https://zkprxfzgywsqzhqcbisk.supabase.co/storage/v1/object/public/Branding/White%20Logo.svg',
          alt: 'Fliplingo logo',
          title: 'Practice that fits your routine',
          description: 'Clean UX, modern AI, and learner-first design to help you make steady progress.',
          buttonText: 'View pricing',
          buttonUrl: '/pricing',
        }}
        companiesTitle="Trusted by language learners worldwide"
        companies={[
          { src: '/logos/google.svg', alt: 'Google' },
          { src: '/logos/facebook.svg', alt: 'Facebook' },
          { src: '/logos/linkedin.svg', alt: 'LinkedIn' },
          { src: '/logos/youtube.svg', alt: 'YouTube' },
          { src: '/logos/instagram.svg', alt: 'Instagram' },
        ]}
        achievementsTitle="Our impact in numbers"
        achievementsDescription="We focus on outcomes that matter—consistency, clarity, and confidence."
        achievements={[
          { label: 'Active Users', value: '25k+' },
          { label: 'Languages Supported', value: '100+' },
          { label: 'Words Translated', value: '500M+' },
          { label: 'Average Translating Time', value: '5 min' },
        ]}
      />

      <Team1
        heading="Our team"
        description="We’re a small, dedicated group of designers and engineers passionate about building thoughtful language tools."
      />

      <Cta11
        heading="Ready to get started?"
        description="Join thousands of learners improving their skills with Fliplingo."
        imageSrc="/window.svg"
        imageAlt="Fliplingo preview"
      />

      <Faq1
        heading="Frequently asked questions"
      />
    </main>
  )
}


