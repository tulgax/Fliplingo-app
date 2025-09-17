import Link from 'next/link'
import Image from 'next/image'
import { FolderClosed, Menu, Upload, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/user-menu'
import { SidebarNav } from '@/components/sidebar-nav'

export const Sidebar = async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const email = data?.claims?.email as string | undefined
  const avatarUrl = (data?.claims as any)?.picture as string | undefined
  const isAuthed = Boolean(email)

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-svh w-40 flex-col items-center justify-between border-r border-border bg-foreground/5 px-3 py-6">
      <div className="flex w-full flex-col items-center gap-8">
        <Link
          href="/dashboard"
          aria-label="Home"
          className="flex h-12 w-24 items-center justify-center"
        >
          <img
            src="https://zkprxfzgywsqzhqcbisk.supabase.co/storage/v1/object/public/Branding/White%20Logo.svg"
            alt="Logo"
            className="h-36 w-auto"
          />
        </Link>

        <SidebarNav />
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
        {isAuthed ? (
          <div className="flex w-full flex-col items-center gap-2">
            <UserMenu email={email} avatarUrl={avatarUrl} />
            <span className="max-w-[8rem] truncate text-xs text-muted-foreground" title={email}>
              {email}
            </span>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-2">
            <Link
              href="/auth/login"
              className="w-full rounded-md bg-foreground/10 px-3 py-2 text-center text-sm hover:bg-foreground/15"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="w-full rounded-md border border-border px-3 py-2 text-center text-sm hover:bg-foreground/5"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}


