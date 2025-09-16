import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TranslateSection } from '@/components/translate-section'

export default async function TranslatePage() {
  // Client-only combobox values handled via EpubUploadFlow props; keep SSR safe by rendering flow with empty values.
  return (
    <main className="min-h-svh w-full bg-background text-foreground flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card id="upload">
          <CardHeader>
            <CardTitle>Translate Documents</CardTitle>
            <CardDescription>Upload documents to translate them to another language</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <TranslateSection />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


