import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TranslateSection } from '@/components/translate-section'

export default async function HomePage() {
    return (
        <main className="w-full bg-background text-foreground h-[calc(60vh)] flex items-center justify-center p-6">
            <div className="w-full max-w-5xl">
                <Card id="upload">
                    <CardHeader>
                        <CardTitle>Translate Documents</CardTitle>
                        <CardDescription>Upload documents to translate them to another language</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div id="files" className="mb-2"></div>
                        <TranslateSection />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
