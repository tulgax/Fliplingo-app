'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import JSZip from 'jszip'

type EpubViewerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalBuffer: ArrayBuffer | null
  translatedBuffer?: ArrayBuffer | null
  fileName?: string
}

type EpubContent = {
  chapters: { title: string; content: string }[]
  currentChapter: number
}

export const EpubViewerModal = ({ open, onOpenChange, originalBuffer, translatedBuffer, fileName }: EpubViewerModalProps) => {
  const [isReady, setIsReady] = useState(false)
  const [leftContent, setLeftContent] = useState<EpubContent | null>(null)
  const [rightContent, setRightContent] = useState<EpubContent | null>(null)
  const [currentChapter, setCurrentChapter] = useState(0)

  const leftIframeRef = useRef<HTMLIFrameElement>(null)
  const rightIframeRef = useRef<HTMLIFrameElement>(null)

  const parseEpub = useCallback(async (buffer: ArrayBuffer): Promise<EpubContent> => {
    const zip = new JSZip()
    const epub = await zip.loadAsync(buffer)
    
    // Read container.xml to find the OPF file
    const containerFile = epub.file('META-INF/container.xml')
    if (!containerFile) throw new Error('Invalid EPUB: missing container.xml')
    
    const containerXml = await containerFile.async('text')
    const opfPath = containerXml.match(/full-path="([^"]+)"/)?.[1]
    if (!opfPath) throw new Error('Invalid EPUB: missing OPF path')
    
    // Read the OPF file to get the spine order
    const opfFile = epub.file(opfPath)
    if (!opfFile) throw new Error('Invalid EPUB: missing OPF file')
    
    const opfXml = await opfFile.async('text')
    
    // Extract manifest items
    const manifestItems = new Map<string, string>()
    const manifestRegex = /<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"/g
    let match
    while ((match = manifestRegex.exec(opfXml)) !== null) {
      manifestItems.set(match[1], match[2])
    }
    
    // Extract spine order
    const spineItems: string[] = []
    const spineRegex = /<itemref[^>]+idref="([^"]+)"/g
    while ((match = spineRegex.exec(opfXml)) !== null) {
      spineItems.push(match[1])
    }
    
    // Create image data URL map
    const imageDataUrls = new Map<string, string>()
    const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : ''
    
    // Process images
    for (const [, href] of manifestItems) {
      if (href.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        const imagePath = opfDir + href
        const imageFile = epub.file(imagePath)
        if (imageFile) {
          try {
            const imageData = await imageFile.async('arraybuffer')
            const mimeType = href.endsWith('.svg') ? 'image/svg+xml' : 
                           href.endsWith('.png') ? 'image/png' : 
                           href.endsWith('.gif') ? 'image/gif' : 'image/jpeg'
            const dataUrl = `data:${mimeType};base64,${btoa(String.fromCharCode(...new Uint8Array(imageData)))}`
            imageDataUrls.set(href, dataUrl)
          } catch (err) {
            console.warn('Failed to process image:', imagePath, err)
          }
        }
      }
    }
    
    // Read chapter files
    const chapters: { title: string; content: string }[] = []
    
    for (let i = 0; i < Math.min(spineItems.length, 10); i++) { // Limit to first 10 chapters
      const itemId = spineItems[i]
      const href = manifestItems.get(itemId)
      if (!href) continue
      
      const chapterPath = opfDir + href
      const chapterFile = epub.file(chapterPath)
      if (!chapterFile) continue
      
      try {
        let chapterContent = await chapterFile.async('text')
        const title = chapterContent.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || 
                     chapterContent.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i)?.[1] ||
                     `Chapter ${i + 1}`
        
        // Replace image sources with data URLs
        for (const [imagePath, dataUrl] of imageDataUrls) {
          const regex = new RegExp(`src=["']([^"']*${imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})["']`, 'gi')
          chapterContent = chapterContent.replace(regex, `src="${dataUrl}"`)
        }
        
        // Clean up the HTML content
        let cleanContent = chapterContent
          .replace(/<\?xml[^>]*\?>/g, '')
          .replace(/<!DOCTYPE[^>]*>/g, '')
          .replace(/<html[^>]*>/g, '<html>')
          .replace(/<head[^>]*>/g, '<head><meta charset="utf-8">')
          .replace(/<body[^>]*>/g, '<body style="font-family: Georgia, serif; line-height: 1.6; padding: 20px; max-width: none; margin: 0; background: white; color: black; font-size: 16px;">')
        
        // Ensure proper HTML structure
        if (!cleanContent.includes('<html>')) {
          cleanContent = `<html><head><meta charset="utf-8"></head><body style="font-family: Georgia, serif; line-height: 1.6; padding: 20px; max-width: none; margin: 0; background: white; color: black; font-size: 16px;">${cleanContent}</body></html>`
        }
        
        chapters.push({ title, content: cleanContent })
      } catch (err) {
        console.error('Failed to read chapter:', chapterPath, err)
      }
    }
    
    return { chapters, currentChapter: 0 }
  }, [])

  useEffect(() => {
    const loadEpubs = async () => {
      if (!open || !originalBuffer) return
      
      setIsReady(false)
      try {
        const leftEpub = await parseEpub(originalBuffer)
        setLeftContent(leftEpub)
        
        const rightBuffer = translatedBuffer || originalBuffer
        const rightEpub = await parseEpub(rightBuffer)
        setRightContent(rightEpub)
        
        setCurrentChapter(0)
        setIsReady(true)
      } catch (err) {
        console.error('Failed to parse EPUB:', err)
      }
    }
    
    void loadEpubs()
  }, [open, originalBuffer, translatedBuffer, parseEpub])

  useEffect(() => {
    // Update iframe contents when chapter changes
    if (leftContent && leftIframeRef.current) {
      const doc = leftIframeRef.current.contentDocument
      if (doc && leftContent.chapters[currentChapter]) {
        doc.open()
        doc.write(leftContent.chapters[currentChapter].content)
        doc.close()
      }
    }
    
    if (rightContent && rightIframeRef.current) {
      const doc = rightIframeRef.current.contentDocument
      if (doc && rightContent.chapters[currentChapter]) {
        doc.open()
        doc.write(rightContent.chapters[currentChapter].content)
        doc.close()
      }
    }
  }, [leftContent, rightContent, currentChapter])

  const handlePrev = useCallback(() => {
    setCurrentChapter(prev => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    const maxChapter = Math.max(
      (leftContent?.chapters.length || 1) - 1,
      (rightContent?.chapters.length || 1) - 1
    )
    setCurrentChapter(prev => Math.min(maxChapter, prev + 1))
  }, [leftContent, rightContent])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    },
    [handlePrev, handleNext]
  )

  const maxChapter = Math.max(
    (leftContent?.chapters.length || 1) - 1,
    (rightContent?.chapters.length || 1) - 1
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] h-[90vh] p-0 overflow-hidden m-2" 
        onKeyDown={handleKeyDown} 
        aria-label="EPUB viewer dialog"
        style={{ 
          width: '90vw', 
          maxWidth: '90vw',
          minWidth: '90vw'
        }}
      >
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="text-base font-semibold truncate">{fileName ? `${fileName}` : 'EPUB Viewer'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-3" style={{ height: 'calc(100%)' }}>
          <ResizablePanelGroup direction="horizontal" className="h-full gap-0">
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-background">
                <div className="border-b px-3 py-2 text-sm font-medium bg-muted/30">
                  Original {leftContent && `- ${leftContent.chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`}`}
                </div>
                <div className="flex-1 p-2">
                  <iframe
                    ref={leftIframeRef}
                    className="h-full w-full border-0 rounded"
                    title="Original EPUB content"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="mx-2" />
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-background">
                <div className="border-b px-3 py-2 text-sm font-medium bg-muted/30">
                  Translated {rightContent && `- ${rightContent.chapters[currentChapter]?.title || `Chapter ${currentChapter + 1}`}`}
                </div>
                <div className="flex-1 p-2">
                  <iframe
                    ref={rightIframeRef}
                    className="h-full w-full border-0 rounded"
                    title="Translated EPUB content"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <DialogFooter className="flex items-center justify-between gap-2 px-4 py-2 border-t bg-muted/20">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentChapter === 0}
              aria-label="Previous chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleNext} 
              disabled={currentChapter >= maxChapter}
              aria-label="Next chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {isReady 
              ? `Chapter ${currentChapter + 1} of ${maxChapter + 1} • Use arrow keys to navigate`
              : 'Loading…'
            }
          </div>
          <Button size="sm" onClick={() => onOpenChange(false)} aria-label="Close viewer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EpubViewerModal