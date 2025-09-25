'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { TextShimmer } from '@/components/ui/text-shimmer'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import EpubViewerModal from '@/components/epub-viewer-modal'

type Stage = 'idle' | 'uploading' | 'translating' | 'transforming' | 'done'

type UploadProps = {
  sourceLang?: string
  targetLang?: string
}

export const EpubUploadFlow = ({ sourceLang, targetLang }: UploadProps) => {
  const [stage, setStage] = useState<Stage>('idle')
  const [percent, setPercent] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const percentRef = useRef(0)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [originalBuffer, setOriginalBuffer] = useState<ArrayBuffer | null>(null)

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


  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setFileName(file.name)
    setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`)
    
    // Only allow EPUB for now (extension check)
    const isEpub = file.name.toLowerCase().endsWith('.epub') || file.type === 'application/epub+zip'
    if (!isEpub) {
      toast.error('Please upload an EPUB file', { position: 'bottom-right' })
      return
    }

    // Check if user is authenticated
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    try {
      // Read file buffer
      const buf = await file.arrayBuffer()
      setOriginalBuffer(buf)
      
      // Start upload process
      await uploadToSupabase(file, buf, user.id)
    } catch (e) {
      console.error('Upload error:', e)
      toast.error('Failed to upload file', { position: 'bottom-right' })
      setStage('idle')
      setPercent(0)
    }
  }, [sourceLang, targetLang])

  const uploadToSupabase = useCallback(async (file: File, buffer: ArrayBuffer, userId: string) => {
    const supabase = createClient()
    
    // Start uploading stage
    setStage('uploading')
    setPercent(10)
    
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${userId}/${timestamp}_${sanitizedName}`
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('epub-files')
        .upload(storagePath, buffer, {
          contentType: 'application/epub+zip',
          upsert: false
        })
      
      if (uploadError) {
        throw uploadError
      }
      
      setPercent(30)
      
      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          filename: sanitizedName,
          original_filename: file.name,
          file_size: file.size,
          file_type: file.type || 'application/epub+zip',
          storage_path: storagePath,
          source_language: sourceLang,
          target_language: targetLang,
          translation_status: 'processing'
        })
        .select()
        .single()
      
      if (dbError) {
        // If database save fails, clean up uploaded file
        await supabase.storage.from('epub-files').remove([storagePath])
        throw dbError
      }
      
      setPercent(50)
      
      // Simulate translation process (in real implementation, this would be actual translation)
      setStage('translating')
      await animateTo(80, 3000)
      
      setStage('transforming')
      await animateTo(95, 2000)
      
      // Update file status to completed
      await supabase
        .from('files')
        .update({ translation_status: 'completed' })
        .eq('id', fileData.id)
      
      setPercent(100)
      setStage('done')
      
      toast.success('File uploaded and processed successfully!', { 
        description: 'Your EPUB is ready to view.', 
        position: 'bottom-right' 
      })
      
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.2 },
        scalar: 0.9,
        colors: ['#22c55e', '#10b981', '#34d399'],
      })
      
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed', { 
        description: error instanceof Error ? error.message : 'Please try again',
        position: 'bottom-right' 
      })
      setStage('idle')
      setPercent(0)
    }
  }, [animateTo, sourceLang, targetLang])

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
          <Button
            size="sm"
            onClick={() => {
              if (!sourceLang || !targetLang) {
                toast.error('Please select both Source and Target languages', { position: 'bottom-right' })
                return
              }
              inputRef.current?.click()
            }}
            aria-label="Choose EPUB"
          >
            {stage === 'idle' ? 'Choose EPUB' : 'Change file'}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            aria-label="View translated"
            onClick={async () => {
              const supabase = createClient()
              const { data } = await supabase.auth.getUser()
              if (!data.user) {
                setShowAuthPrompt(true)
                return
              }
              if (!originalBuffer) {
                toast.error('No file to display', { position: 'bottom-right' })
                return
              }
              setViewerOpen(true)
            }}
          >
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

      <AlertDialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to view your translation</AlertDialogTitle>
            <AlertDialogDescription>
              Create an account or sign in to access your translated EPUB and keep your files saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAuthPrompt(false)}>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/auth/login">Sign in</Link>
            </AlertDialogAction>
            <AlertDialogAction asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EpubViewerModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        originalBuffer={originalBuffer}
        translatedBuffer={originalBuffer}
        fileName={fileName ?? undefined}
      />
    </div>
  )
}


