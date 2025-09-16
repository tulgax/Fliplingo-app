"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderClosed, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SidebarNav() {
  const pathname = usePathname()
  const isFiles = pathname?.startsWith('/dashboard/files')
  const isUpload = pathname === '/dashboard' || pathname?.startsWith('/dashboard/') && !isFiles

  return (
    <nav className="flex w-full flex-col items-center gap-4">
      <Link
        href="/dashboard"
        className={cn(
          'group flex w-full flex-col items-center gap-2 rounded-xl px-3 py-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isUpload ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-foreground/10'
        )}
        aria-label="Upload"
        tabIndex={0}
      >
        <Upload className="h-6 w-6" />
        <span>Upload</span>
      </Link>
      <Link
        href="/dashboard/files"
        className={cn(
          'group flex w-full flex-col items-center gap-2 rounded-xl px-3 py-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isFiles ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-foreground/10'
        )}
        aria-label="Files"
        tabIndex={0}
      >
        <FolderClosed className="h-6 w-6" />
        <span>Files</span>
      </Link>
    </nav>
  )
}


