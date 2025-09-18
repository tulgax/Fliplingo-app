"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderClosed, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export const NavbarLinks = () => {
  const pathname = usePathname()
  const isFiles = pathname?.startsWith('/dashboard/files')
  const isUpload = pathname === '/dashboard' || (pathname?.startsWith('/dashboard/') && !isFiles)

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/dashboard"
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isUpload ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-foreground/10'
        )}
        aria-label="Upload"
        tabIndex={0}
      >
        <Upload className="h-4 w-4" />
        <span>Upload</span>
      </Link>
      <Link
        href="/dashboard/files"
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isFiles ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-foreground/10'
        )}
        aria-label="Files"
        tabIndex={0}
      >
        <FolderClosed className="h-4 w-4" />
        <span>Files</span>
      </Link>
    </div>
  )
}


