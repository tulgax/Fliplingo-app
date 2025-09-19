import { Contact7 } from '@/components/landing/contact7'
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-16 md:px-8">
      <Contact7
        title="Contact us"
        description="Send us a message or reach out using the details below."
        emailLabel="Email"
        emailDescription="We respond to all emails within 24 hours."
        email="support@fliplingo.app"
        officeLabel="Office"
        officeDescription="Drop by our office for a chat."
        officeAddress="Remote-first"
        phoneLabel="Phone"
        phoneDescription="We're available Mon–Fri, 9am–5pm."
        phone="+1 (555) 555-5555"
        chatLabel="Live Chat"
        chatDescription="Get instant help from our support team."
        chatLink="Start Chat"
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-4 text-2xl font-semibold">Send us a message</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}


