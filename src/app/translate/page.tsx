import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { LanguageCombobox } from '@/components/language-combobox'
import { EpubUploadFlow } from '@/components/epub-upload-flow'

export default async function TranslatePage() {
  return (
    <main className="min-h-svh w-full bg-background text-foreground flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card id="upload">
          <CardHeader>
            <CardTitle>Translate Documents</CardTitle>
            <CardDescription>Upload documents to translate them to another language</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Source Language</Label>
                <LanguageCombobox buttonClassName="w-full" />
              </div>
              <div className="space-y-2">
                <Label>Target Language</Label>
                <LanguageCombobox buttonClassName="w-full" />
              </div>
            </div>

            <div className="mt-8">
              <EpubUploadFlow />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


