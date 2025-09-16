import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default async function TranslatePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-svh w-full bg-background text-foreground flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Translate Documents</h1>
          <p className="text-sm text-muted-foreground">Upload documents to translate them to another language</p>
        </div>

        <Card className="border-dashed" id="upload">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source">Source Language</Label>
                <select
                  id="source"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="mn"
                  aria-label="Source language"
                >
                  <option value="mn">Mongolian (Монгол)</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Language</Label>
                <select
                  id="target"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="en"
                  aria-label="Target language"
                >
                  <option value="en">English</option>
                  <option value="mn">Mongolian (Монгол)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <details className="text-sm text-muted-foreground">
                <summary className="cursor-pointer select-none">Advanced options</summary>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-xs">Keep formatting</Label>
                    <input type="checkbox" className="ml-2 align-middle" aria-label="Keep formatting" />
                  </div>
                </div>
              </details>
            </div>

            <div className="mt-8">
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-16 text-center"
                role="region"
                aria-label="Upload area"
                tabIndex={0}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <span className="text-2xl">☁️</span>
                </div>
                <p className="mt-4 text-lg font-medium">Drop document files here</p>
                <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md border px-2 py-1">PDF</span>
                  <span className="rounded-md border px-2 py-1">DOCX</span>
                  <span className="rounded-md border px-2 py-1">TXT</span>
                  <span className="rounded-md border px-2 py-1">and more...</span>
                </div>
                <Button className="mt-6" aria-label="Upload">Upload</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


