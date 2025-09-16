'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap } from 'lucide-react'
import { TextShimmer } from '@/components/ui/text-shimmer'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

type Stage = 'idle' | 'uploading' | 'translating' | 'transforming' | 'done'

export const EpubUploadFlow = () => {
  const [stage, setStage] = useState<Stage>('idle')
  const [percent, setPercent] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const percentRef = useRef(0)

  useEffect(() => {
    percentRef.current = percent
  }, [percent])

  const label = useMemo(() => {
    switch (stage) {
      case 'uploading':
        return 'Uploading'
      case 'translating':
        return 'Translating'
      case 'transforming':
        return 'Transforming'
      case 'done':
        return 'Completed'
      default:
        return 'Upload'
    }
  }, [stage])

  const animateTo = useCallback(async (targetPercent: number, durationMs: number) => {
    const start = percentRef.current
    const delta = Math.max(0, targetPercent - start)
    const steps = 100
    const delay = Math.max(10, Math.floor(durationMs / steps))
    for (let i = 0; i <= steps; i++) {
      const next = Math.min(100, Math.round(start + (delta * i) / steps))
      setPercent(next)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, delay))
    }
  }, [])

  const simulateProgress = useCallback(async () => {
    // Simulate upload progress
    setStage('uploading')
    await animateTo(20, 1500)
    // Translating: 5 seconds
    setStage('translating')
    await animateTo(70, 5000)
    // Transforming: 10 seconds
    setStage('transforming')
    await animateTo(100, 10000)
    setStage('done')
    toast.success('Translation completed!', { description: 'Your EPUB is ready to view.', position: 'bottom-right' })
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.2 },
      scalar: 0.9,
      colors: ['#22c55e', '#10b981', '#34d399'],
    })
  }, [animateTo])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setFileName(file.name)
    setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`)
    // Only allow EPUB for now (extension check)
    const isEpub = file.name.toLowerCase().endsWith('.epub') || file.type === 'application/epub+zip'
    if (!isEpub) {
      alert('Please upload an EPUB file')
      return
    }
    await simulateProgress()
  }, [simulateProgress])

  const uploaded = stage === 'translating' || stage === 'transforming' || stage === 'done'

  return (
    <div
      className={cn(
        'w-full rounded-xl border p-4',
        uploaded ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-border'
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{fileName ?? 'No file selected'}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {uploaded && (
              <span className="inline-flex items-center gap-1 text-sky-400">
                <CheckCircle2 className="h-4 w-4" /> Uploaded
              </span>
            )}
            {fileSize && <span>{fileSize}</span>}
          </div>
        </div>
        {stage !== 'done' ? (
          <Button size="sm" onClick={() => inputRef.current?.click()} aria-label="Choose EPUB">
            {stage === 'idle' ? 'Choose EPUB' : 'Change file'}
          </Button>
        ) : (
          <Button size="sm" variant="default" aria-label="View translated">
            View
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".epub,application/epub+zip"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {stage !== 'idle' && (
        <div className="mt-3">
          <Progress value={percent} indicatorClassName="bg-emerald-500" />
          <div className="mt-2 flex items-center gap-2 text-emerald-500">
            <Zap className="h-5 w-5" />
            {stage === 'done' ? (
              <span className="text-sm">{label}</span>
            ) : (
              <TextShimmer as="span" duration={1.2} className="text-sm">
                {label}
              </TextShimmer>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


