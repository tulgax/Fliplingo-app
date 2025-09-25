'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { MoreHorizontal, Eye, Download, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import EpubViewerModal from '@/components/epub-viewer-modal'
import { EpubUploadFlow } from '@/components/epub-upload-flow'

type FileData = {
  id: string
  filename: string
  original_filename: string
  file_size: number
  storage_path: string
  source_language?: string
  target_language?: string
  translation_status: string
  created_at: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const fetchFiles = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please sign in to view your files')
        return
      }

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching files:', error)
        toast.error('Failed to load files')
        return
      }

      setFiles(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const handleView = async (file: FileData) => {
    try {
      const supabase = createClient()
      
      // Download file from storage
      const { data, error } = await supabase.storage
        .from('epub-files')
        .download(file.storage_path)

      if (error) {
        console.error('Error downloading file:', error)
        toast.error('Failed to load file')
        return
      }

      const buffer = await data.arrayBuffer()
      setFileBuffer(buffer)
      setSelectedFile(file)
      setViewerOpen(true)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load file')
    }
  }

  const handleDownload = async (file: FileData) => {
    try {
      const supabase = createClient()
      
      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('epub-files')
        .createSignedUrl(file.storage_path, 60)

      if (error) {
        console.error('Error creating download URL:', error)
        toast.error('Failed to create download link')
        return
      }

      // Create download link
      const link = document.createElement('a')
      link.href = data.signedUrl
      link.download = file.original_filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Download started')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to download file')
    }
  }

  const handleDelete = async (file: FileData) => {
    if (!confirm(`Are you sure you want to delete "${file.original_filename}"?`)) {
      return
    }

    try {
      const supabase = createClient()
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('epub-files')
        .remove([file.storage_path])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id)

      if (dbError) {
        console.error('Error deleting from database:', dbError)
        toast.error('Failed to delete file')
        return
      }

      // Refresh file list
      await fetchFiles()
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete file')
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] w-full bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading files...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[60vh] w-full bg-background text-foreground flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Files ({files.length})</CardTitle>
            <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload New File
            </Button>
          </CardHeader>
          <CardContent>
            {showUpload && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-4">Upload New EPUB</h3>
                <EpubUploadFlow 
                  sourceLang="en"
                  targetLang="es"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setShowUpload(false)
                    fetchFiles() // Refresh the file list
                  }}
                >
                  Close
                </Button>
              </div>
            )}
            
            {files.length === 0 ? (
              <div className="text-center py-12">
                <Image src="/file.svg" alt="No files" width={48} height={48} className="mx-auto opacity-50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No files uploaded yet</h3>
                <p className="text-sm text-muted-foreground">Upload your first EPUB file to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[56px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Languages</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="hover:bg-muted/30">
                      <TableCell className="py-3">
                        <Image src="/file.svg" alt="file" width={20} height={20} className="opacity-80" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p className="truncate">{file.original_filename}</p>
                          <p className="text-xs text-muted-foreground">{file.filename}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {file.source_language && file.target_language ? (
                          <div className="flex gap-1 text-xs">
                            <Badge variant="outline">{file.source_language}</Badge>
                            <span>→</span>
                            <Badge variant="outline">{file.target_language}</Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className={getStatusColor(file.translation_status)}>
                          {file.translation_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(file.created_at)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(file)} className="gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(file)} className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(file)} 
                              className="gap-2 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <EpubViewerModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        originalBuffer={fileBuffer}
        translatedBuffer={fileBuffer}
        fileName={selectedFile?.original_filename}
      />
    </main>
  )
}



