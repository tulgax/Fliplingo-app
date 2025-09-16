import Link from 'next/link'
import Image from 'next/image'
import { FolderClosed, Menu, Upload, Zap } from 'lucide-react'

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-svh w-40 flex-col items-center justify-between border-r border-border bg-foreground/5 px-3 py-6">
      <div className="flex w-full flex-col items-center gap-8">
        <button
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex w-full flex-col items-center gap-4">
          <Link
            href="#files"
            className="group flex w-full flex-col items-center gap-2 rounded-xl px-3 py-3 text-center text-sm text-muted-foreground hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Files"
            tabIndex={0}
          >
            <FolderClosed className="h-6 w-6" />
            <span>Files</span>
          </Link>
          <Link
            href="#upload"
            className="group flex w-full flex-col items-center gap-2 rounded-xl bg-foreground/10 px-3 py-3 text-center text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-current="page"
            aria-label="Upload"
            tabIndex={0}
          >
            <Upload className="h-6 w-6" />
            <span>Upload</span>
          </Link>
        </nav>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <Link
          href="#pro"
          className="flex flex-col items-center gap-2 text-sm text-cyan-400"
          aria-label="Get Pro"
          tabIndex={0}
        >
          <Zap className="h-6 w-6" />
          <span>Get Pro</span>
        </Link>
        <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
          <Image src="/vercel.svg" alt="User avatar" width={40} height={40} className="dark:invert" />
        </div>
      </div>
    </aside>
  )
}


