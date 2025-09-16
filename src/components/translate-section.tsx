'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { LanguageCombobox } from '@/components/language-combobox'
import { EpubUploadFlow } from '@/components/epub-upload-flow'

export function TranslateSection() {
  const [sourceLang, setSourceLang] = useState<string | undefined>(undefined)
  const [targetLang, setTargetLang] = useState<string | undefined>(undefined)

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Source Language</Label>
          <LanguageCombobox buttonClassName="w-full" value={sourceLang} onChange={setSourceLang} />
        </div>
        <div className="space-y-2">
          <Label>Target Language</Label>
          <LanguageCombobox buttonClassName="w-full" value={targetLang} onChange={setTargetLang} />
        </div>
      </div>
      <div className="mt-8">
        <EpubUploadFlow sourceLang={sourceLang} targetLang={targetLang} />
      </div>
    </>
  )
}


